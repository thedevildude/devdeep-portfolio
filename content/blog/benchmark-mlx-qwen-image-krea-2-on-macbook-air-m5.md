---
title: How to benchmark MLX models on a MacBook Air (M5): repeatable timings for Qwen-Image and Krea 2
tag: Tutorial
seoTitle: Benchmark MLX on a MacBook Air M5: Repeatable Timings
description: A checklist and a small harness for timing MLX models on a fanless MacBook Air: interleave runs, benchmark a slice, take the minimum, and check swap first.
date: 2026-10-25
updated: 2026-10-25
keywords: MLX benchmark, MacBook Air M5, thermal throttling, Apple Silicon benchmark, fanless laptop, swap, Qwen-Image, Krea 2, MOSS-Image, benchmark methodology, repeatable timings
---

Timing the same MLX forward pass four times in a row on a fanless MacBook Air gave 19.6, 23.9, 30.1 and 41.2 seconds. The code, input and weights were identical. If you compare two implementations by timing one and then the other, a drift like that can make either look faster. This guide is a checklist for getting numbers you can repeat, with a small harness at the end.

{{chart:timing-drift}}

## Why the same code gets slower

Two things move the clock on a laptop:

- **Heat.** The Air has no fan. Under sustained GPU load macOS lowers clocks, and a single image takes minutes, which is long enough for it to start. `pmset -g therm` may report nothing even while your timings double, so don't rely on it.
- **Memory pressure.** Image models run close to a 16GB machine's limit. With a browser and a few apps open, the system can be well into swap (here 10.7GB of a 12GB swap file), and a run that has to page is slower in a way that depends on what got evicted.

## The checklist

1. **Look at swap before you start.** `sysctl vm.swapusage` takes a second. If most of the swap is in use, close things and check again.
2. **Don't let the benchmark use the memory it's measuring.** A harness that caches float32 copies of 4-bit weights can push tens of gigabytes into swap on its own, and then every number describes paging.
3. **Warm up and calibrate first.** The first call compiles kernels, and an int8 path also calibrates on its first input. Neither is steady state.
4. **Interleave the candidates.** Run A, B, A, B and compare within each round, so heat and memory pressure hit both the same way. Don't run all of A and then all of B.
5. **Benchmark a slice.** Four transformer blocks take about two seconds, a full step about 17. A short run finishes before the machine's state changes and lets you do many rounds. Scale up afterwards and call it an estimate.
6. **Take the minimum of a few repetitions.** Interference only slows things down, so the fastest of three is closest to what the code can do. Use the median across rounds if you need typical behavior.
7. **Pause between rounds.** Ten seconds lets the chip leave a sprint before the next measurement. A longer wait before the first round also helps.
8. **Report ranges and say how you got them.** "8.3 to 8.5 seconds" is more honest than "8.4", and "cool block-level run" and "whole image on a warm machine" are different claims.

## A small harness

```python
import time
import mlx.core as mx

def timed(fn, reps=3):
    best = float("inf")
    for _ in range(reps):
        start = time.perf_counter()
        mx.eval(fn())                       # force the lazy graph to run
        best = min(best, time.perf_counter() - start)
    return best

candidates = {"4-bit": run_quantized, "int8": run_int8}

for fn in candidates.values():              # warm up and calibrate
    mx.eval(fn())
time.sleep(45)

for round_ in range(4):
    row = {name: timed(fn) for name, fn in candidates.items()}
    print(round_, {k: round(v, 3) for k, v in row.items()})
    time.sleep(10)
```

`mx.eval` matters. MLX is lazy, so timing a call that returns an unevaluated array measures graph construction, not the work.

## Reading the result

With a slice and interleaving, four rounds of four Krea 2 blocks gave 2.3 to 2.6 seconds for the 4-bit path and 1.6 to 1.7 for the int8 path every time. That is a ratio between 1.43 and 1.57, steady enough to quote.

{{chart:int8-block-rounds}}

Whole-image timings are noisier, so claim less from them. MOSS-Image Turbo took 115.7, 130.3, 139.8 and 160.1 seconds on four prompts before enabling int8, and 97.8, 118.6, 115.3 and 118.4 after. The average fell about 18 percent, but later images were slower in both series, so the pairs aren't like for like. That gain is believable because the block-level timings agree with it. Alone, those four pairs wouldn't prove much.

{{chart:moss-int8-images}}

## Models used

- [mflux-community/krea-2-turbo-mflux-q4](https://huggingface.co/mflux-community/krea-2-turbo-mflux-q4): the Krea 2 weights used for the block timings.
- [VisualInference/MOSS-Image-SFT-MLX-compact](https://huggingface.co/VisualInference/MOSS-Image-SFT-MLX-compact) with the [Turbo build](https://huggingface.co/VisualInference/MOSS-Image-SFT-Turbo-MLX): the MOSS-Image models behind the whole-image timings.
