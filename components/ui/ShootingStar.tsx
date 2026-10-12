type Streak = {
  x: number;
  y: number;
  scale: number;
  delay: number;
  duration: number;
};

/** Head position, size, and timing of each star; staggered so they never move in unison. */
const STREAKS: Streak[] = [
  { x: 340, y: 46, scale: 1, delay: 0, duration: 5 },
  { x: 232, y: 118, scale: 0.7, delay: 1.6, duration: 4.2 },
  { x: 388, y: 168, scale: 0.85, delay: 3.1, duration: 5.6 },
  { x: 150, y: 56, scale: 0.55, delay: 0.8, duration: 4.6 },
  { x: 300, y: 252, scale: 0.6, delay: 2.4, duration: 4 },
];

const TWINKLES = [
  { x: 60, y: 130, r: 3 },
  { x: 90, y: 230, r: 2 },
  { x: 200, y: 26, r: 2 },
  { x: 410, y: 100, r: 2.5 },
] as const;

/** Several stars, each drifting along its own tail direction and fading in and out in place. */
const ShootingStar = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 430 290" fill="none" className={className}>
    <defs>
      <linearGradient id="star-tail" x1="1" y1="0" x2="0" y2="1">
        <stop stopColor="currentColor" />
        <stop offset="1" stopColor="currentColor" stopOpacity="0" />
      </linearGradient>
    </defs>

    {TWINKLES.map((t) => (
      <circle
        key={`${t.x}-${t.y}`}
        cx={t.x}
        cy={t.y}
        r={t.r}
        fill="currentColor"
        opacity="0.5"
      />
    ))}

    {STREAKS.map((s) => (
      <g
        key={`${s.x}-${s.y}`}
        transform={`translate(${s.x} ${s.y}) scale(${s.scale})`}
      >
        <g
          className="animate-shooting-star"
          style={{
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        >
          <path d="M0 0-130 76-116 82Z" fill="url(#star-tail)" opacity="0.7" />
          <path
            d="M0-16c2 10 6 14 16 16-10 2-14 6-16 16-2-10-6-14-16-16 10-2 14-6 16-16Z"
            fill="currentColor"
          />
        </g>
      </g>
    ))}
  </svg>
);

export default ShootingStar;
