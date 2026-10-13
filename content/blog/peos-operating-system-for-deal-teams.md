---
title: PEOS: an operating system for private equity deal teams
tag: Case study
work: peos
seoTitle: PEOS Case Study: An Operating System for PE Deal Teams
description: PEOS connects a private equity firm's email, calendar and Salesforce into one Action Hub, with AI doing the legwork and people approving every material action.
date: 2026-10-13
updated: 2026-10-13
keywords: PEOS, private equity software, AI agents, Salesforce, Microsoft Graph, human-in-the-loop
---

A private equity deal team runs on relationships. Bankers, founders and intermediaries send a steady stream of email and meeting invites, and somewhere in all of it is the one note that says a target has just crossed the threshold worth a call. That signal usually lives in someone's inbox, gets half-copied into Salesforce, and is remembered, or not, on the way into the next meeting.

PEOS, the PE Agentic Operating System, is built to be the place where that work converges. It reads the sources a deal team already uses, works out what needs attention, and puts it in front of the right person. It is multi-tenant, so one platform can serve many firms, and the first to launch on it is a single firm whose rules, scorecards and workflows are configuration, not code.

## One queue instead of five tools

The product is organised around work a person has to do, not around database screens. Under the hood it runs a loop every thirty minutes. It reads Outlook mail, the calendar and Salesforce, files each item as evidence against the right person, company or deal, and has an AI agent keep a current summary of every record. It then checks those summaries against the firm's own responsibilities, such as who should hear back and which commitment is overdue. Whatever matters lands as a single card in the **Action Hub**.

A card is a specific thing: _CC Test Opportunity crossed the banker-call score_, with the reason, the evidence behind it, and a recommended next step like "review what changed". Each one is traceable. You can open the evidence, see the trace of how PEOS got there, mark it not relevant or snooze it.

## Walking into a meeting prepared

Relationships are the centre of the product. The relationships view shows who needs attention and why, with live counts of follow-ups, opportunities and at-risk contacts. Open a contact, ask for relationship intelligence, and the assistant reads Salesforce and writes a cited brief: the people, the organisations, open cases, opportunities with their stage, amount and close date, the risks, and the next best actions. A meeting gets a brief before you need it: who you are meeting, your last touch, what you owe them and what they owe you. You can ask questions of it in plain English. It answers, and does not act.

Deals sit on a pipeline board from sourcing and screening through diligence, investment committee, closing, and passed or lost. Each opportunity shows what is still missing, so a screening-stage deal tells you which facts you haven't collected yet.

## AI that proposes, people that approve

The firm cares most about what the AI is allowed to do. Sending an email, booking a meeting, writing to Salesforce, overriding a score and exporting data are all material actions, and by default each one needs a person's approval. PEOS tracks the person who proposed an action separately from the person who approves it, even where policy lets the same human do both.

The Salesforce flow shows how that works. After a meeting, the agent reads the transcript and the CRM and suggests field changes, and at that point nothing has been written. When someone approves, PEOS reads Salesforce again, compares it with what the human edited, and writes only the fields that really changed. A race with another user's edit is caught instead of overwritten. The firm sets which contact fields PEOS may change at all, and which of those skip review. Policy changes are drafts until approved.

## Built to be trusted with a firm's data

Each firm's data is separated at the database level, not just in application code, so a request carrying one firm's context can't read another's rows even if the query asks for them. Sign-in goes through Cognito. Platform administrators run the system but get no implicit access to any firm's content, and the backend checks role on every request, so the menu is never the security boundary.

Everything that is shown carries its source and how fresh it is. PEOS doesn't run its own search or agent infrastructure. It calls a shared AI platform for the agent work and keeps ownership of the business state, the policy and the approvals.

## Where it stands

PEOS is deployed and being demonstrated against a test tenant, with the firm's real Salesforce and Microsoft 365 connections being brought online.
