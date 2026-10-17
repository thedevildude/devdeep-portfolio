// TODO(owner): add real Unity projects and experience here; the proof below leans on transferable work.
import type { Service } from "../services";

const page: Service = {
  slug: "hire-unity-developer-india",
  seoTitle: "Hire a Unity Developer in India — Games, 3D & AR | Devdeep",
  h1: "Hire a Unity Developer in India",
  role: "Unity Developer",
  headline: "Hire a Unity developer in India, *for games and interactive 3D*",
  description:
    "Hire a senior Unity developer in India for mobile games, AR experiences and interactive 3D apps in C#, with steady frame rates and a real backend. Remote.",
  keywords: [
    "hire unity developer india",
    "hire unity game developer",
    "unity 3d developer for hire",
    "hire ar developer india",
    "remote unity c# developer",
  ],
  intro:
    "A Unity project lives or dies by its frame rate. Whether it's a mobile game, an AR product viewer or an interactive 3D experience, I build in C# with performance targets set from the start, and I connect it to the accounts, data and cloud services it needs outside the engine.",
  heroCta: "Hire me for your Unity project",
  chips: ["Unity", "C#", "Game development", "AR", "Unity 3D", "Mobile games"],
  overview: {
    title: "How to hire a Unity developer in India",
    paragraphs: [
      "Unity makes it quick to get something moving on screen, which is exactly why many projects hit a wall later. Scripts grow into tangled MonoBehaviours, garbage collection causes stutter, draw calls pile up on mobile GPUs and the build size balloons. The right Unity hire treats architecture and profiling as part of the creative work.",
      "My background is in demanding real-time software. On Boomshare I worked on native C++ and Objective-C capture pipelines and real-time video streaming with FFmpeg, where every frame has a deadline. At Capital Compute I design complete architectures and ship apps to production for global clients. That discipline carries straight into Unity.",
    ],
    gets: [
      "Gameplay and interaction code in clean, testable C#",
      "Frame-rate and memory targets set early and profiled regularly",
      "AR features built on AR Foundation for both iOS and Android",
      "Native plugins in C++ or Objective-C when the engine needs to reach the device",
      "Accounts, saves, leaderboards and content delivery backed by a real server",
    ],
  },
  roleTitle: "What I do as your *Unity developer*",
  roleIntro: "The engine-side and server-side Unity work you can hand to me.",
  duties: [
    {
      icon: "cube",
      title: "Gameplay systems",
      body: "Build mechanics, input, cameras and game state in C# with ScriptableObjects and clear component boundaries.",
    },
    {
      icon: "globe",
      title: "AR experiences",
      body: "Create plane detection, image tracking and placement flows with AR Foundation for ARKit and ARCore.",
    },
    {
      icon: "layout",
      title: "Interactive 3D",
      body: "Build product configurators, visualisations and training scenes that respond instantly to touch.",
    },
    {
      icon: "gauge",
      title: "Frame-rate tuning",
      body: "Profile CPU, GPU and memory, cut draw calls and allocations, and keep a steady frame rate on mid-range phones.",
    },
    {
      icon: "code",
      title: "Native plugins",
      body: "Write C++ or Objective-C plugins when Unity needs device features or third-party SDKs it can't reach directly.",
    },
    {
      icon: "cloud",
      title: "Content delivery",
      body: "Stream levels and assets with Addressables from cloud storage so the install stays small.",
    },
    {
      icon: "server",
      title: "Game backend",
      body: "Build the APIs for accounts, cloud saves, leaderboards and purchases on Node.js and serverless AWS.",
    },
    {
      icon: "loop",
      title: "Build pipeline",
      body: "Automate iOS, Android and WebGL builds through CI so every playable version is one click away.",
    },
  ],
  whyTitle: "Why hire a Unity developer in India, *and why me*",
  whyIntro:
    "India has a fast-growing game and interactive media scene with strong Unity skills. I bring real-time engineering habits and the backend side that many Unity projects lack.",
  why: [
    {
      icon: "gauge",
      title: "Real-time is familiar",
      body: "Real-time HLS streaming and hour-long 4K exports on Boomshare taught me to think in frame deadlines, buffers and memory, which is daily work in Unity.",
    },
    {
      icon: "code",
      title: "Below the engine",
      body: "C++ and Objective-C are part of my production toolkit, so native plugins and platform-specific bugs don't stall the project.",
    },
    {
      icon: "server",
      title: "Outside the engine too",
      body: "Serverless AWS, DynamoDB and Stripe are things I've shipped in production, so player accounts, saves and payments are handled properly.",
    },
  ],
  steps: [
    {
      title: "Pitch the project",
      body: "Game or experience concept, target devices, art direction and any existing Unity project.",
    },
    {
      title: "Feasibility call",
      body: "30 minutes on scope, performance targets and risks, with a written view on fit within 24 hours.",
    },
    {
      title: "Playable trial",
      body: "A scoped trial that builds one core mechanic or AR interaction you can play on your own device.",
    },
    {
      title: "Set targets and structure",
      body: "Frame-rate targets, asset rules, scene organisation and automated builds agreed before production.",
    },
    {
      title: "Weekly playable builds",
      body: "A new build to play every week, with a written note on what was added, fixed and tuned.",
    },
  ],
  stack: [
    { category: "Languages", items: ["C#", "C++", "Objective-C", "TypeScript"] },
    { category: "Engine", items: ["Unity", "Universal Render Pipeline", "Shader Graph"] },
    { category: "AR", items: ["AR Foundation", "ARKit", "ARCore"] },
    { category: "Unity tooling", items: ["Addressables", "Input System", "Unity Profiler"] },
    { category: "Platforms", items: ["iOS", "Android", "WebGL"] },
    { category: "Back end", items: ["Node.js", "Express", "REST APIs"] },
    { category: "Cloud", items: ["AWS Lambda", "DynamoDB", "S3", "CloudFront"] },
    { category: "Payments", items: ["Stripe", "In-app purchases"] },
    { category: "CI and version control", items: ["Git", "GitHub Actions", "Unity Test Framework"] },
  ],
  faqs: [
    {
      q: "Do you build games, or other kinds of Unity apps too?",
      a: "Both. Alongside games, I build AR experiences, 3D product viewers and interactive training or visualisation apps in Unity.",
    },
    {
      q: "Can you build AR for both iPhone and Android?",
      a: "Yes. AR Foundation lets one Unity project use ARKit on iOS and ARCore on Android, with platform-specific tweaks where the two differ.",
    },
    {
      q: "Our Unity game stutters on phones. Can you fix it?",
      a: "Usually, yes. I profile on a real device first to find whether the time goes into scripts, rendering or memory, then fix the biggest causes one at a time.",
    },
    {
      q: "Do you create the 3D art as well?",
      a: "No. I'm the engineer: I work with your artists or purchased assets and set the import rules that keep them fast on mobile.",
    },
    {
      q: "Can you build the online side, like accounts and leaderboards?",
      a: "Yes. I build the backend on Node.js and serverless AWS, with player data in DynamoDB or PostgreSQL and purchases verified on the server.",
    },
    {
      q: "Where can I see your Unity work?",
      a: "My published case studies are in real-time media, serverless and AI products. A playable trial built on your concept is the best way to judge my Unity work.",
    },
    {
      q: "When can you start, and who owns the project?",
      a: "Typically within one to two weeks. I sign an NDA, and the project, code and IP are yours.",
    },
  ],
  ctaTitle: "Take your idea from sketch *to something playable*",
  ctaBody:
    "Send a short description of your game or 3D experience. I'll reply within 24 hours with an honest view on fit and a first plan.",
};

export default page;
