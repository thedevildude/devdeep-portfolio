---
title: Boomshare: exporting videos that don't fit in a Lambda
description: How a screen-recording product with AI editing, usage billing and a desktop app handles huge exports without paying for idle servers.
date: 2026-10-13
tag: Case study
work: boomshare
---

Boomshare is a screen and video recording product. You record in a desktop app, tidy the video in a web editor, and share a link. Around that sit transcription, AI dubbing, comments, referrals and usage-based billing. I worked across the backend and the desktop recorder.

## The shape of the system

The backend is Node, TypeScript, Express and PostgreSQL through Prisma, running on Fargate behind a load balancer. Anything heavy leaves the API and goes onto SQS: editing, transcription, downloading and asset validation each have their own queue, their own dead-letter queue and their own worker. Uploads land in S3 and are served through CloudFront with signed URLs.

The recorder is an Electron app with React and Vite, packaged for both Intel and Apple Silicon, with FFmpeg bundled so capture and processing work offline.

## Where it broke: the download that ate the disk

Exports ran on Lambda, and Lambda gives you 10 GB of `/tmp`. That sounded like plenty until a long 4K recording turned up. An hour of 4K is somewhere between 11 and 18 GB, and our export wrote three full copies to disk: the downloaded segments, the remuxed file and the watermarked one. Peak usage was about three times the video, so anything above roughly 2.5 to 3 GB failed with `ENOSPC`.

Most traffic was fine. The measured workload was about 72 exports a day, 22 seconds on average, and around 99% of jobs fit comfortably. So the fix couldn't be "move everything to bigger machines".

## Two lanes instead of one big machine

I split exports into two lanes and let the job's size decide:

- **Light lane:** the existing Lambda. Fast, cheap, nothing idle.
- **Heavy lane:** a Fargate service that scales to zero, with 80 GB of ephemeral storage, for anything over an 8 GB threshold.

I considered launching a fresh Fargate task per job and rejected it. It would have meant writing a dispatcher, a reaper for stuck tasks and our own retry counter, and we'd have lost SQS redelivery and the dead-letter queue for free. Keeping both lanes behind SQS meant the retry behaviour stayed the one we already trusted.

The cost is a cold start of two to three minutes on the heavy lane. For a 15 GB export that someone kicked off and walked away from, I was happy to pay it.

## Measuring size without trusting the database

Routing needs the video's size, and the obvious place to read it was the recording's `fileSize` column. That column is a 32-bit integer, which overflows at about 2.14 GB. In other words it breaks in exactly the size range the router has to tell apart.

So the router sums the real segment sizes straight from S3 instead. `ListObjectsV2` reports 64-bit sizes, needs no migration, and works for old recordings too. If the size is unknown, the job goes to the heavy lane, and a retry always escalates to it. Wrongly picking the big lane costs a few minutes; wrongly picking the small one costs a failed export.

## Two smaller decisions I'd repeat

**Billing is a mirror, not a source of truth.** Lago owns subscriptions, invoices and wallets, with Stripe behind it. Our Postgres keeps a local copy for fast reads and an audit trail. Every webhook is stored with a unique event ID before it's processed, so a duplicate delivery is rejected instead of charging twice, and the cached wallet balance is refreshed from Lago's transactions rather than trusted.

**Validation is a pipeline.** Uploaded assets pass through an S3-triggered validator built as a list of checks: real file size, that the file decodes as the type it claims, a 16:9 ratio within a small tolerance, and H.264. Adding a check is one line. It reports back through an HMAC-signed webhook and stores the probed width, height and duration, so the render worker never has to probe again.

## What I took from it

The expensive failure was never the average export. It was the rare giant one, and the fix that worked was routing on a number that was cheap to measure and honest about its own limits. If the slow path is rare and tolerable, send it to a different lane and leave the fast one alone.
