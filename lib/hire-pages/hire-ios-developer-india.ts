// TODO(owner): add real iOS projects and experience here; the proof below leans on transferable work.
import type { Service } from "../services";

const page: Service = {
  slug: "hire-ios-developer-india",
  seoTitle: "Hire an iOS Developer in India — Swift, SwiftUI | Devdeep",
  h1: "Hire an iOS Developer in India",
  role: "iOS Developer",
  headline: "Hire an iOS developer in India, *who sweats the Apple details*",
  description:
    "Hire a senior iOS developer in India for native Swift and SwiftUI iPhone and iPad apps, Objective-C codebases and App Store releases. Remote, direct.",
  keywords: [
    "hire ios developer india",
    "hire iphone app developer",
    "hire swift developer india",
    "remote ios developer for hire",
    "swiftui developer for hire",
  ],
  intro:
    "iPhone users notice when an app ignores the platform: a gesture that doesn't respond, text that won't scale, a sheet that dismisses the wrong way. I build native iOS apps in Swift that feel like they belong on the device, and I'm just as comfortable in the older Objective-C code many apps still depend on.",
  heroCta: "Hire me for your iOS app",
  chips: ["iOS", "Swift", "SwiftUI", "iPhone apps", "App Store", "Objective-C"],
  overview: {
    title: "How to hire an iOS developer in India",
    paragraphs: [
      "Good iOS work is mostly invisible. It is respecting safe areas and Dynamic Type, handling app lifecycle events correctly, asking for permissions with a clear reason and getting through App Store review without a rejection loop. The developer you hire should treat Apple's guidelines as a design input, not an obstacle.",
      "I write Objective-C in production: the native macOS capture layer of the Boomshare desktop app was built in Objective-C and C++. That means Apple frameworks, memory management and bridging between languages are familiar ground, and I bring the backend and cloud side of the product with me too.",
    ],
    gets: [
      "A native iPhone and iPad app in Swift, with SwiftUI where it fits",
      "Interfaces that follow Apple's Human Interface Guidelines and accessibility settings",
      "Confident work inside legacy Objective-C and mixed-language projects",
      "TestFlight builds and App Store submissions handled for you",
      "The API and cloud services behind the app, owned by the same person",
    ],
  },
  roleTitle: "What I do as your *iOS developer*",
  roleIntro: "The iPhone and iPad work you can hand to me, from Xcode project to App Store listing.",
  duties: [
    {
      icon: "layout",
      title: "SwiftUI screens",
      body: "Build native screens in SwiftUI, falling back to UIKit where a view needs finer control or older iOS support.",
    },
    {
      icon: "cube",
      title: "Clean structure",
      body: "Organise the app into testable modules with clear boundaries between views, state and networking code.",
    },
    {
      icon: "migrate",
      title: "Objective-C bridging",
      body: "Maintain legacy Objective-C code and move it to Swift gradually, without a risky full rewrite.",
    },
    {
      icon: "users",
      title: "Accessibility",
      body: "Support VoiceOver, Dynamic Type and reduced motion so the app works for every iPhone user.",
    },
    {
      icon: "shield",
      title: "Privacy and auth",
      body: "Store credentials in the Keychain, add Sign in with Apple and write clear privacy permission prompts.",
    },
    {
      icon: "link",
      title: "Apple frameworks",
      body: "Integrate push notifications, in-app purchases, camera and location through Apple's native frameworks.",
    },
    {
      icon: "server",
      title: "Backend services",
      body: "Build the Node.js or serverless AWS APIs the app relies on, with auth handled through Cognito.",
    },
    {
      icon: "review",
      title: "App Store review",
      body: "Prepare builds, metadata and review notes so submissions pass Apple's checks on the first attempt more often.",
    },
  ],
  whyTitle: "Why hire an iOS developer in India, *and why me*",
  whyIntro:
    "Working from India in IST, I can cover your morning or evening while staying in direct contact. What sets me apart is real Objective-C and native work alongside the product side.",
  why: [
    {
      icon: "code",
      title: "Native Apple code already shipped",
      body: "Boomshare's capture pipeline on macOS was written in Objective-C and C++, so Apple frameworks and low-level debugging are part of my toolkit.",
    },
    {
      icon: "sparkles",
      title: "Attention to detail",
      body: "I review my own work on a real device against Apple's guidelines before you see it, so polish isn't left for the end.",
    },
    {
      icon: "cloud",
      title: "App plus cloud",
      body: "I design serverless backends on AWS Lambda, DynamoDB and Cognito, so the iOS app and its services fit together from day one.",
    },
  ],
  steps: [
    {
      title: "Outline the iOS app",
      body: "Devices and minimum iOS version, key flows, designs, and whether there is an existing Xcode project.",
    },
    {
      title: "Discovery call",
      body: "30 minutes on scope, Apple-specific risks and timelines. A written view on fit follows within 24 hours.",
    },
    {
      title: "TestFlight trial",
      body: "One scoped feature delivered through TestFlight, so you judge it on your own iPhone.",
    },
    {
      title: "Project foundations",
      body: "Targets, signing, networking, auth and automated builds set up before the main backlog begins.",
    },
    {
      title: "Weekly TestFlight drops",
      body: "A fresh build every week with a written summary of what's new, what's fixed and what comes next.",
    },
  ],
  stack: [
    { category: "Languages", items: ["Swift", "Objective-C", "C++", "TypeScript"] },
    { category: "Apple UI", items: ["SwiftUI", "UIKit", "Xcode"] },
    { category: "Apple frameworks", items: ["Combine", "Core Data", "StoreKit", "Push notifications"] },
    { category: "Distribution", items: ["TestFlight", "App Store Connect"] },
    { category: "Back end", items: ["Node.js", "Express", "REST APIs"] },
    { category: "Cloud", items: ["AWS Lambda", "Cognito", "S3", "CloudFront"] },
    { category: "Databases", items: ["PostgreSQL", "DynamoDB", "Supabase"] },
    { category: "Payments", items: ["Stripe", "In-app purchases"] },
    { category: "Testing and CI", items: ["XCTest", "GitHub Actions", "CircleCI"] },
  ],
  faqs: [
    {
      q: "Do you build iOS apps in Swift or Objective-C?",
      a: "New code is Swift, usually with SwiftUI. I also work in existing Objective-C codebases and can migrate them to Swift one module at a time.",
    },
    {
      q: "Can you get our app through App Store review?",
      a: "I prepare builds, privacy details and reviewer notes with Apple's guidelines in mind and handle any feedback from review. Apple makes the final call, but careful preparation avoids most rejections.",
    },
    {
      q: "Whose Apple Developer account should the app live under?",
      a: "Yours. The app should be registered to your company's Apple Developer account, with me added as a team member, so the app, its listing and its reviews always belong to you.",
    },
    {
      q: "Can you support iPad as well as iPhone?",
      a: "Yes. I plan layouts that adapt to iPad screen sizes and multitasking from the start rather than stretching the phone layout.",
    },
    {
      q: "Can you add features to an iOS app another developer built?",
      a: "Yes. I begin by getting the project building and signing cleanly, then map the riskiest areas before changing anything.",
    },
    {
      q: "Do you have published iOS case studies?",
      a: "My published case studies are web, desktop and serverless products, including native Objective-C work on Boomshare. For iOS specifically, a TestFlight trial on your own app is the best evidence.",
    },
    {
      q: "When can you start?",
      a: "Typically within one to two weeks, and I'm happy to sign an NDA first. The code and IP are yours.",
    },
  ],
  ctaTitle: "Ship an iPhone app that *feels at home on iOS*",
  ctaBody:
    "Send me a short note about your iOS app. I'll reply within 24 hours with an honest take on fit and a first plan.",
};

export default page;
