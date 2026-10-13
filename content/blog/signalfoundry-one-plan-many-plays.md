---
title: SignalFoundry: one plan, many plays
tag: Case study
work: signalfoundry
seoTitle: SignalFoundry Case Study: Agentic Marketing on AWS
description: SignalFoundry is a serverless marketing system on AWS where AI agents plan, launch and measure campaigns, and every action can be audited.
date: 2026-09-02
updated: 2026-10-01
keywords: SignalFoundry, AI agents, marketing automation, AWS serverless, LLM output validation
---

SignalFoundry is a marketing operating system. You give it your mission, your offer, your proof and your budget. It plans the campaign, produces the content, publishes through your connected accounts and learns from the results. Every action can be explained afterwards and, where it matters, approved by a person first.

## From brief to plan

It starts with a guided, chat-style intake. A deeper ingest step can read a website and pre-fill the brief, so nobody types the same facts twice. Out of that comes one marketing plan per goal. The strategy pipeline keeps adding to that same document: personas, research, a channel and budget plan, a content strategy. A critic step checks the quality before anything moves on.

Campaigns are made of plays. A campaign is one outcome, and each play covers one surface, with its own assets, schedule and metrics. "Launch across PR, LinkedIn and ads" becomes one campaign with three plays rather than three unrelated records. The campaign coordinates and the play executes. Only paid plays carry a budget and experiments.

Agents handle strategy, content, creative compliance and channel execution. For each action we record the intent, the reasoning, the inputs and outputs, a confidence level, the policy result, the approval status and what happened. Publishing goes through connectors for ads, social, email, SMS and CRM.

## How it's built

The backend is serverless on AWS: API Gateway, Cognito, Lambda, DynamoDB, EventBridge and S3, defined as nested SAM stacks, with a React frontend. The control plane (auth, tenants, brands, approvals, connectors) is kept separate from the execution plane (planning, generation, validation, publishing, budget decisions). The control plane began as a single routed Lambda so the first slice could ship quickly, with its modules kept separate enough to split later.

Every domain event uses the same envelope: event ID, type, version, tenant, brand, project, actor, and correlation and causation IDs. The event is written to storage before it goes to EventBridge, so there is always a trail to replay. That costs an extra write, and it has been worth it whenever something needed explaining.

## Dealing with model output

Most of the design decisions here came from the model doing something I hadn't expected.

In the intake, the model once asked about a success metric but rendered a URL input. So the server now decides what kind of question to ask, and the model only words it. I considered a second model call to check the first, but it would have doubled the latency of every turn.

Strict schema validation was throwing away output that was almost right: a single 130-character label could kill a whole turn and show the user an error instead of a question. Now the server pads, truncates and de-duplicates the model's output into something valid instead.

Plan synthesis was one schema producing about 29,700 output tokens, which at the measured rate takes over three minutes, behind a CDN that hangs up at 60 seconds. It could never finish. Splitting the schema wasn't enough, because every pass still received the whole-plan prompt and reasoned about all thirteen sections. Once each prompt covered only its own pass, the same call that had timed out at 60 seconds returned in 36.

Some strategy plans failed over several days before anyone noticed. Optional stages now check a time budget and skip themselves, with a log line, when they can't finish. Background failures emit a metric directly from code instead of depending on a log filter.

## Where it stands

SignalFoundry is still in beta, and deploys are manual for now.
