---
title: Porting an image model to MLX: from 15 seconds a step to 6 on a MacBook Air
tag: Performance
seoTitle: Qwen-Image on Apple Silicon: PyTorch MPS vs an MLX Port
description: I moved Qwen-Image 2.1 from a GGUF file on PyTorch MPS to MLX on an M5 MacBook Air. A step fell from 15.4s to about 6s. Here is what worked, in order.
date: 2026-10-25
updated: 2026-10-25
keywords: MLX, Apple Silicon, Qwen-Image, image generation on Mac, PyTorch MPS, GGUF, MLX vs PyTorch, M5 MacBook Air, quantized diffusion model
---

Our experiment is a local image-generation setup that runs entirely on my own laptop: an M5 MacBook Air with 16GB of memory. Qwen-Image 2.1 Turbo is one of the models we tried in it. It is a 7B model that makes a picture in 8 steps, and it follows prompts well enough that we wanted it to be the default.

It was also slow. A 1024px step took about 15 seconds, so one image took a couple of minutes, on a chip that has matrix hardware in every GPU core. The weights were a 4-bit GGUF file running through PyTorch on the MPS backend, and something about that combination was leaving most of the machine idle. This is the story of fixing it. Everything below is measured on that one laptop, so treat the numbers as one data point, not a benchmark suite.

## Why a 4-bit file ran at 16-bit speed

GGUF is a storage format. When diffusers loads a GGUF transformer, each quantized layer is dequantized back to bf16 on the way through every forward pass, then multiplied at 16 bits. The file is small, the memory footprint is small, and the arithmetic is the same as the full-size model plus the cost of unpacking. You saved disk and RAM and paid for it in time.

MLX does it differently. `mx.quantized_matmul` takes the packed 4-bit weights, their scales and biases, and multiplies them directly. Nothing is unpacked into a full-size tensor first. On an M5 it also takes advantage of the new matrix units. So the plan was simple to say: run the transformer in MLX, on weights that stay packed.

## Port the transformer, borrow the rest

I did not rewrite the pipeline. The Qwen-Image pipeline does a lot besides the transformer: prompt templating, packing reference images, the VAE, the scheduler, the callbacks that drive live previews and masked edits in our setup. None of that is where the time goes, and all of it already worked.

So only the transformer moved. I wrote a small module that looks enough like the original transformer for the pipeline to call it, and does the real work in MLX behind the scenes. What crosses between the two worlds is small: the packed latents (4096 rows by 64 at 1024px), the prompt embedding on the first step, and the velocity coming back. The weights and the per-layer attention cache stay on the MLX side for the whole generation, and only numpy arrays cross the boundary. The text encoder, Qwen3-VL-8B, was already running in MLX at 4 bits. In bf16 it is 17.5GB, which doesn't exist on a 16GB machine.

For weights I used the published MLX conversions from the mflux community. They keep the diffusers parameter names, so the module tree can mirror the original attribute for attribute and load without any renaming. A few things about loading are worth knowing:

- The conversion's index records only a quantization level, not bits or group size. I read both off the shapes in the safetensors header: the packed weight tells you how many values fit in a 32-bit word, and the scales tell you the group size.
- Quantization is selective. Some small layers are stored in float and the rest are packed, so the loader asks the file which layers to quantize instead of guessing.
- Loading is strict. A transformer with a few randomly initialized layers still makes an image, just not the right one, and nothing about it looks like a failure.

## Proving the port is correct

I checked the MLX transformer against the PyTorch one on a small random model. Two surprises there.

The first was precision. On the M5's GPU, float32 matmul runs at reduced precision, so a float32 comparison on the GPU looked like a pile of bugs. The comparisons run on the CPU, where float32 means float32, and they match to a tolerance of 1e-3. The second was a one-ulp difference in how `exp` rounds in the timestep embedding, which is why the tolerance isn't tighter.

## What the numbers did

At 1024px, on a cool machine, per step:

- GGUF on PyTorch MPS: 15.4 seconds.
- The straight MLX port, 4-bit: about 9.4 seconds.
- After fusing the query and key preparation into one Metal kernel, plus a couple of smaller fusions (the subject of [the next article](/blog/custom-metal-kernels-mlx-int8-m5)): 8.3 to 8.5 seconds.
- With the optional int8 path turned on: 5.7 to 6.0 seconds.

{{chart:mlx-step-time}}

So the port alone was a bit over 1.6x, and the rest came from digging into where the remaining time went. The int8 number is the one to be careful with. Over a whole image, with the encoder, the VAE decode and a hot chip, I saw 12 to 20 percent improvement, not 30. I left it opt-in for that reason and a second one: it changes the picture you get from a given seed.

A few port decisions that paid off quietly:

- **Prefill attention is a single call.** The PyTorch model needs a compiled flex-attention kernel, or splits the block-causal prefill into one call per segment. In MLX I build the block-causal rule as one boolean mask and hand it to `mx.fast.scaled_dot_product_attention` once. The rule is identical, so the results match.
- **Only the target image goes through the output projection.** The pipeline throws away every other row, so I never compute them.
- **Positions and masks are worked out on the CPU** from small numpy arrays, the way the original uses `tolist()`.

## The editing bug that was a memory leak

Qwen-Image 2.1 edits images from references, and we let you attach a couple. With two references a single step was taking 35 to 58 seconds, which made no sense, since references only add tokens to the sequence.

The cause was the attention cache. During the first step the model keeps the keys and values for the prompt and reference tokens so later steps don't recompute them. I stored them as slices of the full tensors. MLX is lazy, and a slice keeps its parent array alive, so every layer's complete keys and values, over 2GB at 1024px, stayed in memory for the whole generation to hold on to a few hundred rows. On a 16GB machine that meant swap.

The fix was a handful of lines: copy the slice with `mx.contiguous`, and evaluate each layer's cache entry as the layer finishes so the source tensors can be freed. With two references a step dropped from 35 to 58 seconds to 10.8. It is the fastest speedup in this whole project and it came from deleting memory, not from adding cleverness.

{{chart:mlx-reference-edit}}

## Where I ended up

4-bit MLX is now our default for Qwen-Image 2.1, at about 4.2GB for the transformer. An 8-bit MLX build exists for people with more memory. I removed the GGUF Q4_K_M option, since it was the same size and 1.6x slower, and migrated saved settings so nothing is left pointing at a variant that no longer exists. A 1024px image takes roughly a minute on this laptop after the first one, where it used to take more than two.

Three things I'd tell someone starting the same project. Keep the rest of the pipeline in PyTorch until you have a reason not to; the bridge is a couple hundred lines and it kept everything else working. Test on the CPU. And look at memory before you look at kernels, because the biggest win here was a leak. If you want to see what came after the leak, [the Metal kernel article](/blog/custom-metal-kernels-mlx-int8-m5) is next, and [the one about benchmarking on a fanless laptop](/blog/benchmarking-on-a-fanless-macbook-air) explains why I trust the numbers above as much as I do, which is carefully, not completely.
