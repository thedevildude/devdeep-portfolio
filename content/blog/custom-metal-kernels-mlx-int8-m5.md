---
title: Writing Metal kernels for MLX: a fused norm and RoPE, then int8 matmuls on the M5
tag: Performance
seoTitle: Custom Metal Kernels in MLX: Fused RoPE and Int8 Matmul
description: Two custom Metal kernels for an MLX diffusion transformer on Apple Silicon: a fused RMS norm and rotary kernel, and int8 matmuls on the M5. What failed and why.
date: 2026-10-25
updated: 2026-10-25
keywords: MLX, Metal kernel, mx.fast.metal_kernel, Metal 4 tensor ops, MetalPerformancePrimitives, int8 matmul, W8A8, SmoothQuant, Apple M5, fused RoPE, Apple Silicon
---

After [moving Qwen-Image's transformer to MLX](/blog/qwen-image-mlx-port-macbook-air), a 1024px step took about 9.4 seconds on my M5 MacBook Air. I profiled it, expecting the big matmuls to dominate, and found something duller. A noticeable slice of every step was spent on the glue between the matmuls. That is where the first kernel came from. The second came from reading the M5's specs and wondering whether I was using the right half of the chip.

MLX makes this approachable. `mx.fast.metal_kernel` lets you write the body of a Metal function as a string, and MLX generates the signature, handles the buffers and lets you call the result like any other op. If you've never touched Metal, the first kernel is a good place to start, because it is small.

## The glue that cost more than attention

Before attention, every block does the same thing to its queries and keys: an RMS norm, a cast, a rotary rotation of adjacent channel pairs in float32, a cast back, and a transpose into the `(batch, heads, seq, head_dim)` layout the attention kernel wants. Written with MLX ops that is about eight passes over two tensors of roughly 4,200 rows by 4,096 columns, per block. Each pass reads and writes the whole tensor. At that sequence length the passes cost more than the attention itself, about 0.7 seconds of every step.

All of it is element-wise apart from one reduction, the sum of squares in the norm, so it belongs in one kernel that reads the tensor once and writes it once.

The layout I chose: one SIMD group of 32 threads owns one head row of 128 channels. Each thread holds 4 channels, which happen to be two complete rotary pairs, so after the norm no data moves between threads. The sum of squares is a single `simd_sum`. The result is written straight into the transposed layout, so the transpose costs nothing.

The detail that matters for correctness is rounding. The op-by-op version does the norm in float32, rounds to the model dtype, rotates in float32, and rounds again. The kernel does exactly that, in that order, because "mathematically the same" is not good enough when you want to compare images. I kept the op-by-op version in the repo as a reference and as the fallback for the CPU, which is where the parity tests run. On the GPU the kernel measured about 15 times faster than the code it replaced. Together with a couple of small compiled fusions, the SwiGLU and the gated residual add, a step went from about 9.4 seconds to about 8.4.

One later change: another model I ported, Krea 2, uses the same rotary convention but stores its norm weights as a zero-centred scale, so the multiplier is one plus the stored value. In bf16 that rounds. I changed the kernel to take its weight in float32. For Qwen, whose weights are bf16 already, nothing changes.

## Why int8

MLX's quantized matmul already uses the M5's matrix units, so the 4-bit path was not slow for lack of hardware. The question was whether the hardware could go faster on a different data type. In small standalone tests, a Metal 4 `matmul2d` with int8 inputs and int32 accumulation ran at roughly 20 TOPS. The same operation in bf16 ran at roughly 10 TFLOPS. A mixed bf16 by int8 operation got only bf16 speed. The units want both operands in the same narrow type.

That forces W8A8: eight-bit weights and eight-bit activations. My weights are stored at 4 bits, and activations are bf16, so there is work on both sides:

- **Weights** are converted to int8 a layer at a time, with a scale per output row, into a transient buffer of at most 48MB, so the model doesn't grow.
- **Activations** get one int8 scale per token, computed on the fly.
- **Smoothing.** Transformer activations tend to have a few huge channels that wreck int8 rounding. [SmoothQuant](https://arxiv.org/abs/2211.10438) moves that difficulty into the weights by dividing activations and multiplying weights by a per-channel factor. I used the usual alpha of 0.5, calibrated from the layer's first input. That is why the first image after loading is a little slower.

The matmul itself is a tiled `matmul2d` through MetalPerformancePrimitives, with int32 accumulation and a single scale applied at the end.

## The version that was five times too slow

My first int8 kernel was four to five times slower than it needed to be to beat the 4-bit path. The reason was the one thing I thought was clever: the 4-bit weights have a scale per group of 64 values, so I applied each group's scale inside the loop. That means pulling partial sums out of the matrix registers every 64 steps along the reduction, and reading partials out of those registers stalls the units. The hardware wants to accumulate for a long time and be asked once.

I tried double buffering, several sub-tiles per threadgroup and half-precision conversion. None of it helped, because I was optimizing around the stall instead of removing it.

What worked was splitting the job. A separate small kernel converts each layer's 4-bit weights into smoothed per-row int8, so by the time the matmul runs, the scales are per row and can be applied after the whole reduction. The matmul becomes a pure int8 GEMM with one fold at the end. That version ran 1.38 to 1.66 times faster than the quantized matmul it replaced, depending on the layer. The conversion kernel costs a bit of time per layer, and it is still a clear win.

{{chart:int8-kernel-speed}}

## Metal 4 gotchas I paid for

If you try this yourself, some things aren't in any tutorial I found:

- Cooperative tensors give you `get_capacity()`, `is_valid_element(i)` and `get_multidimensional_index(i)`. The index comes back in `(n, m)` order, which is easy to transpose by accident.
- Write `#pragma unroll`. `#pragma unroll full` doesn't compile.
- Cooperative tensors can't live in arrays, so you can't keep a row of accumulators in a local array the way you would in CUDA-style code.
- Template arguments to `metal_kernel` have to be MLX dtypes, ints or bools. A float won't do.
- Parity tests on the GPU lie. The M5's float32 matmul runs at reduced precision, so I compared on the CPU.

## A memory bug in the calibration

Calibration kept a running maximum of each layer's activations. MLX is lazy, so that maximum was an unevaluated expression, and each one kept its layer's whole input alive until it was evaluated. Calibrating one pass held 11.6GB. The fix was to evaluate at the moment of recording. If your MLX process has more memory than it should, look for lazy values you are holding on to.

## What it bought

On Qwen-Image, per-step time went from about 8.4 seconds to between 5.7 and 6.0. Over a whole image, with the encoder, the decode and a warm chip, the gain was 12 to 20 percent. On MOSS-Image, another model in our experiment, an image went from an average of about 136 seconds to about 112, close to 18 percent. For Krea 2, which I covered in [another article](/blog/krea-2-on-a-16gb-mac), four consecutive blocks took 2.3 to 2.6 seconds without int8 and 1.6 to 1.7 with it, so 1.4 to 1.6 times faster on the matmul-heavy part.

{{chart:int8-block-rounds}}

{{chart:moss-int8-images}}

The cost is quality, and I'd rather say that plainly. The same seed gives a different composition with int8 on. The images I compared looked equally good and I couldn't find a loss, but I can't promise there isn't one, so it is an opt-in toggle, off by default. Layers that see fewer than 512 rows skip the int8 path entirely, since the conversion would cost more than it saves.

Fast numbers on a laptop with no fan only mean something if you measured them carefully. [The article on benchmarking a MacBook Air](/blog/benchmarking-on-a-fanless-macbook-air) is about how I tried to.
