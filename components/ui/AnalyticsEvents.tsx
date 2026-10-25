"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/analytics";

const DEPTHS = [25, 50, 75, 100];

/** Where on the page a click happened: the header, footer, or the enclosing section's id. */
const locationOf = (el: Element) =>
  el.closest("header")
    ? "header"
    : el.closest("footer")
      ? "footer"
      : (el.closest("section[id]")?.id ?? "page");

const linkEvent = (a: HTMLAnchorElement) => {
  const href = a.getAttribute("href") ?? "";
  const params = {
    link_text: a.textContent?.trim().slice(0, 60),
    location: locationOf(a),
  };
  if (href.startsWith("mailto:")) return ["click_email", params] as const;
  if (href.startsWith("#")) {
    return href.length > 1
      ? (["click_nav", { ...params, target: href.slice(1) }] as const)
      : null;
  }
  if (a.host === window.location.host) {
    return [
      "click_nav",
      { ...params, target: `${a.pathname}${a.hash}` },
    ] as const;
  }
  if (a.host) {
    return [
      "click_outbound",
      { ...params, link_url: a.href, link_domain: a.host },
    ] as const;
  }
  return null;
};

/**
 * Site-wide GA4 events that need no per-component wiring: link clicks (nav / email /
 * outbound), section views and scroll depth. Component-specific events call `track` directly.
 */
const AnalyticsEvents = () => {
  const pathname = usePathname();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest("a");
      const evt = a && linkEvent(a);
      if (evt) track(evt[0], evt[1]);
    };
    document.addEventListener("click", onClick);

    const seen = new Set<string>();
    const sections = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || seen.has(entry.target.id)) continue;
          seen.add(entry.target.id);
          track("section_view", { section: entry.target.id, page: pathname });
        }
      },
      { threshold: 0.4 },
    );
    document
      .querySelectorAll("section[id]")
      .forEach((s) => sections.observe(s));

    const fired = new Set<number>();
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      for (const d of DEPTHS) {
        if (pct >= d && !fired.has(d)) {
          fired.add(d);
          track("scroll_depth", { percent: d, page: pathname });
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      sections.disconnect();
    };
  }, [pathname]);

  return null;
};

export default AnalyticsEvents;
