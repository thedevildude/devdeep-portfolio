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

export const PLACEHOLDER_IMAGE = "/placeholder.svg";

export const INTRO_POINTS = [
  { title: "Point one", text: "Placeholder text for the first point." },
  { title: "Point two", text: "Placeholder text for the second point." },
  { title: "Point three", text: "Placeholder text for the third point." },
] as const;

export const BRANDS = ["Brand 1", "Brand 2", "Brand 3", "Brand 4", "Brand 5", "Brand 6"] as const;

export const WORKS = [
  { id: "work-1", title: "Work One", category: "Category", image: PLACEHOLDER_IMAGE },
  { id: "work-2", title: "Work Two", category: "Category", image: PLACEHOLDER_IMAGE },
  { id: "work-3", title: "Work Three", category: "Category", image: PLACEHOLDER_IMAGE },
] as const;
