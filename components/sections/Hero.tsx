import Image from "next/image";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import HeroBackdrop from "@/components/ui/HeroBackdrop";

const Hero = () => (
  <section id="hero" className="sticky top-0 z-0 flex min-h-svh items-center">
    <HeroBackdrop />
    <Container className="relative">
      <Reveal className="max-w-md rounded-xl bg-foreground p-6 sm:p-10">
        <Image
          src="/logo-bw.svg"
          alt=""
          width={56}
          height={56}
          className="mb-5 size-10 sm:mb-8 sm:size-14"
        />
        <div>
          <h1 className="text-xl leading-tight font-semibold text-background sm:text-4xl lg:text-5xl uppercase">
            Software Engineer +<br />
            Product Thinker
          </h1>
        </div>
        <p className="mt-4 text-base text-background sm:mt-6 sm:text-xl lg:text-2xl font-medium font-slab">
          Helping startups and engineering teams move at light speed.
        </p>
      </Reveal>
    </Container>
  </section>
);

export default Hero;
