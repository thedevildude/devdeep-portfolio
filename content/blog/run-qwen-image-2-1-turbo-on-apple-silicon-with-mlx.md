---
title: How to run Qwen-Image 2.1 Turbo on Apple Silicon with MLX
tag: Tutorial
seoTitle: Run Qwen-Image 2.1 Turbo on a Mac with MLX
description: Port the Qwen-Image 2.1 Turbo transformer from PyTorch MPS and GGUF to MLX: load quantized weights, bridge to diffusers, check parity, avoid cache leaks.
date: 2026-10-25
updated: 2026-10-25
keywords: Qwen-Image 2.1 Turbo, Qwen-Image MLX, MLX, Apple Silicon, mflux, Qwen3-VL, GGUF vs MLX, PyTorch MPS, quantized_matmul, port PyTorch to MLX, image generation on Mac
---

If you run a quantized image model on a Mac through diffusers and a GGUF file, you are storing weights at 4 bits and multiplying them at 16. Diffusers dequantizes each layer back to bf16 on every forward pass, so the file is small but the arithmetic isn't any cheaper. MLX can multiply the packed weights directly with `mx.quantized_matmul`, and on an M5 it uses the matrix units while it does.

This guide walks through moving one model's transformer to MLX while leaving the rest of the pipeline alone. The example is [Qwen-Image 2.1 Turbo](https://huggingface.co/Qwen/Qwen-Image-2.1-Turbo), a 7B model that makes an image in 8 steps, but the same steps apply to most diffusion transformers.

## Port the transformer, not the pipeline

A diffusion pipeline does a lot besides the transformer: prompt templating, the scheduler, the VAE, step callbacks for previews. None of that is where the time goes, and all of it already works. Replace only the transformer and keep everything else in PyTorch.

If the text encoder is large, move it too. Qwen-Image 2.1 reads prompts with [Qwen3-VL-8B](https://huggingface.co/Qwen/Qwen3-VL-8B-Instruct), which is 17.5GB in bf16 and doesn't fit a 16GB machine at all. The 4-bit MLX build is around 5.5GB with its vision tower.

## Step 1: Start from weights that already have the right names

Look for an MLX conversion that keeps the original diffusers parameter names. For this model that is [`mflux-community/qwen-image-2-1-turbo-mflux-q4`](https://huggingface.co/mflux-community/qwen-image-2-1-turbo-mflux-q4). When the names match, your module tree can mirror the PyTorch one attribute for attribute and the weights load without any renaming.

Write the MLX layers against `mlx.nn`, following the reference implementation file by file. Keep list containers where the original has them (`to_out` is a list because diffusers keeps a dropout at index 1), since the index is part of the key.

## Step 2: Load the weights strictly

Two details decide whether the load works.

First, the conversion may not tell you its quantization settings. Read them from the safetensors header instead of guessing. A packed 4-bit weight holds 8 values per 32-bit word, and there is one scale per group:

```python
import json, struct

def tensor_shape(path, name):
    with open(path, "rb") as f:
        (n,) = struct.unpack("<Q", f.read(8))
        return json.loads(f.read(n))[name]["shape"]

dim = 4096  # input width of the layer you probe
packed = tensor_shape(shard, "transformer_blocks.0.attn.to_q.weight")
scales = tensor_shape(shard, "transformer_blocks.0.attn.to_q.scales")

bits = packed[1] * 32 // dim
group_size = dim // scales[1]
```

Second, converters quantize selectively. Small layers such as timestep embeddings are often left in float, so quantizing the whole tree creates layers the file has no tensors for. Ask the file which layers to quantize:

```python
import mlx.nn as nn

nn.quantize(
    model,
    group_size=group_size,
    bits=bits,
    class_predicate=lambda path, module: f"{path}.scales" in weights,
)
```

Then compare the two key sets and refuse to continue if they differ:

```python
from mlx.utils import tree_flatten, tree_unflatten

expected = {k for k, _ in tree_flatten(model.parameters())}
missing, extra = expected - set(weights), set(weights) - expected
assert not missing and not extra, (sorted(missing)[:3], sorted(extra)[:3])
model.update(tree_unflatten(list(weights.items())))
```

Be strict here. A transformer with a few randomly initialized layers still makes an image. It just isn't the right one, and nothing tells you.

## Step 3: Give the pipeline something it can call

The pipeline calls `self.transformer(...)` and expects a torch module. Write a small `torch.nn.Module` with the same call signature and the attributes the pipeline reads (`config`, `dtype`, `device`). Inside `forward`, convert tensors to numpy, run the MLX model, and convert back:

```python
class MLXTransformer(torch.nn.Module):
    def forward(self, hidden_states, encoder_hidden_states, timestep, **_):
        out = EXECUTOR.submit(
            self._run,
            hidden_states.float().cpu().numpy(),
            encoder_hidden_states.float().cpu().numpy(),
            timestep.float().cpu().numpy(),
        ).result()
        return (torch.from_numpy(out).to(hidden_states.device, hidden_states.dtype),)
```

At 1024px the tensors crossing the boundary are small: about 4096 rows by 64 channels in, the same out. The weights and any attention cache stay on the MLX side for the whole generation. Run every MLX call on one dedicated thread, which is what `EXECUTOR` is; [the threading guide](/blog/fix-mlx-no-stream-in-current-thread-fastapi) explains why.

## Step 4: Check the port against the original

Build a tiny random version of the model, load the same weights into both implementations, and compare outputs. Run it on the CPU:

```python
mx.set_default_device(mx.cpu)
got = np.array(mlx_model(x))
want = torch_model(torch.from_numpy(np.array(x))).detach().numpy()
np.testing.assert_allclose(got, want, rtol=1e-3, atol=1e-3)
```

The CPU matters. On Apple GPUs float32 matmul runs at reduced precision, so a GPU comparison reports differences that aren't bugs. Expect to loosen the tolerance a little for things like `exp` rounding in the timestep embedding.

## Step 5: Watch memory in the attention cache

Models that edit from reference images cache the keys and values for the prompt and reference tokens so later steps skip them. The natural way to write that is to slice them out of the full tensors, and in MLX that is a trap. Arrays are lazy, and a slice keeps its parent alive. Each layer's full keys and values, over 2GB at 1024px, stay in memory until the cache entry is evaluated:

```python
# Keeps the entire k tensor alive:
cache.k = k[:, :, :prefix_len]

# Copies only the rows you need, then evaluate per layer so the parent can go:
cache.k = mx.contiguous(k[:, :, :prefix_len])
cache.v = mx.contiguous(v[:, :, :prefix_len])
mx.eval(x, cache.k, cache.v)
```

With two reference images this was the difference between 35 to 58 seconds per step and 10.8, because the slow version was swapping.

{{chart:mlx-reference-edit}}

If an MLX process uses more memory than its weights and activations explain, look for lazy values you are still holding.

## What to expect

On an M5 MacBook Air with 16GB, a 1024px step went from 15.4 seconds (GGUF on PyTorch MPS) to about 9.4 with the straight port. A fused norm and rotary kernel brings it to 8.4, and the optional int8 matmuls to about 5.9. [The Metal kernel guide](/blog/mlx-metal-kernels-fused-rope-int8-qwen-image-krea-2) covers those two.

{{chart:mlx-step-time}}

The straight port is the safe part and gets you most of the way. Keep anything that changes the output, like int8, as an opt-in. If you want trustworthy numbers for your own port, [benchmark it carefully](/blog/benchmark-mlx-qwen-image-krea-2-on-macbook-air-m5), because a laptop will happily give you results that drift by a factor of two.

## Models used

- [Qwen/Qwen-Image-2.1-Turbo](https://huggingface.co/Qwen/Qwen-Image-2.1-Turbo): the model, plus the VAE and scheduler the pipeline still uses.
- [mflux-community/qwen-image-2-1-turbo-mflux-q4](https://huggingface.co/mflux-community/qwen-image-2-1-turbo-mflux-q4) and the [8-bit build](https://huggingface.co/mflux-community/qwen-image-2-1-turbo-mflux-q8): the MLX conversions, with diffusers parameter names.
- [unsloth/Qwen-Image-2.1-Turbo-GGUF](https://huggingface.co/unsloth/Qwen-Image-2.1-Turbo-GGUF): the GGUF files used as the PyTorch baseline.
- [Qwen/Qwen3-VL-8B-Instruct](https://huggingface.co/Qwen/Qwen3-VL-8B-Instruct) and its 4-bit MLX build, [mlx-community/Qwen3-VL-8B-Instruct-4bit](https://huggingface.co/mlx-community/Qwen3-VL-8B-Instruct-4bit): the text encoder.
