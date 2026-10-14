"use client";

import { useEffect, useRef } from "react";

/** The hero's live backdrop. Three.js and the scene load after mount, off the critical path. */
const HeroBackdrop = () => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    import("./hero-scene/createHeroScene").then(({ createHeroScene }) => {
      if (!disposed) cleanup = createHeroScene(host);
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={hostRef} className="absolute inset-0 overflow-hidden bg-[#040924]" />;
};

export default HeroBackdrop;
