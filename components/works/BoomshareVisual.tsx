"use client";

import { useReducedMotion } from "motion/react";

const FEATURES = [
  "AI editing",
  "Auto captions",
  "50+ language dubbing",
] as const;

const BoomshareVisual = () => {
  const reduce = useReducedMotion();
  return (
    <div className="w-full">
      <div className="overflow-hidden rounded-xl ring-1 ring-white/15">
        <video
          src="/boom-demo.mp4"
          className="aspect-video w-full object-cover"
          autoPlay={!reduce}
          controls={!!reduce}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Boomshare product demo"
        />
      </div>
      <ul className="mt-4 flex flex-wrap gap-2">
        {FEATURES.map((feature) => (
          <li
            key={feature}
            className="rounded-full bg-white/10 px-3 py-1 text-sm text-foreground"
          >
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoomshareVisual;
