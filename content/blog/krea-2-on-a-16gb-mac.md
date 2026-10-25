---
title: Fitting a 12B image model into a 16GB MacBook Air
tag: Performance
seoTitle: Run Krea 2 on a 16GB Mac with MLX (12B Image Model)
description: Krea 2 Turbo is a 12B image model that needed about 16GB on a Mac with GGUF. In MLX, with a 4-bit text encoder, I budget about 10.6GB. How the port went.
date: 2026-10-25
updated: 2026-10-25
keywords: Krea 2, Krea 2 Turbo, run on Mac, 16GB MacBook, MLX, Apple Silicon, image generation, quantized, LoRA, Qwen3-VL, diffusers
---

Krea 2 Turbo makes good-looking pictures in eight steps, and at 12 billion parameters it is a lot of model for a laptop. In bf16 the transformer alone is about 26GB. The usual answer is a GGUF quantization: the 4-bit Q4_K_M file is around 7.5GB. Add the 8.3GB text encoder that Krea's pipeline loads next to it and you need about 15.8GB, on a machine where the operating system wants a few of its own.

That doesn't fit my 16GB MacBook Air, and our notes from earlier attempts record what we tried. Lowering the resolution didn't help, because memory sat flat across a 2.8x change in pixel count. Releasing the text encoder early let the denoising loop finish for the first time and then ran out of memory in the VAE decode. With the memory cap lifted, swap grew by 4GB in eight seconds and the machine got unresponsive enough for a watchdog to kill it. That is what "doesn't fit" looks like in practice.

This is how I got Krea 2 running on the same laptop, using the same trick as [the Qwen-Image port](/blog/qwen-image-mlx-port-macbook-air): keep the weights packed and run them in MLX.

## Two things to shrink, not one

The transformer is the big number, but the text encoder is the one nobody thinks about. Krea 2 reads its prompt with Qwen3-VL-4B, and the PyTorch pipeline holds it at 8.3GB even after the unused vision tower is dropped. So the plan had two parts:

- The transformer in MLX, from the 4-bit conversion published by the mflux community. It is 7.2GB in memory, with every array evaluated.
- The text encoder as an MLX 4-bit build of the same Qwen3-VL-4B, 3.1GB, which also lets me delete the PyTorch encoder from the picture entirely.

Add the VAE and I budget about 10.6GB at peak, instead of the 15.8GB the GGUF build needs.

{{chart:krea-memory}}

## The text path is more than one hidden state

Most text-to-image models read a prompt as one tensor from the last layer of an encoder. Krea 2 doesn't. It taps twelve layers of Qwen3-VL (layers 2, 5, 8 and so on up to 35), stacks them per token, and runs them through a small fusion network inside the transformer: two blocks that attend across the layer axis of each token on its own, a linear projector that collapses that axis, and two blocks that attend across the tokens.

The prompt is also laid out oddly. The pipeline tokenizes `[system prefix | prompt | padding | suffix]` to a fixed 512 tokens, and positions skip the padding, so the suffix gets the same position it would have had without it. The padded keys are masked out of attention everywhere.

That layout gave me two cheap wins:

- **The padding never needs to exist.** If the padded tokens are masked as keys everywhere, and their own outputs are thrown away, then leaving them out changes nothing except cost. The sequence per step goes from 4,608 rows to about 4,130 for a short prompt, around ten percent fewer rows through every block.
- **The text features are computed once.** The fusion network and the text projection don't depend on the timestep, so the bridge computes them on the first step and reuses them for the other seven.

## Is the encoder still right?

A quantized encoder feeding a quantized transformer is exactly where "it works" can quietly mean "it's a bit off". I wanted to separate bugs in my port from the damage 4-bit does by design.

So I ran the same prompts through Krea's own PyTorch code on the CPU in bf16 and compared all twelve tapped layers. My 4-bit MLX encoder came out at a cosine similarity of 0.985 to 0.994 against it. That is decent but not obviously right. Then I loaded the bf16 weights into my own MLX encoder code, with no quantization, and the similarity was above 0.9999 on the layers I checked. The port is right. The remaining distance is 4-bit rounding, which is the price of fitting.

{{chart:krea-encoder-fidelity}}

The transformer got the same treatment on a small random configuration. The MLX version matches diffusers to a tolerance of 1e-3, including the case with padded tokens dropped, and it passed the first time I ran the test.

## Small things that were easy to miss

Krea 2's RMSNorm is zero-centred: the checkpoint stores the multiplier minus one. The converted weights keep that convention, and I confirmed it by reading the values (the first block's pre-norm scale averages about minus 0.49). Load them as plain norm weights and every layer is scaled wrong without any error.

Each block also computes `(1 + scale) * norm(x) + shift`. For a single image, the norm's weight and `1 + scale` fold into one weight, so it becomes one fused `rms_norm` call and an add. That is a small win per layer and there are twenty-eight layers.

## LoRAs without ruining them

We wanted style LoRAs to keep working, and Krea 2 has built-in ones, so the MLX path had to support them. The obvious way is to fuse the adapter into the weights. With 4-bit weights that means dequantizing the layer, adding the update, and quantizing again. A 4-bit step is coarser than most adapters' updates, so the requantization would round much of the style away.

Instead the adapters run beside the layer: `y = layer(x) + scale * delta(x)`. A LoRA adds two thin matmuls per layer, and rank 16 to 64 against a width of 6,144 is cheap. LoKr adapters, which are Kronecker products, are computed without ever building the product, by reshaping the input and applying the two small factors one after the other, so there is never a dense matrix per layer. The int8 path wraps the base layer inside the adapter, so the two compose. I tested LoRA output against diffusers with PEFT on the small random model, then ran the 469MB retro-anime style on the real 4-bit weights with int8 on, and it produced a recognizable, clean result.

## What it costs in time

I should be straight about speed, because the machine made it hard to measure. When the machine was behaving, a transformer step at 1024px took 17 to 18 seconds. Timing four blocks and scaling up gave about 16 to 18 seconds without int8 and about 11.4 with it. Full images in my end-to-end runs took anywhere from about two and a half minutes to nearly six, because I was running them while swap was at 10.7GB of 12GB with other apps open, and the chip was hot. That variance is a story of its own, in [the article on benchmarking a fanless laptop](/blog/benchmarking-on-a-fanless-macbook-air).

Krea 2 is slower than Qwen-Image here, and it should be: it is a 12B model against a 7B one. The reason to run it anyway is the look. The point of this work was that it runs at all, in about 10GB, instead of crashing the machine.

## The crash that wasn't about the model

My first end-to-end runs failed with `MPS backend out of memory (MPS allocated: 1.04 GiB, other allocations: 19.06 GiB, max allowed: 20.13 GiB)`. The transformer was 7GB and PyTorch had 1GB allocated, so where did 19GB go? Not to the model. It went to the VAE, which on the first decode asked for about 15GB and then kept 12GB. That has [its own article](/blog/qwen-image-vae-out-of-memory-mps), because the fix is one function and it applies to every model that uses that VAE.

If you have a 16GB Mac and have tried and failed to run one of these bigger image models, the answer is probably not a smaller model. It is checking what each piece costs while it runs, and what it still holds when it's finished.
