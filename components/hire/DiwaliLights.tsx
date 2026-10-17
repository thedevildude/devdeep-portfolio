import { useId } from "react";
import { cn } from "@/lib/utils";

const WIDTH = 2600;
const HEIGHT = 92;
/** Height of the hooks the wire hangs from. */
const TOP = 12;
const COLORS = [
  "#ffb020",
  "#ff5c8a",
  "#22c55e",
  "#22c3dd",
  "#ff7a1a",
  "#ffd23f",
  "#a78bfa",
];

/** Small seeded PRNG (mulberry32), so a divider looks the same on server and client. */
const random = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type Span = { x0: number; x1: number; sag: number };
type Bulb = {
  x: number;
  y: number;
  angle: number;
  scale: number;
  color: string;
  delay: number;
};

/** Lays out one irregular light string: uneven spans, sags and bulb spacing. */
const layout = (seed: number) => {
  const rand = random(seed);
  const between = (a: number, b: number) => a + rand() * (b - a);

  const hooks: number[] = [between(-120, 0)];
  while (hooks[hooks.length - 1] < WIDTH) {
    hooks.push(hooks[hooks.length - 1] + between(150, 290));
  }

  const spans: Span[] = hooks.slice(1).map((x1, i) => {
    const x0 = hooks[i];
    // Longer spans sag more, with some play either way.
    return { x0, x1, sag: (x1 - x0) * between(0.1, 0.16) };
  });

  const bulbs: Bulb[] = [];
  let colorIndex = Math.floor(rand() * COLORS.length);
  for (const { x0, x1, sag } of spans) {
    const count = Math.max(2, Math.round((x1 - x0) / between(48, 70)));
    for (let i = 0; i < count; i++) {
      // Evenly placed, then nudged so the spacing is never regular.
      const t = (i + 0.5) / count + between(-0.06, 0.06);
      const x = x0 + (x1 - x0) * t;
      const y = TOP + 4 * sag * t * (1 - t);
      // Slope of the wire at t, so each bulb hangs along it, plus a wobble.
      const slope = (4 * sag * (1 - 2 * t)) / (x1 - x0);
      const angle =
        ((Math.atan(slope) * 180) / Math.PI) * 0.6 + between(-14, 14);
      colorIndex = (colorIndex + 1 + Math.floor(rand() * 3)) % COLORS.length;
      bulbs.push({
        x,
        y,
        angle,
        scale: between(0.85, 1.15),
        color: COLORS[colorIndex],
        delay: between(0, 3.2),
      });
    }
  }
  return { hooks, spans, bulbs, sizes: hooks.map(() => between(0.8, 1.2)) };
};

/** A marigold at a hook: layered petals in two oranges. */
const Marigold = ({ x, size }: { x: number; size: number }) => (
  <g transform={`translate(${x} ${TOP}) scale(${size})`}>
    {Array.from({ length: 10 }, (_, i) => (
      <ellipse
        key={i}
        cx="0"
        cy="-4.2"
        rx="2.6"
        ry="4.4"
        fill={i % 2 ? "#f59e0b" : "#fb8c00"}
        transform={`rotate(${i * 36})`}
      />
    ))}
    <circle r="3.4" fill="#ffb300" />
    <circle r="1.6" fill="#e65100" />
  </g>
);

/**
 * Diwali-style string lights used as a section divider: a loosely draped wire
 * with glowing bulbs and marigolds at the hooks. Pass a different `seed` per
 * divider so no two hang the same way. Purely decorative.
 */
const DiwaliLights = ({
  seed = 1,
  className,
}: {
  seed?: number;
  className?: string;
}) => {
  const glow = `glow-${useId().replace(/:/g, "")}`;
  const { hooks, spans, bulbs, sizes } = layout(seed);
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none relative z-10 flex h-28 justify-center overflow-hidden",
        className,
      )}
    >
      <svg
        width={WIDTH * 1.2}
        height={HEIGHT * 1.2}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="shrink-0"
      >
        <defs>
          <filter id={glow} x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="4.5" />
          </filter>
        </defs>
        {spans.map(({ x0, x1, sag }) => (
          <path
            key={x0}
            d={`M${x0} ${TOP} Q${(x0 + x1) / 2} ${TOP + 2 * sag} ${x1} ${TOP}`}
            fill="none"
            stroke="#4a3b2a"
            strokeOpacity="0.55"
            strokeWidth="1.4"
          />
        ))}
        {bulbs.map((b) => (
          <g
            key={b.x}
            transform={`translate(${b.x} ${b.y}) rotate(${b.angle}) scale(${b.scale})`}
          >
            <circle
              cy="9"
              r="9"
              fill={b.color}
              filter={`url(#${glow})`}
              className="diwali-twinkle"
              style={{ animationDelay: `${b.delay.toFixed(2)}s` }}
            />
            <rect
              x="-2"
              y="-0.5"
              width="4"
              height="3.5"
              rx="1"
              fill="#5b4a36"
            />
            <path
              d="M0 3C4.2 5 4.2 11.5 0 14C-4.2 11.5-4.2 5 0 3Z"
              fill={b.color}
            />
            <ellipse
              cx="-1.2"
              cy="7"
              rx="0.9"
              ry="1.8"
              fill="#fff"
              opacity="0.7"
            />
          </g>
        ))}
        {hooks.map((x, i) => (
          <Marigold key={x} x={x} size={sizes[i]} />
        ))}
      </svg>
    </div>
  );
};

export default DiwaliLights;
