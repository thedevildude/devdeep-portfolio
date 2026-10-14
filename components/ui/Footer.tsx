import Link from "next/link";
import { CONTACT, LINKS, SITE } from "@/lib/constants";
import { SERVICES } from "@/lib/services";
import CurrentYear from "./CurrentYear";
import Container from "./Container";

const Footer = () => (
  <footer className="border-t border-border py-8 text-sm sm:py-10 text-muted">
    <Container className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex flex-col gap-3">
        <p>
          © <CurrentYear /> {SITE.name}
        </p>
        <nav aria-label="Hire" className="flex flex-wrap gap-x-6 gap-y-2">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/hire/${s.slug}`}
              className="hover:text-foreground"
            >
              {s.h1}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <a href={CONTACT.emailHref} className="hover:text-foreground">
          Email
        </a>
        <a href={CONTACT.phoneHref} className="hover:text-foreground">
          Phone
        </a>
        <a
          href={LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground"
        >
          GitHub
        </a>
        <a
          href={LINKS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground"
        >
          LinkedIn
        </a>
      </div>
    </Container>
  </footer>
);

export default Footer;
