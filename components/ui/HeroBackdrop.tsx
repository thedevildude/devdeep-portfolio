"use client";

import { useEffect, useRef } from "react";

/** The hero's live backdrop. Three.js and the scene load after mount, off the critical path. */
const HeroBackdrop = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const wishRef = useRef<HTMLButtonElement>(null);
  const releaseRef = useRef(() => {});

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    import("./hero-scene/createHeroScene").then(({ createHeroScene }) => {
      if (disposed) return;
      // The easter egg's badge follows the paused wish star; set directly, it moves every frame.
      const scene = createHeroScene(host, ({ x, y, visible }) => {
        const wish = wishRef.current;
        if (!wish) return;
        wish.style.transform = `translate(${x + 24}px, ${y + 12}px)`;
        wish.dataset.visible = String(visible);
        wish.tabIndex = visible ? 0 : -1;
        wish.setAttribute("aria-hidden", String(!visible));
      });
      cleanup = scene.dispose;
      releaseRef.current = scene.releaseWish;
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div ref={hostRef} className="absolute inset-0 overflow-hidden bg-[#040924]">
      <button
        ref={wishRef}
        type="button"
        tabIndex={-1}
        aria-hidden
        data-visible="false"
        onClick={() => releaseRef.current()}
        className="pointer-events-none absolute top-0 left-0 z-10 cursor-pointer rounded-full bg-[#e8e0ff] px-3 py-1 font-slab text-xs whitespace-nowrap text-[#3a2e8c] opacity-0 shadow-[0_0_20px_rgba(232,224,255,0.55)] transition-[opacity,box-shadow] duration-500 hover:shadow-[0_0_30px_rgba(232,224,255,0.9)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8e0ff] data-[visible=true]:pointer-events-auto data-[visible=true]:opacity-100 sm:text-sm"
      >
        make a wish ✦
      </button>
    </div>
  );
};

export default HeroBackdrop;
