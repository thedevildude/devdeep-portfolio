import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
};

/** Endless right-to-left scroll. The children are rendered twice for a seamless loop. */
const Marquee = ({ children, className }: MarqueeProps) => (
  <div className="overflow-hidden">
    <div className={cn("animate-marquee-rtl flex w-max", className)}>
      <div className="flex shrink-0">{children}</div>
      <div className="flex shrink-0" aria-hidden>
        {children}
      </div>
    </div>
  </div>
);

export default Marquee;
