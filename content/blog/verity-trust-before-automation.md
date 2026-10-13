---
title: Verity: a QA platform that has to show its evidence
tag: Case study
work: verity
seoTitle: Verity Case Study: AI QA Platform on AWS
description: Verity is a serverless QA platform built on AWS and Playwright. It only reports a bug when it can show evidence for it.
date: 2026-09-24
updated: 2026-10-06
keywords: Verity, AI QA, Playwright, AWS Step Functions, bug deduplication
---

Most small teams don't have a QA person. The usual stand-in is an AI that writes bug reports, and those tend to be confident guesses, the same issue filed several times, and a flaky test failing every morning. Verity is my attempt at the opposite. A finding only exists if it comes with evidence, such as a screenshot, logs or a trace, and a confidence score.

## How a run works

A test case, a schedule, or a result from a customer's CI starts a run. A Step Functions state machine drives it: run the test, process the evidence, check for duplicates, score the confidence, then either open an issue or log the finding quietly. Playwright captures a screenshot at each step along with console and API errors. Raw artifacts go to S3 and structured results go to DynamoDB.

The backend is AWS SAM with API Gateway, TypeScript Lambdas, DynamoDB, S3 and Cognito. The React app and an embeddable feedback widget are hosted separately. Tenants contain projects, and projects contain environments.

## Deciding what is a real bug

When a step fails, the first question is whether the product is broken or the infrastructure is. Failures are classified as an assertion failure, an infrastructure problem, a timeout or a cancellation, and only real assertion failures go any further. That keeps flaky runners from turning into bug tickets.

Those failures go to a jury of five roles: a collector, a visual judge, a functional judge, a skeptic and an arbiter. The skeptic argues that the finding isn't real, and the arbiter makes the call. The result is a confidence score, and the score decides whether Verity files an issue, sends the finding to a person to review, or only logs it. Automatic dispatch exists but is off by default.

This costs extra latency and model spend. I accepted that because a tool that files fewer bugs, each with evidence, is one people keep reading.

## Duplicates

Deduplication happens in two passes. The first is an exact fingerprint match, which is cheap and deterministic. The second is a semantic pass that catches the same bug described in different words. Both are scoped to the tenant, so one customer's report is never compared against another's.

If the semantic pass fails, the finding is treated as unique. That means an occasional repeat gets through, but a real bug is never dropped. Likely matches are tagged `possible-duplicate` instead of being merged silently.

## Running the browser

Quick single-URL scans run on Lambda. The test executor had been inheriting a 300 second, 1 GB default, which a real login-and-CRUD journey won't reliably finish in. I raised it to 900 seconds and 3 GB as a stopgap, but that is a ceiling raise, not a fix: Lambda has no video and a 15 minute hard cap. So the chosen design runs full journeys on Fargate with the official Playwright image, billed per second, and that runner isn't built yet. Both paths write the same result format, so nothing downstream cares which one ran. I ruled out one Lambda per step because the browser would cold-start on every step and the traces wouldn't join up.

## Limits on automation

Anything that can change code is bounded. AI fixes arrive as pull requests and never as direct commits. Automation stops on a duplicate fingerprint, repeated failures, an attempt that produces no diff, or a budget limit, and production is read-only by default. An application's lifecycle phase isn't stored anywhere. It's derived from the data, so it can't get out of sync.

There is also an MCP server, off by default for each project, so an AI assistant can drive Verity directly.
