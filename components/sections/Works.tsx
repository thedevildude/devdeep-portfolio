"use client";

import { useRef, type ReactNode } from "react";
import { useScroll } from "motion/react";
import { WORKS } from "@/lib/constants";
import DeepDivesHero from "./DeepDivesHero";
import BoomshareCard from "@/components/works/BoomshareCard";
import SplitCard from "@/components/works/SplitCard";
import StackedCard from "@/components/works/StackedCard";
import WorkItem from "./WorkItem";

const PLACEHOLDER_COPY =
  "A short summary of the problem, what I built, and the result it had.";

/** Each work lays out its own card; the shell (logo, wave, background) is shared. */
const CARDS: Record<string, ReactNode> = {
  boomshare: <BoomshareCard />,
  "work-2": <SplitCard headline="Work Two" description={PLACEHOLDER_COPY} />,
  "work-3": (
    <StackedCard headline="Work Three" description={PLACEHOLDER_COPY} />
  ),
  "work-4": <SplitCard headline="Work Four" description={PLACEHOLDER_COPY} />,
};

const Works = () => {
  const stackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  });

  return (
    <div id="work" className="bg-bright-indigo">
      <DeepDivesHero />
      <div ref={stackRef}>
        {WORKS.map((work, index) => (
          <WorkItem
            key={work.id}
            {...work}
            index={index}
            total={WORKS.length}
            progress={scrollYProgress}
          >
            {CARDS[work.id]}
          </WorkItem>
        ))}
      </div>
    </div>
  );
};

export default Works;
