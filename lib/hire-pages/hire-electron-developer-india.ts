import type { Service } from "../services";

const page: Service = {
  slug: "hire-electron-developer-india",
  seoTitle: "Hire an Electron Developer in India — Desktop Apps | Devdeep",
  h1: "Hire an Electron Desktop App Developer in India",
  role: "Electron Desktop App Developer",
  headline: "Hire an Electron developer in India, *who goes native when needed*",
  description:
    "Hire a senior Electron desktop app developer in India for macOS, Windows and Linux apps, native C++ and Objective-C addons, and media pipelines. Remote.",
  keywords: [
    "hire electron developer india",
    "hire electron desktop app developer",
    "cross-platform desktop app developer",
    "electron js developer for hire",
    "hire desktop application developer india",
  ],
  intro:
    "I built Boomshare, a Loom-style screen recorder that runs on macOS, Windows and Linux from one Electron codebase. That meant native capture in C++ and Objective-C, real-time streaming with FFmpeg and exporting hour-long 4K recordings. If your desktop app has to do more than wrap a website, I can help.",
  heroCta: "Hire me for your desktop app",
  chips: ["Electron", "Desktop apps", "macOS", "Windows", "Linux", "C++"],
  overview: {
    title: "How to hire an Electron desktop app developer in India",
    paragraphs: [
      "Electron makes it easy to get a window on screen. The hard parts come later: talking to the operating system, keeping memory under control in a long-running process, handling permissions on each platform and moving heavy work out of the renderer.",
      "Those are the problems I solved on Boomshare, from native capture pipelines to non-linear video editing with GStreamer Editing Services. You hire me directly, and you get someone who has taken a demanding Electron app to production across three operating systems.",
    ],
    gets: [
      "One codebase for macOS, Windows and Linux, built with production experience",
      "Native addons in C++ and Objective-C when JavaScript isn't enough",
      "A clean split between main, preload and renderer processes",
      "Media, file and system work that stays fast in long sessions",
      "The web backend, accounts and billing behind the app, covered too",
    ],
  },
  roleTitle: "What I do as your *electron developer*",
  roleIntro: "The desktop work you can hand over to me, from window to operating system.",
  duties: [
    {
      icon: "cube",
      title: "App architecture",
      body: "Design the main, preload and renderer split with typed IPC so the app stays secure and maintainable.",
    },
    {
      icon: "code",
      title: "Native addons",
      body: "Write C++ and Objective-C modules for capture, devices and system APIs that Electron can't reach alone.",
    },
    {
      icon: "workflow",
      title: "Media pipelines",
      body: "Build recording, encoding and streaming with FFmpeg and GStreamer, including HLS and DASH output.",
    },
    {
      icon: "globe",
      title: "Cross-platform behaviour",
      body: "Handle permissions, file paths and quirks on macOS, Windows and Linux so the app behaves everywhere.",
    },
    {
      icon: "layout",
      title: "Desktop interfaces",
      body: "Build React interfaces that feel like proper desktop software, with shortcuts, menus and tray controls.",
    },
    {
      icon: "gauge",
      title: "Memory and speed",
      body: "Keep long-running sessions stable by moving heavy work off the renderer and profiling for leaks.",
    },
    {
      icon: "server",
      title: "Cloud backend",
      body: "Build the Node.js, Postgres and AWS services for sync, uploads, accounts and Stripe billing.",
    },
    {
      icon: "loop",
      title: "Builds and updates",
      body: "Set up CI that builds and packages the app for each platform on every release, without manual steps.",
    },
  ],
  whyTitle: "Why hire an Electron developer in India, *and why me*",
  whyIntro:
    "Few developers have taken an Electron app deep into native code and real-time media. That's the work I've already shipped.",
  why: [
    {
      icon: "sparkles",
      title: "Boomshare is the proof",
      body: "Screen capture, streaming, editing, AI transcription, dubbing and auto-zoom in one cross-platform app. The case study shows the real architecture.",
    },
    {
      icon: "code",
      title: "Comfortable below JavaScript",
      body: "C++, Objective-C and Rust are part of my toolkit, so a hard native problem is something I solve rather than work around.",
    },
    {
      icon: "shield",
      title: "Whole product ownership",
      body: "Desktop app, web app, backend and billing: I've built every layer of a desktop product, so nothing falls between hand-offs.",
    },
  ],
  steps: [
    {
      title: "Describe the app",
      body: "Target platforms, what the app has to do with the OS, and whether a codebase already exists.",
    },
    {
      title: "Technical call",
      body: "30 minutes on architecture and native needs. You get an honest answer on fit within 24 hours.",
    },
    {
      title: "Platform spike",
      body: "A trial that proves the riskiest native piece works on each target platform before full build.",
    },
    {
      title: "Build the core",
      body: "Process architecture, IPC, packaging and CI first, then features on top of a stable base.",
    },
    {
      title: "Release and refine",
      body: "Test builds for every platform each week, with written notes on fixes, changes and next steps.",
    },
  ],
  stack: [
    {
      category: "Languages",
      items: ["TypeScript", "JavaScript", "C++", "Objective-C", "Rust"],
    },
    { category: "Desktop", items: ["Electron", "Native addons", "macOS", "Windows", "Linux"] },
    {
      category: "Media",
      items: ["FFmpeg", "GStreamer", "GStreamer Editing Services", "HLS / DASH streaming"],
    },
    { category: "Interface", items: ["React", "Next.js", "Zustand", "Tailwind CSS"] },
    { category: "Back end", items: ["Node.js", "Express", "PostgreSQL", "Prisma"] },
    { category: "Cloud", items: ["AWS", "S3", "CloudFront"] },
    { category: "AI", items: ["Transcription", "Summarisation", "Dubbing", "Auto-zoom"] },
    { category: "Billing", items: ["Stripe usage-based billing"] },
    { category: "CI and testing", items: ["GitHub Actions", "CircleCI", "Jest", "Playwright"] },
  ],
  faqs: [
    {
      q: "Is Electron a good choice for my desktop app?",
      a: "It is when you want one codebase for macOS, Windows and Linux and a team that already knows web tech. If the app is mostly heavy native work, I'll tell you whether another approach fits better.",
    },
    {
      q: "Can you write native code for Electron?",
      a: "Yes. On Boomshare I wrote native addons in C++ and Objective-C for screen and audio capture, which is where many Electron projects get stuck.",
    },
    {
      q: "Aren't Electron apps slow and memory hungry?",
      a: "They can be when everything runs in the renderer. Moving heavy work into native modules or background processes and profiling for leaks keeps them responsive, even exporting hour-long 4K recordings.",
    },
    {
      q: "Can you take over an existing Electron app?",
      a: "Yes. I review the process architecture and security settings first, then fix the biggest stability and performance issues before adding features.",
    },
    {
      q: "Can you build the web backend and billing too?",
      a: "Yes. For Boomshare I built the Node.js and Next.js services on Postgres and AWS, plus Stripe usage-based billing.",
    },
    {
      q: "Do you handle video, audio or other media work?",
      a: "Yes. Real-time HLS and DASH streaming with FFmpeg just-in-time encoding and non-linear editing with GStreamer Editing Services are both things I've shipped.",
    },
    {
      q: "How quickly can you start?",
      a: "Typically within one to two weeks. Send a short brief and I'll confirm availability the same day.",
    },
  ],
  ctaTitle: "Ship your desktop app on *every platform*",
  ctaBody:
    "Send a short brief on what your app needs to do. I'll reply within 24 hours with an honest answer on fit and a first technical view.",
};

export default page;
