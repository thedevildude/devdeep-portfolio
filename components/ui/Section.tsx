import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import Container from "./Container";
import Reveal from "./Reveal";

type SectionProps = {
  id: string;
  className?: string;
  title?: string;
  fullScreen?: boolean;
  children: ReactNode;
};

const Section = ({
  id,
  className,
  title,
  fullScreen = true,
  children,
}: ComponentProps<"div"> & SectionProps) => (
  <section
    id={id}
    className={cn(
      "flex items-center py-24",
      fullScreen && "min-h-svh",
      className,
    )}
  >
    <Container>
      <Reveal>
        {title && (
          <h2 className="mb-8 text-sm uppercase tracking-widest text-muted">
            {title}
          </h2>
        )}
        {children}
      </Reveal>
    </Container>
  </section>
);

export default Section;
