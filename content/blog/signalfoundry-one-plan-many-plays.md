---
title: SignalFoundry: one plan, many plays
description: Building a marketing system where agents plan, launch and measure campaigns on AWS, and the model's output is never trusted blindly.
date: 2026-10-12
tag: Case study
work: signalfoundry
---

SignalFoundry is a marketing operating system. You describe the mission, the offer, your proof and your budget. It plans the campaign, produces the content, publishes through connected accounts, and learns from the results. The point is that every action is explainable, and where it matters, approved by a person first.

## The loop

It starts with a guided, chat-style intake. A deeper ingest step can read a website and pre-fill the brief so nobody types the same facts twice. Out of that comes one canonical **marketing plan** per goal. The strategy pipeline enriches that same document in place with personas, research, a channel and budget plan, and a content strategy, and a critic step checks the quality before anything moves on.

Campaigns come next, and this is the part I like most. A campaign is one outcome, and it's made of **plays**: one per surface, each with its own assets, schedule and metrics. "Launch across PR, LinkedIn and ads" becomes one campaign with three plays, not three unrelated records. The campaign coordinates and the play executes. Only paid plays carry budget and experiments.

Agents handle strategy, content, creative compliance and channel execution. Each action records its intent, its reasoning, the inputs and outputs, a confidence level, the policy result, approval status and the outcome. Publishing goes through connectors for ads, social, email, SMS and CRM, and everything is persisted so it can be audited.

## Under the hood

The backend is serverless on AWS: API Gateway, Cognito, Lambda, DynamoDB, EventBridge and S3, defined as nested SAM stacks. The frontend is React. I kept a hard line between the control plane (auth, tenants, brands, approvals, connectors) and the execution plane (planning, generation, validation, publishing, budget decisions), and started with a single routed Lambda for the control plane so the first vertical slice shipped fast, with modules kept separable to split later.

Every domain event uses the same envelope: event ID, type, version, tenant, brand, project, actor, correlation and causation IDs. The event is written to storage before it goes to EventBridge, so there is always a replay trail. That costs an extra write, and it has paid for itself every time something needed explaining.

## Lessons from the model misbehaving

Most of the interesting decisions came from AI output doing something unexpected.

**The server picks the question, the model only phrases it.** In the intake, a model once asked about a success metric but rendered a URL input. Now the server decides what to ask, as a fixed enum, and the model just words it. I rejected running two model calls per turn because it doubled latency.

**Normalize, don't just validate.** A single 130-character label used to fail an entire turn on a strict schema. The server now pads, truncates and de-duplicates model output into something valid instead of throwing it away.

**Size generation to the transport.** Plan synthesis was one schema producing around 30,000 output tokens, behind a CDN with a 60-second limit. We moved to multi-pass generation with prompts scoped per pass. A call that used to time out at 60 seconds came back in 36 once its prompt only covered its own pass.

**Make failure loud.** Several strategy plans once failed over a few days before anyone noticed. Optional stages now check a wall-clock budget and skip themselves when they can't finish, logging the skip, and background failures emit a metric straight from code instead of relying on a log filter.

## Where it stands

It's in late beta and stabilisation: deploys are still manual, and I'd rather say so than dress it up. What I'm proudest of is the shape. One plan, many plays, an auditable event trail, and a habit of never letting a model's output through without the server having the last word.
