"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import Container from "./Container";

const linkProps = (link: (typeof NAV_LINKS)[number]) =>
  "external" in link && link.external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

const Header = () => {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (latest > prev && latest > 80) {
      setHidden(true);
      setOpen(false);
    } else if (latest < prev) setHidden(false);
  });

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 32, mass: 0.8 }}
      className="fixed top-2 left-0 z-50 w-full sm:top-4"
    >
      <Container isHeader>
        <div className="flex flex-row items-center justify-between py-3 text-xl">
          <Link href="/" aria-label={SITE.name} className="block">
            <Image
              src="/logo.svg"
              alt=""
              width={40}
              height={40}
              priority
              className="size-9 sm:size-10"
            />
          </Link>

          <nav className="hidden flex-row gap-6 font-bold md:flex">
            {NAV_LINKS.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                whileHover={{ y: -2 }}
                {...linkProps(link)}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="-mr-2 flex size-11 flex-col items-center justify-center gap-1.5 md:hidden"
          >
            <span
              className={`h-0.5 w-6 bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`h-0.5 w-6 bg-current transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-0.5 w-6 bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="mt-1 flex flex-col overflow-hidden rounded-xl bg-foreground text-background md:hidden"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...linkProps(link)}
                  onClick={() => setOpen(false)}
                  className="border-b border-background/10 px-6 py-4 text-lg font-bold last:border-b-0"
                >
                  {link.label}
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
      </Container>
    </motion.header>
  );
};

export default Header;
