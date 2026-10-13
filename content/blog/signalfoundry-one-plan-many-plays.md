---
title: SignalFoundry: a marketing team that shows its work
tag: Case study
work: signalfoundry
seoTitle: SignalFoundry Case Study: Agentic Marketing on AWS
description: SignalFoundry is a marketing operating system where AI agents plan, launch and measure campaigns, and every action can be explained and approved.
date: 2026-09-02
updated: 2026-10-01
keywords: SignalFoundry, AI agents, marketing automation, AWS serverless, campaign planning
---

Most small teams don't have a marketing department. They have a founder, a half-finished positioning doc, and a pile of channels they know they should be using. SignalFoundry is a marketing operating system for exactly that situation. You tell it your mission, your offer, your proof and your budget. It plans the campaign, produces the content, publishes through your connected accounts, and learns from the results.

The part I care about is that it shows its work. Every action can be explained afterwards and, where it matters, approved by a person first.

## From a chat to a plan

It starts as a guided, chat-style intake. A deeper ingest step can read your website and pre-fill the brief, so nobody types the same facts twice. Out of that comes one marketing plan per goal. The strategy pipeline keeps adding to that single document: personas, research, a channel and budget plan, a content strategy. A critic step reviews the quality before anything moves on. The plan is the thing you read, edit and agree with, and everything downstream refers back to it.

## One campaign, many plays

A campaign is one outcome, and it's made of plays, one per surface, each with its own assets, schedule and metrics. "Launch across PR, LinkedIn and ads" becomes one campaign with three plays, not three unrelated records. The campaign coordinates and the play executes. Only paid plays carry a budget and experiments, so you can see what is costing money.

Agents handle strategy, content, creative compliance and channel execution. For each action the system records its intent, the reasoning, the inputs and outputs, a confidence level, the policy result, the approval status and what happened. Publishing runs through connectors for ads, social, email, SMS and CRM. Nothing is a black box, and a founder can open any post and see why it exists.

## What's under it

SignalFoundry is serverless on AWS: API Gateway, Cognito, Lambda, DynamoDB, EventBridge and S3 as nested SAM stacks, with a React frontend. The control plane (auth, tenants, brands, approvals, connectors) is kept apart from the execution plane (planning, generation, validation, publishing, budget decisions). Every domain event shares one envelope and is written to storage before it goes to EventBridge, so there's always a trail to replay.

## Making a model behave like a product

Most of the interesting decisions came from the model doing something I hadn't expected.

In the intake, the model once asked about a success metric but rendered a URL input. Now the server decides what kind of question to ask and the model only words it. I considered a second model call to check the first, but it would have doubled the latency of every turn.

Strict schema validation threw away output that was almost right: a single 130-character label could kill a whole turn and show the user an error instead of a question. Now the server pads, truncates and de-duplicates the model's output into something valid.

Plan synthesis was one schema producing about 29,700 output tokens, over three minutes of generation, behind a CDN that hangs up at 60 seconds. It could never finish. Splitting the schema wasn't enough, because every pass still received the whole-plan prompt and reasoned about all thirteen sections. Once each prompt covered only its own pass, the call that had timed out at 60 seconds returned in 36.

Some strategy plans failed over several days before anyone noticed. Optional stages now check a time budget and skip themselves with a log line when they can't finish, and background failures emit a metric directly from code.

## Where it stands

SignalFoundry is in beta and I'm still stabilising it. Deploys are manual for now.
