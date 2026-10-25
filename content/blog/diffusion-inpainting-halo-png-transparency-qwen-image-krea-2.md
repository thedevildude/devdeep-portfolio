---
title: Diffusion inpainting with Qwen-Image 2.1, Krea 2 and Z-Image: fix the tone halo and keep PNG transparency
tag: Tutorial
seoTitle: Inpainting Halo Fix and PNG Alpha: Qwen-Image, Krea 2
description: Masked diffusion inpainting leaves a tone halo around the mask and drops PNG transparency. How to measure the halo, correct it, and composite with alpha.
date: 2026-10-25
updated: 2026-10-25
keywords: inpainting halo, diffusion inpainting artifacts, masked edit, PNG transparency, alpha channel, RGBA, Qwen-Image 2.1, Krea 2, Z-Image, tone drift, mask feathering, blended latent diffusion
---

Two problems show up in almost every mask-based image editor built on a text-to-image model. The edited region sits inside a faint disc the shape of your brush stroke, and a PNG with transparency comes back flat and opaque. Both are fixed in the step that pastes the generated area back over the original. This guide covers how that step works, how to measure the halo, how to remove it, and how to keep alpha. The examples use Qwen-Image 2.1, Krea 2 and Z-Image, but nothing depends on those models.

## How mask-based editing works without an inpainting model

If the model has no inpainting variant, you can still edit through the sampling loop. The model denoises the whole canvas, and after every step the area outside the mask is overwritten with the original image's latents, re-noised to that step's noise level. The masked area evolves freely, and by the last step the outside is the original exactly. With flow-matching models the re-noising is one line: `x_sigma = (1 - sigma) * x_0 + sigma * noise`, using one fixed noise sample for the whole loop so the pinned region doesn't shimmer.

After decoding, composite the result over the original through a feathered mask. The VAE redraws every pixel slightly differently, and without the composite an edit in one corner subtly changes the rest of the picture.

## The halo: measure it first

A halo happens because the model regenerates everything under the mask and is free to pick a slightly different shade for the parts meant to stay the same, like a sky 20 levels darker. Near the mask edge the pixels agree with the original, because the outside is pinned and the feather blends. Further in, the offset ramps up.

Don't judge it by eye. Take a row of pixels that crosses the mask edge and plot the difference from the original:

```python
import numpy as np

diff = np.asarray(result, dtype=float) - np.asarray(original, dtype=float)
profile = diff[y0:y1].mean(axis=(0, 2))      # average rows y0..y1 and the RGB channels
# profile[x] near 0 outside the mask, then drifting to about -20 inside it
```

In a test that added a moon to a sky, the drift was about 0 at the edge, reached -17 at 34 pixels in, and stayed near -20 inside. The plain paste-back line in the chart is that profile.

## Correct the drift before compositing

You want a smooth correction that makes the edit meet its surroundings without a step, and leaves the new content alone. A sampled version of seamless cloning's low-frequency half works, and you don't need OpenCV for it:

1. Work out the ring just inside the mask edge, about six percent of the image's long side deep. This is where the drift has developed but the new content hasn't started.
2. In that ring, keep only pixels where the generated image and the original differ by 48 levels or less in every channel. Larger differences are the thing you asked for, so they are excluded.
3. Turn the surviving differences into a smooth field on a coarse grid (about 128 cells on the long side) with a normalized blur, at two scales: a fine one that follows the ramp near the edge and a wide one from the inner part of the ring for the interior. Blend the two by how much data is near each point.
4. Upsample the field, clip it to plus or minus 48, and add it to the generated image.
5. Composite as usual.

On that test the correction held the difference within about 2 levels near the edge and no worse than 7 anywhere on the profile, and the moon was still 16 to 23 levels different from the original, as it should be. It takes about 0.06 seconds.

{{chart:halo-profile}}

Know its limit. It guesses that small differences near the edge are drift. A subtle change you paint right up against the mask edge, like making a shirt slightly darker, is under the threshold and can be partly pulled back toward the original. Bold edits and new objects aren't affected, and a larger mask solves the subtle case.

## Keep the PNG's transparency

Models that decode three channels can't make alpha, so you carry the original's alpha through yourself. Decoders that produce four channels (Qwen-Image 2.1's VAE does) don't return a clean 255 for solid areas either. It comes back around 243, lower along tile seams. The rules that worked:

- **Detect alpha properly.** An RGBA or LA image has a channel. A palette PNG keeps transparency in `image.info["transparency"]`, so convert it to RGBA before reading it.
- **Keep the source as RGBA** if any pixel is below 255, and as RGB otherwise, so opaque images behave as before.
- **Outside the mask, the original alpha survives exactly.**
- **Inside the mask, pick by engine.** If the model generates alpha, use its alpha, so an edit can fill a hole or cut one. If it decodes RGB only, keep the original's alpha there too, so the edit changes colour and not the shape.
- **Snap the decoded alpha** so near-opaque reads as opaque, otherwise an inpainted patch looks faintly see-through inside a solid object.

```python
def snap_alpha(alpha, low=16, high=240):
    scale = 255.0 / (high - low)
    return alpha.point(lambda v: 0 if v <= low else 255 if v >= high else round((v - low) * scale))

merged = Image.composite(edited_rgb, original_rgb, mask)
edited_alpha = snap_alpha(result.getchannel("A")) if result.mode == "RGBA" else original_alpha
merged.putalpha(Image.composite(edited_alpha, original_alpha, mask))
```

For a whole-image edit with no mask, the same idea applies: if the source had transparency, don't run your "flatten to RGB if the image is basically opaque" rule on the result.

## Models used

- [Qwen/Qwen-Image-2.1-Turbo](https://huggingface.co/Qwen/Qwen-Image-2.1-Turbo): its VAE decodes RGBA, which is where the near-255 alpha comes from.
- [Comfy-Org/Krea-2](https://huggingface.co/Comfy-Org/Krea-2) (official: [krea/Krea-2-Turbo](https://huggingface.co/krea/Krea-2-Turbo)): decodes RGB only.
- [Tongyi-MAI/Z-Image-Turbo](https://huggingface.co/Tongyi-MAI/Z-Image-Turbo): decodes RGB only.
