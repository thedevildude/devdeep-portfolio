/**
 * The hero scene's layout, in the artwork's own pixel space (1920×1088). World space has its
 * origin at the artwork's centre with y up; positions below are measured from the artwork.
 */
export const IMG_W = 1920;
export const IMG_H = 1088;

/** Artwork pixel (x right, y down) → world (origin centre, y up). */
export const at = (x: number, y: number): [number, number] => [x - IMG_W / 2, IMG_H / 2 - y];

export const CENTER = at(975, 440);

/** Where the starburst sits across the screen on wide layouts, clear of the hero card. */
export const BURST_SCREEN_X = 0.64;

/** Milky Way band angle (radians, before the galaxy's sway). */
export const BAND_ANGLE = 0.32;

/** Big bang timeline: seconds, and the shockwave's final radius in world px. */
export const BANG_AT = 0.45;
export const REVEAL_FOR = 2.4;
export const REVEAL_RADIUS = 2400;

export const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
export const easeOutBack = (x: number) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export type PlanetSpec = {
  x: number;
  y: number;
  r: number;
  base: string;
  accent: string;
  accent2: string;
  rim: string;
  opacity?: number;
};

/** Measured from the artwork, coloured to match it and the site palette. */
export const PLANETS: PlanetSpec[] = [
  { x: 642, y: -5, r: 183, base: "#5a86f0", accent: "#a6a8f4", accent2: "#f1ecfb", rim: "#e6ebff" },
  { x: 1192, y: 218, r: 44, base: "#7cc4d2", accent: "#b9ece8", accent2: "#e0f8f4", rim: "#ecfcff" },
  { x: 762, y: 383, r: 53, base: "#eba6bc", accent: "#fdd0dc", accent2: "#7f79d0", rim: "#fff0f6" },
  { x: 1876, y: 383, r: 77, base: "#e2aef0", accent: "#f2cdf4", accent2: "#fde5f4", rim: "#fff2fc" },
  { x: 40, y: 930, r: 290, base: "#b98ae6", accent: "#f2b8d8", accent2: "#fde5f4", rim: "#ffe8f6" },
  { x: 1670, y: 1085, r: 500, base: "#0a52f0", accent: "#acdcf2", accent2: "#eefaf8", rim: "#dcf4fb" },
  { x: 1180, y: 760, r: 45, base: "#4f7bf0", accent: "#93aef6", accent2: "#d2ddfb", rim: "#e0e8ff", opacity: 0.9 },
  { x: 612, y: 890, r: 21, base: "#f0b2c8", accent: "#fedff5", accent2: "#c890b8", rim: "#fff2f8" },
  { x: 900, y: 215, r: 9, base: "#8cd2dc", accent: "#c8f0ec", accent2: "#e8fbf8", rim: "#f2ffff" },
  { x: 1835, y: 178, r: 11, base: "#8cd2dc", accent: "#c8f0ec", accent2: "#e8fbf8", rim: "#f2ffff" },
  { x: 1385, y: 520, r: 14, base: "#eea488", accent: "#f8caae", accent2: "#b4849a", rim: "#ffeadc" },
  { x: 1460, y: 600, r: 15, base: "#eea488", accent: "#f8caae", accent2: "#b4849a", rim: "#ffeadc" },
  { x: 1610, y: 610, r: 14, base: "#a698f4", accent: "#d0c4fa", accent2: "#f3ecfd", rim: "#f6f2ff" },
];

/** The planet the starburst's rays fan out from, backlit like an eclipse, at the scene's centre. */
export const CORE_PLANET: PlanetSpec = {
  x: 975,
  y: 440,
  r: 30,
  base: "#3f63d8",
  accent: "#7d9cf0",
  accent2: "#c9dafc",
  rim: "#dceaff",
};

/** The starburst: how many rays, and their length range (world px) beyond the core's rim. */
export const RAYS = { count: 110, minLength: 40, maxLength: 230 };

/** Bright four-point stars, as painted. [x, y, size] in artwork pixels. */
export const SPARKLES: [number, number, number][] = [
  [1100, 365, 46], [1190, 410, 40], [1320, 425, 54], [1178, 905, 60],
  [350, 6, 44], [1200, 472, 22], [845, 255, 18], [1530, 320, 20],
];

/** Orbit arcs around the starburst: [radius, from°, to°]. Satellites travel along them. */
export const ORBIT_ARCS: [number, number, number][] = [
  [330, -35, 168],
  [195, 25, 158],
  [560, 52, 122],
];

/** The asteroid belt circling the core: a tilted, foreshortened disc (world px, radians). */
export const BELT = { count: 1500, radius: 255, spread: 28, tilt: -0.28, squash: 0.36 };

/** Rings around the pink planet (PLANETS[2]); radii as multiples of the planet's radius. */
export const RING = {
  planet: 2,
  inner: 1.35,
  outer: 2.15,
  tilt: -0.38,
  squash: 0.32,
  colA: "#fde5f4",
  colB: "#b9a8ff",
};

/** Moons orbiting planets (by PLANETS index): orbit radius in world px, speed in rad/s. */
export const MOONS = [
  { planet: 1, orbit: 78, squash: 0.38, tilt: 0.25, speed: 0.35, spec: { r: 7, base: "#f6d8e8", accent: "#fde5f4", accent2: "#c8a8d8", rim: "#fff4fa" } },
  { planet: 0, orbit: 245, squash: 0.3, tilt: -0.12, speed: -0.16, spec: { r: 13, base: "#8fa6f4", accent: "#c9d4fb", accent2: "#eef2ff", rim: "#f2f5ff" } },
];

/** Distant spiral galaxies: artwork position, size (world px), tilt and foreshortening. */
export const GALAXIES = [
  { x: 1450, y: 275, size: 84, tilt: 0.5, squash: 0.42, tint: [0.85, 0.82, 1] },
  { x: 1320, y: 625, size: 58, tilt: -0.35, squash: 0.6, tint: [1, 0.86, 0.94] },
  { x: 760, y: 760, size: 46, tilt: 1.1, squash: 0.36, tint: [0.76, 0.86, 1] },
];
