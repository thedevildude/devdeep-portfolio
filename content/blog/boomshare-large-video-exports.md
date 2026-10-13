---
title: Boomshare: a screen recorder that handles hour-long 4K
tag: Case study
work: boomshare
seoTitle: Boomshare Case Study: Screen Recording with AI Editing
description: Boomshare is a screen recorder with AI editing, dubbing and usage-based billing. This is the product, and how it learned to export hour-long 4K recordings.
date: 2026-08-04
updated: 2026-09-15
keywords: Boomshare, screen recorder, AI video editing, video export, AWS
---

Boomshare is a screen and video recorder for people who explain things for a living. You record in a desktop app, tidy the video in a web editor, and share a link. Around that core sit the things that make a recording useful after the fact: transcription, AI dubbing into other languages, comments, referrals, and usage-based billing for teams. I worked on the backend and the desktop recorder.

## The product

The recorder is an Electron app for both Intel and Apple Silicon. FFmpeg ships inside it, so capture and processing work without a connection. When you stop recording, the video uploads in segments to S3 and appears in the web editor, where you can trim it, add a transcript, dub it or share it. Shared videos stream through CloudFront with signed URLs, so a link can't be passed around forever.

Behind the editor, anything heavy leaves the API. Editing, transcription, downloading and asset validation each have their own SQS queue, dead-letter queue and worker, so a slow transcription never holds up an export.

Billing is metered. Lago handles subscriptions, invoices and wallets with Stripe behind it, and our database keeps a copy for fast reads and an audit trail. Every webhook is stored under its unique event ID before it's processed, so a duplicate delivery can't charge someone twice. Uploaded assets pass through an S3-triggered validator built as a list of checks: file size, whether it decodes as the type it claims, aspect ratio and codec. Adding a check is one line.

## The recording that broke exports

The part of the product that taught me the most was export. People record long sessions, and paid users have no cap on duration. An hour of 4K is 11 to 18 GB. Exports ran on Lambda, which gives you 10 GB of `/tmp`, and our export wrote three full copies of the video to disk: the downloaded segments, the remuxed file and the watermarked file. Peak usage was about three times the video, so anything above roughly 2.5 to 3 GB failed with `ENOSPC`.

Almost nothing else was wrong. Production was doing 72 exports a day, 22.5 seconds on average, 259 seconds at the slowest. That is a small workload, a good fit for Lambda and a bad one for an always-on container. Moving everything to bigger machines would have meant paying all day for a job that rarely arrives.

## Two lanes

I split exports into two lanes and let the job's size choose one. Small jobs stay on Lambda. Anything over 8 GB goes to a Fargate service that scales to zero and has 80 GB of ephemeral storage. About 99% of jobs stay on Lambda. The price is a two to three minute cold start on the heavy lane, which is fine for a big export someone started and walked away from.

I considered launching a new Fargate task per large job and dropped it. I'd have had to write a dispatcher, something to clean up stuck tasks and my own retry counter, and I'd have lost SQS redelivery and the dead-letter queue. With both lanes reading from SQS, retries behave the same everywhere.

I also stopped the Lambda lane downloading every HLS segment to disk. FFmpeg's HLS demuxer can fetch signed URLs itself, so one full copy disappeared. That is what made an 8 GB threshold realistic instead of 3 GB.

Routing needs the video's size, and the obvious source, the `fileSize` column, is a 32-bit integer that overflows at 2.14 GB, which is exactly where the decision gets made. So the router adds up the real segment sizes from S3, which reports 64-bit sizes, needs no migration and works for old recordings. If the size is unknown, or the job is a retry, it goes to the heavy lane. Sending a small job to the big lane costs a few minutes. Sending a big job to the small lane costs a failed export.
