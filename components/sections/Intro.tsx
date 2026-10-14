import Section from "@/components/ui/Section";
import { INTRO_POINTS } from "@/lib/constants";

const Highlighted = ({ text }: { text: string }) =>
  text.split("**").map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-foreground underline">
        {part}
      </strong>
    ) : (
      part
    ),
  );

const Intro = () => (
  <Section id="intro" fullScreen={false} className="pb-10 sm:pb-12">
    <h2 className="max-w-3xl text-xl font-medium sm:text-4xl lg:text-5xl">
      <span className="text-muted">
        HIGH-PERFORMANCE WEB, DESKTOP & MOBILE APPLICATIONS TO AI-POWERED VIDEO
        PIPELINES,
      </span>
      <span>
        {" "}
        I BUILD PLATFORMS THAT POWER MISSION-CRITICAL INFRASTRUCTURE.
      </span>
    </h2>
    <div className="mt-10 grid sm:mt-16 grid-cols-1 gap-10 md:grid-cols-3 md:gap-10 font-slab">
      {INTRO_POINTS.map((point, i) => (
        <div key={point.title} className="border-t border-border pt-6">
          <div className="flex items-baseline gap-3">
            <span className="text-sm text-accent">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-lg font-medium uppercase sm:text-xl">
              {point.title}
            </h3>
          </div>
          <p className="mt-4 text-sm leading-relaxed sm:text-base text-muted">
            <Highlighted text={point.text} />
          </p>
        </div>
      ))}
    </div>
  </Section>
);

export default Intro;
