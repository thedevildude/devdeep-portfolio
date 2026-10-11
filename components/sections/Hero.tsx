import Section from "@/components/ui/Section";
import { SITE } from "@/lib/constants";

const Hero = () => (
  <Section id="hero">
    <h1 className="text-6xl font-semibold tracking-tight sm:text-8xl lg:text-9xl">
      {SITE.name}
    </h1>
    <p className="mt-6 max-w-xl text-lg text-muted">{SITE.description}</p>
  </Section>
);

export default Hero;
