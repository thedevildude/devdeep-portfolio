// TODO(owner): add more real C++ projects and experience here; beyond the Boomshare native capture work, the proof below leans on transferable work.
import type { Service } from "../services";

const page: Service = {
  slug: "hire-cpp-developer-india",
  seoTitle: "Hire a C++ Developer in India — Senior, Remote | Devdeep",
  h1: "Hire a C++ Developer in India",
  role: "C++ Developer",
  headline: "Hire a C++ developer in India, *where every millisecond counts*",
  description:
    "Hire a senior C++ developer in India for performance-critical native code, media pipelines, cross-platform libraries and C++ bindings for Node.js and Rust.",
  keywords: [
    "hire c++ developer india",
    "c++ developer for hire",
    "remote c++ developer india",
    "senior c++ engineer india",
    "hire native code developer",
  ],
  intro:
    "C++ is what you reach for when a higher-level language runs out of headroom: frame-accurate media, tight memory limits or direct access to the operating system. I write modern C++ for those hot paths and expose it cleanly to the rest of your product, so the fast part does not become the part nobody dares to touch.",
  heroCta: "Hire me for your native code",
  chips: ["C++", "Modern C++", "CMake", "Native modules", "FFmpeg", "Performance optimisation"],
  overview: {
    title: "How to hire a C++ developer in India",
    paragraphs: [
      "C++ bugs are expensive. A dangling pointer can corrupt memory far from where it was freed, undefined behaviour can pass every test on one compiler and crash on another, and a careless copy in a loop can wipe out the speed you chose C++ for. The right hire writes code that is fast and also safe to change.",
      "On Boomshare I built native capture pipelines in C++ and Objective-C feeding FFmpeg for real-time HLS streaming and GStreamer for non-linear editing, with hour-long 4K exports at the end. I also write Rust. When you hire me directly, you get someone who has kept native code stable inside a shipping product, not only in a benchmark.",
    ],
    gets: [
      "Modern C++ with RAII and clear ownership instead of raw new and delete",
      "Profiling before optimising, with numbers for every change",
      "Builds that compile cleanly on macOS, Windows and Linux",
      "Sanitizer and unit test runs that catch memory errors early",
      "A small, documented interface between native code and the rest of the app",
    ],
  },
  roleTitle: "What I do as your *C++ developer*",
  roleIntro: "The native work I take on where performance or platform access matters.",
  duties: [
    {
      icon: "gauge",
      title: "Hot path tuning",
      body: "Profile CPU and memory, then remove copies, allocations and cache misses from the code that runs most.",
    },
    {
      icon: "loop",
      title: "Media pipelines",
      body: "Capture, encode and process audio and video in C++ with FFmpeg and GStreamer at real-time rates.",
    },
    {
      icon: "cube",
      title: "Platform APIs",
      body: "Call macOS, Windows and Linux system APIs from C++, with Objective-C where Apple frameworks require it.",
    },
    {
      icon: "link",
      title: "Language bindings",
      body: "Expose C++ libraries to Node.js through Node-API or to Rust through FFI with safe, narrow interfaces.",
    },
    {
      icon: "workflow",
      title: "Threads and concurrency",
      body: "Design producer and consumer threads, lock-free queues where justified, and shutdown that never hangs.",
    },
    {
      icon: "shield",
      title: "Memory safety",
      body: "Find leaks, races and undefined behaviour with AddressSanitizer, ThreadSanitizer and careful code review.",
    },
    {
      icon: "code",
      title: "Build systems",
      body: "Set up CMake builds and dependencies so the project compiles reproducibly on every target platform.",
    },
    {
      icon: "migrate",
      title: "Legacy modernisation",
      body: "Bring older C++ code forward to modern standards with smart pointers, tests and fewer macros.",
    },
  ],
  whyTitle: "Why hire a C++ developer in India, *and why me*",
  whyIntro:
    "Native work needs someone who understands both the machine and the product around it. I have done both in production.",
  why: [
    {
      icon: "loop",
      title: "Native capture that shipped",
      body: "Boomshare's screen and audio capture runs on native C++ and Objective-C pipelines, streaming HLS in real time through FFmpeg.",
    },
    {
      icon: "link",
      title: "Native meets the rest",
      body: "I connect C++ to Node.js and Electron through native addons, and I work across Rust, TypeScript and the backend that serves it.",
    },
    {
      icon: "review",
      title: "Careful by default",
      body: "Small, reviewed changes and written reasoning about ownership and threading, the same standard I held when leading a team of five.",
    },
  ],
  steps: [
    {
      title: "Describe the constraint",
      body: "The native code involved, target platforms and the limit you are hitting: speed, memory or access.",
    },
    {
      title: "Profiling conversation",
      body: "A 30-minute call on the codebase and measurements so far, with a written fit answer within 24 hours.",
    },
    {
      title: "Prove the risky part",
      body: "A focused trial on the hardest piece, such as one capture path or one optimisation, with numbers.",
    },
    {
      title: "Build on every target",
      body: "I get the project compiling on each platform you support and add sanitizer runs to CI.",
    },
    {
      title: "Measured iterations",
      body: "Small pull requests with benchmark results attached, demoed weekly with written notes.",
    },
  ],
  stack: [
    { category: "Languages", items: ["C++", "Objective-C", "Rust", "TypeScript"] },
    { category: "Standards", items: ["C++17", "C++20", "STL"] },
    { category: "Build and tooling", items: ["CMake", "Clang", "GCC", "MSVC"] },
    { category: "Media", items: ["FFmpeg", "GStreamer", "HLS streaming"] },
    { category: "Interop", items: ["Node-API", "Native addons", "Electron", "Rust FFI"] },
    { category: "Platforms", items: ["macOS", "Windows", "Linux"] },
    { category: "Debugging and profiling", items: ["AddressSanitizer", "ThreadSanitizer", "GDB", "LLDB"] },
    { category: "Testing", items: ["GoogleTest"] },
    { category: "Delivery", items: ["Git", "GitHub Actions", "CircleCI", "Docker"] },
  ],
  faqs: [
    {
      q: "Which C++ standard do you write?",
      a: "C++17 or C++20 for new code, depending on your compilers. In older codebases I follow the existing standard and modernise only where it pays off.",
    },
    {
      q: "Can you speed up a slow part of our application?",
      a: "Yes. I profile first to find where time actually goes, then fix that, and I show before-and-after numbers for each change.",
    },
    {
      q: "Can you write C++ that our Node.js or Electron app can call?",
      a: "Yes. I have built native addons that Boomshare's Electron app uses for capture, and I keep the boundary small so JavaScript developers can use it safely.",
    },
    {
      q: "Do you work with audio and video in C++?",
      a: "Yes. Boomshare uses native capture pipelines with FFmpeg for real-time HLS and GStreamer for editing, through to hour-long 4K exports.",
    },
    {
      q: "Should we rewrite this in Rust instead?",
      a: "Sometimes. I write both, and I will tell you honestly whether a rewrite pays off or whether hardening the existing C++ is the better move.",
    },
    {
      q: "Can you fix crashes we cannot reproduce?",
      a: "Often. I start with crash reports and sanitizer builds, since many hard-to-reproduce crashes come from races or memory errors those tools reveal.",
    },
    {
      q: "How do we start, and who owns the code?",
      a: "Usually with a scoped trial task within one to two weeks. I sign an NDA, and the code and IP belong to you.",
    },
  ],
  ctaTitle: "Make your native code *fast and stable*",
  ctaBody:
    "Tell me about the C++ code and the limit you are running into. I will reply within 24 hours with an honest answer on fit.",
};

export default page;
