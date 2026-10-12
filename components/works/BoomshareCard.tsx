"use client";

import { useReducedMotion } from "motion/react";

const FEATURES = [
  "AI editing",
  "Auto captions",
  "50+ language dubbing",
] as const;

/** Full-width, left-aligned headline on top; below, a third of the width for copy and two thirds for the demo. */
const BoomshareCard = () => {
  const reduce = useReducedMotion();
  return (
    <div>
      <h3 className="text-left text-3xl font-semibold uppercase sm:text-4xl lg:text-5xl">
        Skip the meeting. Record, don&apos;t meet.
      </h3>

      <div className="mt-8 grid items-center gap-8 md:grid-cols-3">
        <div>
          <p className="font-slab text-lg">
            Boomshare is an AI screen recorder and video editor built to replace
            meetings with recordings. It trims silences, cleans up audio, writes
            captions and summaries, and dubs your voice into 50+ languages.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {FEATURES.map((feature) => (
              <li
                key={feature}
                className="rounded-full bg-white/10 px-3 py-1 text-sm"
              >
                {feature}
              </li>
            ))}
          </ul>
          <a
            href="https://boomshare.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-3 rounded-md bg-white/10 px-5 py-3 font-slab text-base transition-colors hover:bg-white/20"
          >
            Visit boomshare.ai <span aria-hidden>→</span>
          </a>
        </div>

        <video
          src="/boom-demo.mp4"
          className="aspect-video w-full rounded-xl object-cover ring-1 ring-white/15 md:col-span-2"
          autoPlay={!reduce}
          controls={!!reduce}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Boomshare product demo"
        />
      </div>
    </div>
  );
};

export default BoomshareCard;
