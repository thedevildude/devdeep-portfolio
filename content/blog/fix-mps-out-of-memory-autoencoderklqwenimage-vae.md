---
title: Fix "MPS backend out of memory" in the Qwen-Image VAE (AutoencoderKLQwenImage)
tag: Troubleshooting
seoTitle: Fix MPS Out of Memory in AutoencoderKLQwenImage (Qwen VAE)
description: The Qwen-Image VAE decodes with Conv3d, which on PyTorch MPS peaks near 15GB and keeps 12GB allocated. Run single-frame convs as Conv2d to fix it.
date: 2026-10-25
updated: 2026-10-25
keywords: AutoencoderKLQwenImage, MPS backend out of memory, PyTorch MPS, Conv3d, Qwen-Image VAE, Qwen-Image-Edit, Krea 2, diffusers, Apple Silicon, VAE decode memory, torch.mps
---

`AutoencoderKLQwenImage` is the VAE diffusers uses for Qwen-Image, Qwen-Image-Edit and Krea 2. On a Mac with PyTorch MPS, decoding the final latents can fail like this even when the model weights are small:

`RuntimeError: MPS backend out of memory (MPS allocated: 1.04 GiB, other allocations: 19.06 GiB, max allowed: 20.13 GiB)`

The traceback ends inside `tiled_decode`, on the first convolution of a tile. This guide shows how to confirm the cause, the patch that fixes it, and how to check the patch is safe. (Qwen-Image 2.1 ships its own VAE with 2D convolutions and isn't affected.)

## Step 1: Measure the number that matters

PyTorch reports two different figures on MPS:

```python
import torch

def mps(label):
    print(
        label,
        "driver", round(torch.mps.driver_allocated_memory() / 1e9, 2), "GB,",
        "live", round(torch.mps.current_allocated_memory() / 1e9, 2), "GB",
    )
```

`current_allocated_memory` counts live tensors. `driver_allocated_memory` is what the Metal driver has reserved for the process. After one VAE decode, the driver can still hold 12.36GB while live tensors come to 0.26GB. On a Mac the GPU shares memory with everything else, so the reserved figure is the one that causes the next allocation to fail.

Take two more precautions when you measure:

- Time and measure the first decode separately from later ones. The first call in a fresh process peaked near 15GB at every tile size tried.
- Run the experiments in more than one order. In one order, 256px tiles looked like the problem (a 15.5GB peak against 6GB at 512px). In another order the same sizes gave 3.4GB and 5.5GB.

{{chart:vae-first-decode}}

## Step 2: Find the operation

Read the model code. The VAE is a video VAE: every convolution is a `QwenImageCausalConv3d`, a `Conv3d` over (frames, height, width) with causal padding in time, so frame N never sees frame N+1. An image is a video with one frame, and the code runs the 3D convolutions on it anyway. MPS handles that badly: a large peak, and memory that isn't handed back.

## Step 3: Replace the op for single frames

For a causal 3D convolution on the first frame, the temporal padding is `kernel_t - 1` frames of zeros in front of the image. With no cached previous frame, only the last time slice of the kernel touches real data. So the result is a 2D convolution with `weight[:, :, -1]` over the frame:

```python
import torch.nn.functional as F
from diffusers.models.autoencoders import autoencoder_kl_qwenimage as module

conv_cls = module.QwenImageCausalConv3d
original = conv_cls.forward

def forward(self, x, cache_x=None):
    if (
        x.shape[2] == 1                          # one frame
        and cache_x is None                      # no cached previous frame
        and self.stride[0] == 1                  # no stride in time
        and self._padding[4] == self.kernel_size[0] - 1
    ):
        pad_w, _, pad_h, _, _, _ = self._padding
        y = F.conv2d(
            F.pad(x[:, :, 0], (pad_w, pad_w, pad_h, pad_h)),
            self.weight[:, :, -1],
            self.bias,
            self.stride[1:], 0, self.dilation[1:], self.groups,
        )
        return y.unsqueeze(2)
    return original(self, x, cache_x)           # anything else keeps the old path

conv_cls.forward = forward
```

Apply it once, before you build the pipeline, and guard it with a flag on the class so a second call does nothing. Anything that isn't a plain single frame, such as several frames or a cached frame from a video decode, still takes the original code.

## Step 4: Check the patch

Two tests cover it:

1. On the CPU in float32, compare the patched layer with a reference `Conv3d` for a 3x3x3 kernel, a 1x1x1 kernel and a strided kernel. They should agree to about 1e-5. Also test several frames, and a single frame with `cache_x`, and confirm those go through the original path.
2. On the GPU in bf16, compare whole decodes. The differences should be rounding only: here a mean absolute difference of 0.0012 on a scale of -1 to 1, a worst case of 0.047, and at most 0.031 on the encode path.

## Results

At 1024px with 512px tiles on an M5 MacBook Air, the decode took 2.7 seconds instead of 6.7. The peak above baseline fell from 15.25GB to about 2.3GB, and the memory still held afterwards from 12.36GB to 0.43GB.

{{chart:vae-conv-compare}}

These numbers are from Apple Silicon only. If you decode on CUDA you may not see the problem at all.

## Models used

- [Qwen/Qwen-Image](https://huggingface.co/Qwen/Qwen-Image): its `vae` subfolder is the `AutoencoderKLQwenImage` weights, shared by the models below.
- [Qwen/Qwen-Image-Edit-2511](https://huggingface.co/Qwen/Qwen-Image-Edit-2511): decodes with the same VAE class.
- [krea/Krea-2-Turbo](https://huggingface.co/krea/Krea-2-Turbo) and the ungated [Comfy-Org/Krea-2](https://huggingface.co/Comfy-Org/Krea-2): Krea 2 uses the Qwen-Image VAE.
