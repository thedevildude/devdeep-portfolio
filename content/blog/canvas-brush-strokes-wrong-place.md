---
title: Why my canvas brush strokes landed in the wrong place
tag: Debugging
seoTitle: Canvas Brush in the Wrong Place: Fixed Position + Transform
description: My React canvas mask editor painted above the click on tall images, and its brush ring sat off the pointer. Two CSS causes, the fix, and how I tested the maths.
date: 2026-10-25
updated: 2026-10-25
keywords: canvas brush offset, canvas mouse coordinates wrong, position fixed transform, getBoundingClientRect canvas, React canvas drawing, pointer events, mask painting, inpainting editor, zoom and pan canvas
---

The inpainting editor in our experiment had a bug that I could feel before I could explain. You'd paint over something, and the red stroke would show up a little above where you'd put the brush. On tall images it was clearly wrong, and the brush ring that follows your pointer never quite sat under it. The editor was unpleasant to use, and I'd been blaming myself for being sloppy.

It turned out to be two separate CSS bugs that made the same symptom, plus a design choice that made both likelier. If you've ever had a canvas draw somewhere other than where you clicked, one of these is probably yours too.

## Bug one: position fixed inside a transformed parent

The brush ring was a div with `position: fixed`, placed at the pointer's `clientX` and `clientY`. That is correct if fixed means "relative to the window". It does, unless an ancestor has a `transform`. A transformed element becomes the containing block for its fixed-position descendants, and `filter`, `perspective` and `will-change: transform` do the same.

The editor lives inside a dialog, and the dialog is centred with the classic `left: 50%; top: 50%; transform: translate(-50%, -50%)`. So my "fixed" ring was positioned relative to the dialog's own box. Every coordinate was off by the dialog's offset from the window's corner. I rebuilt it in a bare page to check: inside a dialog whose top-left corner sat at (190, 100), a fixed element at `left: 100px; top: 100px` was drawn at (290, 200). The ring floated at a constant displacement from the pointer.

The real cursor was hidden with `cursor: none`, because I wanted the ring to be the cursor. So the one thing on screen telling you where the brush would land was the thing that was wrong.

The fix is to not use `fixed` at all. The ring is now `position: absolute` inside the editing viewport, and its coordinates are the pointer's position minus that viewport's `getBoundingClientRect()`. It works wherever the editor sits, in a dialog, in a transformed container or on a bare page.

## Bug two: max-height that squashed the canvas and not the image

This one was the one that made tall images worse. The canvas element overlaid an `<img>`, both sized by CSS inside a wrapper that had `max-height: 100%` so a big image would fit the window. The image had `width: 100%; height: auto`, and the canvas was `position: absolute` with `inset: 0; width: 100%; height: 100%`.

On a wide image everything fitted. On a tall one, the wrapper was shortened by `max-height`, but the `<img>` kept its natural aspect ratio and overflowed. The canvas, being 100% of the wrapper, got squashed to the shorter height. The two layers were now different sizes in the same place. A click was mapped to the canvas's coordinate system correctly, and then drawn onto a canvas that was no longer the same shape as the picture beneath it. Everything landed too high, by an amount that grew toward the bottom. In my bare-page repro, with a 512 by 1024 image in a 600-pixel dialog, the wrapper was capped at 492 pixels tall, the image stayed 1,024 pixels tall and the canvas was squashed to 492.

The fix is that the layout can't be left to CSS to work out. The component now measures the viewport with a `ResizeObserver`, computes the image's display size itself from its aspect ratio, and gives one stage element that exact pixel width and height. The image and the canvas both fill that stage with `absolute inset-0`, so they cannot disagree. Pointer positions map through the stage's own bounding rectangle: `(clientX - rect.left) / rect.width * canvas.width`, and the same for y.

## What I changed while I was in there

Once the geometry was computed instead of inherited, zoom and pan were cheap to add, and a mask editor without them is hard to use on a big image.

- **Zoom at the cursor.** When the scale changes, the image point under the pointer has to stay under the pointer. That means working out which image pixel it is before the change, and choosing the pan offset afterwards that puts the same pixel back.
- **Trackpad pinch arrives as a wheel event with ctrl held.** And React attaches wheel handlers as passive, so `preventDefault` does nothing and the whole page zooms. The wheel listener has to be a native one added with `{ passive: false }`.
- **Space-drag and middle-drag pan,** as in every image editor, plus two-finger scroll.
- **Coalesced events.** Browsers batch pointer moves between frames. Reading `getCoalescedEvents()` gives you every sample, so a fast stroke is a curve and not a few straight chords.
- **A click that doesn't move** draws a zero-length line, which draws nothing. The first point also draws a dot.
- **Stroke undo,** using `ImageData` snapshots of the mask, with a memory budget so a huge canvas keeps fewer steps. This is separate from the version history, where each step is a generated image: a stroke is cheap to redo and a generation takes minutes, so they shouldn't share one undo stack.
- **The mask lives at the image's real resolution** and is only scaled for display, so a stroke means the same thing at any zoom or window size.

One more fix wasn't geometry. A click just outside the canvas while painting would close the dialog and throw the mask away. I'd done it myself. The dialog now ignores outside clicks.

## Testing pointer maths without a hand

I couldn't test this by painting, since the Chrome extension I use for automation wasn't connected, and "it felt right" is what had let the bug survive. So I tested it headlessly. A small page renders the real component inside a `fixed` plus `transform` container, as the dialog does, with a 512 by 1024 test image. A script drives Chrome through the DevTools protocol, moves the mouse to a known screen position, and reads the mask canvas's alpha at the image pixel that should have been painted.

The checks, all passing: a click at image pixel (256, 900), near the bottom of the tall image where the old layout drifted most, paints at exactly that pixel and not 40 pixels above. The brush ring's centre is zero pixels from the pointer. Its diameter matches the brush size times the display scale. A drag across paints along the line. Undo removes the last stroke and nothing else. After zooming 2x, a click still lands where the pointer is.

It isn't a substitute for using it, and I haven't tested with a real trackpad pinch. But the thing that was wrong was arithmetic, and arithmetic is easy to test if you ask the browser where things are instead of guessing. For what happens to the mask once you've painted it, the [article on inpainting halos and transparency](/blog/inpainting-halo-and-png-transparency) picks up from there.
