// TODO(owner): add real data engineering projects and experience here; the proof below leans on transferable work.
import type { Service } from "../services";

const page: Service = {
  slug: "hire-data-engineer-india",
  seoTitle: "Hire a Data Engineer in India — Pipelines, Senior | Devdeep",
  h1: "Hire a Data Engineer in India",
  role: "Data Engineer",
  headline: "Hire a data engineer in India, *for data you can trust*",
  description:
    "Hire a data engineer in India to build ingestion pipelines, scrapers, PDF parsing, warehouses and scheduled jobs on AWS, with checks that catch bad data early.",
  keywords: [
    "hire data engineer india",
    "data pipeline developer for hire",
    "remote data engineer india",
    "etl developer india",
    "hire data ingestion engineer",
  ],
  intro:
    "Every dashboard, model and AI feature is only as good as the data feeding it. I build the pipelines that pull data in from websites, documents, APIs and databases, clean it, and land it somewhere your team can query with confidence.",
  heroCta: "Hire me for your data pipelines",
  chips: ["Data pipelines", "ETL", "Web scraping", "SQL", "Data warehouse", "AWS"],
  overview: {
    title: "How to hire a data engineer in India",
    paragraphs: [
      "Most data problems are quiet. A source changes its layout, a column starts arriving empty, a nightly job skips a day and nobody notices for a month. A good data engineer designs for that drift: validation at the edges, jobs that can be re-run safely and a clear record of where each number came from.",
      "On SignalFoundry I built the ingestion layer that feeds its AI agents, scraping web pages and parsing PDFs into structured briefs, with AWS Lambda, Step Functions and DynamoDB doing the heavy lifting. That same discipline carries over to warehouses, reporting tables and event streams.",
    ],
    gets: [
      "Ingestion from APIs, databases, websites and documents into one place",
      "Pipelines that can be re-run without duplicating or losing records",
      "Schema and quality checks that flag bad data before anyone reports on it",
      "Tables modelled for the questions your analysts actually ask",
      "Lineage notes so every metric can be traced back to its source",
    ],
  },
  roleTitle: "What I do as your *data engineer*",
  roleIntro:
    "The data plumbing you can hand over to me, from raw source to a table people trust.",
  duties: [
    {
      icon: "globe",
      title: "Web scraping",
      body: "Collect data from public sites with scrapers that handle pagination, rate limits and layout changes.",
    },
    {
      icon: "pen",
      title: "Document parsing",
      body: "Turn PDFs and unstructured files into clean, structured records your systems and models can use.",
    },
    {
      icon: "workflow",
      title: "Pipeline orchestration",
      body: "Schedule and chain extract, transform and load steps so failures retry instead of silently stopping.",
    },
    {
      icon: "database",
      title: "Warehouse modelling",
      body: "Design fact and dimension tables in PostgreSQL or a cloud warehouse around real reporting needs.",
    },
    {
      icon: "link",
      title: "Source integrations",
      body: "Pull from Salesforce, Microsoft Graph, Stripe and internal databases with incremental, resumable syncs.",
    },
    {
      icon: "shield",
      title: "Data quality",
      body: "Add schema validation, null checks and row-count alerts that catch broken loads on the same day.",
    },
    {
      icon: "gauge",
      title: "Query tuning",
      body: "Partition, index and pre-aggregate heavy tables so reports load quickly as volumes grow.",
    },
    {
      icon: "migrate",
      title: "Data migrations",
      body: "Move data between stores with backfills, reconciliation counts and a tested plan to roll back.",
    },
  ],
  whyTitle: "Why hire a data engineer in India, *and why me*",
  whyIntro:
    "Data engineering sits between software and analysis. I come from the software side, so pipelines get the same testing and review as production code.",
  why: [
    {
      icon: "search",
      title: "Messy sources, handled",
      body: "SignalFoundry turns scraped pages and parsed PDFs into structured briefs that AI agents use to plan campaigns across 50+ channels.",
    },
    {
      icon: "workflow",
      title: "Serverless orchestration",
      body: "I have run multi-step jobs on Step Functions, Lambda and DynamoDB in production, with retries and state that survive failures.",
    },
    {
      icon: "code",
      title: "Engineered like software",
      body: "Typed transforms, tests around the critical joins and small reviewed changes, so the pipeline stays understandable as it grows.",
    },
  ],
  steps: [
    {
      title: "Map your sources",
      body: "Where the data lives today, how often it changes and which reports or models depend on it.",
    },
    {
      title: "Data walkthrough",
      body: "A 30-minute call on volumes, freshness needs and the numbers people currently argue about.",
    },
    {
      title: "First pipeline",
      body: "One real source ingested end to end, with validation, so you can judge the approach on live data.",
    },
    {
      title: "Model and expand",
      body: "Add the remaining sources and shape the tables around the questions your team asks most.",
    },
    {
      title: "Monitor and hand over",
      body: "Alerts on freshness and quality, plus written lineage notes so your team can run it day to day.",
    },
  ],
  stack: [
    { category: "Languages", items: ["SQL", "Python", "TypeScript", "JavaScript"] },
    {
      category: "Databases",
      items: ["PostgreSQL", "DynamoDB", "MongoDB", "Supabase"],
    },
    {
      category: "Orchestration",
      items: ["AWS Step Functions", "AWS Lambda", "n8n", "Scheduled jobs"],
    },
    { category: "Storage", items: ["S3", "Data lakes", "Data warehouses"] },
    {
      category: "Ingestion",
      items: ["Web scraping", "Playwright", "PDF parsing", "REST APIs", "Webhooks"],
    },
    {
      category: "Integrations",
      items: ["Salesforce", "Microsoft Graph", "Stripe", "GoHighLevel"],
    },
    { category: "ORMs", items: ["Prisma", "Sequelize"] },
    { category: "Cloud", items: ["AWS", "Azure", "Google Cloud"] },
    {
      category: "Tooling",
      items: ["Docker", "Git", "GitHub Actions", "Jest"],
    },
  ],
  faqs: [
    {
      q: "Can you build a pipeline from scraped websites and PDFs?",
      a: "Yes. That is exactly what SignalFoundry's ingestion does, turning web pages and PDF documents into structured data that downstream agents rely on.",
    },
    {
      q: "Batch or streaming for our data?",
      a: "Most reporting needs are met by scheduled batch jobs, which are simpler to run and debug. I suggest streaming only when the business genuinely needs data within minutes.",
    },
    {
      q: "Which warehouse should we use?",
      a: "It depends on your cloud, volumes and who queries the data. Often PostgreSQL is enough for longer than people expect, and I will say plainly when it is time to move to a dedicated warehouse.",
    },
    {
      q: "How do you stop bad data reaching our dashboards?",
      a: "Validation at ingestion, row-count and freshness checks after each load, and alerts that fire when something looks wrong, so issues are caught before a report goes out.",
    },
    {
      q: "Can you clean up pipelines someone else built?",
      a: "Yes. I start by mapping what runs, when and from where, then fix the fragile steps first and document the whole flow as I go.",
    },
    {
      q: "Do you handle sensitive or personal data?",
      a: "Yes, with access limited to what each job needs and personal fields handled according to your policies. I sign an NDA before seeing any of it.",
    },
    {
      q: "How soon can you start?",
      a: "Typically within one to two weeks. Send a list of your sources and what you want out of them, and I will confirm availability the same day.",
    },
  ],
  ctaTitle: "Get your data *flowing and correct*",
  ctaBody:
    "List your data sources and the numbers you need from them. I will reply within 24 hours with an honest read on fit and where I would start.",
};

export default page;
