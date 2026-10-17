// TODO(owner): add real data science projects and experience here; the proof below leans on transferable work.
import type { Service } from "../services";

const page: Service = {
  slug: "hire-data-scientist-india",
  seoTitle: "Hire a Data Scientist in India — Senior, Remote | Devdeep",
  h1: "Hire a Data Scientist in India",
  role: "Data Scientist",
  headline: "Hire a data scientist in India, *whose models leave the notebook*",
  description:
    "Hire a data scientist in India for analysis, A/B experiments and predictive models that ship inside your product, not slides. Python, SQL, clear findings.",
  keywords: [
    "hire data scientist india",
    "remote data scientist for hire",
    "freelance data scientist india",
    "hire data analyst india",
    "predictive modeling consultant india",
  ],
  intro:
    "I turn your data into decisions and then into working software. That means honest analysis, experiments designed to give a clear answer, and models that run inside your product instead of stopping at a notebook.",
  heroCta: "Hire me for your data science work",
  chips: ["Data analysis", "Python", "A/B testing", "Predictive models", "SQL", "Statistics"],
  overview: {
    title: "How to hire a data scientist in India",
    paragraphs: [
      "Plenty of data science work ends as a chart in a deck that nobody acts on. The valuable kind starts from a business question, picks the simplest method that answers it, states its uncertainty plainly and ends with something the product or the team can use on Monday.",
      "I am a software engineer first, which shapes how I do this work. On Verity I designed confidence scoring and fingerprint deduplication so the system reports a bug only when the evidence holds up. The same habits apply to a churn model or an experiment readout: measure carefully, avoid fooling yourself and ship the result as working code.",
    ],
    gets: [
      "Analysis framed around a decision, not a pile of charts",
      "Experiments sized and designed before they start, so the result means something",
      "Models validated on held-out data and explained in plain language",
      "Production code for the model, not just a notebook handed over",
      "Clear statements of uncertainty, including when the data cannot answer the question",
    ],
  },
  roleTitle: "What I do as your *data scientist*",
  roleIntro:
    "From the first question to a model your product calls, this is the work I take on.",
  duties: [
    {
      icon: "search",
      title: "Exploratory analysis",
      body: "Dig into your data to find what drives retention, revenue or usage, and what is just noise.",
    },
    {
      icon: "flask",
      title: "Experiment design",
      body: "Plan A/B tests with the right metrics and sample sizes, then read them out without p-hacking.",
    },
    {
      icon: "chart",
      title: "Predictive models",
      body: "Build churn, scoring and forecasting models, starting simple and adding complexity only when it pays off.",
    },
    {
      icon: "gauge",
      title: "Metric definitions",
      body: "Agree one written definition for each key metric so teams stop arguing about whose number is right.",
    },
    {
      icon: "database",
      title: "SQL and features",
      body: "Write the queries and feature tables that models need, straight from your production databases.",
    },
    {
      icon: "sparkles",
      title: "Text and LLM analysis",
      body: "Classify, cluster and summarise support tickets, reviews and documents with language models where they help.",
    },
    {
      icon: "server",
      title: "Model deployment",
      body: "Wrap models in tested APIs or scheduled jobs so their output reaches users and internal tools.",
    },
    {
      icon: "pen",
      title: "Findings write-ups",
      body: "Write short, plain reports that state the answer, the confidence and the recommended next step.",
    },
  ],
  whyTitle: "Why hire a data scientist in India, *and why me*",
  whyIntro:
    "A model that never ships has no value. I bring the statistics and the engineering together, so the work ends up in front of users.",
  why: [
    {
      icon: "shield",
      title: "Evidence over guesswork",
      body: "Verity's AI jury scores its confidence and deduplicates findings by fingerprint, so it reports a bug only when the evidence supports it.",
    },
    {
      icon: "code",
      title: "Engineer and analyst",
      body: "I build the APIs, pipelines and interfaces around a model myself, so you do not need a second hire to put it into production.",
    },
    {
      icon: "users",
      title: "Clear with stakeholders",
      body: "Having led a team and mentored new engineers, I explain trade-offs and uncertainty in language that product and leadership can act on.",
    },
  ],
  steps: [
    {
      title: "Bring the question",
      body: "The decision you are trying to make, the data you have and what a useful answer would change.",
    },
    {
      title: "Scoping call",
      body: "30 minutes on whether the data can answer it, which method fits and what success looks like.",
    },
    {
      title: "First read",
      body: "A short exploratory analysis on your real data, so you see the shape of the answer early.",
    },
    {
      title: "Model or experiment",
      body: "Build and validate the model, or run the experiment, with weekly check-ins on what the numbers say.",
    },
    {
      title: "Ship and monitor",
      body: "Put the result into your product or reporting, and track whether it keeps performing as data shifts.",
    },
  ],
  stack: [
    { category: "Languages", items: ["Python", "SQL", "TypeScript"] },
    {
      category: "Analysis",
      items: ["pandas", "NumPy", "Jupyter", "Statistics", "A/B testing"],
    },
    { category: "Modelling", items: ["scikit-learn", "XGBoost", "PyTorch"] },
    {
      category: "Visualisation",
      items: ["Matplotlib", "Plotly", "Dashboards"],
    },
    {
      category: "LLMs",
      items: ["LangChain", "RAG", "Text classification", "Embeddings"],
    },
    {
      category: "Databases",
      items: ["PostgreSQL", "DynamoDB", "MongoDB", "Supabase"],
    },
    {
      category: "Deployment",
      items: ["Django", "Node.js", "AWS Lambda", "Docker"],
    },
    { category: "Cloud", items: ["AWS", "Azure", "Google Cloud"] },
  ],
  faqs: [
    {
      q: "Do we have enough data for data science to help?",
      a: "Often more than you think, but not always. I will check what you have in the first call and tell you plainly if the question needs more data or a simpler approach.",
    },
    {
      q: "Can you run and analyse our A/B tests?",
      a: "Yes. I help pick the metric, size the test before it starts and read the result honestly, including when it is inconclusive.",
    },
    {
      q: "Will the model actually go into our product?",
      a: "That is the goal from day one. I write the model as tested code and deploy it behind an API or a scheduled job your product can use.",
    },
    {
      q: "Do you use machine learning or simpler statistics?",
      a: "Whichever answers the question best. A well-chosen regression or a clear cohort analysis often beats a complex model, and it is easier to explain.",
    },
    {
      q: "Can you analyse text like reviews or support tickets?",
      a: "Yes. Language models are now good at classifying and summarising text at scale, and I pair them with checks so the output can be trusted.",
    },
    {
      q: "How do you share results?",
      a: "Short written reports and weekly demos, with the code and queries in your repo so anyone can reproduce the numbers.",
    },
    {
      q: "How quickly can you start?",
      a: "Typically within one to two weeks. Send the question you want answered and I will confirm availability the same day.",
    },
  ],
  ctaTitle: "Turn your data into *decisions that ship*",
  ctaBody:
    "Send the question you want your data to answer. I will reply within 24 hours with an honest view on feasibility and a first approach.",
};

export default page;
