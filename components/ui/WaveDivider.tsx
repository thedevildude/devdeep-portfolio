import { cn } from "@/lib/utils";

type WaveDividerProps = {
  /** "soft": a gentle wave hanging down from the top edge of its parent. "ocean": a smooth wave that sits in the flow above a section's body. */
  variant?: "soft" | "ocean";
  /** Picks the ocean wave's swell count, phase and height so each divider differs. */
  seed?: number;
  className?: string;
};

/** Height in px of the ocean wave for a seed, so the body below can size itself around it. */
export const oceanHeight = (seed: number) => 72 + 16 * (seed % 3);

/**
 * A smooth wave as a closed path filled below the crest line: two sine waves summed.
 * The seed picks the swell counts (2–4 and 4–7 across the width) and the phases, so
 * neighbouring dividers look related but never identical. The whole curve is shifted so
 * its highest crest sits at y = 0 and touches the top edge of the svg.
 */
const oceanPath = (seed: number) => {
  const f1 = 2 + (seed % 3);
  const f2 = f1 * 2 + (seed % 2);
  const phase1 = (seed * Math.PI) / 3;
  const phase2 = (seed * Math.PI) / 2;
  const STEP = 8;
  const raw: number[] = [];
  for (let x = 0; x <= 1440; x += STEP) {
    const t = x / 1440;
    raw.push(
      0.65 * Math.sin(2 * Math.PI * f1 * t + phase1) +
        0.35 * Math.sin(2 * Math.PI * f2 * t + phase2),
    );
  }
  const top = Math.max(...raw);
  const points = raw.map(
    (r, i) => `${i * STEP} ${((top - r) * 45).toFixed(1)}`,
  );
  return `M${points.join("L")}V101H0Z`;
};

/** A smooth S-curve wave (no cusps) hanging from the top edge. */
const softWave = (periods: number, amp: number) => {
  const half = 1440 / (periods * 2);
  const mid = 50;
  let prev = mid;
  let d = `M0 0V${mid}`;
  for (let i = 0; i < periods * 2; i++) {
    const x = i * half;
    const y = mid + (i % 2 === 0 ? amp : -amp);
    d += `C${x + half / 2} ${prev} ${x + half / 2} ${y} ${x + half} ${y}`;
    prev = y;
  }
  return `${d}V0Z`;
};

/**
 * Fills with `currentColor`, so set the colour with a text-* class.
 * "soft" hangs down from the top edge of its parent; "ocean" rises above it.
 */
const WaveDivider = ({
  variant = "soft",
  seed = 0,
  className,
}: WaveDividerProps) => {
  if (variant === "soft") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-20 w-full sm:h-28",
          className,
        )}
      >
        <path d={softWave(3, 26)} fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      style={{ height: oceanHeight(seed) }}
      className={cn("pointer-events-none block w-full", className)}
    >
      <path d={oceanPath(seed)} fill="currentColor" />
    </svg>
  );
};

export default WaveDivider;
