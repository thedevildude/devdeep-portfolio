import type { Service } from "../services";

const page: Service = {
  slug: "hire-aws-developer-india",
  seoTitle: "Hire an AWS Developer in India — Serverless, Senior | Devdeep",
  h1: "Hire an AWS Developer in India",
  role: "AWS Developer",
  headline: "Hire an AWS developer in India, *serverless from the ground up*",
  description:
    "Hire a senior AWS developer in India for serverless apps on Lambda, Step Functions, DynamoDB, Cognito, S3 and CloudFront, with CI/CD and tests built in.",
  keywords: [
    "hire aws developer india",
    "hire aws serverless developer",
    "aws lambda developer for hire",
    "remote aws developer india",
    "hire cloud developer india",
  ],
  intro:
    "I build products on serverless AWS: Lambda for compute, Step Functions for long workflows, DynamoDB for data and Cognito for access. Verity and SignalFoundry both run this way in production, and I designed and shipped them end to end.",
  heroCta: "Hire me for your AWS build",
  chips: ["AWS Lambda", "Step Functions", "DynamoDB", "Serverless", "Cognito", "S3"],
  overview: {
    title: "How to hire an AWS developer in India",
    paragraphs: [
      "Serverless removes servers, not decisions. You still need sensible function boundaries, a DynamoDB design built around your access patterns, workflows that recover from failure and permissions that grant only what each piece needs.",
      "I've made those decisions on real products. Verity, a QA platform, runs on Lambda, DynamoDB and Step Functions with Cognito role-based access and a GitHub workflows deployment pipeline. SignalFoundry's AI agents run on Lambda and DynamoDB too. You hire me directly and get the person who designed those systems.",
    ],
    gets: [
      "Serverless architecture designed around your actual workload",
      "DynamoDB data models built from access patterns, not guesswork",
      "Step Functions workflows that retry, branch and recover cleanly",
      "Least-privilege access with Cognito roles and scoped permissions",
      "Automated deployments and tests from the first sprint",
    ],
  },
  roleTitle: "What I do as your *aws developer*",
  roleIntro: "The cloud work you can hand over to me, from first function to production.",
  duties: [
    {
      icon: "cube",
      title: "Serverless architecture",
      body: "Map your product to Lambda, queues and workflows, and write down why each piece exists.",
    },
    {
      icon: "code",
      title: "Lambda functions",
      body: "Write focused TypeScript functions with clear inputs, structured errors and sensible timeouts.",
    },
    {
      icon: "workflow",
      title: "Step Functions",
      body: "Orchestrate long, multi-step jobs with retries, branches and human approvals that survive failures.",
    },
    {
      icon: "database",
      title: "DynamoDB design",
      body: "Design keys and indexes around real access patterns so queries stay fast and predictable at scale.",
    },
    {
      icon: "shield",
      title: "Auth and access",
      body: "Set up Cognito sign-in and role-based access so every user and service sees only what it should.",
    },
    {
      icon: "globe",
      title: "Storage and delivery",
      body: "Serve files and media through S3 and CloudFront with signed access where privacy matters.",
    },
    {
      icon: "loop",
      title: "CI/CD pipelines",
      body: "Automate builds, tests and deployments with GitHub Actions so every release is repeatable.",
    },
    {
      icon: "migrate",
      title: "Serverless migrations",
      body: "Move parts of an existing Node.js backend onto Lambda step by step, without a risky big-bang cutover.",
    },
  ],
  whyTitle: "Why hire an AWS developer in India, *and why me*",
  whyIntro:
    "Cloud work is judged by what happens when things fail. I've built serverless systems that have to stay correct, not just stay up.",
  why: [
    {
      icon: "flask",
      title: "Verity, tested to 92%",
      body: "A serverless QA platform on Lambda, DynamoDB and Step Functions with 92% test coverage, Cognito RBAC and automated deployments.",
    },
    {
      icon: "sparkles",
      title: "AI on serverless",
      body: "SignalFoundry runs AI agents on Lambda and DynamoDB that plan and publish campaigns across 50+ channels, cutting setup from hours to minutes.",
    },
    {
      icon: "server",
      title: "Full stack around the cloud",
      body: "I also build the React front end and Node.js services, so the infrastructure fits the product rather than the other way round.",
    },
  ],
  steps: [
    {
      title: "Outline the workload",
      body: "What the system does, expected usage, and what already runs on AWS today.",
    },
    {
      title: "Architecture call",
      body: "30 minutes on services, data and risks. An honest answer on fit within 24 hours.",
    },
    {
      title: "Trial slice",
      body: "One real function or workflow deployed to your account, so you can review code and setup together.",
    },
    {
      title: "Pipeline first",
      body: "Environments, deployments and tests in place before features, so every change ships the same way.",
    },
    {
      title: "Build and document",
      body: "Weekly demos and written notes on each architecture decision, so your team can run it after me.",
    },
  ],
  stack: [
    {
      category: "Compute and workflows",
      items: ["AWS Lambda", "Step Functions", "Serverless functions"],
    },
    { category: "Data", items: ["DynamoDB", "PostgreSQL", "MongoDB", "Supabase"] },
    { category: "Storage and delivery", items: ["S3", "CloudFront"] },
    { category: "Identity", items: ["Cognito", "Role-based access control"] },
    { category: "Languages", items: ["TypeScript", "JavaScript", "Rust", "SQL"] },
    { category: "Back end", items: ["Node.js", "Express", "REST APIs"] },
    { category: "Testing", items: ["Jest", "Playwright", "Integration tests"] },
    {
      category: "CI/CD",
      items: ["GitHub Actions", "CircleCI", "Docker", "Git"],
    },
    { category: "Other clouds", items: ["Azure", "Google Cloud"] },
    { category: "AI", items: ["LangChain", "LangGraph", "LLM agents", "RAG"] },
  ],
  faqs: [
    {
      q: "Is serverless right for my product?",
      a: "It suits spiky or event-driven workloads, background jobs and products that want to avoid running servers. For steady, heavy compute, a container may fit better, and I'll say so.",
    },
    {
      q: "Can you design our DynamoDB tables?",
      a: "Yes. I start from the queries your product needs, then design keys and indexes to serve them, which avoids slow scans later.",
    },
    {
      q: "Do you use Step Functions or just chain Lambdas?",
      a: "For anything multi-step or long-running, Step Functions. They give retries, branching and visibility that chained Lambdas don't, which is how Verity runs its test workflows.",
    },
    {
      q: "Can you secure our AWS setup?",
      a: "I set up Cognito authentication, role-based access and scoped permissions for each function, so access is limited to what each part needs.",
    },
    {
      q: "Do you work in our AWS account?",
      a: "Yes. Everything is built in your account and repo, with deployments automated through CI, so you own the infrastructure from day one.",
    },
    {
      q: "Can you also work with Azure or Google Cloud?",
      a: "Yes, I've worked with both. AWS serverless is where I've built the most, so it's what I recommend unless you're already committed elsewhere.",
    },
    {
      q: "How quickly can you start?",
      a: "Typically within one to two weeks. Send a short outline of the workload and I'll confirm the same day.",
    },
  ],
  ctaTitle: "Build on AWS *the serverless way*",
  ctaBody:
    "Send a short outline of what you need to run. I'll reply within 24 hours with an honest answer on fit and a first architecture view.",
};

export default page;
