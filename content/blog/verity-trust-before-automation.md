---
title: Verity: a QA platform that has to show its evidence
tag: Case study
work: verity
seoTitle: Verity Case Study: AI QA Platform on AWS
description: Verity is a serverless QA platform on AWS and Playwright that only reports a bug when it can show evidence for it.
date: 2026-09-24
updated: 2026-10-06
keywords: Verity, AI QA, Playwright, AWS Step Functions, bug deduplication
---

Most small teams don't have a QA person. The usual stand-in is an AI that writes bug reports, and those tend to be confident guesses, the same issue filed several times, and a flaky test failing every morning. Verity is built on the opposite rule: a finding only exists if it comes with evidence, such as a screenshot, logs or a trace, and a confidence score.

## What it does

You point Verity at an application and it understands the product, generates coverage, writes tests and runs them. A run can start from a test case, a schedule, or a result from your CI. Playwright captures a screenshot at every step along with console and API errors, and the evidence goes to S3. Each tenant has projects, projects have environments, and findings flow into the feedback pipeline your team already uses. There is an embeddable feedback widget so real users' reports join the same queue.

## A jury, not a prompt

When a step fails, the first question is whether the product is broken or the infrastructure is. Failures are classified as an assertion failure, an infrastructure problem, a timeout or a cancellation, and only real assertion failures go any further. That keeps flaky runners from turning into tickets.

Those failures go to a jury of five roles: a collector, a visual judge, a functional judge, a skeptic and an arbiter. The skeptic's job is to disprove the finding, and it can veto automation. The arbiter decides. The result is a confidence score from 0 to 100, which decides whether Verity dispatches automatically, files a QA issue, asks a person to review, or only logs it. The votes, the score and the cited evidence are stored and shown in the UI.

This costs extra latency and model spend. I accepted that because a tool that files fewer bugs, each with evidence, is one people keep reading.

## No repeats

Deduplication runs in two passes. The first is an exact fingerprint, which is cheap and deterministic. The second is a semantic pass that catches the same bug described in different words. Both are scoped to a tenant. If the semantic pass fails, the finding is treated as unique, so an occasional repeat gets through but a real bug is never dropped, and likely matches are tagged `possible-duplicate` instead of being merged silently.

## Automation with limits

Anything that can change code is bounded. AI fixes arrive as pull requests and never as direct commits. Automation stops on a duplicate fingerprint, repeated failures, an attempt that produces no diff, or a budget limit, and production is read-only by default. There is also an MCP server, off by default for each project, so an AI assistant can drive Verity directly.

## What's still ahead

Quick single-URL scans run on Lambda. The test executor had inherited a 300 second, 1 GB default, which a real login-and-CRUD journey can't reliably finish in. I raised it to 900 seconds and 3 GB, but that's a ceiling raise, not a fix. Lambda has no video and a 15 minute hard cap, so full journeys are designed to run on Fargate with the official Playwright image, billed per second. That runner isn't built yet.

I'd also rather be plain about the test suite. Backend statement coverage is 53.9%, measured in September. The testing doc used to claim 92%, and nothing in the repo could produce that figure. I set the CI thresholds to the measured numbers as a ratchet, so coverage can only go up.
