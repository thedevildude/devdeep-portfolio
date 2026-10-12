"use client";

import type { ReactNode } from "react";
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
  /** Brand logo for the top-left spot; falls back to the title as text. */
  logo?: ReactNode;
  theme: { bg: string; fg: string };
  /** This work's own card content, laid out however that work needs. */
  children: ReactNode;
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
  theme,
  children,
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
      className={`sticky top-0 flex min-h-svh items-center py-8 sm:py-10 ${bg}`}
    >
      {/* First item shares the hero's indigo, so it needs no divider. */}
      {index > 0 && (
        <WaveDivider variant="ocean" seed={index} className={wave} />
      )}
      <Container>
        <motion.div
          style={{
            scale,
            transformOrigin: "50% 0%",
            backgroundColor: theme.bg,
            color: theme.fg,
          }}
          className="relative flex min-h-[min(38rem,calc(100svh-6rem))] flex-col overflow-hidden rounded-[2rem]"
        >
          {/* Same spot on every card: the logo, or the title as a wordmark. */}
          <div className="absolute top-8 left-6 z-10 flex h-12 items-center sm:left-12 lg:left-16">
            {logo ?? (
              <span className="text-xl font-semibold uppercase">{title}</span>
            )}
          </div>
          {/* Each card owns its padding, so it can bleed to the card's edges. */}
          <Reveal y={0} className="flex flex-1 flex-col">
            {children}
          </Reveal>
        </motion.div>
      </Container>
    </section>
  );
};

export default WorkItem;
