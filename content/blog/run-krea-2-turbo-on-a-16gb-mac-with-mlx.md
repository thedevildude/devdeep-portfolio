---
title: Run Krea 2 Turbo on a 16GB Mac with MLX: 4-bit transformer, Qwen3-VL encoder and LoRA
tag: Tutorial
seoTitle: Run Krea 2 Turbo on a 16GB Mac with MLX
description: Fit the 12B Krea 2 Turbo image model into 16GB with MLX: a 4-bit transformer, a 4-bit Qwen3-VL-4B text encoder, no padding rows, and unfused LoRA adapters.
date: 2026-10-25
updated: 2026-10-25
keywords: Krea 2 Turbo, Krea 2, Krea-2-Turbo, run on Mac, 16GB MacBook, MLX, Qwen3-VL-4B, Qwen-Image VAE, LoRA, LoKr, quantization, mflux, Apple Silicon
---

A 12B diffusion model sounds like it belongs on a workstation, but it can run on a 16GB MacBook if you treat memory as a budget and spend it deliberately. This guide uses Krea 2 Turbo as the example, a 12B model that makes an image in 8 steps, and covers the method more than the model.

## 1. Write the budget down

List every component that has to be resident at the same time and its size. For Krea 2 that is the transformer, the text encoder, the VAE, and whatever the decode needs. The common setup, a GGUF 4-bit transformer through diffusers, comes to about 15.8GB:

- Transformer, GGUF Q4_K_M: about 7.5GB.
- Qwen3-VL-4B text encoder in bf16 (vision tower dropped), plus the VAE: about 8.3GB.

That leaves nothing for the operating system on a 16GB machine. The transformer is the number everyone looks at, but the text encoder is almost as large, and it is the easier one to shrink.

{{chart:krea-memory}}

## 2. Shrink every part, not just the biggest

On Apple Silicon the useful kind of quantization is the kind the framework can multiply directly, which is what MLX's `quantized_matmul` does (see [the MLX port guide](/blog/run-qwen-image-2-1-turbo-on-apple-silicon-with-mlx) for loading). Apply it to both models:

- The transformer, from an MLX 4-bit conversion: 7.21GB measured with every array evaluated.
- The text encoder, from a 4-bit MLX build of the same Qwen3-VL-4B: about 3.1GB including its vision tower, and the vision tower can be released once the prompt is encoded.

The estimated budget drops to about 10.6GB. It is only an estimate, so leave room for the OS and the rest of your session.

## 3. Don't compute what is masked out

Krea 2 encodes every prompt as a fixed 512-token block laid out as `[system prefix | prompt | padding | suffix]`, then masks the padding out of attention everywhere. Padded tokens are never attended to and their own outputs are discarded, so you can leave them out of the sequence entirely. Two conditions make that exact: the real tokens' positions must not count the padding, and the text rows must all sit at the same rotary position (they do, at zero).

For a short prompt that removes around 450 rows from a sequence of about 4,600 at 1024px, so every transformer block does roughly ten percent less work. The text encoder gets the same treatment: run only the real tokens and put zeros back in the padded rows if some other code expects the full shape.

## 4. Cache what doesn't depend on the timestep

The text-fusion stage (and the projection into the transformer's width) depends on the prompt only. Compute it on the first step and reuse it for the other seven. Key the cache on the embedding tensor and clear it when a new generation starts, since a new tensor can land at a freed one's address.

## 5. Keep LoRAs beside the layer, not fused into it

Fusing an adapter into 4-bit weights means dequantizing the layer, adding the update, and quantizing again. A 4-bit step is coarser than most adapters' updates, so requantizing rounds much of the style away. Run the adapter next to the layer instead:

```python
class LoRALinear(nn.Module):
    def __init__(self, base, adapters):
        super().__init__()
        self.base = base
        self._adapters = Holder(adapters)   # plain object, not part of the module tree

    def __call__(self, x):
        y = self.base(x)
        for a, b, scale in self._adapters.items:
            y = y + scale * ((x @ a.T) @ b.T)
        return y.astype(y.dtype)
```

That costs two thin matmuls per adapted layer, and with a rank of 16 to 64 against a width of 6,144 it is cheap. For LoKr adapters, whose update is a Kronecker product, don't build the product. Reshape the input and apply the two small factors in turn:

```python
t = x.reshape(-1, b, d) @ w2.T              # (n, b, c)
t = t.transpose(0, 2, 1) @ w1.T             # (n, c, a)
delta = t.transpose(0, 2, 1).reshape(*lead, a * c)
```

Check it against `x @ np.kron(w1, w2).T` in a test. Hold the adapter list in a plain object, because MLX modules treat lists and dicts as parts of the parameter tree.

## 6. Verify each piece against a reference

Quantization and porting errors look the same in the output: a prompt that is followed a little less well. Separate them.

1. Compare the MLX transformer with the original on a tiny random configuration, on the CPU, in float32. It should match to about 1e-3.
2. Compare the text encoder's tapped layers with the reference bf16 PyTorch encoder using cosine similarity.
3. Run your own MLX encoder code with the bf16 weights as a control. If it scores near 1.0 and the 4-bit build scores lower, the gap is rounding and your code is right.

Here the 4-bit encoder scored 0.988 to 0.994 per layer, and the same code with bf16 weights scored 0.9999 or better at the layers checked.

{{chart:krea-encoder-fidelity}}

Check the small conventions too. Krea 2's RMSNorm is zero-centred, so the checkpoint stores the multiplier minus one (the first block's pre-norm scale averages about -0.49), and loading it as a plain norm weight scales every layer wrongly without raising an error. The text conditioning also taps twelve layers of the encoder (2, 5, 8, up to 35) and stacks them per token.

## 7. Check the decode separately

The transformer is only part of a generation. The VAE decode can ask for more memory than the whole denoising loop, which is covered in [the VAE guide](/blog/fix-mps-out-of-memory-autoencoderklqwenimage-vae).

## What to expect

On an M5 MacBook Air, a 1024px transformer step took about 17 to 18 seconds, and timing four blocks and scaling up gave about 11.4 seconds with the optional int8 path. Whole images took from about two and a half minutes to nearly six, depending on how much else was running and how warm the machine was. The reason to do all this is that the model runs at all, in about 10GB.

## Models used

- [krea/Krea-2-Turbo](https://huggingface.co/krea/Krea-2-Turbo): the official model, gated on the Hub.
- [Comfy-Org/Krea-2](https://huggingface.co/Comfy-Org/Krea-2): an ungated copy of the weights, including the style LoRAs.
- [vantagewithai/Krea-2-Turbo-GGUF](https://huggingface.co/vantagewithai/Krea-2-Turbo-GGUF): the GGUF quantizations used as the baseline.
- [mflux-community/krea-2-turbo-mflux-q4](https://huggingface.co/mflux-community/krea-2-turbo-mflux-q4) and the [8-bit build](https://huggingface.co/mflux-community/krea-2-turbo-mflux-q8): the MLX conversions.
- [Qwen/Qwen3-VL-4B-Instruct](https://huggingface.co/Qwen/Qwen3-VL-4B-Instruct) and [mlx-community/Qwen3-VL-4B-Instruct-4bit](https://huggingface.co/mlx-community/Qwen3-VL-4B-Instruct-4bit): the text encoder, in bf16 and 4-bit MLX.
- [Qwen/Qwen-Image](https://huggingface.co/Qwen/Qwen-Image): the VAE Krea 2 decodes with.
