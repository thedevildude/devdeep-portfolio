export const SITE = {
  name: "Devdeep",
  title: "Devdeep — Full Stack Software Engineer",
  description:
    "Senior full stack software engineer in India for hire. 3+ years building production apps with React, Next.js, TypeScript, AI and Blockchain.",
  url: "https://www.idevdeep.com",
} as const;

export const HOMEPAGE_METADATA = {
  title: "Hire a Senior Software Engineer in India — Devdeep",
  description:
    "Hire a senior full stack software engineer in India. 3+ years shipping production React, Next.js, TypeScript, AI and Blockchain products for startups.",
  keywords: [
    "Senior Full Stack Software Engineer",
    "Full Stack Software Engineer",
    "Software Engineer",
    "AI Engineer",
    "Forward Deployed Engineer",
    "Machine Learning Engineer",
    "Blockchain Engineer",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "JavaScript",
    "React",
    "Next.js",
    "Frontend Engineer",
  ],
} as const;

const EMAIL = process.env.NEXT_PUBLIC_EMAIL ?? "";

export const CONTACT = {
  email: EMAIL,
  emailHref: `mailto:${EMAIL}`,
  contactUs: `mailto:${EMAIL}?subject=Hello%20Devdeep`,
} as const;

export const LINKS = {
  linkedin: "https://www.linkedin.com/in/devdeep-ghosh-34774817a",
  github: "https://github.com/thedevildude",
  twitter: "https://x.com/the_devil_dude",
  resume:
    "https://drive.google.com/file/d/1pjt3MNcRZ8dbtJeMjj75JAOICRnUHOjr/view?usp=sharing",
} as const;

export const NAV_LINKS = [
  { label: "Work", href: "/#work" },
  { label: "Blog", href: "/blog" },
  { label: "LinkedIn", href: LINKS.linkedin, external: true },
  { label: "Resume", href: LINKS.resume, external: true },
  { label: "Contact", href: CONTACT.contactUs, external: true },
] as const;

export const PLACEHOLDER_IMAGE = "/placeholder.svg";
/**
 * Hero artworks; one is picked at random per visit. `center` is the starburst position as a
 * percentage of the image, `ratio` its pixel size, so the glow overlay stays on the star.
 */
export const HERO_IMAGES = [
  {
    src: "/hero-image2.png",
    width: 1672,
    height: 941,
    center: { x: 61.8, y: 48.9 },
  },
  {
    src: "/hero-image3.png",
    width: 1920,
    height: 1088,
    center: { x: 50, y: 50 },
  },
] as const;

/** Wrap text in **double asterisks** to highlight it in the Intro section. */
export const INTRO_POINTS = [
  {
    title: "Growth",
    text: "**SDE Intern to SDE II in under a year** at Capital Compute. I architect projects end to end, **lead teams**, and ship for **global clients**.",
  },
  {
    title: "Impact",
    text: "Contributed to **CARE** and **Ayushma** at Open Healthcare Network: tele-ICU software serving **200+ hospitals** across India.",
  },
  {
    title: "Range",
    text: "**3+ years** shipping **production systems**: mobile and desktop apps, serverless AWS, AI marketing engines, and open-source tools.",
  },
] as const;

export const NAME = {
  hindi: "देवदीप घोष",
  english: "Devdeep",
} as const;

export const BRANDS = [
  { name: "Capital Compute", logo: "/capital-compute-logo.png" },
  { name: "Boom", logo: "/boom-logo.png" },
  { name: "Open Healthcare Network", logo: "/ohc-logo.png" },
  { name: "eGov Foundation", logo: "/e-gov-foundation-logo.png" },
] as const;

export const DEEP_DIVES = {
  title: "Deep Dives",
  subtitle:
    "A closer look at the systems I have architected, led, and shipped.",
} as const;

/**
 * Shell data only: each work's card content lives in components/works/.
 * `theme` styles the card to match that product: a solid `bg` and the `fg` text colour.
 */
export const WORKS = [
  {
    id: "boomshare",
    title: "Boomshare",
    theme: { bg: "#000000", fg: "#ffffff" },
  },
  {
    id: "signalfoundry",
    title: "SignalFoundry",
    theme: {
      bg: "#1c1226",
      fg: "#ffffff",
    },
  },
  {
    id: "verity",
    title: "Verity",
    theme: {
      bg: "#0b3a3f",
      fg: "#ffffff",
    },
  },
  {
    id: "peos",
    title: "PEOS",
    theme: {
      bg: "#0d1233",
      fg: "#ffffff",
    },
  },
  {
    id: "doctorweb3",
    title: "DoctorWeb3",
    theme: {
      bg: "#17224a",
      fg: "#ffffff",
    },
  },
] as const;

export const DEMO_VIDEO = {
  name: "Boomshare product demo: AI screen recording, transcript and editing",
  description:
    "Demo of Boomshare, a screen recorder with an AI transcript editor, dubbing and usage-based billing, built by Devdeep Ghosh.",
  src: "/boom-demo.mp4",
  poster: "/boom-demo-poster.jpg",
  uploadDate: "2026-10-12",
  duration: "PT18S",
  width: 1920,
  height: 1080,
} as const;

/** Published research linked to a work (keyed by WORKS id). */
export const PAPERS: Record<
  string,
  {
    url: string;
    venue: string;
    title: string;
    authors: string[];
    conference: string;
    conferenceShort: string;
    location: string;
    dates: string;
    published: string;
    doi: string;
  }
> = {
  doctorweb3: {
    url: "https://ieeexplore.ieee.org/document/10846115/",
    venue: "IEEE Xplore",
    title:
      "Doctor Web3.0: An Enhanced Decentralized Framework to Share and Store Medical Record of Patients",
    authors: ["Jyoti Anand", "Afaq Ahmad", "Devdeep Ghosh"],
    conference:
      "2024 12th International Conference on Internet of Everything, Microwave, Embedded, Communication and Networks (IEMECON)",
    conferenceShort: "IEMECON 2024",
    location: "Jaipur, India",
    dates: "24-26 October 2024",
    published: "2025-01-23",
    doi: "10.1109/IEMECON62401.2024.10846115",
  },
};
