const ShootingStar = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 320 200" fill="none" className={className}>
    <defs>
      <linearGradient
        id="star-tail"
        x1="300"
        y1="30"
        x2="20"
        y2="170"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="currentColor" />
        <stop offset="1" stopColor="currentColor" stopOpacity="0" />
      </linearGradient>
    </defs>
    <g className="animate-shooting-star">
      <path d="M296 34 24 172 270 52Z" fill="url(#star-tail)" opacity="0.55" />
      <path
        d="M296 34 90 138"
        stroke="url(#star-tail)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M296 14c2 12 8 18 20 20-12 2-18 8-20 20-2-12-8-18-20-20 12-2 18-8 20-20Z"
        fill="currentColor"
      />
    </g>
    <path
      d="M70 40c1 6 4 9 10 10-6 1-9 4-10 10-1-6-4-9-10-10 6-1 9-4 10-10Z"
      fill="currentColor"
      opacity="0.7"
    />
    <path
      d="M150 20c.8 4 3 6 7 7-4 .8-6 3-7 7-.8-4-3-6-7-7 4-.8 6-3 7-7Z"
      fill="currentColor"
      opacity="0.5"
    />
    <circle cx="220" cy="170" r="3" fill="currentColor" opacity="0.6" />
    <circle cx="40" cy="100" r="2" fill="currentColor" opacity="0.5" />
  </svg>
);

export default ShootingStar;
