"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import WaveDivider from "@/components/ui/WaveDivider";

type WorkItemProps = {
  id: string;
  title: string;
  logo?: string;
  headline: string;
  description: string;
  cta: string;
  href: string;
  /** The right-hand column: a custom component per work. */
  visual: ReactNode;
  index: number;
  total: number;
  /** 0 → 1 as the stack scrolls from the first card pinned to the last. */
  progress: MotionValue<number>;
};

/** Each work brings its own section background; the wave above it uses the same colour. */
const TONES = [
  "bg-bright-indigo text-bright-indigo",
  "bg-royal-azure text-royal-azure",
  "bg-petal-frost text-petal-frost",
  "bg-full-spectrum-blue text-full-spectrum-blue",
] as const;

const WorkItem = ({
  id,
  title,
  logo,
  headline,
  description,
  cta,
  href,
  visual,
  index,
  total,
  progress,
}: WorkItemProps) => {
  const reduce = useReducedMotion();
  const [bg, wave] = TONES[index % TONES.length].split(" ");

  // The next card covers this one during [index, index + 1] / (total - 1).
  const span = Math.max(total - 1, 1);
  const scale = useTransform(
    progress,
    [index / span, (index + 1) / span],
    [1, index === total - 1 || reduce ? 1 : 0.94],
  );

  return (
    <section
      id={id}
      className={`sticky top-0 flex min-h-svh items-center py-12 sm:py-16 ${bg}`}
    >
      {/* First item shares the hero's indigo, so it needs no divider. */}
      {index > 0 && (
        <WaveDivider variant="ocean" seed={index} className={wave} />
      )}
      <Container>
        <motion.div
          style={{ scale, transformOrigin: "50% 0%" }}
          className="relative rounded-[2rem] bg-black text-foreground"
        >
          <div className="grid items-center gap-10 px-6 py-10 sm:px-12 md:grid-cols-2 lg:px-16">
            <Reveal>
              {logo && (
                <Image
                  src={logo}
                  alt={title}
                  width={160}
                  height={43}
                  className="mb-8 h-10 w-auto brightness-0 invert"
                />
              )}
              <h3 className="font-hindi text-4xl font-semibold uppercase sm:text-5xl">
                {headline}
              </h3>
              <p className="mt-6 max-w-md font-slab text-lg">{description}</p>
              <a
                href={href}
                {...(href.startsWith("http") && {
                  target: "_blank",
                  rel: "noopener noreferrer",
                })}
                className="mt-8 inline-flex items-center gap-3 rounded-md bg-white/10 px-5 py-3 font-slab text-base transition-colors hover:bg-white/20"
              >
                <span>{cta}</span>
                <span aria-hidden>→</span>
              </a>
            </Reveal>
            <Reveal delay={0.1}>{visual}</Reveal>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default WorkItem;
