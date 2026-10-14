export type Service = {
  slug: string;
  seoTitle: string;
  h1: string;
  description: string;
  keywords: string[];
  intro: string;
  why: { title: string; body: string }[];
  scope: string[];
  steps: { title: string; body: string }[];
  faqs: { q: string; a: string }[];
};

export const SERVICES: Service[] = [
  {
    slug: "hire-software-engineer-india",
    seoTitle: "Hire a Software Engineer in India — Senior, Remote | Devdeep",
    h1: "Hire a Software Engineer in India",
    description:
      "Hire a senior software engineer in India who ships. 3+ years of production React, Next.js, TypeScript, AI and Blockchain work. Remote, fast to start, direct communication.",
    keywords: [
      "hire software engineer in india",
      "hire senior software engineer india",
      "remote software engineer india",
      "freelance software engineer india",
      "hire full stack developer india",
    ],
    intro:
      "You don't need an agency layer, a bench of juniors or a three-month recruiting cycle. You need one senior engineer who understands the product, writes production code and talks to you directly. I'm a full stack engineer based in India, available for contract and full-time remote work with startups and engineering teams.",
    why: [
      {
        title: "One engineer, no middlemen",
        body: "You talk to the person writing the code. No account managers, no hand-offs, no lost context between your brief and the pull request.",
      },
      {
        title: "Product thinking, not just tickets",
        body: "I question scope, flag trade-offs early and propose simpler routes. That is how small teams keep moving at speed without accumulating debt.",
      },
      {
        title: "Production experience",
        body: "Shipped systems across fintech-style dashboards, deal-team tooling, creator platforms and Web3 products. See the case studies on the blog for real architecture decisions.",
      },
      {
        title: "Overlap with your timezone",
        body: "I'm flexible on working hours so standups, reviews and incident calls land inside your day, whether you are in the US, UK, UAE or Singapore.",
      },
    ],
    scope: [
      "Frontend: React, Next.js (App Router), TypeScript, Tailwind",
      "Backend: Node.js APIs, databases, auth, integrations",
      "AI features: LLM-powered workflows, retrieval, agents, evals",
      "Blockchain: wallet flows, smart-contract integration, on-chain data",
      "Cloud: deployment, CI/CD, observability, performance tuning",
      "Technical leadership: architecture, code review, mentoring",
    ],
    steps: [
      {
        title: "Intro call",
        body: "A 30-minute conversation about your product, stack, timeline and what success looks like. Honest answer on fit within 24 hours.",
      },
      {
        title: "Scoped trial",
        body: "We pick a small, real piece of work first, so you can judge quality, speed and communication before committing further.",
      },
      {
        title: "Embedded delivery",
        body: "I join your repo, board and chat. Weekly demos, small pull requests, written updates, no surprises.",
      },
    ],
    faqs: [
      {
        q: "How quickly can you start?",
        a: "Typically within one to two weeks, depending on my current commitments. Send a short brief and I'll confirm availability the same day.",
      },
      {
        q: "Do you work as a contractor or full-time?",
        a: "Both. I take fixed-scope projects, monthly retainers and long-term remote roles. We pick whichever fits your stage.",
      },
      {
        q: "What does it cost to hire a software engineer in India?",
        a: "Rates depend on scope, duration and seniority, and are well below US or UK senior rates without a drop in quality. Get in touch with your brief for a clear quote.",
      },
      {
        q: "Can you work with my existing team and codebase?",
        a: "Yes. Most of my work is inside existing codebases: reading before rewriting, matching conventions and leaving things better than I found them.",
      },
      {
        q: "Will you sign an NDA?",
        a: "Yes, on request, before we discuss anything sensitive.",
      },
    ],
  },
  {
    slug: "hire-react-nextjs-developer-india",
    seoTitle: "Hire a React & Next.js Developer in India | Devdeep",
    h1: "Hire a React & Next.js Developer in India",
    description:
      "Hire a senior React and Next.js developer in India. App Router, TypeScript, performance and SEO-focused builds for startups, with clear communication and fast delivery.",
    keywords: [
      "hire react developer india",
      "hire nextjs developer india",
      "senior react developer for hire",
      "freelance next.js developer india",
      "hire frontend developer india",
    ],
    intro:
      "Fast, accessible, well-structured interfaces are what turn a product into something people trust. I build React and Next.js applications end to end: component architecture, data fetching, rendering strategy, performance and the unglamorous details that make an app feel finished.",
    why: [
      {
        title: "Modern Next.js, done properly",
        body: "App Router, server components, streaming, caching and metadata, used where they help and avoided where they don't.",
      },
      {
        title: "Performance and SEO built in",
        body: "Core Web Vitals, image and font strategy, structured data, sitemaps and canonical handling are part of the build, not an afterthought.",
      },
      {
        title: "Design-literate",
        body: "I work comfortably from Figma or from a rough idea, and care about spacing, motion and typography as much as state management.",
      },
      {
        title: "Typed and maintainable",
        body: "TypeScript throughout, small composable components and sensible tests, so your team can keep extending it after I'm gone.",
      },
    ],
    scope: [
      "Marketing sites and portfolios with strong SEO",
      "SaaS dashboards and internal tools",
      "Design-system and component-library work",
      "Migrations from Pages Router, CRA or Vite to Next.js",
      "Performance audits and Core Web Vitals fixes",
      "Web3 front ends: wallet connection, signing, on-chain reads",
    ],
    steps: [
      {
        title: "Share the brief",
        body: "Links, designs or even a rough outline. I'll reply with questions, risks and a proposed approach.",
      },
      {
        title: "Plan and estimate",
        body: "A short written plan with milestones and a clear estimate, so you know what you're getting and when.",
      },
      {
        title: "Build and ship",
        body: "Preview deployments on every pull request, weekly demos and a clean hand-over with documentation.",
      },
    ],
    faqs: [
      {
        q: "Do you only do frontend?",
        a: "No. I'm a full stack engineer, so I can build the API, database and integrations behind the interface too.",
      },
      {
        q: "Can you improve an existing slow Next.js app?",
        a: "Yes. I start with measurement, fix the biggest bottlenecks first and report before-and-after numbers.",
      },
      {
        q: "Do you work with designers?",
        a: "Yes, and I'm comfortable making design decisions myself when there's no designer on the team.",
      },
      {
        q: "Is Next.js the right choice for my project?",
        a: "Often, but not always. I'll tell you honestly if a simpler setup suits you better.",
      },
    ],
  },
  {
    slug: "hire-forward-deployed-engineer-india",
    seoTitle: "Hire a Forward Deployed Engineer in India | Devdeep",
    h1: "Hire a Forward Deployed Engineer in India",
    description:
      "Hire a forward deployed engineer in India who embeds with your customers or team, ships AI and full stack solutions fast and turns messy requirements into working software.",
    keywords: [
      "hire forward deployed engineer",
      "forward deployed engineer india",
      "ai engineer for hire india",
      "hire ai software engineer india",
      "customer-facing software engineer",
    ],
    intro:
      "A forward deployed engineer sits where the product meets the customer's real problem. I embed with your team or your clients, learn the workflow, then build the integrations, AI features and tooling that get them live. Part engineer, part consultant, fully hands-on.",
    why: [
      {
        title: "Comfortable with ambiguity",
        body: "Customer requirements are rarely clean. I clarify, prioritise and deliver a working first version fast, then iterate with feedback.",
      },
      {
        title: "AI, cloud and full stack in one person",
        body: "LLM workflows, data pipelines, APIs and polished interfaces, so one engineer can take a customer use case from idea to production.",
      },
      {
        title: "Clear communicator",
        body: "I translate between technical and non-technical stakeholders, and write up what was decided and why.",
      },
      {
        title: "Ownership",
        body: "I own outcomes: deployment, monitoring, hand-over and the follow-up conversation when something needs to change.",
      },
    ],
    scope: [
      "Customer-specific integrations and data onboarding",
      "AI copilots, document extraction and workflow automation",
      "Prototypes and proofs of concept that become real products",
      "Internal tools for operations and deal or sales teams",
      "Pilot rollouts, training and feedback loops",
      "Feeding customer learnings back into the core product",
    ],
    steps: [
      {
        title: "Discovery",
        body: "Sit with the users, map the workflow and agree on the one outcome that matters most.",
      },
      {
        title: "Fast prototype",
        body: "A working slice in days, not weeks, put in front of real users to find what's wrong early.",
      },
      {
        title: "Production and hand-over",
        body: "Harden, deploy, document and train, then measure adoption and iterate.",
      },
    ],
    faqs: [
      {
        q: "What is a forward deployed engineer?",
        a: "An engineer embedded with customers or close to them, building solutions on top of a product or platform and bridging the gap between engineering and the customer's needs.",
      },
      {
        q: "Can you work on-site or only remotely?",
        a: "Primarily remote, with on-site visits in India possible for key workshops or rollouts.",
      },
      {
        q: "Which AI tools and models do you use?",
        a: "I choose per use case: hosted frontier models, retrieval pipelines and evaluation harnesses, with attention to cost, latency and data privacy.",
      },
      {
        q: "Do you take short engagements?",
        a: "Yes. Pilots and proofs of concept of a few weeks are a good fit.",
      },
    ],
  },
];

export const getService = (slug: string) =>
  SERVICES.find((s) => s.slug === slug);
