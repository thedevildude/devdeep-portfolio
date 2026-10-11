import type { ReactNode } from "react";
import Container from "./Container";
import Reveal from "./Reveal";

type SectionProps = {
  id: string;
  title?: string;
  children: ReactNode;
};

const Section = ({ id, title, children }: SectionProps) => (
  <section id={id} className="scroll-mt-20 py-24">
    <Container>
      <Reveal>
        {title && (
          <h2 className="mb-8 font-mono text-sm uppercase tracking-widest text-muted">
            {title}
          </h2>
        )}
        {children}
      </Reveal>
    </Container>
  </section>
);

export default Section;
