"use client";

import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import Container from "./Container";

const Header = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 80) setHidden(true);
    else if (latest < prev) setHidden(false);
  });

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-4 left-0 z-50 w-full"
    >
      <Container>
        <div className="flex flex-row items-center justify-between rounded-full bg-background/80 px-6 py-3 backdrop-blur">
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
        </div>
      </Container>
    </motion.header>
  );
};

export default Header;
