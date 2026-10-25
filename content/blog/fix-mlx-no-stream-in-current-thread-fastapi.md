---
title: Fix "There is no Stream(gpu, 0) in current thread" when running MLX in FastAPI
tag: Troubleshooting
seoTitle: Fix MLX "There is no Stream(gpu, 0) in current thread"
description: MLX streams belong to the thread that built the work. Loading a model on one asyncio.to_thread worker and running it on another fails. One executor fixes it.
date: 2026-10-25
updated: 2026-10-25
keywords: MLX, There is no Stream(gpu, 0) in current thread, MLX thread, asyncio.to_thread, FastAPI, ThreadPoolExecutor, Metal command buffer, MTLCommandBufferStatusCommitted, Apple Silicon
---

If you serve an MLX model from a Python web server, you can hit this:

`RuntimeError: There is no Stream(gpu, 0) in current thread.`

It usually shows up when a model is loaded in one request or startup hook and run in another. This guide reproduces it in a few lines, explains the rule behind it, and gives the pattern that fixes it.

## Reproduce it

MLX is lazy: an operation builds a graph on the stream of the thread that created it, and nothing runs until you evaluate it. Build an array on one thread and use it from another before it has been evaluated, and the second thread has no such stream:

```python
import threading
import mlx.core as mx

shared = {}

def make():
    shared["lazy"] = mx.random.normal((64, 64)) * 2      # not evaluated

def use():
    mx.eval(shared["lazy"] + 1)                         # RuntimeError

for fn in (make, use):
    t = threading.Thread(target=fn)
    t.start()
    t.join()
```

The error names a stream (here `Stream(gpu, 3)`, in a server it is whichever thread built it). An array that was already evaluated on the first thread can be used elsewhere, which is why this fails some of the time and not others.

## Why a web server hits it

`asyncio.to_thread` and a framework's thread pool run your function on whichever worker is free. A model load and the first forward pass can land on different workers. Anything left unevaluated at load time carries the loading thread's stream: a lookup table built in a module's `__init__`, a precomputed rotary table, a cached constant. The forward pass then fails on another thread.

Calling `mx.eval(model.parameters())` after loading helps with weights, but it doesn't cover every lazy value, and it doesn't solve the second problem, which is that GPU work from two threads can end up in one Metal command buffer. That can abort the whole process with an assertion like `_status < MTLCommandBufferStatusCommitted`, and there is no exception to catch.

## The fix: one thread per MLX model

Give each MLX model a single-thread executor, and run everything that touches MLX on it: loading, every forward pass, releasing the weights, clearing the cache.

```python
from concurrent.futures import ThreadPoolExecutor

EXECUTOR = ThreadPoolExecutor(max_workers=1, thread_name_prefix="mlx")

def on_mlx_thread(fn, *args):
    return EXECUTOR.submit(fn, *args).result()

model = on_mlx_thread(load_model, path)

def generate(x_np):                              # runs on the MLX thread
    out = model(mx.array(x_np))
    return np.array(out)                         # numpy leaves the thread, not mx arrays
```

In an async handler, don't block the event loop while you wait:

```python
import asyncio

@app.post("/generate")
async def generate_endpoint(req: Request):
    loop = asyncio.get_running_loop()
    out = await loop.run_in_executor(EXECUTOR, generate, req.to_numpy())
    return respond(out)
```

## Rules that keep it working

- **Numpy crosses the boundary, MLX arrays don't.** Convert inputs to numpy before submitting and results back to numpy inside the function. Numpy has no stream attached.
- **Release on the same thread.** Dropping the weights and calling `mx.clear_cache()` go through the executor too.
- **One executor per model is fine.** A text encoder and a transformer can each have their own. They share the same unified memory, so this doesn't add any.
- **A single worker also serializes access.** One GPU, one generation at a time is usually what you want.
- **Keep non-weight state out of the module tree.** `mlx.nn.Module` is a dict, and attributes that are dicts or lists are treated as parameters. Keep calibration data or adapter lists in a plain holder object.

## PyTorch MPS has the same limit

If part of your pipeline runs on PyTorch MPS, as it does when MLX replaces only the transformer in a diffusers pipeline, MPS isn't thread-safe either. Two threads using it at once can trigger the same Metal assertion. Send all GPU work through one queue, including endpoints that look separate, such as a streaming route that bypasses your job queue.
