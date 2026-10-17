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
      if (disposed) return;
      const scene = createHeroScene(host);
      if (scene) cleanup = scene.dispose;
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={hostRef} aria-hidden className="absolute inset-0 overflow-hidden bg-[#060b2e]" />;
};

export default HeroBackdrop;
