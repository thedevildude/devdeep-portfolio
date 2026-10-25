---
title: Canvas brush in the wrong place: fix pointer coordinates, position: fixed and CSS transforms
tag: Troubleshooting
seoTitle: Canvas Brush Offset: Fix position:fixed in a Transform
description: A canvas paints above or away from the cursor. Two CSS causes (position: fixed inside a transformed parent, max-height squashing the canvas) and how to fix them.
date: 2026-10-25
updated: 2026-10-25
keywords: canvas brush offset, canvas mouse coordinates wrong, position fixed transform, getBoundingClientRect canvas, React canvas drawing, pointer events, mask painting, inpainting editor, zoom and pan canvas
---

If your canvas draws above or beside where you clicked, or your custom brush cursor doesn't sit under the real pointer, the cause is almost always layout, not your drawing code. Here are the two CSS causes behind a mask-painting editor with exactly that symptom, the fix, and a way to test pointer maths without clicking.

## Map the pointer to canvas pixels correctly

The mapping is the same in every canvas app. Take the pointer position relative to the element that is actually displayed, scale it by the ratio of the canvas's pixel size to its displayed size:

```ts
const rect = stage.getBoundingClientRect();
const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
const y = ((e.clientY - rect.top) / rect.height) * canvas.height;
```

Use `getBoundingClientRect()` on the element you draw on, every time, not a width you cached earlier. It accounts for scroll, zoom and CSS scaling. If the result is wrong, the rectangle is not what you think it is, and the two traps below are the usual reasons.

## Trap 1: `position: fixed` inside a transformed parent

A custom brush ring is often a `position: fixed` div placed at `clientX` and `clientY`. That works until an ancestor has a `transform`. A transformed element becomes the containing block for its fixed-position descendants, and so do `filter`, `perspective` and `will-change: transform`. A dialog centred with the usual `left: 50%; top: 50%; transform: translate(-50%, -50%)` does it.

In a test page with a dialog whose top-left corner sat at (190, 100), an element with `left: 100px; top: 100px` was drawn at (290, 200). The ring floated at a constant offset from the pointer, and if you hide the real cursor with `cursor: none` it is the only thing telling the user where the brush will land.

Fix it by not using `fixed`. Put the ring in the editing viewport with `position: absolute` and use the pointer position minus that viewport's `getBoundingClientRect()`. It then works inside a dialog, a transformed container or a bare page.

## Trap 2: `max-height` that squashes the canvas but not the image

The common structure is an `<img>` with a `<canvas>` overlaid on top, both sized by CSS inside a wrapper with `max-height: 100%` so a big image fits the window. The image has `width: 100%; height: auto`, and the canvas is `position: absolute; inset: 0; width: 100%; height: 100%`.

On a wide image that is fine. On a tall image the wrapper is capped by `max-height`, but the image keeps its aspect ratio and overflows, and the canvas, being 100% of the wrapper, is squashed to the shorter height. They are now two different shapes in the same place. In a test with a 512 by 1024 image in a 600-pixel dialog, the wrapper was 492 pixels tall, the image 1,024 and the canvas 492. A click is mapped correctly for the canvas and then drawn on a canvas that no longer matches the picture, so everything lands too high, by more toward the bottom.

Don't let CSS work out the layout. Measure the viewport with a `ResizeObserver`, compute the image's display size from its aspect ratio, and give one stage element that exact width and height. The image and canvas both fill the stage with `absolute inset-0`, so they cannot disagree.

## Zoom and pan: keep the point under the cursor still

Once you compute the layout yourself, zoom and pan are cheap. To zoom around the cursor, find the image pixel under it before the change, then choose the new pan so the same pixel is under it afterwards:

```ts
const px = (cx - left) / scaleBefore;        // image pixel under the cursor
const py = (cy - top) / scaleBefore;

panX = cx - px * scaleAfter - (viewportW - imageW * scaleAfter) / 2;
panY = cy - py * scaleAfter - (viewportH - imageH * scaleAfter) / 2;
```

Three things catch people out:

- Trackpad pinch arrives as a `wheel` event with `ctrlKey` set. React attaches wheel handlers as passive, so `preventDefault()` does nothing and the page zooms instead. Add a native listener with `{ passive: false }`.
- Browsers batch pointer moves between frames. Read `event.getCoalescedEvents()` and draw every sample, or fast strokes turn into straight chords.
- A click that doesn't move draws a zero-length line, which draws nothing. Draw a dot at the first point.

Keep the painted mask at the image's real resolution and only scale it for display, so a stroke means the same thing at any zoom or window size.

## Test the maths without clicking

Pointer bugs survive because "it feels right" is the only test. Instead, build a small page that renders your component inside a `position: fixed` plus `transform` container, as your dialog does, with a tall test image. Drive Chrome over the DevTools protocol, move the mouse to a known screen position, and read the mask canvas's alpha at the image pixel that should have been painted. Check that:

- A click near the bottom of the tall image paints at exactly that pixel, not 40 pixels above it.
- The brush ring's centre is zero pixels from the pointer, and its diameter is the brush size times the display scale.
- A drag paints along the line.
- After zooming 2x, a click still lands under the pointer.

These are arithmetic checks, so they are easy to automate once you ask the browser where things are.
