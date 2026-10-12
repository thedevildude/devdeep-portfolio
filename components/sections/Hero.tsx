import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import HeroBackdrop from "@/components/ui/HeroBackdrop";

const Hero = () => (
  <section id="hero" className="sticky top-0 z-0 flex min-h-svh items-center">
    <HeroBackdrop />
    <Container className="relative">
      <Reveal className="max-w-md rounded-xl bg-foreground p-6 sm:p-10">
        <div>
          <h1 className="text-2xl leading-tight font-semibold text-background sm:text-5xl lg:text-6xl uppercase">
            Software Engineer +<br />
            Product Thinker
          </h1>
        </div>
        <p className="mt-4 text-lg text-background sm:mt-8 sm:text-2xl lg:text-3xl font-medium font-slab">
          Helping startups and engineering teams move at light speed.
        </p>
      </Reveal>
    </Container>
  </section>
);

export default Hero;
