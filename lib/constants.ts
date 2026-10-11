export const SITE = {
  name: "Devdeep Ghosh",
  title: "Devdeep Ghosh — Full Stack Software Engineer",
  description: "Portfolio of Devdeep Ghosh — Full Stack Software Engineer.",
  url: "https://idevdeep.com",
} as const;

export const HOMEPAGE_METADATA = {
  title: "Devdeep Ghosh — Full Stack Software Engineer",
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

export const INTRO_POINTS = [
  { title: "Point one", text: "Placeholder text for the first point." },
  { title: "Point two", text: "Placeholder text for the second point." },
  { title: "Point three", text: "Placeholder text for the third point." },
] as const;

export const BRANDS = [
  "Brand 1",
  "Brand 2",
  "Brand 3",
  "Brand 4",
  "Brand 5",
  "Brand 6",
] as const;

export const WORKS = [
  {
    id: "work-1",
    title: "Work One",
    category: "Category",
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: "work-2",
    title: "Work Two",
    category: "Category",
    image: PLACEHOLDER_IMAGE,
  },
  {
    id: "work-3",
    title: "Work Three",
    category: "Category",
    image: PLACEHOLDER_IMAGE,
  },
] as const;
