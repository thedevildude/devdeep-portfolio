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
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 32, mass: 0.8 }}
      className="fixed top-4 left-0 z-50 w-full"
    >
      <Container>
        <div className="flex flex-row items-center justify-between py-3 text-xl">
          <a href="#">
            {SITE.name}
          </a>
          <nav className="flex flex-row gap-6 text-muted">
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
