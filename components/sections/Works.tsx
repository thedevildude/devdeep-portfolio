"use client";

import { useRef, type ReactNode } from "react";
import { useScroll } from "motion/react";
import { WORKS } from "@/lib/constants";
import DeepDivesHero from "./DeepDivesHero";
import BoomshareVisual from "@/components/works/BoomshareVisual";
import PlaceholderVisual from "@/components/works/PlaceholderVisual";
import WorkItem from "./WorkItem";

/** Custom right-hand component per work; anything unlisted gets the placeholder. */
const VISUALS: Record<string, ReactNode> = {
  boomshare: <BoomshareVisual />,
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
            visual={VISUALS[work.id] ?? <PlaceholderVisual alt={work.title} />}
            index={index}
            total={WORKS.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
};

export default Works;
