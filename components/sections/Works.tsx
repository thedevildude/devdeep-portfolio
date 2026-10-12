"use client";

import { useRef, type ReactNode } from "react";
import { useScroll } from "motion/react";
import { WORKS } from "@/lib/constants";
import DeepDivesHero from "./DeepDivesHero";
import BoomshareCard from "@/components/works/BoomshareCard";
import DoctorWeb3Card from "@/components/works/DoctorWeb3Card";
import SignalFoundryCard from "@/components/works/SignalFoundryCard";
import VerityCard from "@/components/works/VerityCard";
import {
  BoomLogo,
  SignalFoundryLogo,
  VerityLogo,
  DoctorWeb3Logo,
} from "@/components/works/logos";
import WorkItem from "./WorkItem";

/** Each work lays out its own card; the shell (logo, wave, background) is shared. */
const CARDS: Record<string, ReactNode> = {
  boomshare: <BoomshareCard />,
  signalfoundry: <SignalFoundryCard />,
  verity: <VerityCard />,
  doctorweb3: <DoctorWeb3Card />,
};

/** Logos shown top-left of each card; works without one show their title. */
const LOGOS: Record<string, ReactNode> = {
  boomshare: <BoomLogo />,
  signalfoundry: <SignalFoundryLogo />,
  verity: <VerityLogo />,
  doctorweb3: <DoctorWeb3Logo />,
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
            logo={LOGOS[work.id]}
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
