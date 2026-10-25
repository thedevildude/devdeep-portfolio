---
title: Custom Metal kernels in MLX for Qwen-Image and Krea 2: fused RMSNorm and RoPE, then int8 matmul on the M5
tag: Tutorial
seoTitle: Metal Kernels in MLX: Fused RoPE and Int8 (Qwen-Image, Krea 2)
description: Write a fused RMSNorm and RoPE kernel with mx.fast.metal_kernel, then compare int8 matmuls on the M5's Metal 4 tensor ops with 4-bit quantized matmuls.
date: 2026-10-25
updated: 2026-10-25
keywords: MLX, mx.fast.metal_kernel, Metal kernel, Qwen-Image, Krea 2, fused RoPE, RMSNorm, int8 matmul, W8A8, SmoothQuant, Metal 4 tensor ops, MetalPerformancePrimitives, Apple M5
---

MLX lets you write the body of a Metal function as a string and call it like any other op. That is enough to remove the small element-wise steps that pile up between the big matmuls in a transformer. This guide starts with the smallest possible kernel, builds a real fused one, and then looks at a harder case: int8 matrix multiplies on the M5.

## When a kernel is worth writing

Profile first. A transformer block is mostly matmuls, but around them sit norms, rotary embeddings, casts and transposes. Each one reads and writes a whole activation tensor, and at a few thousand tokens those passes are memory-bound. If a group of cheap ops shows up in the profile and they could share one read and one write, that is a kernel.

If the time is already inside a matmul, a custom element-wise kernel won't help.

## The smallest kernel

`mx.fast.metal_kernel` takes the body of the function. MLX generates the signature from the input and output names you give it:

```python
import mlx.core as mx

source = """
    uint i = thread_position_in_grid.x;
    out[i] = T(float(inp[i]) * scale[0] + 1.0f);
"""
kernel = mx.fast.metal_kernel(
    name="scale_add",
    input_names=["inp", "scale"],
    output_names=["out"],
    source=source,
)

x = mx.arange(8, dtype=mx.float32)
(out,) = kernel(
    inputs=[x, mx.array([2.0])],
    template=[("T", mx.float32)],
    grid=(8, 1, 1),
    threadgroup=(8, 1, 1),
    output_shapes=[x.shape],
    output_dtypes=[x.dtype],
)
# [1, 3, 5, 7, 9, 11, 13, 15]
```

A few things to notice. `template` defines names like `T` that you can use in the body, and the values must be MLX dtypes, ints or bools. `grid` is the total number of threads, not the number of threadgroups. Inside the body you get `thread_position_in_grid`, `thread_position_in_threadgroup` and `<name>_shape` for each input. Do the arithmetic in float and cast on the way out, so the same source works for float32 and bf16.

## A real one: fused RMS norm and rotary

Before attention, each block normalizes its queries and keys, rotates adjacent channel pairs by a position-dependent angle, casts, and transposes into `(batch, heads, seq, head_dim)`. As separate MLX ops that is about eight passes over two tensors of roughly 4,200 by 4,096. Fused into one kernel it is one read and one write.

The layout that works well:

1. One SIMD group of 32 threads owns one head row of 128 channels.
2. Each thread holds 4 channels, which happen to be two complete rotary pairs, so nothing moves between threads after the norm.
3. The sum of squares is a single `simd_sum`.
4. The result is written straight into the transposed layout, so the transpose is free.

An excerpt of the body:

```metal
uint lane = thread_position_in_threadgroup.x;   // 0..31
uint h = thread_position_in_grid.y;             // head
uint s = thread_position_in_grid.z;             // token
constexpr uint D = 128;

float v[4];
float ss = 0.0f;
for (int i = 0; i < 4; i++) {
    v[i] = float(x[src + i]);
    ss += v[i] * v[i];
}
ss = simd_sum(ss);
float r = metal::precise::rsqrt(ss / float(D) + eps[0]);
for (int i = 0; i < 4; i++) {
    v[i] = float(T(v[i] * r * float(w[lane * 4 + i])));   // round like the reference
}
// rotate the two pairs this thread owns, write to out[(h * S + s) * D + ...]
```

It is launched with `grid=(32, heads, seq)` and `threadgroup=(32, 1, 1)`.

Match the rounding of the version you are replacing. The reference does the norm in float32, rounds to the model dtype, rotates in float32 and rounds again. The kernel does the same, in the same order, because "mathematically equal" isn't good enough when you want to compare images afterwards. Keep the op-by-op version in your code as the reference for tests and as the fallback when shapes don't fit the kernel.

On an M5 this kernel was about 15 times faster than the ops it replaced, and with two small `mx.compile` fusions (SwiGLU and a gated residual add) a 1024px step dropped from about 9.4 seconds to about 8.4.

If a model stores its norm weights as "scale minus one" (Krea 2 does), pass the multiplier `1 + w` computed in float32 and keep the kernel's weight input float32. Rounding `1 + w` to bf16 first shifts every layer slightly.

## Int8 matmuls on the M5

MLX's quantized matmul already uses the M5's matrix units, so a 4-bit model isn't slow for lack of hardware. The question is whether the units are faster on another type. In standalone tests, a Metal 4 `matmul2d` (from `MetalPerformancePrimitives`) with int8 inputs and int32 accumulation ran at roughly 20 TOPS. The same operation in bf16 ran at roughly 10 TFLOPS, and a mixed bf16 by int8 operation only reached bf16 speed. The units want both operands in the same narrow type, which means W8A8: 8-bit weights and 8-bit activations.

A 4-bit model needs work on both sides:

1. **Weights.** Convert each layer's 4-bit weights to int8 with one scale per output row, into a transient buffer sized for one layer (48MB at most here), so the model doesn't grow.
2. **Activations.** Quantize to int8 with one scale per token, on the fly.
3. **Smoothing.** Transformer activations tend to have a few huge channels that wreck int8 rounding. [SmoothQuant](https://arxiv.org/abs/2211.10438) moves that difficulty into the weights by dividing activations and multiplying weights by a per-channel factor. An alpha of 0.5 worked, with the factors calibrated from the layer's first input.
4. **Matmul.** Multiply int8 by int8 into int32 and apply the scales once at the end.

The mistake to avoid is applying the 4-bit weights' group scales inside the matmul loop. That means pulling partial sums out of the matrix registers every 64 steps, and reading those registers stalls the units. A first kernel built that way ran four to five times slower than the 4-bit path. Converting the weights to per-row int8 in a separate small kernel, so the matmul is a pure int8 GEMM with a single fold at the end, made the same hardware faster than the baseline.

{{chart:int8-kernel-speed}}

Over four rounds on a block of Krea 2, the int8 path took 1.6 to 1.7 seconds against 2.3 to 2.6 for the 4-bit path.

{{chart:int8-block-rounds}}

## Metal 4 details that cost time

- Cooperative tensors give you `get_capacity()`, `is_valid_element(i)` and `get_multidimensional_index(i)`. The index comes back in `(n, m)` order.
- Write `#pragma unroll`. `#pragma unroll full` doesn't compile.
- Cooperative tensors can't be put in arrays, so you can't keep a row of accumulators in a local array.
- Compare against a CPU reference. On Apple GPUs float32 matmul runs at reduced precision.
- MLX is lazy. If calibration keeps a running maximum per layer, evaluate it when you record it, or every layer's input stays alive (11.6GB in one case).

## What it costs

Int8 changes the output: the same seed gives a different composition, and layers with fewer than about 512 rows are better left on the normal path because the weight conversion costs more than it saves. Ship it as an opt-in setting and say so.

## Models used

- [mflux-community/qwen-image-2-1-turbo-mflux-q4](https://huggingface.co/mflux-community/qwen-image-2-1-turbo-mflux-q4): the Qwen-Image 2.1 weights the fused kernel was built against.
- [mflux-community/krea-2-turbo-mflux-q4](https://huggingface.co/mflux-community/krea-2-turbo-mflux-q4): the Krea 2 weights used for the int8 block timings.
