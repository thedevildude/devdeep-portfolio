import Section from "@/components/ui/Section";
import { INTRO_POINTS } from "@/lib/constants";

const Intro = () => (
  <Section id="intro">
    <h2 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
      Placeholder hero text for the second section.
    </h2>
    <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3">
      {INTRO_POINTS.map((point) => (
        <div key={point.title}>
          <h3 className="font-medium">{point.title}</h3>
          <p className="mt-2 text-muted">{point.text}</p>
        </div>
      ))}
    </div>
  </Section>
);

export default Intro;
