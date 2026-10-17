// TODO(owner): add real QA and test automation projects and experience here; the proof below leans on transferable work.
import type { Service } from "../services";

const page: Service = {
  slug: "hire-qa-engineer-india",
  seoTitle: "Hire a QA Engineer in India — Test Automation | Devdeep",
  h1: "Hire a QA Engineer in India",
  role: "QA Engineer",
  headline: "Hire a QA engineer in India, *who reports bugs with evidence*",
  description:
    "Hire a QA engineer in India for Playwright end-to-end tests, Jest unit and integration suites, CI test gates and bug reports with steps, logs and screenshots.",
  keywords: [
    "hire qa engineer india",
    "hire test automation engineer india",
    "playwright automation engineer for hire",
    "remote qa engineer india",
    "hire sdet india",
  ],
  intro:
    "I build test suites that developers trust and bug reports that developers can act on. I built Verity, a QA platform that only reports a bug when it can prove it, and I bring that same standard of evidence to your product.",
  heroCta: "Hire me to test your product",
  chips: [
    "Test automation",
    "Playwright",
    "Jest",
    "E2E testing",
    "Regression testing",
    "SDET",
  ],
  overview: {
    title: "How to hire a QA engineer in India",
    paragraphs: [
      'Bad QA looks busy. Hundreds of flaky tests that everyone reruns until they pass, and bug tickets that say "it doesn\'t work" with no steps to reproduce. Good QA is quieter: a focused suite that fails only when something is really broken, and reports that show exactly what happened.',
      "Verity is my clearest proof. It is a serverless QA platform built on Lambda, DynamoDB, Step Functions and Playwright, tested to 92% coverage. An AI jury scores confidence and deduplicates findings by fingerprint, so a bug is reported only with evidence. I apply the same thinking when I own testing on your product.",
    ],
    gets: [
      "End-to-end tests for the journeys that would hurt most if they broke",
      "Unit and integration tests that run in seconds, not minutes",
      "A CI gate that blocks a merge when a real regression appears",
      "Bug reports with steps, expected and actual results, logs and screenshots",
      "Flaky tests found, fixed or removed instead of retried forever",
    ],
  },
  roleTitle: "What I do as your *QA engineer*",
  roleIntro:
    "The quality work you can hand to me, from a test plan to a suite that guards every release.",
  duties: [
    {
      icon: "layout",
      title: "Playwright E2E",
      body: "Automate critical user journeys across Chromium, Firefox and WebKit with stable, readable Playwright tests.",
    },
    {
      icon: "flask",
      title: "Unit and integration",
      body: "Write Jest suites around business logic and APIs so regressions surface before code reaches review.",
    },
    {
      icon: "loop",
      title: "CI test gates",
      body: "Run the right tests on every pull request in GitHub Actions or CircleCI and block risky merges.",
    },
    {
      icon: "search",
      title: "Exploratory testing",
      body: "Probe new features by hand for edge cases, odd inputs and confusing flows that scripts would miss.",
    },
    {
      icon: "review",
      title: "Evidence-based reports",
      body: "File bugs with exact reproduction steps, environment details, logs, traces and screenshots attached.",
    },
    {
      icon: "gauge",
      title: "Flaky test triage",
      body: "Track down timing issues and shared state behind intermittent failures, then fix the root cause.",
    },
    {
      icon: "link",
      title: "API testing",
      body: "Check request and response contracts, error cases and auth rules for every endpoint your product depends on.",
    },
    {
      icon: "pen",
      title: "Test strategy",
      body: "Write a plain test plan that says what is covered, what is not and why, matched to your risk.",
    },
  ],
  whyTitle: "Why hire a QA engineer in India, *and why me*",
  whyIntro:
    "Most QA engineers test products. I have also built a QA product, which changes how I think about signal, noise and proof.",
  why: [
    {
      icon: "shield",
      title: "Built a QA platform",
      body: "Verity reports a bug only with evidence, using an AI jury with confidence scoring and fingerprint deduplication to cut false alarms.",
    },
    {
      icon: "chart",
      title: "92% coverage, held",
      body: "Verity itself is tested to 92% coverage and ships through a GitHub workflows pipeline, so I know what a sustainable suite looks like.",
    },
    {
      icon: "code",
      title: "A developer who tests",
      body: "I write production code in TypeScript, React and Node.js, so my tests fit your codebase and my bug reports point at the likely cause.",
    },
  ],
  steps: [
    {
      title: "Tell me what scares you",
      body: "The flows that must never break, how you test today and where bugs keep slipping through.",
    },
    {
      title: "Risk walkthrough",
      body: "A 30-minute call to rank your journeys by risk and agree what the first tests should protect.",
    },
    {
      title: "First critical journey",
      body: "One high-value flow automated and running in CI, so you can judge the tests and the reports.",
    },
    {
      title: "Grow the suite",
      body: "Add coverage in order of risk, fix flaky tests as they appear and wire gates into every pull request.",
    },
    {
      title: "Hand over the playbook",
      body: "A written test strategy and conventions, so your developers can keep adding tests in the same style.",
    },
  ],
  stack: [
    {
      category: "End-to-end",
      items: ["Playwright", "Cross-browser testing", "Visual checks"],
    },
    {
      category: "Unit and integration",
      items: ["Jest", "React Testing Library", "Supertest"],
    },
    {
      category: "API testing",
      items: ["REST APIs", "Contract tests", "Postman"],
    },
    { category: "CI", items: ["GitHub Actions", "CircleCI", "Docker"] },
    { category: "Languages", items: ["TypeScript", "JavaScript", "SQL"] },
    {
      category: "Apps under test",
      items: ["React", "Next.js", "Node.js", "Electron", "React Native"],
    },
    {
      category: "Cloud",
      items: ["AWS Lambda", "Step Functions", "DynamoDB", "Cognito"],
    },
    {
      category: "Reporting",
      items: ["Traces", "Screenshots", "Test reports", "Coverage"],
    },
  ],
  faqs: [
    {
      q: "Do you do manual testing or only automation?",
      a: "Both. Automation guards the journeys that must never break, and focused manual testing finds the edge cases scripts would never think to try.",
    },
    {
      q: "Why Playwright for end-to-end tests?",
      a: "It runs across Chromium, Firefox and WebKit, waits for elements sensibly and records traces that make failures easy to debug. Verity is built on it.",
    },
    {
      q: "Our test suite is flaky. Can you fix it?",
      a: "Yes. I find the timing issues, shared state and brittle selectors behind the failures and fix the cause, rather than adding retries that hide real bugs.",
    },
    {
      q: "What coverage should we aim for?",
      a: "Coverage is a guide, not a goal. I focus on covering the paths that carry the most risk first, and Verity shows that high coverage is sustainable when tests are written well.",
    },
    {
      q: "What does one of your bug reports include?",
      a: "Exact steps to reproduce, expected and actual results, environment details and evidence such as logs, traces or screenshots, so a developer can start fixing straight away.",
    },
    {
      q: "Can you test mobile and desktop apps too?",
      a: "Yes. I have built React Native and Electron apps, so I know how to test them, though web apps with Playwright are where automation pays off fastest.",
    },
    {
      q: "How quickly can you start?",
      a: "Typically within one to two weeks. Send the flows you most need protected and I will confirm availability the same day.",
    },
  ],
  ctaTitle: "Ship with tests *you can believe*",
  ctaBody:
    "Tell me which parts of your product must never break. I will reply within 24 hours with an honest read on fit and the first journeys I would cover.",
};

export default page;
