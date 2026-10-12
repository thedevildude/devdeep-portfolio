"use client";

import { useReducedMotion } from "motion/react";

const FEATURES = [
  "Screen recording",
  "Transcripts and captions",
  "Voice dubbing",
] as const;

/** Full-width, left-aligned headline on top; below, a third of the width for copy and two thirds for the demo. */
const BoomshareCard = () => {
  const reduce = useReducedMotion();
  return (
    <div>
      <h3 className="text-left text-2xl font-semibold uppercase sm:text-3xl lg:text-4xl">
        Async screen recorder and AI video editor
      </h3>

      <div className="mt-8 grid items-stretch gap-8 md:grid-cols-3">
        <div className="flex flex-col justify-between gap-6">
          <div>
            <p className="font-slab text-base">
              Designed and developed Boomshare. Record the screen and share it
              as video instead of holding a meeting. The AI editor removes
              silences, cleans up audio, generates transcripts and captions, and
              dubs speech into other languages.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="rounded-full bg-white/10 px-2 py-0.5 text-xs"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <a
            href="https://boomshare.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 self-start rounded-md bg-white/10 px-5 py-3 font-slab text-sm transition-colors hover:bg-white/20"
          >
            Visit boomshare.ai <span aria-hidden>→</span>
          </a>
        </div>

        <video
          src="/boom-demo.mp4"
          className="aspect-video w-full object-cover ring-1 ring-white/15 md:col-span-2"
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
