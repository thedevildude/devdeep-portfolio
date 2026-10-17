// TODO(owner): add real Laravel projects and experience here; the proof below leans on transferable work.
import type { Service } from "../services";

const page: Service = {
  slug: "hire-laravel-developer-india",
  seoTitle: "Hire a Laravel Developer in India — Senior, Remote | Devdeep",
  h1: "Hire a Laravel Developer in India",
  role: "Laravel Developer",
  headline: "Hire a Laravel developer in India, *for SaaS built the Laravel way*",
  description:
    "Hire a senior Laravel developer in India for SaaS apps, REST APIs, queues, billing and multi-tenant products built on clean Eloquent models. Remote and direct.",
  keywords: [
    "hire laravel developer india",
    "laravel developer for hire",
    "remote laravel developer india",
    "senior laravel developer",
    "hire laravel api developer",
  ],
  intro:
    "Laravel gives you a lot out of the box, and the best Laravel apps use it instead of fighting it. I build products on its conventions: Eloquent models that match your domain, queued jobs for slow work, policies for access, and APIs your web and mobile clients can rely on.",
  heroCta: "Hire me for your Laravel app",
  chips: ["Laravel", "Laravel API", "Eloquent", "Laravel queues", "Livewire", "Inertia.js"],
  overview: {
    title: "How to hire a Laravel developer in India",
    paragraphs: [
      "Laravel makes the first version of a product quick to build. The difference between developers shows up later: fat controllers, queries inside loops, jobs that fail silently and permissions scattered across views. A good Laravel developer keeps the app tidy while the feature list grows.",
      "My background is product architecture: designing complete systems end to end at Capital Compute, building multi-tenant platforms like PEOS and wiring Stripe usage billing into Boomshare. I bring that same structure to Laravel, so your SaaS has clear boundaries between billing, tenants, jobs and API from the first sprint.",
    ],
    gets: [
      "Eloquent models and relationships that reflect your business",
      "Slow work moved onto queues with retries and visible failures",
      "Versioned APIs with Sanctum auth and consistent JSON responses",
      "Subscription and usage billing handled through Stripe",
      "Feature tests that let you upgrade Laravel with confidence",
    ],
  },
  roleTitle: "What I do as your *Laravel developer*",
  roleIntro: "The Laravel product work I can own from first migration to release.",
  duties: [
    {
      icon: "server",
      title: "API resources",
      body: "Build REST APIs with form requests, API resources and Sanctum tokens for web and mobile clients.",
    },
    {
      icon: "database",
      title: "Eloquent modelling",
      body: "Design migrations, relationships and scopes so the data model reads like your product's own vocabulary.",
    },
    {
      icon: "loop",
      title: "Queues and jobs",
      body: "Move emails, imports and exports onto queued jobs with retries, batching and monitored failures.",
    },
    {
      icon: "users",
      title: "Multi-tenant SaaS",
      body: "Separate tenant data cleanly and enforce access with gates and policies rather than scattered checks.",
    },
    {
      icon: "link",
      title: "Billing integration",
      body: "Wire up Stripe subscriptions, trials and metered usage with webhook handling that never double-charges.",
    },
    {
      icon: "layout",
      title: "Livewire and Inertia",
      body: "Build admin panels and app screens with Livewire, or Inertia with React or Vue when richer UI helps.",
    },
    {
      icon: "flask",
      title: "Feature testing",
      body: "Write Pest or PHPUnit feature tests around signup, billing and permissions, run on every pull request.",
    },
    {
      icon: "migrate",
      title: "Laravel upgrades",
      body: "Upgrade older Laravel versions release by release, replacing abandoned packages along the way.",
    },
  ],
  whyTitle: "Why hire a Laravel developer in India, *and why me*",
  whyIntro:
    "Laravel is easy to learn and easy to misuse. What I add is product-level architecture experience and the discipline to keep a growing app maintainable.",
  why: [
    {
      icon: "users",
      title: "Multi-tenant experience",
      body: "PEOS is a multi-tenant platform where each deal team has its own email, calendar and Salesforce data, the same isolation problem every SaaS faces.",
    },
    {
      icon: "chart",
      title: "Billing done before",
      body: "I built Stripe usage-based billing for Boomshare, so metering, webhooks and invoice edge cases are familiar ground rather than a learning exercise.",
    },
    {
      icon: "workflow",
      title: "Background work at scale",
      body: "Verity coordinates long-running work through AWS Step Functions with safe retries, the same thinking I apply to Laravel queues and scheduled tasks.",
    },
  ],
  steps: [
    {
      title: "Describe the product",
      body: "What the app does, who uses it, and whether it is a new build or an existing Laravel codebase.",
    },
    {
      title: "Scoping conversation",
      body: "A 30-minute call on models, users and integrations, followed by a written answer within 24 hours.",
    },
    {
      title: "One feature as a trial",
      body: "A real endpoint, job or screen built to your standards, so you can review structure and tests first.",
    },
    {
      title: "Conventions agreed",
      body: "We settle folder structure, testing rules and deployment so every later feature follows the same pattern.",
    },
    {
      title: "Weekly Laravel releases",
      body: "Reviewed pull requests with migrations and tests attached, plus a demo of what shipped each week.",
    },
  ],
  stack: [
    { category: "Core", items: ["Laravel", "PHP 8", "Composer", "Artisan"] },
    { category: "Data", items: ["Eloquent", "MySQL", "PostgreSQL", "Redis"] },
    { category: "Auth and access", items: ["Sanctum", "Gates and policies"] },
    { category: "Background work", items: ["Laravel queues", "Horizon", "Task scheduling"] },
    { category: "Front end", items: ["Blade", "Livewire", "Inertia.js", "React", "Vue", "Tailwind CSS"] },
    { category: "Billing and integrations", items: ["Stripe", "Laravel Cashier", "Salesforce", "Microsoft Graph"] },
    { category: "Testing", items: ["Pest", "PHPUnit", "Playwright"] },
    { category: "Deployment", items: ["Docker", "AWS", "GitHub Actions", "Git"] },
  ],
  faqs: [
    {
      q: "Can you build a Laravel API for our mobile app?",
      a: "Yes. I build versioned JSON APIs with Sanctum authentication, API resources for consistent responses and documentation your mobile developers can work from.",
    },
    {
      q: "Livewire, Inertia or a separate front end?",
      a: "Livewire suits admin-heavy apps with modest interactivity, Inertia suits richer React or Vue screens inside one codebase, and a separate Next.js front end makes sense when the API serves several clients. I recommend one with reasons.",
    },
    {
      q: "Can you add subscriptions and billing to our Laravel SaaS?",
      a: "Yes. I handle Stripe plans, trials, metered usage and webhooks, and test the awkward cases such as failed payments, upgrades mid-cycle and cancellations.",
    },
    {
      q: "Our Laravel app is several versions behind. Can you upgrade it?",
      a: "Yes. I upgrade one major version at a time, run the test suite at each step and replace packages that are no longer maintained.",
    },
    {
      q: "How do you keep a Laravel codebase from getting messy?",
      a: "Thin controllers, form requests for validation, policies for access, jobs for slow work and feature tests on every important flow.",
    },
    {
      q: "Can you take over a Laravel project another developer started?",
      a: "Yes. I review the code first, write down what is solid and what is risky, and agree priorities with you before building on top of it.",
    },
    {
      q: "Which time zones do you cover?",
      a: "I am in India (IST) with flexible hours overlapping the UK, Europe, the UAE, Singapore and US mornings.",
    },
  ],
  ctaTitle: "Build your Laravel product *on solid foundations*",
  ctaBody:
    "Send a short description of the app or a link to the repo. I will reply within 24 hours with an honest view on fit and how I would begin.",
};

export default page;
