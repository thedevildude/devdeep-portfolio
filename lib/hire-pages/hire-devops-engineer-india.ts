// TODO(owner): add real DevOps projects and experience here; the proof below leans on transferable work.
import type { Service } from "../services";

const page: Service = {
  slug: "hire-devops-engineer-india",
  seoTitle: "Hire a DevOps Engineer in India — CI/CD, Senior | Devdeep",
  h1: "Hire a DevOps Engineer in India",
  role: "DevOps Engineer",
  headline: "Hire a DevOps engineer in India, *for releases nobody dreads*",
  description:
    "Hire a DevOps engineer in India for CI/CD on GitHub Actions or CircleCI, Docker, AWS, Azure and Google Cloud infrastructure, and monitoring that catches issues.",
  keywords: [
    "hire devops engineer india",
    "remote devops engineer for hire",
    "ci cd engineer india",
    "hire cloud devops engineer",
    "github actions consultant india",
  ],
  intro:
    "Shipping should be the boring part of building software. I set up the pipelines, containers, environments and monitoring that let your team merge with confidence and release on any day of the week.",
  heroCta: "Hire me to fix your release process",
  chips: [
    "CI/CD",
    "GitHub Actions",
    "Docker",
    "Infrastructure as code",
    "Kubernetes",
    "Monitoring",
  ],
  overview: {
    title: "How to hire a DevOps engineer in India",
    paragraphs: [
      "You can usually tell when DevOps is missing. Releases happen late on a Friday with someone watching the logs, staging drifts away from production, builds take twenty minutes and nobody is quite sure which secrets live where. Fixing that is less about tools and more about making every step repeatable and visible.",
      "I have written the pipelines for products I built and shipped, including Verity's GitHub workflows pipeline that deploys a serverless QA platform on AWS. Because I am also a product engineer, I build delivery around how your developers actually work, not around a diagram.",
    ],
    gets: [
      "A pipeline that builds, tests and deploys every merge the same way",
      "Environments defined in code, so staging matches production",
      "Container images that are small, reproducible and quick to build",
      "Logs, metrics and alerts that point at the problem, not just the symptom",
      "Runbooks your team can follow without me in the room",
    ],
  },
  roleTitle: "What I do as your *DevOps engineer*",
  roleIntro:
    "The delivery and infrastructure work you can hand to me, from first commit to running in production.",
  duties: [
    {
      icon: "loop",
      title: "CI/CD pipelines",
      body: "Build GitHub Actions or CircleCI workflows that lint, test, build and deploy on every merge.",
    },
    {
      icon: "cube",
      title: "Containerisation",
      body: "Write lean Dockerfiles and compose setups so every service runs identically on laptops and servers.",
    },
    {
      icon: "code",
      title: "Infrastructure as code",
      body: "Define cloud resources in Terraform or CDK so changes are reviewed, versioned and repeatable.",
    },
    {
      icon: "cloud",
      title: "Cloud setup",
      body: "Configure networks, compute, storage and access on AWS, Azure or Google Cloud with sensible defaults.",
    },
    {
      icon: "chart",
      title: "Observability",
      body: "Set up structured logs, metrics, dashboards and alerts so incidents are noticed and traced quickly.",
    },
    {
      icon: "shield",
      title: "Secrets and access",
      body: "Move secrets out of code, scope permissions tightly and add dependency and image scanning to CI.",
    },
    {
      icon: "gauge",
      title: "Faster builds",
      body: "Cut pipeline time with caching, parallel test jobs and only rebuilding what actually changed.",
    },
    {
      icon: "layout",
      title: "Preview environments",
      body: "Spin up a deployed copy of each pull request so reviewers can click through changes before merge.",
    },
  ],
  whyTitle: "Why hire a DevOps engineer in India, *and why me*",
  whyIntro:
    "Good DevOps comes from people who have felt the pain of a bad release. I write application code too, so I build delivery from the developer's side.",
  why: [
    {
      icon: "workflow",
      title: "Pipelines in production",
      body: "Verity deploys through a GitHub workflows pipeline onto Lambda, DynamoDB and Step Functions, with tests holding coverage at 92%.",
    },
    {
      icon: "globe",
      title: "Three clouds, many targets",
      body: "I have shipped to AWS, Azure and Google Cloud, and released web, desktop and mobile apps for clients around the world.",
    },
    {
      icon: "users",
      title: "Team-level thinking",
      body: "Having led a team of five at Capital Compute, I design workflows that a whole team can follow, not just the person who wrote them.",
    },
  ],
  steps: [
    {
      title: "Describe the pain",
      body: "How you ship today, what breaks most often and which cloud and CI tools you already use.",
    },
    {
      title: "Delivery audit",
      body: "A 30-minute walkthrough of your repo, pipeline and cloud setup, followed by a written list of priorities.",
    },
    {
      title: "Quick win",
      body: "Fix the most painful step first, often a slow or flaky build, so the team feels the change early.",
    },
    {
      title: "Codify the platform",
      body: "Move infrastructure into code, standardise environments and add monitoring around the critical paths.",
    },
    {
      title: "Document and step back",
      body: "Write runbooks and walk your developers through the setup, so the process does not depend on me.",
    },
  ],
  stack: [
    { category: "CI/CD", items: ["GitHub Actions", "CircleCI", "Git"] },
    {
      category: "Containers",
      items: ["Docker", "Docker Compose", "Kubernetes"],
    },
    { category: "Infrastructure as code", items: ["Terraform", "AWS CDK"] },
    {
      category: "AWS",
      items: [
        "Lambda",
        "Step Functions",
        "S3",
        "CloudFront",
        "Cognito",
        "CloudWatch",
      ],
    },
    { category: "Other clouds", items: ["Azure", "Google Cloud"] },
    {
      category: "Observability",
      items: ["Structured logging", "Metrics", "Alerting", "Dashboards"],
    },
    { category: "Testing in CI", items: ["Jest", "Playwright"] },
    { category: "Scripting", items: ["Bash", "TypeScript", "Node.js"] },
    { category: "Databases", items: ["PostgreSQL", "DynamoDB", "MongoDB"] },
  ],
  faqs: [
    {
      q: "GitHub Actions or CircleCI?",
      a: "I have used both in production. If your code is on GitHub, Actions is usually the simplest choice, while CircleCI is worth keeping if your team already relies on its caching and parallelism.",
    },
    {
      q: "Do we need Kubernetes?",
      a: "Many products do not. Serverless functions or a managed container service are often simpler to run, and I will only recommend Kubernetes when the workload clearly needs it.",
    },
    {
      q: "Can you speed up our slow CI pipeline?",
      a: "Usually, yes. Caching dependencies, splitting tests across parallel jobs and skipping unchanged packages often make a large difference within the first week.",
    },
    {
      q: "Can you move our infrastructure into code?",
      a: "Yes. I import what already exists step by step, so nothing is recreated by surprise, and every future change goes through review.",
    },
    {
      q: "Will you work inside our cloud accounts?",
      a: "Yes. Everything lives in your accounts and repos with access you control, and I sign an NDA before touching anything.",
    },
    {
      q: "Can you help after something has gone wrong in production?",
      a: "Yes. I can trace the failure through logs and metrics, fix the cause and add the alerting that would have caught it sooner.",
    },
    {
      q: "How quickly can you start?",
      a: "Typically within one to two weeks. Send a short description of how you ship today and I will confirm availability the same day.",
    },
  ],
  ctaTitle: "Make shipping *the easy part*",
  ctaBody:
    "Tell me how you release today and what keeps breaking. I will reply within 24 hours with an honest read on fit and the first thing I would fix.",
};

export default page;
