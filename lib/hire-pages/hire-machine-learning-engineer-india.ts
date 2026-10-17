// TODO(owner): add real machine learning / MLOps projects and experience here; the proof below leans on transferable work.
import type { Service } from "../services";

const page: Service = {
  slug: "hire-machine-learning-engineer-india",
  seoTitle: "Hire a Machine Learning Engineer in India — MLOps | Devdeep",
  h1: "Hire a Machine Learning Engineer in India",
  role: "Machine Learning Engineer",
  headline:
    "Hire a machine learning engineer in India, *from evaluation to deployment*",
  description:
    "Hire a machine learning engineer in India to deploy, evaluate and monitor ML models and LLMs, with MLOps pipelines, model serving and quality checks built in.",
  keywords: [
    "hire machine learning engineer india",
    "hire ml engineer india",
    "mlops engineer for hire",
    "remote machine learning engineer india",
    "model deployment engineer india",
  ],
  intro:
    "Training a model is the start of the job, not the end. I build the evaluation, serving, deployment and monitoring that let a model run reliably for real users, and I make its quality something you can measure rather than hope for.",
  heroCta: "Hire me to take your model live",
  chips: ["MLOps", "Model deployment", "Model evaluation", "PyTorch", "LLM fine-tuning", "Docker"],
  overview: {
    title: "How to hire a machine learning engineer in India",
    paragraphs: [
      "The gap between a promising model and a dependable feature is mostly engineering. Versioned data and models, an evaluation set that reflects real usage, serving that meets your latency target, a safe way to roll back and monitoring that notices when inputs drift away from what the model was trained on.",
      "That production discipline is what I bring. Verity, a QA platform I built on Lambda, Step Functions and DynamoDB, is tested to 92% coverage and scores the confidence of every AI finding before reporting it. I apply the same standard to ML systems: nothing goes live without an evaluation that can fail.",
    ],
    gets: [
      "An evaluation suite that measures quality on cases that matter to you",
      "Reproducible training and versioned models you can roll back",
      "Model serving sized for your latency and traffic",
      "Deployment through CI, with checks that block a worse model",
      "Monitoring for drift, errors and quality after launch",
    ],
  },
  roleTitle: "What I do as your *machine learning engineer*",
  roleIntro:
    "The work between a trained model and a feature your users rely on, handled end to end.",
  duties: [
    {
      icon: "flask",
      title: "Evaluation suites",
      body: "Build test sets and metrics that reflect real usage, so every model change is judged on evidence.",
    },
    {
      icon: "server",
      title: "Model serving",
      body: "Expose models through fast, versioned APIs in containers or serverless functions sized for your traffic.",
    },
    {
      icon: "loop",
      title: "Training pipelines",
      body: "Make training reproducible, with tracked data, parameters and artefacts for every model version.",
    },
    {
      icon: "workflow",
      title: "MLOps automation",
      body: "Wire training, evaluation and release into CI so better models ship and worse ones are blocked.",
    },
    {
      icon: "sparkles",
      title: "LLM tuning",
      body: "Fine-tune or prompt-tune language models and compare them against a baseline on your own tasks.",
    },
    {
      icon: "chart",
      title: "Drift monitoring",
      body: "Track input distributions, prediction quality and errors so degradation is spotted before users complain.",
    },
    {
      icon: "gauge",
      title: "Inference performance",
      body: "Cut latency and compute with batching, caching, quantisation and choosing the right model size.",
    },
    {
      icon: "database",
      title: "Feature pipelines",
      body: "Build the feature and embedding pipelines that keep training and serving data consistent.",
    },
  ],
  whyTitle: "Why hire a machine learning engineer in India, *and why me*",
  whyIntro:
    "Machine learning in production fails in software ways: bad deploys, silent data changes, missing tests. I treat a model as software that has to earn its release.",
  why: [
    {
      icon: "review",
      title: "Quality you can measure",
      body: "Verity scores the confidence of each AI finding and reports a bug only with evidence, backed by 92% test coverage.",
    },
    {
      icon: "cloud",
      title: "Production infrastructure",
      body: "I have shipped serverless systems on Lambda, Step Functions and DynamoDB, and containerised services with Docker across AWS, Azure and Google Cloud.",
    },
    {
      icon: "cube",
      title: "Architecture ownership",
      body: "At Capital Compute I designed complete project architectures end to end and led a team of five, so the ML system fits the whole product.",
    },
  ],
  steps: [
    {
      title: "Share the model",
      body: "What it predicts or generates, how it was trained and where it needs to run.",
    },
    {
      title: "Readiness review",
      body: "A 30-minute call on evaluation, latency targets and the risks between today and launch.",
    },
    {
      title: "Evaluation first",
      body: "Build the test set and metrics before any deployment work, so we agree on what good looks like.",
    },
    {
      title: "Serve and automate",
      body: "Package, deploy and wire the model into CI with gates that compare each version to the last.",
    },
    {
      title: "Watch it live",
      body: "Monitor drift, quality and cost after launch, and retrain or tune when the numbers move.",
    },
  ],
  stack: [
    { category: "Languages", items: ["Python", "TypeScript", "SQL", "C++"] },
    { category: "ML frameworks", items: ["PyTorch", "scikit-learn", "Hugging Face"] },
    {
      category: "LLMs",
      items: ["Fine-tuning", "Embeddings", "LangChain", "RAG", "Evaluation sets"],
    },
    { category: "MLOps", items: ["MLflow", "Model registry", "Experiment tracking"] },
    {
      category: "Serving",
      items: ["Docker", "REST APIs", "AWS Lambda", "Batch inference"],
    },
    {
      category: "Cloud",
      items: ["AWS", "Step Functions", "S3", "Azure", "Google Cloud"],
    },
    { category: "Data", items: ["PostgreSQL", "DynamoDB", "MongoDB"] },
    { category: "CI/CD", items: ["GitHub Actions", "CircleCI", "Git"] },
    { category: "Testing", items: ["pytest", "Jest", "Playwright"] },
  ],
  faqs: [
    {
      q: "How is this different from hiring an AI developer?",
      a: "An AI developer builds LLM apps and agents. A machine learning engineer focuses on getting models evaluated, deployed and monitored reliably, whether they are classic ML models or fine-tuned LLMs.",
    },
    {
      q: "Our data scientists built a model. Can you put it into production?",
      a: "Yes, that is the core of the role. I package it, build an evaluation around it, deploy it behind an API or batch job and add monitoring.",
    },
    {
      q: "How do you know a new model is actually better?",
      a: "Every version runs against the same evaluation set before release, and the pipeline blocks it if key metrics get worse.",
    },
    {
      q: "Should we fine-tune an LLM or use prompting and retrieval?",
      a: "Start with prompting and retrieval, which are quicker to change. Fine-tuning earns its place when you have good examples and a measurable gap the baseline cannot close.",
    },
    {
      q: "Do you need GPUs to serve our model?",
      a: "Not always. Many models run well on CPUs with batching or a smaller variant, and I measure before recommending heavier infrastructure.",
    },
    {
      q: "Can you work with our existing cloud and tools?",
      a: "Yes. I have worked on AWS, Azure and Google Cloud and fit into your repo, CI and deployment process rather than bringing a new one.",
    },
    {
      q: "How quickly can you start?",
      a: "Typically within one to two weeks. Send a short note on the model and where it needs to run, and I will confirm the same day.",
    },
  ],
  ctaTitle: "Put your model *in front of real users*",
  ctaBody:
    "Tell me about the model and where it needs to run. I will reply within 24 hours with an honest read on readiness and a first plan.",
};

export default page;
