import { CONTACT, LINKS, SITE } from "@/lib/constants";
import CurrentYear from "./CurrentYear";
import Container from "./Container";

const Footer = () => (
  <footer className="border-t border-border py-8 text-sm sm:py-10 text-muted">
    <Container className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <p>
        © <CurrentYear /> {SITE.name}
      </p>
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
