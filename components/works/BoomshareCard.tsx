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
    <div className="flex flex-1 flex-col px-5 pt-20 pb-6 sm:px-12 sm:pt-24 lg:px-16">
      <h3 className="text-left text-lg font-semibold uppercase sm:text-3xl lg:text-4xl">
        Async screen recorder and AI video editor
      </h3>

      <div className="mt-6 grid flex-1 items-stretch gap-8 lg:grid-cols-3">
        <div className="flex flex-col justify-between gap-6">
          <div>
            <p className="font-slab text-sm sm:text-base">
              Designed and developed Boomshare. Record the screen and share it
              as video instead of holding a meeting. The AI editor removes
              silences, cleans up audio, generates transcripts and captions, and
              dubs speech into other languages.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {FEATURES.map((feature) => (
                <li
                  key={feature}
                  className="rounded-full bg-current/10 px-2 py-0.5 text-xs"
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
            className="inline-flex items-center gap-3 self-start rounded-md bg-current/10 px-5 py-2.5 font-slab text-sm transition-colors hover:bg-current/20"
          >
            Visit boomshare.ai <span aria-hidden>→</span>
          </a>
        </div>

        <div className="relative aspect-video overflow-hidden lg:aspect-auto lg:min-h-52 ring-1 ring-current/15 lg:col-span-2">
          <video
            src="/boom-demo.mp4"
            className="absolute inset-0 h-full w-full object-cover"
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
    </div>
  );
};

export default BoomshareCard;
