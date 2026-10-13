---
title: Verity: a QA platform that has to show its evidence
description: Building an AI-assisted QA system on AWS where no bug exists without proof, and a jury, not a single prompt, decides what's real.
date: 2026-10-11
tag: Case study
work: verity
---

Most small teams have no QA person. The usual stand-in is an AI that writes bug reports, and those are mostly confident guesses, plus the same issue filed five times and a flaky test crying wolf every morning. Verity starts from the opposite principle: **truth over automation**. A finding doesn't exist unless it comes with evidence (a screenshot, logs or a trace) and a confidence score.

It's pre-launch, so this is a story about design, not adoption.

## How a run flows

A test case, a schedule or a result from a customer's CI starts a run, and a Step Functions state machine drives it: execute the test, process the evidence, de-duplicate, score confidence, then either open an issue or quietly log the finding. Playwright captures a screenshot per step along with console and API errors. Raw artifacts go to S3 and structured results to DynamoDB.

The backend is AWS SAM with API Gateway, TypeScript Lambdas, DynamoDB, S3 and Cognito. The React app and an embeddable feedback widget are hosted separately. Tenants contain projects, and projects contain environments. A beginner and an expert mode sit over the same data, so a founder and an engineer see the same truth at different depths.

## A jury instead of a prompt

When a test step fails, the first question is whether the product is broken or the infrastructure is. Failures are classified as an assertion failure, infrastructure, a timeout or a cancellation, and **only real assertion failures reach the jury**. That one filter keeps flaky runners from turning into bug tickets.

The jury is five roles: a collector, a visual judge, a functional judge, a skeptic and an arbiter. The skeptic exists to argue the finding isn't real. The arbiter rules.

Confidence then decides what happens:

- **92 or more:** eligible for auto-dispatch, which is off by default.
- **75 or more:** a QA issue is created.
- **55 or more:** goes to a human for review.
- **Below 55:** logged, not filed.

It costs extra latency and model spend, and I think it's worth it. A tool that files fewer, better bugs gets read; one that files everything gets muted.

## Duplicates, in two passes

Deduplication is tiered. First an exact SHA-256 fingerprint, which is cheap and deterministic. Then a separate semantic pass catches findings that are the same bug in different words. Both are scoped per tenant, so one customer's report can never be treated as a duplicate of another's.

The semantic pass fails open: if the model errors, everything is treated as unique. That means an occasional duplicate gets through rather than a real bug being dropped, and medium-confidence matches are tagged `possible-duplicate` instead of silently merged. I'll take a repeat over a missed regression every time.

## Running the browser

Lambda caps at 300 seconds and 1 GB, with no video, which isn't enough for a full end-to-end journey. For those, the plan is to run Playwright on Fargate using the official image, billed per second, and keep Lambda for quick single-URL scans. Both paths write the same result envelope, so everything downstream doesn't care which one ran. I rejected one Lambda per step because of a Chromium cold start on every step and traces that don't join up.

## Automation with a leash

Anything that can change code is bounded. AI fixes arrive as pull requests, never direct commits. Automation halts on a duplicate fingerprint, repeated failures, an attempt with no diff, or a budget limit, and production is read-only by default. An application's lifecycle phase isn't stored at all. It's derived from the data and tested exhaustively, so it can't drift out of sync.

There's also an MCP server, off by default per project, so an assistant like ChatGPT, Claude or Cursor can drive Verity directly.

## An honest note on coverage

Backend statement coverage is **about 54%** as of early September, and CI enforces it as a ratchet so it can only go up. An older doc claimed 92% and nobody could trace where it came from. We deleted the claim and set the thresholds to reality. The suite is large (over 2,000 backend tests and about 900 frontend tests) but a number you can't reproduce is worse than a lower one you can.

That's the same instinct as the product itself: don't report anything you can't back up.
