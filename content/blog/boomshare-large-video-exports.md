---
title: Boomshare: exporting videos that don't fit in a Lambda
tag: Case study
work: boomshare
seoTitle: Boomshare Case Study: Large Video Exports on AWS
description: How Boomshare, a screen-recording app with AI editing, sends large video exports to Fargate and keeps small ones on Lambda.
date: 2026-08-04
updated: 2026-09-15
keywords: Boomshare, video export, AWS Lambda, Fargate, SQS, FFmpeg
---

Boomshare is a screen recorder. You record in a desktop app, tidy the video in a web editor, and share a link. Transcription, AI dubbing, comments, referrals and usage-based billing sit around that core. I worked on the backend and on the desktop recorder.

This post is about one problem in particular: exports of long recordings kept running out of disk.

## The setup

The backend is Node, TypeScript and Express on PostgreSQL, running on Fargate behind a load balancer. Anything heavy leaves the API and goes onto an SQS queue. Editing, transcription, downloading and asset validation each have their own queue, their own dead-letter queue and their own worker. Uploads land in S3 and are served through CloudFront with signed URLs.

The recorder is an Electron app with React and Vite, with FFmpeg bundled so capture and processing work offline.

## The export that ran out of disk

Exports ran on Lambda, which gives you 10 GB of `/tmp`. That is plenty until someone exports a long 4K recording. An hour of 4K is 11 to 18 GB, and paid users can record with no duration cap. Our export wrote three full copies of it to disk: the downloaded segments, the remuxed file, and the watermarked file. Peak usage was about three times the size of the video, so anything above roughly 2.5 to 3 GB failed with `ENOSPC`.

The awkward part was that almost nothing else was wrong. Production was doing 72 exports a day, 22.5 seconds on average, 259 seconds at the slowest. That is a small, sparse workload, a good fit for Lambda and a bad one for an always-on container. Moving everything to bigger machines would have meant paying all day for a job that almost never arrives.

## Two lanes

So I split exports into two lanes and let the size of the job pick one. Small jobs stay on the existing Lambda. Anything over 8 GB goes to a Fargate service that scales to zero and has 80 GB of ephemeral storage. About 99% of jobs stay on Lambda.

I did think about launching a fresh Fargate task for every large job. I dropped it because I'd have had to write a dispatcher, something to clean up stuck tasks, and my own retry counter, and I'd have lost SQS redelivery and the dead-letter queue, which I already trusted. With both lanes reading from SQS, retries behave the same everywhere.

The cost is a cold start of two to three minutes on the heavy lane. For a big export that someone started and walked away from, that's acceptable.

I also made the Lambda lane less wasteful. It had been downloading every HLS segment to disk before FFmpeg touched them, even though FFmpeg's HLS demuxer can fetch signed URLs itself. Pointing the playlist at those URLs removed one full copy and is what made an 8 GB threshold realistic instead of 3 GB.

## Knowing how big a video is

Routing needs the video's size, and the obvious source was the `fileSize` column on the recording. That column is a 32-bit integer, so it overflows at about 2.14 GB, which is the range where the router has to make its decision.

Instead, the router adds up the real segment sizes from S3. `ListObjectsV2` reports 64-bit sizes, it needs no migration, and it works for old recordings too. If the size can't be determined, the job goes to the heavy lane, and so does any retry. Sending a small job to the big lane costs a few minutes. Sending a big job to the small lane costs a failed export.

## Billing and validation

Billing is handled by Lago, with Stripe behind it, and our own database keeps a copy for fast reads and an audit trail. Every webhook is stored under its unique event ID before it's processed, so a duplicate delivery is rejected instead of charging someone twice.

Uploaded assets go through an S3-triggered validator built as a list of checks: the real file size, whether the file decodes as the type it claims, the aspect ratio, and the codec. Adding a check is one line. The validator reports back through a signed webhook and saves the dimensions and duration it found, so the render worker never has to probe the file again.
