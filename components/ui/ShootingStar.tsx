"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Shooting stars with sparkle heads, tapered tails and trailing dust, drawn with Three.js in
 * the element's text colour. Size it with width classes; it keeps a 43:29 aspect ratio.
 */
const ShootingStar = ({ className }: { className?: string }) => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    import("./shooting-stars/createShootingStars").then(({ createShootingStars }) => {
      if (!disposed) cleanup = createShootingStars(host, getComputedStyle(host).color);
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={hostRef} aria-hidden className={cn("relative aspect-[43/29]", className)} />;
};

export default ShootingStar;
