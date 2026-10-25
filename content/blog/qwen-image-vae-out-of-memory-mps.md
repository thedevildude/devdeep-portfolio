---
title: The VAE that held on to 12GB of my Mac, and the one-function fix
tag: Debugging
seoTitle: Fix Qwen-Image VAE Out of Memory on Mac (PyTorch MPS)
description: The Qwen-Image VAE decodes with Conv3d, which on PyTorch MPS peaks near 15GB and keeps 12GB allocated. Running single-frame convs as Conv2d fixes it.
date: 2026-10-25
updated: 2026-10-25
keywords: AutoencoderKLQwenImage, MPS backend out of memory, PyTorch MPS, Conv3d, Qwen-Image VAE, Krea 2, diffusers, Apple Silicon, VAE decode memory, torch.mps
---

I was running Krea 2 on a 16GB MacBook Air and kept getting this:

`RuntimeError: MPS backend out of memory (MPS allocated: 1.04 GiB, other allocations: 19.06 GiB, max allowed: 20.13 GiB)`

The model's weights were 7GB and PyTorch had about 1GB allocated, so "other allocations: 19GB" made no sense. The error came from inside the VAE's tiled decode. It took me a while to stop blaming the model and look at the decoder. This is what was going on, in case you've hit the same wall, because the fix applies to more than the model I was working on.

## Which models this touches

diffusers' `AutoencoderKLQwenImage` decodes the latents for Qwen-Image, Qwen-Image-Edit and Krea 2. It is a video VAE. Every convolution in it is a `Conv3d` over frames, height and width, with causal padding along the time axis, so frame N never sees frame N plus one. An image is a video with one frame, and the code runs the full 3D machinery on it anyway. (Qwen-Image 2.1 ships its own VAE that already uses 2D convolutions, so this doesn't affect it.)

## Measuring the wrong thing first

My first theory was tile size. The decode is tiled so it doesn't allocate a whole 1024px image's activations at once, and diffusers' default tile is 256px. I measured a decode at a few tile sizes. In one order, 256px looked terrible, a 15.5GB peak against 6GB at 512px. In another order the same sizes gave 3.4GB at 256px and 5.5GB at 512px. Whichever size ran first peaked near 15GB, whatever it was.

The first decode in a fresh process spiked to roughly 15GB regardless of tile size. After that, decodes needed 3 to 8GB depending on tiling, because something was already holding the memory. When I printed `torch.mps.driver_allocated_memory()` next to `torch.mps.current_allocated_memory()`, the situation was plain: after one decode, the driver was holding about 12GB while PyTorch's live tensors came to 0.26GB. The memory was no longer in use. It just wasn't being given back, and with MLX holding 7GB of weights in the same unified memory, the next allocation had nowhere to go.

The lesson I took: on MPS, `current_allocated_memory` can be nearly empty while the machine is full. Look at the driver's number, measure the first call separately from the rest, and never trust a table you only produced in one order.

{{chart:vae-first-decode}}

## Why one frame doesn't need three dimensions

Look at what the causal padding does for a single frame. A 3x3x3 convolution pads the time axis with two frames of zeros in front, then the image. When the layer has no cached previous frame, which is always the case for the first frame, the kernel's first two time slices are multiplied by zeros. Only the last time slice touches real data.

So a causal `Conv3d` on one frame is a 2D convolution with the kernel's last temporal slice, `weight[:, :, -1]`, over the frame itself, `x[:, :, 0]`. Same weights, same result, one dimension fewer. A kernel with a time size of 1 is the same thing with only one slice to choose from.

The patch replaces `QwenImageCausalConv3d.forward` and takes the 2D path only when it is provably equivalent: a single frame, no cached frame, a time stride of 1, and causal padding exactly one less than the kernel's time size. Anything else, such as several frames or a cached frame from a video decode, goes through the original code.

## What it changed

At 1024px with 512px tiles on the M5 Air:

- With Conv3d: 6.7 seconds, a peak of 15.25GB above the baseline, and 12.36GB still allocated afterwards.
- With Conv2d: 2.7 seconds, a peak of about 2.3GB, and 0.43GB allocated afterwards.

Decoding got two and a half times faster, the peak shrank by a factor of six, and nothing is left behind. I never worked out why PyTorch's MPS backend is so greedy with `Conv3d`, and the fix doesn't need me to. If you know, I'd love to hear it.

{{chart:vae-conv-compare}}

The outputs aren't bit-identical on the GPU, because different kernels round differently in bf16. The decoded images differ by a mean absolute value of 0.0012 on a scale of minus one to one, with a worst case of 0.047, and the encode path by at most 0.031. In float32 on the CPU the two paths agree to 1e-5, which is what the unit test checks, along with the multi-frame and cached-frame cases taking the old path.

## Using it

It is a small class-level patch, applied once before the pipeline is built and safe to call twice. We applied it to the three pipelines in our experiment that use this VAE: Krea 2, Qwen-Image and Qwen-Image-Edit. If you use diffusers on a Mac and one of these models runs out of memory in the decoder, this is the first thing to try. I only measured Apple Silicon, so I can't say what it does anywhere else.

I found this because [fitting Krea 2 into 16GB](/blog/krea-2-on-a-16gb-mac) wouldn't work until the decoder stopped keeping 12GB for itself. It was not the part of the pipeline I'd have guessed.
