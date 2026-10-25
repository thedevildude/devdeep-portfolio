---
title: How to benchmark on a fanless MacBook without fooling yourself
tag: Performance
seoTitle: Benchmarking on a MacBook Air: Thermal Throttling and Swap
description: The same MLX operation took 19 seconds, then 41, on my MacBook Air. Why laptop benchmarks drift, and the habits that finally gave me steady numbers.
date: 2026-10-25
updated: 2026-10-25
keywords: MacBook Air benchmark, thermal throttling, Apple Silicon benchmark, MLX performance, memory pressure, swap, fanless laptop, M5, benchmarking methodology
---

While I was optimizing image models for [a 16GB MacBook Air](/blog/qwen-image-mlx-port-macbook-air), I timed the same forward pass four times in one benchmark and got 19.6 seconds, 23.9, 30.1 and 41.2. Same input, same weights, same machine, nothing changed between runs. If I had stopped after the first two numbers I could have told you my optimization was a failure or a triumph and been equally convincing about either.

That is the hazard of benchmarking on a laptop without a fan. This is a short account of what moved the numbers and what I now do about it. It is not rigorous, but it is better than what I was doing.

{{chart:timing-drift}}

## Two ways the same code gets slower

The Air has no fan. Under sustained GPU load it gets warm, and macOS lowers clocks to keep it that way. A single image takes minutes, which is plenty of time for that to start. So the thirtieth step of a run is not guaranteed to cost what the first did.

The other cause is memory. These models run close to the machine's limit, so anything else I had open mattered. When I checked, 10.7GB of a 12GB swap file was in use, with a browser and a few other apps resident. A run that has to page is slow in a way that depends on what the system decided to evict. It's as random as it sounds.

I can't tell you how much of that 19 to 41 second spread was heat and how much was swap. The tool that is supposed to report thermal throttling, `pmset -g therm`, said nothing had been recorded while my timings doubled. The machine didn't tell me anything was wrong. The only symptom was the clock.

## What didn't work

I made two mistakes before I started to get it.

First, I let the benchmark itself be the problem. An early simulation of the int8 path cached float32 copies of the weights, which pushed about 28GB into swap on a 16GB machine. Every measurement from that run described paging. If your benchmark allocates more than the thing it measures, you are measuring the allocator.

Second, I compared a run of "before" with a later run of "after". On MOSS-Image, another model in our experiment, I timed four prompts before the int8 change and four after: 115.7, 130.3, 139.8 and 160.1 seconds, then 97.8, 118.6, 115.3 and 118.4. The first image was the fastest in both series, and later ones tended to be slower. Some of that is the prompts and some is the machine, and I can't separate them. The average improved by about 18 percent, which I believe, but only because the gain also showed up in block-level timings of the matmuls.

{{chart:moss-int8-images}}

## What I do now

- **Check memory first.** `sysctl vm.swapusage` takes a second. If swap is mostly full, close things and look again before trusting anything.
- **Interleave.** Don't run all of A and then all of B. Run A, B, A, B, so heat and memory pressure hit both the same way, and compare within each round. In the 19 to 41 second runs above, one round said int8 was faster and the next said it was slower, which is the signature of a noise problem and not a conclusion.
- **Benchmark a slice.** Four transformer blocks, repeated, take about two seconds. A full step is about 17. A short run finishes before the machine's mood changes, and I can do many rounds. I scale up afterwards, with the usual caveat that scaling up is an estimate.
- **Take the minimum of a few repetitions.** Interference only makes things slower, so the fastest of three is closest to what the code can do. For a claim about typical behavior I use a median across rounds.
- **Pause between rounds.** I wait a few seconds so the chip isn't in the middle of a sprint when the next measurement starts. My block benchmark waits 45 seconds before the first round and 10 between rounds.
- **Warm up and calibrate before timing.** The first call compiles kernels, and the first int8 call also calibrates. Neither number means anything about steady state.
- **Report ranges and say how the number was made.** Throughout these articles I give "8.3 to 8.5 seconds" and not "8.4", and I say when a figure is from a cool block-level run and when it is from a whole image on a warm machine.

## Does it work?

With the slice approach, four rounds with all of the above gave 2.3 to 2.6 seconds for four blocks without int8 and 1.6 to 1.7 with it, every time. That is a ratio between 1.43 and 1.57, steady enough to quote. The full-image numbers I have are noisier, which is why the claims I make about them are smaller: 12 to 20 percent on Qwen-Image, not the 30 percent the per-step numbers suggest.

{{chart:int8-block-rounds}}

I'd still not call any of this a proper benchmark. It is one machine, one chip, one person with a browser open. But it was enough to tell me which optimizations were real, and [the kernel work](/blog/custom-metal-kernels-mlx-int8-m5) only got decided on numbers I could repeat. If you are timing something on a laptop, run it several times before you believe the first number. Mine went from 19.6 to 41.2.
