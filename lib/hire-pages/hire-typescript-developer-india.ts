import type { Service } from "../services";

const page: Service = {
  slug: "hire-typescript-developer-india",
  seoTitle: "Hire a TypeScript Developer in India — Senior | Devdeep",
  h1: "Hire a TypeScript Developer in India",
  role: "TypeScript Developer",
  headline: "Hire a TypeScript developer in India, *who makes types do the work*",
  description:
    "Hire a senior TypeScript developer in India for type-safe React, Next.js and Node.js code, shared types across the stack and safe JavaScript migrations.",
  keywords: [
    "hire typescript developer india",
    "typescript developer for hire",
    "remote typescript developer india",
    "senior typescript engineer india",
    "javascript to typescript migration",
  ],
  intro:
    "Good types catch bugs before your users do and let a team change code without fear. I write TypeScript across the whole stack, from React components to Node.js services and Lambda functions, and I design the types so the compiler explains the system to the next developer.",
  heroCta: "Hire me for your TypeScript codebase",
  chips: ["TypeScript", "React", "Node.js", "Next.js", "Prisma", "Jest"],
  overview: {
    title: "How to hire a TypeScript developer in India",
    paragraphs: [
      "Many codebases use TypeScript in name only: loose settings, \"any\" scattered through the code and types that drift away from what the API really returns. That gives you the overhead of a type system without the safety.",
      "I use TypeScript as a design tool. Types shared between the database, the API and the interface mean a renamed field breaks the build, not production. You hire me directly, and I bring that discipline to new projects and to existing JavaScript code that needs to grow up.",
    ],
    gets: [
      "Strict compiler settings, with \"any\" treated as a decision, not a habit",
      "One source of truth for types across database, API and interface",
      "Runtime validation at the edges where outside data enters your system",
      "Gradual JavaScript to TypeScript migration with no feature freeze",
      "Types and tests that make refactoring routine instead of risky",
    ],
  },
  roleTitle: "What I do as your *TypeScript developer*",
  roleIntro: "The typed work I take on across your stack.",
  duties: [
    {
      icon: "code",
      title: "Type modelling",
      body: "Model your domain with unions, generics and narrowing so invalid states cannot be written down.",
    },
    {
      icon: "link",
      title: "End-to-end types",
      body: "Share types from Prisma models through API responses into React components without hand-copied interfaces.",
    },
    {
      icon: "migrate",
      title: "JS to TS migration",
      body: "Convert JavaScript codebases file by file, tightening compiler settings as coverage of types grows.",
    },
    {
      icon: "shield",
      title: "Boundary validation",
      body: "Validate data from users, webhooks and LLM output at runtime before it reaches typed code.",
    },
    {
      icon: "layout",
      title: "Typed components",
      body: "Build React and Next.js components with precise props that make misuse a compile error.",
    },
    {
      icon: "server",
      title: "Typed services",
      body: "Write Node.js, Express and Lambda handlers where request and response shapes are checked by the compiler.",
    },
    {
      icon: "search",
      title: "Type audits",
      body: "Find unsafe casts, stray \"any\" types and drifting interfaces, then fix them in a planned order.",
    },
    {
      icon: "workflow",
      title: "CI type checks",
      body: "Run type checks, linting and Jest suites in GitHub Actions or CircleCI on every pull request.",
    },
  ],
  whyTitle: "Why hire a TypeScript developer in India, *and why me*",
  whyIntro:
    "TypeScript skill is easy to claim and hard to fake. My production work shows how I use it across every layer of a product.",
  why: [
    {
      icon: "cube",
      title: "Typed across every layer",
      body: "React and Next.js front ends, Node.js services, Electron desktop apps and serverless AWS backends, all in TypeScript in production.",
    },
    {
      icon: "flask",
      title: "Types plus tests",
      body: "Verity, a serverless QA platform on AWS, reached 92% test coverage, because types and tests catch different classes of bug.",
    },
    {
      icon: "users",
      title: "Raises the team's bar",
      body: "I have led a team of five and mentored freshers through code review, so good typing habits spread beyond my own pull requests.",
    },
  ],
  steps: [
    {
      title: "Share your codebase context",
      body: "Your stack, compiler settings, how much is still JavaScript and where bugs tend to slip through.",
    },
    {
      title: "Types review call",
      body: "A 30-minute call to look at problem areas together. A fit answer and first ideas within 24 hours.",
    },
    {
      title: "Typed trial task",
      body: "A real feature or a small migration first, so you can see how I shape types and tests.",
    },
    {
      title: "Tighten the foundations",
      body: "Agree compiler settings, shared type locations and validation rules before scaling up the work.",
    },
    {
      title: "Typed delivery each week",
      body: "Small pull requests that pass strict checks, with weekly demos and written progress notes.",
    },
  ],
  stack: [
    { category: "Languages", items: ["TypeScript", "JavaScript", "Rust", "SQL"] },
    {
      category: "Front end",
      items: ["React", "Next.js (App Router)", "Angular", "Redux Toolkit", "Zustand"],
    },
    { category: "Back end", items: ["Node.js", "Express", "AWS Lambda"] },
    { category: "Typed data access", items: ["Prisma", "Sequelize", "PostgreSQL", "DynamoDB", "Supabase"] },
    { category: "Desktop and mobile", items: ["Electron", "React Native"] },
    { category: "AI", items: ["LangChain", "LangGraph", "LLM agents"] },
    { category: "Testing", items: ["Jest", "Playwright"] },
    { category: "CI", items: ["GitHub Actions", "CircleCI", "Docker", "Git"] },
  ],
  faqs: [
    {
      q: "Can you migrate our JavaScript codebase to TypeScript?",
      a: "Yes. I convert it incrementally, starting with shared utilities and data models, so the product keeps shipping while type coverage rises.",
    },
    {
      q: "How strict should our TypeScript settings be?",
      a: "Strict mode for new code, almost always. For an existing codebase I tighten settings in stages so the team is never buried in thousands of errors at once.",
    },
    {
      q: "Do you use TypeScript on the backend too?",
      a: "Yes. My Node.js, Express and AWS Lambda services are written in TypeScript, often sharing types with the front end.",
    },
    {
      q: "Do types replace the need for tests?",
      a: "No. Types catch shape and contract mistakes, while Jest and Playwright tests catch logic and behaviour mistakes. I use both.",
    },
    {
      q: "How do you keep API types in sync with the front end?",
      a: "By generating or sharing them from one source, such as Prisma models or a shared types package, rather than redefining the same shapes by hand.",
    },
    {
      q: "Can you help our team get better at TypeScript?",
      a: "Yes. Through code review and short written guides I explain the patterns behind each change, the same way I mentored freshers at Capital Compute.",
    },
    {
      q: "When can you start?",
      a: "Usually within one to two weeks, as a project, a monthly retainer or a full-time remote role, often starting with a scoped trial task.",
    },
  ],
  ctaTitle: "Make your codebase *safe to change*",
  ctaBody:
    "Tell me about your TypeScript or JavaScript codebase. I will reply within 24 hours with an honest answer on fit and where I would begin.",
};

export default page;
