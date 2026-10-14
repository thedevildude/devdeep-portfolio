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
  { x: 1192, y: 108, r: 44, base: "#7cc4d2", accent: "#b9ece8", accent2: "#e0f8f4", rim: "#ecfcff" },
  { x: 762, y: 383, r: 53, base: "#eba6bc", accent: "#fdd0dc", accent2: "#7f79d0", rim: "#fff0f6" },
  { x: 1876, y: 383, r: 77, base: "#e2aef0", accent: "#f2cdf4", accent2: "#fde5f4", rim: "#fff2fc" },
  { x: 20, y: 1200, r: 385, base: "#0145fd", accent: "#a8a2f6", accent2: "#fde5f4", rim: "#e6e2ff" },
  { x: 1720, y: 1265, r: 445, base: "#0a52f0", accent: "#acdcf2", accent2: "#eefaf8", rim: "#dcf4fb" },
  { x: 1258, y: 885, r: 45, base: "#4f7bf0", accent: "#93aef6", accent2: "#d2ddfb", rim: "#e0e8ff", opacity: 0.9 },
  { x: 612, y: 972, r: 21, base: "#f0b2c8", accent: "#fedff5", accent2: "#c890b8", rim: "#fff2f8" },
  { x: 900, y: 215, r: 9, base: "#8cd2dc", accent: "#c8f0ec", accent2: "#e8fbf8", rim: "#f2ffff" },
  { x: 1835, y: 178, r: 11, base: "#8cd2dc", accent: "#c8f0ec", accent2: "#e8fbf8", rim: "#f2ffff" },
  { x: 1385, y: 428, r: 14, base: "#eea488", accent: "#f8caae", accent2: "#b4849a", rim: "#ffeadc" },
  { x: 1633, y: 761, r: 15, base: "#eea488", accent: "#f8caae", accent2: "#b4849a", rim: "#ffeadc" },
  { x: 1610, y: 530, r: 14, base: "#a698f4", accent: "#d0c4fa", accent2: "#f3ecfd", rim: "#f6f2ff" },
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
  [1100, 255, 46], [1190, 300, 40], [1320, 315, 54], [1178, 995, 60],
  [350, 6, 44], [1200, 362, 22], [845, 255, 18], [1530, 210, 20],
];
