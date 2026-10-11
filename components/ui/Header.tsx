"use client";

import { motion } from "motion/react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import Container from "./Container";

const Header = () => {
  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur"
    >
      <Container className="flex flex-row items-center justify-between py-4">
        <a href="#" className="font-semibold tracking-tight">
          {SITE.name}
        </a>
        <nav className="flex flex-row gap-6 text-sm text-muted">
          {NAV_LINKS.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              whileHover={{ y: -2 }}
              {...("external" in link && link.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </motion.a>
          ))}
        </nav>
      </Container>
    </motion.header>
  );
};

export default Header;
