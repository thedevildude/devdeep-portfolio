// TODO(owner): add real Java and Spring Boot projects and experience here; the proof below leans on transferable work.
import type { Service } from "../services";

const page: Service = {
  slug: "hire-java-developer-india",
  seoTitle: "Hire a Java Developer in India — Senior, Remote | Devdeep",
  h1: "Hire a Java Developer in India",
  role: "Java Developer",
  headline: "Hire a Java developer in India, *for enterprise code that lasts*",
  description:
    "Hire a senior Java developer in India for Spring Boot services, enterprise integrations and careful modernisation of long-lived Java systems. Remote, direct.",
  keywords: [
    "hire java developer india",
    "hire spring boot developer india",
    "remote java developer india",
    "senior java engineer for hire",
    "java backend developer india",
  ],
  intro:
    "Java systems tend to run a business for a decade or more, so the code has to be readable by people who have not joined yet. I build and maintain Spring Boot services with clear module boundaries, honest tests and integrations that respect the systems around them.",
  heroCta: "Hire me for your Java services",
  chips: ["Java", "Spring Boot", "Microservices", "Hibernate", "JUnit", "Kafka"],
  overview: {
    title: "How to hire a Java developer in India",
    paragraphs: [
      "Most Java work is not greenfield. It is a Spring application with years of history, a database other teams depend on and integrations nobody wants to touch. The right hire can add features to that system without making the next change harder, and knows when a refactor is worth it and when it is not.",
      "I have designed complete project architectures end to end at Capital Compute, led a team of five and integrated enterprise platforms like Salesforce and Microsoft Graph for multi-tenant products. When you hire me directly, you get that architectural judgement applied to your Java estate, with one person accountable for it.",
    ],
    gets: [
      "Spring Boot services with clear layers and well-named packages",
      "Transactions, connection pools and caching configured on purpose",
      "Integration tests that run against a real database, not only mocks",
      "Upgrade paths across Java and Spring versions planned in stages",
      "Architecture notes your platform and security teams can review",
    ],
  },
  roleTitle: "What I do as your *Java developer*",
  roleIntro: "The Java and Spring work I own from design through release.",
  duties: [
    {
      icon: "server",
      title: "Spring Boot services",
      body: "Build REST services with Spring Boot, using validation, exception handlers and profiles consistently across modules.",
    },
    {
      icon: "database",
      title: "JPA and Hibernate",
      body: "Map entities carefully, control fetch strategies and keep lazy loading from turning into hundreds of queries.",
    },
    {
      icon: "cube",
      title: "Service boundaries",
      body: "Split a monolith only where it helps, with clear contracts between modules or separate deployable services.",
    },
    {
      icon: "workflow",
      title: "Messaging and events",
      body: "Connect services through Kafka or message queues with consumers that handle duplicates and ordering correctly.",
    },
    {
      icon: "link",
      title: "Enterprise integrations",
      body: "Connect Java services to CRMs, identity providers and partner APIs with timeouts, retries and audit trails.",
    },
    {
      icon: "shield",
      title: "Spring Security",
      body: "Set up authentication, role-based authorisation and tenant checks that are tested, not assumed.",
    },
    {
      icon: "migrate",
      title: "Version upgrades",
      body: "Move older Java and Spring Boot versions forward in safe steps, fixing deprecations as they surface.",
    },
    {
      icon: "flask",
      title: "Test coverage",
      body: "Write JUnit and integration tests around the business rules so refactoring stops being a gamble.",
    },
  ],
  whyTitle: "Why hire a Java developer in India, *and why me*",
  whyIntro:
    "Enterprise teams need a Java developer who thinks about the whole system and communicates clearly with everyone who depends on it.",
  why: [
    {
      icon: "cube",
      title: "Architecture, not just tickets",
      body: "At Capital Compute I designed full project architectures end to end and grew from intern to SDE II within a year.",
    },
    {
      icon: "link",
      title: "Enterprise systems connected",
      body: "PEOS pulls Microsoft Graph email and calendar data and Salesforce records into one Action Hub for each private equity deal team.",
    },
    {
      icon: "users",
      title: "A lead who raises the bar",
      body: "I have led a team of five, mentored freshers and interviewed candidates, so I review code with the whole team's growth in mind.",
    },
  ],
  steps: [
    {
      title: "Describe the estate",
      body: "Your Java and Spring versions, services, databases and the change you need most.",
    },
    {
      title: "Architecture walkthrough",
      body: "A 30-minute call on modules, integrations and constraints, with a written answer on fit within 24 hours.",
    },
    {
      title: "One scoped change",
      body: "A real endpoint, bug or upgrade step first, so you can review my Java in your own repository.",
    },
    {
      title: "Map the codebase",
      body: "I build it locally, trace the main request paths and write down risks before larger changes.",
    },
    {
      title: "Release in increments",
      body: "Small pull requests with tests and migration notes, demoed every week to the people who care.",
    },
  ],
  stack: [
    { category: "Languages", items: ["Java", "SQL", "TypeScript"] },
    { category: "Frameworks", items: ["Spring Boot", "Spring Data JPA", "Spring Security", "Hibernate"] },
    { category: "Build", items: ["Maven", "Gradle"] },
    { category: "Messaging", items: ["Kafka", "REST", "Webhooks"] },
    { category: "Databases", items: ["PostgreSQL", "MongoDB", "DynamoDB"] },
    { category: "Testing", items: ["JUnit", "Mockito", "Playwright"] },
    { category: "Cloud", items: ["AWS", "Azure", "Google Cloud"] },
    { category: "Integrations", items: ["Salesforce", "Microsoft Graph", "Stripe"] },
    { category: "Delivery", items: ["Docker", "Git", "GitHub Actions", "CircleCI"] },
  ],
  faqs: [
    {
      q: "Can you work on a large, older Spring application?",
      a: "Yes. I start by building it locally and tracing the main flows, then make changes in small steps with tests around anything I touch.",
    },
    {
      q: "Should we break our Java monolith into microservices?",
      a: "Often not all at once. I usually recommend firming up module boundaries inside the monolith first and extracting a service only where scaling or team ownership clearly needs it.",
    },
    {
      q: "Can you upgrade us to a newer Java and Spring Boot version?",
      a: "Yes. I plan the upgrade in stages, fix deprecations and dependency conflicts along the way and keep the application releasable at every step.",
    },
    {
      q: "Do you work with Maven or Gradle?",
      a: "Both. I will follow whichever your build already uses and keep dependency versions tidy and reproducible.",
    },
    {
      q: "Can you integrate our Java services with Salesforce or Microsoft 365?",
      a: "Yes. I have built Salesforce and Microsoft Graph integrations in production for a multi-tenant product, and the same patterns apply from a Java service.",
    },
    {
      q: "Will you follow our security and compliance process?",
      a: "Yes. I sign an NDA, work inside your access controls and review process, and the code and IP belong to you.",
    },
    {
      q: "How quickly can you join our Java team?",
      a: "Typically within one to two weeks, and we can begin with a scoped trial task before a longer engagement.",
    },
  ],
  ctaTitle: "Bring a senior Java developer *into your platform*",
  ctaBody:
    "Tell me about your Java services and the change that matters most. I will reply within 24 hours with an honest view on fit and a first step.",
};

export default page;
