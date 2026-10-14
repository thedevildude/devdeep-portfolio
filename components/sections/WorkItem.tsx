"use client";

import {
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  motion,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import WaveDivider, { oceanHeight } from "@/components/ui/WaveDivider";

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

/** The pinned, stacking-cards layout needs a tall viewport and room for fixed-height cards. */
const DESKTOP = "(min-width: 1024px)";
const subscribeDesktop = (cb: () => void) => {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const useIsDesktop = () =>
  useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP).matches,
    () => true,
  );

/** Literal class names so Tailwind can see them. Same order as TONES. */
const PREV_BG = [
  "max-lg:bg-bright-indigo",
  "max-lg:bg-royal-azure",
  "max-lg:bg-petal-frost",
  "max-lg:bg-full-spectrum-blue",
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
  const desktop = useIsDesktop();
  const [bg, wave] = TONES[index % TONES.length].split(" ");
  // Below lg the cards don't overlap, so the wave's open top needs the previous card's colour.
  const prevBg = PREV_BG[(index - 1 + PREV_BG.length) % PREV_BG.length];

  // The next card covers this one during [index, index + 1] / (total - 1).
  const span = Math.max(total - 1, 1);
  const scale = useTransform(
    progress,
    [index / span, (index + 1) / span],
    [1, index === total - 1 || reduce || !desktop ? 1 : 0.94],
  );

  return (
    // The section itself is transparent: the wave's top shows the previous card, and
    // its highest crest touches the top of the screen once this section is pinned.
    <section id={id} className="lg:sticky lg:top-0">
      {/* First item shares the hero's indigo, so it needs no divider. */}
      {index > 0 && (
        <WaveDivider
          variant="ocean"
          seed={index}
          className={`${wave} ${prevBg}`}
        />
      )}
      <div
        className={`flex items-center py-6 lg:min-h-[calc(100svh_-_var(--wave))] ${bg}`}
        style={
          {
            "--wave": `${index > 0 ? oceanHeight(index) : 0}px`,
          } as CSSProperties
        }
      >
        <Container>
          <motion.div
            style={{
              scale,
              transformOrigin: "50% 0%",
              backgroundColor: theme.bg,
              color: theme.fg,
            }}
            className="relative flex flex-col lg:h-[min(36rem,calc(100svh-10rem))] overflow-hidden rounded-3xl lg:rounded-[2rem]"
          >
            {/* Same spot on every card: the logo, or the title as a wordmark. */}
            <div className="absolute top-6 left-5 z-10 flex h-10 items-center sm:top-8 sm:left-12 sm:h-12 lg:left-16">
              {logo ?? (
                <span className="text-base font-semibold uppercase sm:text-xl">{title}</span>
              )}
            </div>
            {/* Each card owns its padding, so it can bleed to the card's edges. */}
            <Reveal y={0} className="flex flex-1 flex-col">
              {children}
            </Reveal>
          </motion.div>
        </Container>
      </div>
    </section>
  );
};

export default WorkItem;
