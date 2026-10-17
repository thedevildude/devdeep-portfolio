// TODO(owner): add more real Python, Django and FastAPI projects and experience here; beyond the OHC Django work, the proof below leans on transferable work.
import type { Service } from "../services";

const page: Service = {
  slug: "hire-python-developer-india",
  seoTitle: "Hire a Python Developer in India — Senior, Remote | Devdeep",
  h1: "Hire a Python Developer in India",
  role: "Python Developer",
  headline: "Hire a Python developer in India, *from Django apps to AI glue*",
  description:
    "Hire a senior Python developer in India for Django and FastAPI backends, automation scripts, data pipelines and glue code that connects LLMs to your product.",
  keywords: [
    "hire python developer india",
    "hire django developer india",
    "hire fastapi developer india",
    "remote python developer india",
    "senior python engineer for hire",
  ],
  intro:
    "Python ends up everywhere in a product: the Django admin your operations team lives in, the FastAPI service behind a model, the script that cleans last night's data. I write all three with the same care, so the quick script does not become the fragile thing everyone is afraid to run.",
  heroCta: "Hire me for your Python work",
  chips: ["Python", "Django", "FastAPI", "Django REST Framework", "Celery", "Pandas"],
  overview: {
    title: "How to hire a Python developer in India",
    paragraphs: [
      "Python is forgiving, which means problems hide well. Untyped dictionaries passed through ten functions, Django views doing database work in a loop and scripts that only run on one laptop are common in codebases that grew fast. A senior Python hire brings structure without slowing the team down.",
      "At Open Healthcare Network I worked on CARE, an open-source Django platform whose software served 200+ hospitals across India, where correctness and data handling really mattered. I also build LLM agents and RAG pipelines with LangChain and LangGraph. When you hire me, you get Python that is production code from the first commit.",
    ],
    gets: [
      "Django and FastAPI services with typed models and clear settings",
      "ORM queries checked for N+1 problems before they reach production",
      "Scripts turned into repeatable, scheduled jobs with logging",
      "Pinned, reproducible environments that run the same everywhere",
      "pytest coverage on the business rules and data transformations",
    ],
  },
  roleTitle: "What I do as your *Python developer*",
  roleIntro: "The Python work I take on, from web backends to the scripts around them.",
  duties: [
    {
      icon: "server",
      title: "Django backends",
      body: "Build Django apps with clean models, permissions and an admin your internal teams can actually use.",
    },
    {
      icon: "link",
      title: "FastAPI services",
      body: "Write async FastAPI endpoints with Pydantic validation and generated OpenAPI docs for every consumer.",
    },
    {
      icon: "sparkles",
      title: "LLM and RAG glue",
      body: "Connect models, vector search and your data with LangChain or LangGraph, with outputs validated before use.",
    },
    {
      icon: "workflow",
      title: "Task queues",
      body: "Move slow work into Celery workers with retries, schedules and visibility into what failed.",
    },
    {
      icon: "chart",
      title: "Data processing",
      body: "Clean, join and reshape data with Pandas, then load it into PostgreSQL or your warehouse.",
    },
    {
      icon: "code",
      title: "Automation scripts",
      body: "Replace manual spreadsheets and copy-paste chores with tested Python scripts and simple CLIs.",
    },
    {
      icon: "gauge",
      title: "Django performance",
      body: "Fix slow pages with select_related, prefetching, indexes and caching, measured before and after.",
    },
    {
      icon: "migrate",
      title: "Upgrades and typing",
      body: "Upgrade Python and Django versions and add type hints gradually, checked by mypy in CI.",
    },
  ],
  whyTitle: "Why hire a Python developer in India, *and why me*",
  whyIntro:
    "India has a large Python community. What matters is someone who has written Python where mistakes had real consequences, and who knows the rest of the stack too.",
  why: [
    {
      icon: "shield",
      title: "Django where it mattered",
      body: "I worked on CARE and Ayushma at Open Healthcare Network under a GDC fellowship, open-source software that served 200+ hospitals across India.",
    },
    {
      icon: "sparkles",
      title: "AI work in production",
      body: "I build LangChain and LangGraph agents and RAG pipelines. PEOS shows the pattern I follow: AI does the legwork and people approve material actions.",
    },
    {
      icon: "layout",
      title: "Beyond the Python layer",
      body: "I also ship React, Next.js and TypeScript, so a Django or FastAPI backend comes with a frontend that uses it properly.",
    },
  ],
  steps: [
    {
      title: "Tell me the problem",
      body: "The Django app, FastAPI service, script or pipeline, and what it needs to do next.",
    },
    {
      title: "Short scoping call",
      body: "Thirty minutes on code, data and deployment. A written answer on fit within 24 hours.",
    },
    {
      title: "Proof on real code",
      body: "One real view, endpoint, job or script first, so you can judge my Python on your own code.",
    },
    {
      title: "Reproducible setup",
      body: "I pin the environment, get the project running cleanly and note anything fragile I find.",
    },
    {
      title: "Ship and document",
      body: "Reviewed pull requests each week, with pytest coverage and a short note on each change.",
    },
  ],
  stack: [
    { category: "Languages", items: ["Python", "SQL", "TypeScript"] },
    { category: "Web frameworks", items: ["Django", "Django REST Framework", "FastAPI"] },
    { category: "Async and jobs", items: ["Celery", "asyncio", "Redis"] },
    { category: "Data", items: ["Pandas", "NumPy", "PostgreSQL", "MongoDB"] },
    { category: "AI", items: ["LangChain", "LangGraph", "RAG", "LLM agents"] },
    { category: "Testing and quality", items: ["pytest", "mypy", "Playwright"] },
    { category: "Packaging", items: ["pip", "Poetry", "virtualenv"] },
    { category: "Cloud", items: ["AWS Lambda", "S3", "Google Cloud", "Azure"] },
    { category: "Delivery", items: ["Docker", "Git", "GitHub Actions"] },
  ],
  faqs: [
    {
      q: "Django or FastAPI for our project?",
      a: "Django when you want an admin, auth and a mature ORM out of the box. FastAPI when you need a lean, async API in front of a model or another service. I will recommend one with reasons.",
    },
    {
      q: "Can you take over a Django project another developer started?",
      a: "Yes. I read the models and settings first, get it running reproducibly and write down the risks before making larger changes.",
    },
    {
      q: "Can you build an AI feature in Python for our existing product?",
      a: "Yes. I build RAG pipelines and LLM agents with LangChain and LangGraph, validate model output and keep a human approval step where actions matter.",
    },
    {
      q: "Can you turn our one-off scripts into something reliable?",
      a: "Yes. I add configuration, logging, tests and a schedule, so a script anyone on the team can run replaces the one that only works on one machine.",
    },
    {
      q: "Do you use type hints in Python?",
      a: "Yes, on new code by default, checked with mypy. On older code I add them gradually where they catch the most bugs.",
    },
    {
      q: "Can you also build the frontend?",
      a: "Yes. I work in React and Next.js, which I also used alongside Django at Open Healthcare Network.",
    },
    {
      q: "How soon can you start, and who owns the code?",
      a: "Typically within one to two weeks. I sign an NDA, and all code and IP from the engagement are yours.",
    },
  ],
  ctaTitle: "Get Python code that is *production-ready from day one*",
  ctaBody:
    "Describe your Python project, script or pipeline. I will reply within 24 hours with an honest answer on fit and where I would begin.",
};

export default page;
