/**
 * Content for the /hire/[slug] pages.
 * In `headline`, `roleTitle`, `whyTitle` and `ctaTitle`, wrap one phrase in *single asterisks*
 * to set it in light italic deep blue.
 */

import { HIRE_PAGES } from "./hire-pages";

export type IconName =
  | "code"
  | "server"
  | "layout"
  | "database"
  | "sparkles"
  | "review"
  | "flask"
  | "cloud"
  | "gauge"
  | "search"
  | "pen"
  | "migrate"
  | "link"
  | "cube"
  | "workflow"
  | "users"
  | "chart"
  | "loop"
  | "shield"
  | "globe";

/**
 * Per-page design choices, so the hire pages don't all look the same.
 * Every field is optional; the defaults are the original layout.
 */
export type HireLayout = {
  /** Hero and closing-band gradient. */
  theme?: "sky" | "mint" | "peach" | "lilac";
  /** "What I do": centred icon grid, two-column list, or uneven bento cards. */
  duties?: "grid" | "list" | "bento";
  /** "Why me": tinted cards, big numbered rows, or sticky heading with items beside it. */
  why?: "cards" | "numbered" | "split";
  /** Process: horizontal row of steps, or a vertical timeline. */
  process?: "row" | "timeline";
};

export type Service = {
  slug: string;
  layout?: HireLayout;
  seoTitle: string;
  /** Plain-text page title, also used in links from the footer and other pages. */
  h1: string;
  /** Short role name for related-page cards, e.g. "Software Engineer". */
  role: string;
  headline: string;
  description: string;
  keywords: string[];
  intro: string;
  heroCta: string;
  /** Skills shown as chips under the hero CTA. */
  chips: string[];
  overview: { title: string; paragraphs: string[]; gets: string[] };
  roleTitle: string;
  roleIntro: string;
  duties: { icon: IconName; title: string; body: string }[];
  whyTitle: string;
  whyIntro: string;
  why: { icon: IconName; title: string; body: string }[];
  steps: { title: string; body: string }[];
  stack: { category: string; items: string[] }[];
  faqs: { q: string; a: string }[];
  ctaTitle: string;
  ctaBody: string;
};

/** Sections that read the same on every hire page. */
export const HIRE_SHARED = {
  processTitle: "How hiring *me* works",
  processIntro:
    "Five short steps from first message to shipped work. Most clients go from brief to first pull request inside two weeks.",
  engageTitle: "Ways to *work with me*",
  engageIntro:
    "Every engagement gets the same standard of work. Choose the shape that fits where your product is today.",
  engagements: [
    {
      name: "Fixed-scope project",
      bestFor: "A defined feature, MVP or migration",
      howWeWork: "Milestones agreed up front, demoed as they land",
      commitment: "Ends when it ships",
    },
    {
      name: "Monthly retainer",
      bestFor: "Ongoing product work at a steady pace",
      howWeWork: "A dedicated block of my time every month",
      commitment: "Month to month",
    },
    {
      name: "Full-time remote",
      bestFor: "Long-term ownership of a product or area",
      howWeWork: "Embedded in your team, your rituals and your tools",
      commitment: "Long term, with notice",
    },
  ],
  engageNote:
    "I take on a small number of clients at a time, so each one gets my full attention. Every engagement can start with a scoped trial task.",
  compareTitle: "Hiring me next to the *alternatives*",
  compareIntro:
    "There are several ways to get engineering done from India. Here is how working with me directly compares.",
  compareColumns: [
    "Me, directly",
    "Agency",
    "Local in-house hire",
    "Freelance marketplace",
  ],
  compareRows: [
    {
      label: "Who writes the code",
      values: [
        "Me, the person you talk to",
        "Whoever is free on their bench",
        "Your new hire",
        "Varies by gig",
      ],
    },
    {
      label: "Time to start",
      values: ["1–2 weeks", "2–4 weeks", "2–4 months", "Days, after vetting"],
    },
    {
      label: "Layers between you and the code",
      values: [
        "None",
        "Account and project managers",
        "Recruiters and a long hiring loop",
        "A marketplace in the middle",
      ],
    },
    {
      label: "Seniority",
      values: [
        "Senior, with case studies to check",
        "Mixed, often junior",
        "Depends on your hiring",
        "Hard to verify",
      ],
    },
    {
      label: "Communication",
      values: [
        "Direct, with weekly written updates",
        "Through a project manager",
        "Direct",
        "Varies",
      ],
    },
    {
      label: "Flexibility",
      values: [
        "Project, retainer or full-time",
        "Bound by contract",
        "Hard to scale down",
        "Flexible but short-lived",
      ],
    },
    {
      label: "Product context",
      values: [
        "Stays with the product",
        "Rotates as staff move",
        "Strong",
        "Lost after each gig",
      ],
    },
  ],
  proofTitle: "Proof, not *promises*",
  proofIntro:
    "Instead of testimonials, read how I built these products: the architecture, the trade-offs and what I would do differently.",
  stats: [
    { value: "3+", label: "years shipping production software" },
    { value: "<1 yr", label: "from SDE Intern to SDE II, leading teams" },
    { value: "200+", label: "hospitals served by software I helped build" },
    { value: "24h", label: "to an honest answer on fit and availability" },
  ],
  stackTitle: "What's in my *stack*",
  faqTitle: "Questions worth asking *before you hire*",
  relatedTitle: "More ways to *work with me*",
} as const;

const CORE_SERVICES: Service[] = [
  {
    slug: "hire-software-engineer-india",
    seoTitle: "Hire a Software Engineer in India — Senior, Remote | Devdeep",
    h1: "Hire a Software Engineer in India",
    role: "Software Engineer",
    headline: "Hire a software engineer in India, *without the agency*",
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
      "Work directly with me, a senior full stack engineer based in India. You keep control of the roadmap and the decisions. I write the code, ship it and keep you in the loop, with no account managers, no bench of juniors and no three-month recruiting cycle.",
    heroCta: "Hire me for your project",
    chips: ["React", "Next.js", "Node.js", "TypeScript", "AWS", "AI agents"],
    overview: {
      title: "How to hire a software engineer in India",
      paragraphs: [
        "“Software engineer” covers a lot: frontend, backend, cloud and AI, sometimes all four in one sprint. Most startups and small teams don't need a big team. They need one senior person who learns the product quickly, writes code that lasts and stays.",
        "That's the gap I fill. I'm a full stack engineer with 3+ years of production work across React, Next.js, TypeScript, Rust, serverless AWS, AI agents, real-time video and Blockchain. You hire me directly, so the person in your standup is the person writing your pull requests.",
      ],
      gets: [
        "One senior engineer across frontend, backend, desktop, mobile, cloud and AI",
        "Direct communication, with no agency or middle layer",
        "Working hours that overlap with your team's day",
        "Flexible terms: a project, a monthly retainer or a full-time remote role",
        "Ownership from the first commit to production and beyond",
      ],
    },
    roleTitle: "What I do as your *software engineer*",
    roleIntro: "Day to day, this is the work you can hand over to me.",
    duties: [
      {
        icon: "code",
        title: "Feature development",
        body: "Turn specs, tickets and rough ideas into shipped, tested features.",
      },
      {
        icon: "server",
        title: "APIs and services",
        body: "Design and build the backend logic, APIs and integrations behind your product.",
      },
      {
        icon: "layout",
        title: "Front-end work",
        body: "Build fast, accessible interfaces in React and Next.js that feel finished.",
      },
      {
        icon: "database",
        title: "Data and storage",
        body: "Model data, design schemas and keep queries fast as usage grows.",
      },
      {
        icon: "sparkles",
        title: "AI features",
        body: "Ship RAG pipelines and LangGraph agents that show their work and keep a person in the loop.",
      },
      {
        icon: "review",
        title: "Code reviews",
        body: "Review pull requests, set conventions and keep the codebase consistent.",
      },
      {
        icon: "flask",
        title: "Testing",
        body: "Write unit, integration and end-to-end tests, including Playwright suites.",
      },
      {
        icon: "cloud",
        title: "Deployments",
        body: "Ship through CI/CD on AWS or Vercel, with monitoring once it's live.",
      },
    ],
    whyTitle: "Why hire a software engineer in India, *and why me*",
    whyIntro:
      "India is home to some of the strongest engineering talent in the world. Hiring there well comes down to finding the right person.",
    why: [
      {
        icon: "chart",
        title: "Senior from day one",
        body: "You work with a senior engineer from the first call, held to the same bar as the best teams in the US, UK and Europe.",
      },
      {
        icon: "users",
        title: "Proven in production",
        body: "I grew from SDE Intern to SDE II in under a year, led teams and shipped platforms for global clients. The case studies show the real decisions.",
      },
      {
        icon: "shield",
        title: "Risk, handled",
        body: "Overlapping hours, a scoped trial task and weekly demos cover time zones, scope and quality, so you never have to take my word for it.",
      },
    ],
    steps: [
      {
        title: "Share your brief",
        body: "Your product, stack, timeline and the hours you need to overlap. A few lines is enough.",
      },
      {
        title: "Intro call",
        body: "30 minutes to talk through the work. An honest answer on fit within 24 hours.",
      },
      {
        title: "Scoped trial",
        body: "A small, real piece of work first, so you can judge quality, speed and communication.",
      },
      {
        title: "Onboard in days",
        body: "I join your repo, board and chat, learn the conventions and pick up the first ticket.",
      },
      {
        title: "Ship every week",
        body: "Small pull requests, weekly demos and written updates. You always know where things stand.",
      },
    ],
    stack: [
      {
        category: "Languages",
        items: [
          "TypeScript",
          "JavaScript",
          "Rust",
          "C++",
          "Objective-C",
          "Solidity",
          "SQL",
        ],
      },
      {
        category: "Front end",
        items: [
          "React",
          "Next.js (App Router)",
          "Angular",
          "Redux Toolkit",
          "Zustand",
          "Tailwind CSS",
          "SCSS",
        ],
      },
      {
        category: "Desktop and mobile",
        items: ["Electron", "React Native", "Native addons"],
      },
      {
        category: "Back end",
        items: ["Node.js", "Express", "REST APIs", "Serverless functions"],
      },
      {
        category: "Databases",
        items: [
          "PostgreSQL",
          "MongoDB",
          "DynamoDB",
          "Supabase",
          "Prisma",
          "Sequelize",
        ],
      },
      {
        category: "AI",
        items: [
          "LangChain",
          "LangGraph",
          "RAG",
          "Retrieval",
          "LLM agents",
          "Agentic workflows",
          "n8n",
          "Human-in-the-loop approvals",
        ],
      },
      {
        category: "Video and media",
        items: [
          "GStreamer",
          "GStreamer Editing Services",
          "FFmpeg",
          "HLS / DASH streaming",
        ],
      },
      {
        category: "Cloud",
        items: [
          "AWS Lambda",
          "Step Functions",
          "S3",
          "CloudFront",
          "Cognito",
          "Azure",
          "Google Cloud",
        ],
      },
      {
        category: "Blockchain",
        items: ["Ethereum", "Hardhat", "Ethers.js", "IPFS", "Chainlink"],
      },
      {
        category: "Integrations",
        items: ["Stripe", "Salesforce", "Microsoft Graph", "GoHighLevel"],
      },
      {
        category: "Testing",
        items: ["Playwright", "Jest", "Integration tests"],
      },
      {
        category: "DevOps",
        items: [
          "Docker",
          "Git",
          "GitHub",
          "GitHub Actions",
          "CircleCI",
          "CI/CD",
        ],
      },
    ],
    faqs: [
      {
        q: "Should I hire you directly or through an agency?",
        a: "Directly, if you want the person writing the code to be the person you talk to. An agency adds account managers and hand-offs between you and the work. Hiring me directly removes that layer, and you keep full control of priorities.",
      },
      {
        q: "What kind of work can I hire you for?",
        a: "Full stack product work: React and Next.js front ends, Electron and React Native apps, Node.js and serverless backends on AWS, AI agents and RAG with LangChain and LangGraph, real-time video with GStreamer and FFmpeg, and Blockchain integrations. I also do architecture reviews and mentoring through code review.",
      },
      {
        q: "How quickly can you start?",
        a: "Typically within one to two weeks, depending on my current commitments. Send a short brief and I'll confirm availability the same day.",
      },
      {
        q: "Do you work as a contractor or full-time?",
        a: "Both. I take fixed-scope projects, monthly retainers and long-term remote roles. We pick whichever fits your stage.",
      },
      {
        q: "How do you structure an engagement?",
        a: "As a fixed-scope project, a monthly retainer or a long-term remote role. Send your brief and I'll propose the shape that fits, in writing, within 24 hours.",
      },
      {
        q: "Can you work with my existing team and codebase?",
        a: "Yes. Most of my work is inside existing codebases: reading before rewriting, matching conventions and leaving things better than I found them.",
      },
      {
        q: "Which time zones can you cover?",
        a: "I'm based in India (IST) and flexible on hours. I overlap comfortably with the UK, Europe, the UAE and Singapore, and can cover the morning hours of a US team.",
      },
      {
        q: "Will you sign an NDA, and who owns the code?",
        a: "Yes, I'll sign an NDA before we discuss anything sensitive. The code and IP you pay for are yours.",
      },
    ],
    ctaTitle: "Hire your software engineer in India, *this week*",
    ctaBody:
      "Send a short brief. You'll get an honest answer on fit and availability, plus a written proposal, within 24 hours.",
  },
  {
    slug: "hire-react-nextjs-developer-india",
    layout: {
      theme: "peach",
      duties: "bento",
      why: "numbered",
      process: "timeline",
    },
    seoTitle: "Hire a React & Next.js Developer in India | Devdeep",
    h1: "Hire a React & Next.js Developer in India",
    role: "React & Next.js Developer",
    headline:
      "Hire a React & Next.js developer in India, *who sweats the details*",
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
      "Fast, accessible, well-structured interfaces are what turn a product into something people trust. I build React and Next.js applications end to end: component architecture, data fetching, rendering strategy, performance and the small details that make an app feel finished.",
    heroCta: "Hire me for your front end",
    chips: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Core Web Vitals",
      "SEO",
    ],
    overview: {
      title: "How to hire a React & Next.js developer in India",
      paragraphs: [
        "Plenty of developers can put a React page on screen. Far fewer know when to render on the server, how to keep a bundle small, or why a layout shifts on a slow phone. Those decisions are what users feel.",
        "I build with modern Next.js every day, including this site. You hire me directly, and I take your designs or rough ideas to a fast, typed, maintainable front end that your team can keep extending.",
      ],
      gets: [
        "Modern Next.js: App Router, server components, streaming and caching",
        "Performance and SEO built in from the first commit",
        "Clean TypeScript and small, composable components",
        "Comfort working from Figma or from a rough idea",
        "A full stack engineer, so the API behind the UI is covered too",
      ],
    },
    roleTitle: "What I do as your *React & Next.js developer*",
    roleIntro: "The front-end work you can hand over to me.",
    duties: [
      {
        icon: "layout",
        title: "Interfaces",
        body: "Build pages and app screens from designs, pixel-careful and responsive.",
      },
      {
        icon: "cube",
        title: "Component systems",
        body: "Create design systems and component libraries your team can reuse.",
      },
      {
        icon: "server",
        title: "Data fetching",
        body: "Choose the right rendering and caching for every route, and wire up the APIs.",
      },
      {
        icon: "gauge",
        title: "Performance",
        body: "Measure and fix Core Web Vitals, bundle size and slow interactions.",
      },
      {
        icon: "search",
        title: "SEO",
        body: "Metadata, structured data, sitemaps and canonicals, done properly.",
      },
      {
        icon: "migrate",
        title: "Migrations",
        body: "Move apps from Pages Router, CRA or Vite to the App Router safely.",
      },
      {
        icon: "pen",
        title: "Motion and polish",
        body: "Add motion, focus states and the small touches that make an app feel finished.",
      },
      {
        icon: "flask",
        title: "Testing",
        body: "Cover critical flows with component and end-to-end tests.",
      },
    ],
    whyTitle: "Why hire a React developer in India, *and why me*",
    whyIntro:
      "India has a deep pool of front-end talent. What makes the difference is someone who cares about the user's experience as much as the code.",
    why: [
      {
        icon: "gauge",
        title: "Craft you can feel",
        body: "Interfaces that load fast, move smoothly and hold up on a slow phone, because the details are the product.",
      },
      {
        icon: "pen",
        title: "Design-literate",
        body: "I care about spacing, motion and typography as much as state management, and can make design calls when there's no designer.",
      },
      {
        icon: "shield",
        title: "Maintainable by default",
        body: "Typed, documented and tested, so your team can keep building after the engagement ends.",
      },
    ],
    steps: [
      {
        title: "Share the brief",
        body: "Links, designs or a rough outline. I'll reply with questions, risks and an approach.",
      },
      {
        title: "Plan and estimate",
        body: "A short written plan with milestones and a clear estimate.",
      },
      {
        title: "Scoped trial",
        body: "One real screen or feature first, so you can judge quality and speed.",
      },
      {
        title: "Build in the open",
        body: "Preview deployments on every pull request, so you see progress as it happens.",
      },
      {
        title: "Ship and hand over",
        body: "Weekly demos, a measured launch and clean documentation for your team.",
      },
    ],
    stack: [
      {
        category: "Languages",
        items: ["TypeScript", "JavaScript", "HTML", "CSS"],
      },
      {
        category: "Frameworks",
        items: [
          "React",
          "Next.js (App Router)",
          "Server Components",
          "Angular",
        ],
      },
      {
        category: "State",
        items: ["Redux Toolkit", "Zustand", "React Context"],
      },
      { category: "Styling", items: ["Tailwind CSS", "SCSS / Sass", "Motion"] },
      { category: "Desktop and mobile", items: ["Electron", "React Native"] },
      {
        category: "Performance",
        items: ["Core Web Vitals", "Image and font strategy", "Caching"],
      },
      {
        category: "SEO",
        items: ["Metadata API", "Structured data", "Sitemaps"],
      },
      {
        category: "AI interfaces",
        items: ["Streaming chat UIs", "LangChain", "RAG"],
      },
      {
        category: "Web3 front ends",
        items: ["Ethers.js", "Wallet connection"],
      },
      { category: "Testing", items: ["Jest", "Playwright", "Component tests"] },
      { category: "Hosting", items: ["Vercel", "AWS", "Docker", "CI/CD"] },
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
      {
        q: "How quickly can you start?",
        a: "Typically within one to two weeks. Send a short brief and I'll confirm availability the same day.",
      },
      {
        q: "What makes your front-end work different?",
        a: "I treat performance, accessibility and polish as part of the feature, not a later pass. You get measured results, not just screens that look right in a demo.",
      },
    ],
    ctaTitle: "Get a front end that feels *finished*",
    ctaBody:
      "Send designs, a link or a rough idea. You'll get an honest answer on fit and a clear plan within 24 hours.",
  },
  {
    slug: "hire-forward-deployed-engineer-india",
    layout: { theme: "lilac", duties: "list", why: "split", process: "row" },
    seoTitle: "Hire a Forward Deployed Engineer in India | Devdeep",
    h1: "Hire a Forward Deployed Engineer in India",
    role: "Forward Deployed Engineer",
    headline:
      "Hire a forward deployed engineer in India, *close to your customers*",
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
    heroCta: "Hire me for a deployment",
    chips: ["AI agents", "RAG", "LangGraph", "n8n", "AWS", "Salesforce"],
    overview: {
      title: "How to hire a forward deployed engineer in India",
      paragraphs: [
        "Customer requirements are rarely clean. Data lives in five systems, the workflow lives in someone's head, and the pilot has a deadline. A forward deployed engineer turns that into working software, fast.",
        "I've done this for deal teams, marketing teams and QA workflows: reading their email, calendars and CRMs, and building AI that does the legwork while people approve what matters. You hire me directly and I own the outcome.",
      ],
      gets: [
        "One engineer who covers AI, cloud, integrations and interface",
        "A working first version in days, not weeks",
        "Clear translation between technical and business stakeholders",
        "Written decisions, so nothing lives only in a call",
        "Ownership through deployment, adoption and iteration",
      ],
    },
    roleTitle: "What I do as your *forward deployed engineer*",
    roleIntro: "The work between your product and your customer's reality.",
    duties: [
      {
        icon: "users",
        title: "Discovery",
        body: "Sit with users, map the workflow and agree the outcome that matters most.",
      },
      {
        icon: "link",
        title: "Integrations",
        body: "Connect CRMs, email, calendars and internal systems, and onboard the data.",
      },
      {
        icon: "sparkles",
        title: "AI copilots",
        body: "Build agents and extraction that do the legwork, with people approving key actions.",
      },
      {
        icon: "cube",
        title: "Prototypes",
        body: "Put a working slice in front of real users within days.",
      },
      {
        icon: "workflow",
        title: "Workflow automation",
        body: "Turn repetitive, manual steps into reliable, observable pipelines.",
      },
      {
        icon: "layout",
        title: "Internal tools",
        body: "Ship dashboards and tools for operations, sales and deal teams.",
      },
      {
        icon: "cloud",
        title: "Rollouts",
        body: "Harden, deploy, monitor and train users through the pilot.",
      },
      {
        icon: "loop",
        title: "Feedback loops",
        body: "Feed what customers teach us back into the core product.",
      },
    ],
    whyTitle: "Why hire a forward deployed engineer in India, *and why me*",
    whyIntro:
      "Forward deployed work needs range more than headcount. One engineer who can cover the whole stack and talk to customers beats a team of hand-offs.",
    why: [
      {
        icon: "sparkles",
        title: "AI and full stack in one person",
        body: "LLM workflows, data pipelines, APIs and polished interfaces, so one person can take a use case from idea to production.",
      },
      {
        icon: "users",
        title: "Clear communicator",
        body: "I translate between technical and non-technical stakeholders, and write up what was decided and why.",
      },
      {
        icon: "shield",
        title: "Ownership",
        body: "Deployment, monitoring, hand-over and the follow-up conversation when something needs to change.",
      },
    ],
    steps: [
      {
        title: "Share the use case",
        body: "The customer, the workflow and the outcome you need. A few lines is enough.",
      },
      {
        title: "Discovery",
        body: "Sit with the users, map the workflow and agree on what success looks like.",
      },
      {
        title: "Fast prototype",
        body: "A working slice in days, in front of real users, to find what's wrong early.",
      },
      {
        title: "Production",
        body: "Harden, deploy and monitor, with people approving any material action.",
      },
      {
        title: "Hand over and iterate",
        body: "Documentation, training and adoption numbers, then the next round of improvements.",
      },
    ],
    stack: [
      {
        category: "AI",
        items: [
          "LangChain",
          "LangGraph",
          "RAG",
          "LLM agents",
          "Document extraction",
          "Human-in-the-loop",
        ],
      },
      {
        category: "Automation",
        items: [
          "n8n",
          "Agentic workflows",
          "Playwright",
          "Scheduled pipelines",
        ],
      },
      {
        category: "Integrations",
        items: [
          "Salesforce",
          "Microsoft Graph",
          "GoHighLevel",
          "Stripe",
          "Webhooks",
        ],
      },
      {
        category: "Cloud",
        items: [
          "AWS Lambda",
          "Step Functions",
          "S3",
          "Cognito",
          "Azure",
          "Google Cloud",
        ],
      },
      {
        category: "Data",
        items: ["PostgreSQL", "MongoDB", "DynamoDB", "Supabase", "Prisma"],
      },
      {
        category: "Back end",
        items: ["Node.js", "TypeScript", "Rust", "Express", "REST APIs"],
      },
      { category: "Front end", items: ["React", "Next.js", "Tailwind CSS"] },
      { category: "DevOps", items: ["Docker", "GitHub Actions", "CI/CD"] },
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
        a: "I choose per use case: hosted frontier models, LangChain and LangGraph for agents, RAG pipelines for retrieval and n8n for automation, with attention to latency, reliability and data privacy.",
      },
      {
        q: "Do you take short engagements?",
        a: "Yes. Pilots and proofs of concept of a few weeks are a good fit.",
      },
      {
        q: "How quickly can you start?",
        a: "Typically within one to two weeks. Send the use case and I'll confirm availability the same day.",
      },
    ],
    ctaTitle: "Get your customer *live*, faster",
    ctaBody:
      "Send the use case. You'll get an honest answer on fit and a first plan within 24 hours.",
  },
];

/** Every hire page: the three originals first, then the rest. */
export const SERVICES: Service[] = [...CORE_SERVICES, ...HIRE_PAGES];

export const getService = (slug: string) =>
  SERVICES.find((s) => s.slug === slug);
