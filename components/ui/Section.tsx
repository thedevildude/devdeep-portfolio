import type { ReactNode } from "react";
import Container from "./Container";
import Reveal from "./Reveal";

type SectionProps = {
  id: string;
  title?: string;
  fullScreen?: boolean;
  children: ReactNode;
};

const Section = ({ id, title, fullScreen = true, children }: SectionProps) => (
  <section id={id} className={`flex items-center py-24 ${fullScreen ? "min-h-svh" : ""}`}>
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
