---
title: Two bugs in my inpainting editor: a halo around every edit, and vanishing transparency
tag: Debugging
seoTitle: Inpainting Halo Fix and PNG Transparency in Diffusion Edits
description: Why diffusion inpainting leaves a tone halo around the mask, how I measured and removed it, and how to keep a PNG's transparency instead of flattening to RGB.
date: 2026-10-25
updated: 2026-10-25
keywords: inpainting halo, diffusion inpainting artifacts, masked edit, PNG transparency, alpha channel, RGBA, Qwen-Image, Krea 2, Z-Image, seamless cloning, tone drift, mask feathering
---

We built an image editor into our experiment where you paint a mask over part of a picture, describe what should be there, and a diffusion model regenerates just that part. Two things about it were wrong in ways that took me a while to name. If you edit a PNG with transparency, you got a flat opaque image back. And every edit sat inside a faint disc the shape of the brush stroke, like a smudge around what I'd changed.

Both fixes live in the code that pastes the generated area back into the original, so that is where this article is.

## How the paste-back works

Masked editing here doesn't use a special inpainting model. The model denoises the whole canvas, and at every step the part outside the mask is overwritten with the original image's latents, re-noised to that step's level. The masked region evolves freely. By the last step the outside is the original exactly. After decoding, the result is composited over the original through a feathered mask, because the VAE re-draws every pixel slightly differently and I didn't want an edit in one corner to change the rest of the picture.

That composite is where both bugs were.

## Transparency disappeared in two places

I'd hit this with Qwen-Image 2.1, whose VAE decodes four channels, RGBA, not three. It never decodes alpha as a clean 255, though. A solid area comes back around 243, and lower along the seams between VAE tiles. Over our dark interface those near-opaque bands showed up as faint lines across ordinary images.

The fix at the time was to flatten the result to RGB unless the image was meant to be transparent: keep the alpha only if at least one percent of the pixels were more than half see-through. Reasonable for a new image. Terrible for an edit of your transparent logo, which might have a small cut-out and fall under the threshold. So whole-image edits of a PNG lost their alpha, and masked edits lost it twice more, because the source was converted to RGB to build the picture the result gets pasted over, and the composite then converted both images to RGB again.

What I changed:

- **Keep the source's alpha if it has any.** That includes palette PNGs, where transparency lives in the image's info and not in a channel. If an image is fully opaque, nothing changes from before.
- **Outside the mask, the original alpha survives exactly.** It is never touched by the model.
- **Inside the mask, it depends on the engine.** Qwen-Image 2.1 generates alpha, so its alpha is used, which means an edit can fill in a transparent area or cut a hole. Z-Image and Krea 2 decode plain RGB, so the original alpha stays inside the mask too: the edit changes colours and not the shape.
- **Decoded alpha gets snapped.** Values at or below 16 become 0, values at or above 240 become 255, and the range between is stretched. Otherwise an inpainted patch is faintly see-through in the middle of a solid object, because the VAE's solid is 243.
- **Whole-image edits of a transparent source with Qwen skip the flatten rule.** If you give it a transparent PNG you get one back.

The editor shows a "Transparent" badge and a checkerboard behind see-through areas now, so you can see what you're editing.

## The halo

This one was more interesting. I made a test I could repeat: a lighthouse at sunset, an elliptical mask over part of the sky, the prompt "a full moon in the sky", at full strength. The moon came out fine, and there was a visible darker disc around it, the shape of the mask, where the sky didn't quite match the sky outside.

I measured instead of squinting. Sampling the sky inside the mask against the original: 24, 18 and 24 levels darker in red, green and blue. Just outside the mask: zero. The model had been asked to regenerate the sky and had settled on a slightly different shade. Near the mask edge the pixels agree with the original, because the outside is pinned at every step and the feather blends it. Further in the model is free, and the offset ramps in. Along a line crossing the edge, the difference from the original was about 0 at the edge, minus 10 some 20 pixels in, minus 18 at 40 pixels and about minus 20 from there on. That ramp is a disc.

## The fix that did nothing

I wanted something like Poisson blending, the trick image editors use to make a pasted region take on the tone of its surroundings. OpenCV has it and isn't in our dependencies, and I only needed the low-frequency half anyway: the overall shift in tone, not the detail.

My first version measured the difference between the new and the original pixels along the mask's feathered edge, smoothed it, and added it across the masked area. It did nothing. The sky next to the moon was still 21 levels darker. The reason was in the numbers I'd just collected: at the edge, the difference is near zero. I was measuring the one place the drift hadn't happened yet.

## The version that worked

The drift shows up just inside the edge, so I sample there. The algorithm, on a coarse grid of about 128 cells along the long side:

- Take a ring of pixels inside the mask, about six percent of the image's long side deep.
- Keep the ones where the new and the original differ by 48 levels or less, in every channel. Bigger differences are the thing you asked for, like the moon, and are not drift.
- Turn the differences into a smooth correction field with a normalized blur at two scales: a fine one that follows the ramp near the edge, and a wide one from the inner part of the ring that fills the interior. The two are blended by how much data is near each point.
- Upsample the field, clip it to plus or minus 48, and add it to the generated image before the paste-back.

On the saved moon edit, the sky next to the moon was off by minus 21 before. After, it was within about 3 levels along the same line, and no worse than 7 anywhere on it. The moon is still 16 to 23 levels different from the original, which is the point. The correction takes about 0.06 seconds. The tests cover the three cases that matter: drift is removed while the new object stays, a recolor that fills the whole mask is left alone, and an untouched result stays untouched.

{{chart:halo-profile}}

## What it can't do

It guesses, and a guess can be wrong. If you paint a mask tight around a shirt and ask for "slightly darker", the change is under the 48-level limit, and the edge ring is the shirt. The correction reads the darker shirt as drift and pulls part of it back. Bold changes and new objects are safe, subtle recolors against the mask's edge are not. If that bites you, the fix is a larger mask or a stronger prompt. I'd rather have the halo gone by default and a known limit than the other way round.

The code is in the shared masked-edit module, so every engine that does masked edits gets both fixes. The brush strokes in the same editor had a different problem, [which is the next article](/blog/canvas-brush-strokes-wrong-place).
