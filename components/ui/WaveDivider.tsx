import { cn } from "@/lib/utils";

type WaveDividerProps = {
  /** "soft": a smooth, gentle wave hanging down from the top edge. "ocean": uneven scallops rising above it. */
  variant?: "soft" | "ocean";
  /** Seeds the ocean scallops' widths and heights so each divider differs. */
  seed?: number;
  className?: string;
};

/** Deterministic PRNG, so server and client render the same "random" wave. */
const rng = (seed: number) => {
  let a = (seed + 1) * 0x9e3779b9;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const CUSP_Y = 40;

/**
 * A row of scallops between sharp cusps, as a closed path filling the area on the far
 * side of the crests. `dir` -1 makes crests rise (filled below), +1 makes them hang
 * (filled above). A cubic with both handles at k peaks at 0.75k, hence the 1/0.75.
 */
const scallops = (
  count: number,
  dir: -1 | 1,
  width: () => number,
  height: () => number,
) => {
  const widths = Array.from({ length: count }, width);
  const total = widths.reduce((a, b) => a + b, 0);
  let x = 0;
  let d = `M0 ${CUSP_Y}`;
  for (const w of widths) {
    const nx = x + (w / total) * 1440;
    const handle = CUSP_Y + (dir * height()) / 0.75;
    d += `C${x.toFixed(1)} ${handle.toFixed(1)} ${nx.toFixed(1)} ${handle.toFixed(1)} ${nx.toFixed(1)} ${CUSP_Y}`;
    x = nx;
  }
  return dir === 1 ? `${d}V0H0Z` : `${d}V100H0Z`;
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

  const rand = rng(seed);
  const count = 7 + Math.floor(rand() * 6);
  const d = scallops(
    count,
    -1,
    () => 0.6 + rand() * 0.9,
    () => 26 + rand() * 30,
  );
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 100"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-[calc(100%-1px)] h-14 w-full sm:h-20",
        className,
      )}
      style={{ transform: "translateY(" + CUSP_Y + "%)" }}
    >
      <path d={d} fill="currentColor" />
    </svg>
  );
};

export default WaveDivider;
