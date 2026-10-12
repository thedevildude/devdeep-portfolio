export const SITE = {
  name: "Devdeep",
  title: "Devdeep — Full Stack Software Engineer",
  description: "Devdeep Ghosh — Full Stack Software Engineer Portfolio.",
  url: "https://idevdeep.com",
} as const;

export const HOMEPAGE_METADATA = {
  title: "Devdeep — Full Stack Software Engineer",
  description:
    "Frontend developer with 6 months of experience in building web applications using React and Next.js. Specialized in creating modern, responsive user interfaces and optimizing website performance.",
  keywords: [
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "JavaScript",
    "React",
    "Next.js",
    "Frontend Engineer",
    "Web Developer",
    "UI/UX",
  ],
} as const;

const EMAIL = process.env.NEXT_PUBLIC_EMAIL ?? "";
const PHONE = process.env.NEXT_PUBLIC_PHONE ?? "";

export const CONTACT = {
  email: EMAIL,
  phone: PHONE,
  phoneHref: `tel:${PHONE.replace(/[^+\d]/g, "")}`,
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
  { label: "Work", href: "#work" },
  { label: "LinkedIn", href: LINKS.linkedin, external: true },
  { label: "Resume", href: LINKS.resume, external: true },
  { label: "Contact", href: CONTACT.contactUs, external: true },
] as const;

export const PLACEHOLDER_IMAGE = "/placeholder.svg";
export const HeroImage = "/hero-image2.png";

/** Wrap text in **double asterisks** to highlight it in the Intro section. */
export const INTRO_POINTS = [
  {
    title: "Growth",
    text: "I grew from **SDE Intern to SDE II** at Capital Compute in **under a year**, where I designed complete project architectures, **led multiple teams**, mentored freshers, participated in organizational decisions, and shipped high-performance applications for **global clients**.",
  },
  {
    title: "Impact",
    text: "Earlier, as an SDE Intern at Open Healthcare Network for over a year, I contributed to **CARE** and **Ayushma**, built tele-ICU software, supporting the 10BedICU project, helping serve **over 200 hospitals** across India.",
  },
  {
    title: "Range",
    text: "Over the last **3+ years** I have architected and shipped **production systems** spanning cross-platform mobile and desktop apps, **serverless AWS platforms** (Lambda, DynamoDB, Step Functions), agentic marketing engines, and open-source tools at scale",
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

/** Shell data only: each work's card content lives in components/works/. */
export const WORKS = [
  { id: "boomshare", title: "Boomshare", logo: "/boom-logo.png" },
  { id: "work-2", title: "Work Two" },
  { id: "work-3", title: "Work Three" },
  { id: "work-4", title: "Work Four" },
] as const;
