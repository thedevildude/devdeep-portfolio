import Image from "next/image";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { HeroImage, SITE } from "@/lib/constants";

const Hero = () => (
  <section id="hero" className="relative flex min-h-svh items-center">
    <Image
      src={HeroImage}
      alt=""
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
    <div className="absolute inset-0" />
    <Container className="relative py-24">
      <Reveal className="max-w-md rounded-xl bg-foreground p-8 sm:p-10">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl text-background">
          {SITE.name}
        </h1>
        <p className="mt-4 text-muted text-background">{SITE.description}</p>
      </Reveal>
    </Container>
  </section>
);

export default Hero;
