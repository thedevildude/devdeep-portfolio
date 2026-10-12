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
          style={{ scale, transformOrigin: "50% 0%" }}
          className="relative rounded-[2rem] bg-black text-foreground"
        >
          <div className="px-6 py-8 sm:px-12 lg:px-16">
            {/* Same spot on every card: the logo, or the title as a wordmark. */}
            <div className="mb-8 flex h-10 items-center">
              {logo ? (
                <Image
                  src={logo}
                  alt={title}
                  width={160}
                  height={43}
                  className="h-10 w-auto brightness-0 invert"
                />
              ) : (
                <span className="text-2xl font-semibold uppercase">
                  {title}
                </span>
              )}
            </div>
            <Reveal>{children}</Reveal>
          </div>
        </motion.div>
      </Container>
    </section>
  );
};

export default WorkItem;
