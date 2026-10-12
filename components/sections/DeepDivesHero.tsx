import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import ShootingStar from "@/components/ui/ShootingStar";
import WaveDivider from "@/components/ui/WaveDivider";
import { DEEP_DIVES } from "@/lib/constants";

const DeepDivesHero = () => (
  <section
    id="deep-dives"
    className="relative flex items-center overflow-hidden bg-bright-indigo pt-40 pb-4 text-foreground"
  >
    <WaveDivider variant="soft" className="text-foreground" />
    <Container>
      <Reveal className="flex flex-col items-start justify-between gap-12 md:flex-row md:items-center">
        <div className="max-w-2xl">
          <h2 className="font-hindi text-4xl font-semibold uppercase sm:text-6xl lg:text-7xl">
            {DEEP_DIVES.title}
          </h2>
          <p className="mt-6 font-slab text-xl sm:text-2xl">
            {DEEP_DIVES.subtitle}
          </p>
        </div>
        <ShootingStar className="w-44 shrink-0 text-petal-frost sm:w-60 lg:w-72" />
      </Reveal>
    </Container>
  </section>
);

export default DeepDivesHero;
