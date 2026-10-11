import Image from "next/image";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { PLACEHOLDER_IMAGE, SITE } from "@/lib/constants";

const Hero = () => (
  <section id="hero" className="relative flex min-h-svh items-center">
    <Image
      src={PLACEHOLDER_IMAGE}
      alt=""
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
    <div className="absolute inset-0 bg-black/30" />
    <Container className="relative py-24">
      <Reveal className="max-w-md rounded-2xl bg-background p-8 sm:p-10">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          {SITE.name}
        </h1>
        <p className="mt-4 text-muted">{SITE.description}</p>
      </Reveal>
    </Container>
  </section>
);

export default Hero;
