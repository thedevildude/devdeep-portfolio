// TODO(owner): add real PHP projects and experience here; the proof below leans on transferable work.
import type { Service } from "../services";

const page: Service = {
  slug: "hire-php-developer-india",
  seoTitle: "Hire a PHP Developer in India — Senior, Remote | Devdeep",
  h1: "Hire a PHP Developer in India",
  role: "PHP Developer",
  headline: "Hire a PHP developer in India, *to make old code safe again*",
  description:
    "Hire a senior PHP developer in India to modernise legacy PHP, upgrade to PHP 8, add tests and untangle fragile code without a risky rewrite. Remote and direct.",
  keywords: [
    "hire php developer india",
    "senior php developer for hire",
    "remote php developer india",
    "legacy php modernisation",
    "php 8 upgrade developer",
  ],
  intro:
    "A lot of profitable software runs on PHP that nobody wants to touch. I modernise it in place: typed PHP 8 code, Composer-managed dependencies, tests around the risky paths and a clear plan for every change, so your team can ship again without fear.",
  heroCta: "Hire me for your PHP codebase",
  chips: ["PHP 8", "Legacy PHP", "Composer", "PHPUnit", "MySQL", "PHP upgrade"],
  overview: {
    title: "How to hire a PHP developer in India",
    paragraphs: [
      "Most PHP hiring is not about greenfield work. It is about a codebase that has grown for ten years, runs on an old PHP version, mixes SQL into templates and has no tests. The developer you need has to read that code patiently and improve it without breaking the business that depends on it.",
      "I bring the habits that make that work safe: designing architectures end to end at Capital Compute, leading a team of five and shipping production systems with Stripe billing and Salesforce and Microsoft Graph integrations. Working with me means one senior engineer plans the modernisation, writes the code and explains every step.",
    ],
    gets: [
      "A written map of how your PHP application actually works today",
      "A staged path to a supported PHP 8 version, not a big-bang rewrite",
      "Tests around the code paths that earn you money",
      "Security fixes for injection, sessions and outdated packages",
      "Cleaner code that new PHP hires can understand in days",
    ],
  },
  roleTitle: "What I do as your *PHP developer*",
  roleIntro: "The PHP modernisation and maintenance work you can hand to me in full.",
  duties: [
    {
      icon: "search",
      title: "Codebase audit",
      body: "Read the application end to end and document risky areas, dead code and hidden dependencies.",
    },
    {
      icon: "migrate",
      title: "Version upgrades",
      body: "Move PHP 5 and 7 code to PHP 8 step by step, fixing deprecations as each layer passes tests.",
    },
    {
      icon: "flask",
      title: "Characterisation tests",
      body: "Pin down current behaviour with PHPUnit before refactoring, so every change is checked against reality.",
    },
    {
      icon: "cube",
      title: "Composer adoption",
      body: "Replace copied-in libraries with Composer packages, PSR-4 autoloading and pinned, auditable versions.",
    },
    {
      icon: "code",
      title: "Gradual refactoring",
      body: "Pull business logic out of templates into typed classes, one module at a time, behind the same URLs.",
    },
    {
      icon: "shield",
      title: "Security hardening",
      body: "Close SQL injection, XSS and weak session handling with prepared statements, escaping and modern password hashing.",
    },
    {
      icon: "database",
      title: "MySQL tuning",
      body: "Find slow queries, add missing indexes and tidy schemas that have drifted over years of quick fixes.",
    },
    {
      icon: "cloud",
      title: "Modern deployment",
      body: "Containerise the app with Docker and add CI checks so releases stop depending on one server and FTP.",
    },
  ],
  whyTitle: "Why hire a PHP developer in India, *and why me*",
  whyIntro:
    "Legacy work needs judgement more than speed. I bring architectural experience and a careful, documented way of changing systems that are already in production.",
  why: [
    {
      icon: "workflow",
      title: "Architecture, end to end",
      body: "At Capital Compute I designed complete project architectures for global clients, so I know how to plan a target design and the steps that get you there.",
    },
    {
      icon: "link",
      title: "Integrations that hold",
      body: "I have shipped Stripe usage billing in Boomshare and Salesforce and Microsoft Graph sync in PEOS, the kind of connections legacy PHP apps often depend on.",
    },
    {
      icon: "users",
      title: "Leaves the team stronger",
      body: "I have led a team of five and mentored freshers, so modernisation comes with written notes and reviews your developers can learn from.",
    },
  ],
  steps: [
    {
      title: "Share the codebase story",
      body: "The PHP version, hosting, frameworks if any, and the part of the code everyone avoids touching.",
    },
    {
      title: "Code walkthrough call",
      body: "Thirty minutes reading the code with you, then a written fit answer and first impressions within 24 hours.",
    },
    {
      title: "Scoped audit as trial",
      body: "A short audit with a prioritised modernisation plan, or one contained fix, so you can judge my reasoning.",
    },
    {
      title: "Safety net first",
      body: "Version control, a staging copy and characterisation tests go in before any significant change.",
    },
    {
      title: "Modernise in small steps",
      body: "Reviewed pull requests each week, each one deployable on its own, with a demo and written summary.",
    },
  ],
  stack: [
    { category: "Language", items: ["PHP 8", "PHP 7", "SQL", "JavaScript", "TypeScript"] },
    { category: "Frameworks", items: ["Laravel", "Symfony", "Plain PHP"] },
    { category: "Packages and standards", items: ["Composer", "PSR-4", "PSR-12"] },
    { category: "Testing and quality", items: ["PHPUnit", "PHPStan", "Playwright"] },
    { category: "Databases", items: ["MySQL", "MariaDB", "PostgreSQL"] },
    { category: "Servers", items: ["Nginx", "Apache", "PHP-FPM"] },
    { category: "Integrations", items: ["Stripe", "Salesforce", "Microsoft Graph", "GoHighLevel"] },
    { category: "Cloud and DevOps", items: ["Docker", "AWS", "Git", "GitHub Actions"] },
  ],
  faqs: [
    {
      q: "Should we rewrite our old PHP app or modernise it?",
      a: "Usually modernise. A rewrite throws away years of handled edge cases, so I prefer upgrading in place behind tests and replacing modules only where the old code truly blocks you.",
    },
    {
      q: "Can you upgrade us from PHP 5 or 7 to PHP 8?",
      a: "Yes. I upgrade in stages, run static analysis to catch breaking changes, fix deprecations layer by layer and verify each stage on staging before it reaches production.",
    },
    {
      q: "Our code has no tests. Where do you start?",
      a: "With characterisation tests that record what the code does today, starting with checkout, login and anything else that earns or protects money.",
    },
    {
      q: "Do you work in plain PHP or only frameworks?",
      a: "Both. Many legacy apps are plain PHP, and I can introduce structure gradually, or move parts into Laravel or Symfony when that makes the code easier to own.",
    },
    {
      q: "Can you fix security issues in our PHP application?",
      a: "Yes. I review for injection, cross-site scripting, weak password storage and outdated packages, then fix them in priority order with notes on each change.",
    },
    {
      q: "Will you work alongside our existing PHP developers?",
      a: "Yes. I follow your conventions, review their pull requests and document decisions so the improvements outlast my involvement.",
    },
    {
      q: "Who owns the code and do you sign NDAs?",
      a: "You own everything I write. I sign an NDA before seeing your codebase.",
    },
  ],
  ctaTitle: "Turn your PHP codebase into something *your team trusts again*",
  ctaBody:
    "Tell me about the application and what worries you most about it. I will reply within 24 hours with an honest view on fit and a first step.",
};

export default page;
