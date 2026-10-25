---
title: "There is no Stream(gpu, 0) in current thread": running MLX inside a Python web server
tag: Debugging
seoTitle: Fix MLX "There is no Stream(gpu, 0) in current thread"
description: MLX streams are per thread, so loading a model on one asyncio.to_thread worker and running it on another crashes. One executor per model fixes it.
date: 2026-10-25
updated: 2026-10-25
keywords: MLX, MLX no Stream in current thread, asyncio.to_thread, FastAPI, Metal command buffer, MTLCommandBufferStatusCommitted, PyTorch MPS thread safety, Apple Silicon, ThreadPoolExecutor
---

If you've put MLX behind a Python web server, you may have met this:

`RuntimeError: There is no Stream(gpu, 0) in current thread.`

Or, if you were less lucky, the process just died with a Metal assertion about a command buffer. I hit both while moving an image model into MLX inside a FastAPI app, and the cause is the same in both cases. It is one rule about how MLX works, and once you know it the fix is ten lines.

## The rule

MLX's GPU streams are per thread. The work you build on one thread is bound to that thread's stream. When you load weights on one thread and run a forward pass on another, the second thread has no stream to run them on, and you get the error above.

In a script this never comes up, because everything happens on the main thread. In a web server it comes up immediately, because `asyncio.to_thread` runs your function on whichever worker of the default thread pool is free. My model load ran on one worker. The first generation request ran on another. The load worked and the forward pass failed, and which worker gets which job is up to the pool.

The Metal assertion is the same bug in a worse mood. With a model's load and a step running on different threads, GPU work from two threads ended up in the same command buffer, and Metal aborted the whole process with `_status < MTLCommandBufferStatusCommitted`. There is no exception to catch in that case, and the server just goes away.

## The fix: one thread per MLX model

Give each MLX model its own single-thread executor, and run everything that touches MLX on it: loading, every forward pass, releasing the weights, clearing the cache.

The shape of it:

- Create `ThreadPoolExecutor(max_workers=1)` at module level for the model.
- Wrap each entry point in `executor.submit(fn, *args).result()`, so the caller blocks until the MLX thread is done.
- Keep MLX arrays inside that thread. What goes in and comes out is numpy, which has no stream attached.

That last rule is the one that makes it work in practice. In my case the rest of the pipeline runs in PyTorch on whatever thread the server gives it. The bridge module takes tensors from PyTorch, converts them to numpy, submits the work, and turns the numpy result back into a tensor. The sizes are small, a latent of about 4096 by 64 in and a velocity of the same shape out, so the conversion costs nothing worth measuring. [The port article](/blog/qwen-image-mlx-port-macbook-air) describes the bridge.

Also worth knowing:

- Releasing the weights and calling `mx.clear_cache()` go through the MLX thread as well, so nothing touches MLX state from anywhere else.
- If you have more than one MLX model, such as a text encoder and a transformer, giving each its own executor is fine and keeps them from queueing behind one another. Memory is shared on unified memory either way.
- A single worker also serializes access, which is what you want here. One GPU, one generation at a time.

## A related trap in the module tree

While I was in there I ran into another MLX quirk. `mlx.nn.Module` is itself a dict, and attributes that are dicts or lists get treated as parts of the parameter tree. I was caught out by dict, list and `None` attributes colliding with that. State that isn't weights, such as a store of calibration data or a list of attached adapters, belongs in a plain holder object that the module references. The module then never sees it.

## The one I haven't fixed

PyTorch's MPS backend isn't thread-safe either, and I have an open crash of the same family. Our experiment has a task queue that runs image generations one at a time, but a second, streaming endpoint bypasses it. If that endpoint is running while an image is generating, both use MPS from different threads, and Metal fires the same assertion. I diagnosed it from the crash report, I know where the bypass is, and I haven't changed it yet. If you're building something similar, the lesson is the same as with MLX: anything that touches the GPU needs a single place to wait in line.

If you want the rule in one sentence: **MLX state belongs to one thread, so give it one**. That, and keep numpy as the thing that crosses the boundary, will save you a day.
