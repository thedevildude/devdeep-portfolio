import { cn } from "@/lib/utils";

type WaveDividerProps = {
  /** "soft": a gentle wave hanging down from the top edge of its parent. "ocean": a wave that sits in the flow above a section's body. */
  variant?: "soft" | "ocean";
  /** Picks the ocean wave's swell count, phase, height and drift so each divider differs. */
  seed?: number;
  className?: string;
};

/** Width of one wave period in svg units; the svg holds two periods and drifts by exactly one. */
const PERIOD = 1440;
const STEP = 4;

/** Height in px of the ocean wave for a seed, so the body below can size itself around it. */
export const oceanHeight = (seed: number) => 72 + 16 * (seed % 3);

/** Samples `y(t)` across two periods (t in periods, 0–2) into "x y" points. */
const sample = (y: (t: number) => number) => {
  const points: string[] = [];
  for (let x = 0; x <= 2 * PERIOD; x += STEP) {
    points.push(`${x} ${y(x / PERIOD).toFixed(1)}`);
  }
  return points.join("L");
};

/**
 * Two slow sine waves summed. Their frequencies are whole numbers per period, so the curve
 * tiles seamlessly and can drift sideways in a loop. The seed picks the swell counts and
 * phases. The curve is shifted so its highest crest sits at y = 0, touching the top edge.
 */
const oceanPath = (seed: number) => {
  const f1 = 2 + (seed % 2);
  const f2 = f1 + 1;
  const wave = (t: number) =>
    0.7 * Math.sin(2 * Math.PI * f1 * t + (seed * Math.PI) / 3) +
    0.3 * Math.sin(2 * Math.PI * f2 * t + (seed * Math.PI) / 2);
  let top = -Infinity;
  for (let x = 0; x <= 2 * PERIOD; x += STEP)
    top = Math.max(top, wave(x / PERIOD));
  return `M${sample((t) => (top - wave(t)) * 40)}V101H0Z`;
};

/** One gentle swell pattern, hanging down from the top edge (filled above the curve). */
const softPath = () =>
  `M${sample((t) => 50 + 28 * Math.sin(2 * Math.PI * 3 * t))}V0H0Z`;

/**
 * Fills with `currentColor`, so set the colour with a text-* class. The wave drifts
 * sideways forever (paused for reduced motion).
 */
const WaveDivider = ({
  variant = "soft",
  seed = 0,
  className,
}: WaveDividerProps) => {
  const ocean = variant === "ocean";
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none overflow-hidden",
        ocean ? "block w-full" : "absolute inset-x-0 top-0 h-20 w-full sm:h-28",
        className,
      )}
      style={ocean ? { height: oceanHeight(seed) } : undefined}
    >
      <svg
        viewBox={`0 0 ${2 * PERIOD} 100`}
        preserveAspectRatio="none"
        className="animate-wave-drift block h-full w-[200%]"
        style={{
          animationDuration: ocean ? `${16 + 4 * (seed % 3)}s` : "22s",
          animationDirection: ocean && seed % 2 === 0 ? "reverse" : "normal",
        }}
      >
        <path d={ocean ? oceanPath(seed) : softPath()} fill="currentColor" />
      </svg>
    </div>
  );
};

export default WaveDivider;
