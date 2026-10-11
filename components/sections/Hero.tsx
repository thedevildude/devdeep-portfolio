import Image from "next/image";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { HeroImage } from "@/lib/constants";

const Hero = () => (
  <section id="hero" className="sticky top-0 z-0 flex min-h-svh items-center">
    <Image
      src={HeroImage}
      alt=""
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
    <div className="absolute inset-0" />
    <Container className="relative">
      <Reveal className="max-w-md rounded-xl bg-foreground p-10 sm:p-10">
        <div>
          <h1 className="text-6xl font-semibold sm:text-6xl text-background uppercase">
            Software Engineer +<br />
            Product Thinker
          </h1>
        </div>
        <p className="mt-8 text-background text-3xl font-medium font-slab">
          Helping startups and engineering teams move at light speed.
        </p>
      </Reveal>
    </Container>
  </section>
);

export default Hero;
