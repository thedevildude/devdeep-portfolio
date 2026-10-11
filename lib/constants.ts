export const SITE = {
  name: "Devdeep Ghosh",
  title: "Devdeep Ghosh — Portfolio",
  description: "Portfolio of Devdeep Ghosh — software engineer.",
  url: "https://devdeep.dev",
} as const;

export const CONTACT = {
  email: "devarmforce01@gmail.com",
  phone: "+91 00000 00000",
  phoneHref: "tel:+910000000000",
  emailHref: "mailto:devarmforce01@gmail.com",
  contactUs: "mailto:devarmforce01@gmail.com?subject=Hello%20Devdeep",
} as const;

export const LINKS = {
  linkedin: "https://www.linkedin.com/in/your-handle",
  github: "https://github.com/your-handle",
  twitter: "https://x.com/your-handle",
  resume: "/resume.pdf",
} as const;

export const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "LinkedIn", href: LINKS.linkedin, external: true },
  { label: "Resume", href: LINKS.resume, external: true },
  { label: "Contact", href: CONTACT.contactUs, external: true },
] as const;
