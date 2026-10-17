/**
 * GLSL for the hero: a still river at dusk in the site palette.
 *
 * Two passes. SIM_FRAG steps a height-field wave simulation of the water near the camera,
 * which is where clicks and the cursor's "fish" disturb the surface. FRAG then ray traces
 * every pixel: sky (gradient, clouds, stars, the rising lamp), layered hills, and the
 * water, which mirrors both through the simulated ripples. Colours are display sRGB.
 */

export const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

/**
 * One step of the wave simulation. r = surface height, g = its vertical velocity.
 * Disturbances arrive as drops: (u, v, radius in world units, strength).
 */
export const SIM_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D uPrev;
uniform vec2 uTexel;
uniform vec2 uSize;
uniform vec4 uDrops[12];
uniform int uDropCount;
varying vec2 vUv;

void main() {
  vec4 info = texture2D(uPrev, vUv);
  float avg = (
    texture2D(uPrev, vUv + vec2(uTexel.x, 0.0)).r +
    texture2D(uPrev, vUv - vec2(uTexel.x, 0.0)).r +
    texture2D(uPrev, vUv + vec2(0.0, uTexel.y)).r +
    texture2D(uPrev, vUv - vec2(0.0, uTexel.y)).r) * 0.25;
  // Slower-than-lattice waves read as calmer water; damping lets rings die away.
  info.g += (avg - info.r) * 0.42;
  info.g *= 0.988;
  info.r += info.g;
  info.r *= 0.9985;

  for (int i = 0; i < 12; i++) {
    if (i >= uDropCount) break;
    vec4 d = uDrops[i];
    float r = length((vUv - d.xy) * uSize) / d.z;
    if (r < 1.0) info.r += d.w * (0.5 + 0.5 * cos(r * 3.14159265));
  }

  // Soak up waves within a metre of the edges instead of bouncing them back.
  vec2 band = 1.0 / uSize;
  vec2 e = smoothstep(vec2(0.0), band, vUv) * (1.0 - smoothstep(1.0 - band, vec2(1.0), vUv));
  info.rg *= mix(0.9, 1.0, e.x * e.y);
  gl_FragColor = info;
}
`;

export const FRAG = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec3 uCamPos;
uniform mat3 uCamRot;
uniform vec2 uTan;
uniform vec3 uSun;
uniform float uRise;
uniform float uDim;
uniform int uCloudOct;

uniform sampler2D uSim;
uniform float uSimOn;
uniform vec4 uSimRect;
uniform vec2 uSimTexel;

// The fish: x, z, heading (radians), visibility; and its tail-beat phase.
uniform vec4 uFish;
uniform float uFishPhase;

// Site palette.
uniform vec3 uZenith;
uniform vec3 uCobalt;
uniform vec3 uLavender;
uniform vec3 uPetal;
uniform vec3 uGlow;
uniform vec3 uDeep;
uniform vec3 uForest;

// Angular size of a pixel, for anti-aliased silhouettes.
uniform float uPix;

// Tree-line silhouette mask (white = tree), and whether it has loaded.
uniform sampler2D uTrees;
uniform float uTreesOn;
uniform float uTreesAspect;
uniform float uTreesTexH;

varying vec2 vUv;


float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),
    mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p, int oct) {
  float v = 0.0;
  float a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for (int i = 0; i < 6; i++) {
    if (i >= oct) break;
    v += a * vnoise(p);
    p = r * p * 2.03 + 11.7;
    a *= 0.5;
  }
  return v;
}

// ---------------------------------------------------------------- sky

vec2 clouds(vec3 rd, int oct) {
  if (rd.y <= 0.01) return vec2(0.0);
  float dist = (420.0 - uCamPos.y) / rd.y;
  vec2 p = (uCamPos.xz + rd.xz * dist) * 0.0016;
  p += vec2(uTime * 0.004, uTime * 0.0015);
  vec2 q = vec2(p.x * 0.55, p.y * 1.3);
  float warp = fbm(q * 0.7 + 3.0, 3);
  float n = fbm(q + warp * 0.9, oct);
  float d = smoothstep(0.5, 0.8, n);
  d *= smoothstep(0.012, 0.09, rd.y) * (1.0 - smoothstep(0.2, 0.55, rd.y));
  return vec2(d, clamp(n * 1.6 - 0.55, 0.0, 1.0));
}

/**
 * Mountains: four ranges at increasing distance, each a silhouette in angle (azimuth ->
 * elevation), falling away into a saddle around the lamp where the river runs out. The two
 * far ranges are ridged multifractal noise (sharp peaks, saddles, erosion detail down to the
 * pixel); the two near ones are wooded hills carrying the tree-line asset. Drifting mist
 * banks hang between them.
 */

/** Tree cover (0-1) standing on a ridge whose ground is at elevation h. */
float trees(float az, float e, float h, float height, float shift) {
  if (uTreesOn < 0.5 || height <= 0.0) return 0.0;
  // Around the lamp the trees sink into the far shore, leaving the valley open.
  float sink = 0.18 + 0.75 * (1.0 - smoothstep(0.02, 0.22, abs(az)));
  float v = (e - h) / height + sink;
  float u = az / (height * uTreesAspect) + shift;
  // Pick the mip level from the known pixel footprint: sampling inside branches leaves the
  // GPU's own estimate undefined, which shows up as speckled outlines.
  float lod = log2(max(1.0, uTreesTexH / height * uPix));
  float cover = textureLod(uTrees, vec2(u, clamp(v, 0.0, 1.0)), lod).r;
  return v < 0.0 ? 1.0 : v > 1.0 ? 0.0 : cover;
}

/**
 * Ridged multifractal profile (0-1): each octave folds noise into a crease, and is weighted
 * by the one before it, so detail gathers on the peaks the way erosion leaves it. Octaves stop
 * at the pixel, so edges stay crisp without shimmering.
 */
float ridged(float x, float seed, float scale, float maxOct) {
  float octs = log2(1.0 / max(2.0 * uPix * scale, 1e-5)) / log2(2.07) + 1.0;
  int oct = int(clamp(octs, 2.0, maxOct));
  float sum = 0.0;
  float amp = 0.5;
  float prev = 1.0;
  float f = 1.0;
  float norm = 0.0;
  for (int i = 0; i < 9; i++) {
    if (i >= oct) break;
    float n = 1.0 - abs(vnoise(vec2(x * f, seed + float(i) * 7.31)) * 2.0 - 1.0);
    n *= n;
    sum += n * amp * (0.3 + 0.7 * prev);
    norm += amp;
    prev = n;
    f *= 2.07;
    amp *= 0.5;
  }
  return sum / norm;
}

/**
 * Elevation of each range's skyline at an azimuth (radians), far (0) to near (3). maxOct caps
 * the rock detail: fewer octaves give the broad shape of the range.
 */
float skyline(int i, float az, float maxOct) {
  float a = abs(az);
  // Open around the lamp, rising toward the frame edges.
  float open = smoothstep(0.03, 0.38, a);
  if (i == 0) {
    float x = az * 2.4 + 0.35 * vnoise(vec2(az * 1.3, 9.1)) + 3.1;
    return 0.002 + (0.02 + 0.2 * open) * ridged(x, 1.3, 1.0 / 2.4, maxOct);
  }
  if (i == 1) {
    float x = az * 4.2 + 0.3 * vnoise(vec2(az * 2.1, 4.7)) + 17.0;
    return 0.0005 + (0.01 + 0.13 * open) * ridged(x, 2.7, 1.0 / 4.2, maxOct) + 0.015 * a;
  }
  // The wooded hills and the banks are low and rounded; their trees do the rest.
  float roll = fbm(vec2(az * (i == 2 ? 5.0 : 8.0), i == 2 ? 3.3 : 8.9), 3);
  if (i == 2) return -0.0008 + (0.008 + 0.045 * a) * smoothstep(0.05, 0.3, a) * (0.55 + 0.7 * roll);
  return max(-0.0035 + (0.005 + 0.028 * a) * smoothstep(0.04, 0.3, a) * (0.6 + 0.6 * roll), -0.0035);
}

/** Drifting mist bank (0-1) hanging just above elevation foot. */
float mist(float az, float e, float foot, float thick, float seed, bool cheap) {
  float hgt = (e - foot) / thick;
  if (hgt > 3.0) return 0.0;
  float falloff = exp(-max(hgt, 0.0) * 1.15) * smoothstep(-0.6, 0.2, hgt);
  vec2 q = vec2(az * 4.5 + uTime * (0.008 + seed * 0.003), e * 55.0 + seed * 13.0);
  float warp = fbm(q * vec2(0.6, 0.9) + seed, cheap ? 2 : 3);
  float w = fbm(q + vec2(warp * 1.5, warp * 0.8), cheap ? 3 : 4);
  return falloff * smoothstep(0.32, 0.78, w);
}

/** Mist is lit by the lamp: pink-white near it, lavender away from it. */
vec3 mistColour(float az) {
  float near = exp(-abs(az) * 4.0);
  return mix(uLavender, uPetal, (0.25 + 0.6 * near) * uRise) * (0.85 + 0.25 * near * uRise);
}

vec3 hills(vec3 rd, vec3 col, out float cover, bool cheap) {
  cover = 0.0;
  float e = rd.y;
  if (e > 0.16) return col;
  float az = atan(rd.x, -rd.z);
  float toward = pow(max(dot(normalize(vec3(rd.x, 0.0, rd.z)), normalize(vec3(uSun.x, 0.0, uSun.z))), 0.0), 6.0);
  vec3 mistCol = mistColour(az);

  for (int i = 0; i < 4; i++) {
    float fi = float(i);
    float h = skyline(i, az, cheap ? 6.0 : 9.0);
    float foot = i == 3 ? -0.0035 : -0.0008;
    float ground = 1.0 - smoothstep(h - uPix, h + uPix, e);
    float wood = i == 3 ? trees(az, e, h, 0.03, 0.0) : i == 2 ? trees(az, e, h, 0.012, 0.37) : 0.0;
    float inside = max(ground, wood) * smoothstep(foot - uPix, foot + uPix, e);
    if (inside > 0.0) {
      // Aerial perspective: far ranges pale lavender-blue, near ones deep navy.
      vec3 tone = i == 0 ? mix(uCobalt, uLavender, 0.42) * 0.82
                : i == 1 ? mix(uZenith, uCobalt, 0.55)
                : i == 2 ? mix(uZenith, uCobalt, 0.3)
                : uForest;
      // Slopes facing the lamp catch a soft glow below their crests; the far sides fall into
      // shadow. The slope comes from the skyline a step further from the lamp.
      if (i < 2) {
        float step = 0.02 * sign(az + 1e-6);
        float rise = (skyline(i, az + step, 3.0) - skyline(i, az, 3.0)) / abs(step);
        float facing = clamp(rise * 1.6, -1.0, 1.0);
        float below = exp(-max(h - e, 0.0) / (0.03 - fi * 0.01));
        tone *= 1.0 - 0.18 * max(-facing, 0.0) * below;
        tone += mix(uLavender, uPetal, 0.5) * max(facing, 0.0) * below * (0.16 - fi * 0.05) * uRise;
      }
      // Haze thickens toward each range's foot.
      float depth = 1.0 - smoothstep(foot, foot + 0.05 - fi * 0.008, e);
      vec3 c = mix(tone, mistCol, depth * (0.55 - fi * 0.12));
      // The lamp, low behind the ranges, rims their crests.
      float rim = exp(-max(h - e, 0.0) / (0.0012 + fi * 0.0006));
      c += mix(uLavender, uPetal, 0.65) * rim * toward * (0.5 - fi * 0.11) * uRise;
      col = mix(col, c, inside);
      cover = max(cover, inside);
    }
    // A mist bank drifts in front of each range but the nearest.
    if (i < 3) {
      float m = mist(az, e, foot, 0.036 - fi * 0.007, fi * 2.3 + 1.0, cheap);
      col = mix(col, mistCol, m * (0.6 - fi * 0.1));
    }
  }
  return col;
}

vec3 sky(vec3 rd, bool cheap) {
  float y = max(rd.y, 0.0);
  float s = max(dot(rd, uSun), 0.0);

  vec3 col = mix(uLavender, uCobalt, smoothstep(0.0, 0.16, y));
  col = mix(col, uZenith, smoothstep(0.12, 0.75, y));

  float around = pow(s, 6.0) * exp(-y * 9.0) * 0.75 + pow(s, 40.0) * 0.35;
  col = mix(col, uPetal, clamp(around * (0.25 + 0.75 * uRise), 0.0, 1.0));

  vec2 c = clouds(rd, cheap ? 3 : uCloudOct);
  vec3 shade = mix(uCobalt * 0.55, uLavender, 0.25);
  vec3 lit = mix(uLavender, uPetal, clamp(pow(s, 3.0) * 1.4, 0.0, 1.0));
  vec3 cloudCol = mix(shade, lit, c.y * (0.35 + 0.65 * uRise) * (0.5 + 0.5 * pow(s, 2.0)));
  col = mix(col, cloudCol, c.x * 0.85);

  // The lamp: a bright core, a soft halo and a faint four-point flare.
  float halo = pow(s, 2600.0) * 1.4 + pow(s, 380.0) * 0.28 + pow(s, 60.0) * 0.07;
  float disc = smoothstep(0.99975, 0.99992, s);
  vec3 sr = normalize(cross(uSun, vec3(0.0, 1.0, 0.0)));
  vec3 su = cross(sr, uSun);
  float u = dot(rd, sr);
  float v = dot(rd, su);
  float flare = exp(-abs(u) * 1400.0) * exp(-abs(v) * 22.0) + exp(-abs(v) * 1400.0) * exp(-abs(u) * 16.0);
  flare *= step(0.0, dot(rd, uSun));
  col += uGlow * (halo + disc * 2.0 + flare * 0.8) * (1.0 - c.x * 0.7) * uRise;

  // Stars, fading toward the lit horizon and behind clouds.
  vec2 g = vec2(atan(rd.x, -rd.z), rd.y) * 260.0;
  vec2 cell = floor(g);
  float h = hash12(cell);
  vec2 off = vec2(hash12(cell + 7.1), hash12(cell + 3.9)) - 0.5;
  float star = step(0.985, h) * (1.0 - smoothstep(0.0, 0.09, length(fract(g) - 0.5 - off * 0.6)));
  star *= 0.6 + 0.4 * sin(uTime * (1.5 + h * 4.0) + h * 40.0);
  star *= smoothstep(0.08, 0.35, y) * (1.0 - c.x) * (1.0 - pow(s, 3.0));
  col += uGlow * star * 0.9;

  float cover;
  col = hills(rd, col, cover, cheap);
  return col;
}

/** What a ray off the water sees. */
vec3 scene(vec3 rd) {
  return sky(rd, true);
}

// ---------------------------------------------------------------- water

/** Faint breeze ripples drifting downstream, so the surface is never perfectly still. */
vec2 breeze(vec2 p, float dist) {
  vec2 g = vec2(0.0);
  float amp = 1.0;
  float freq = 0.9;
  float ang = 0.3;
  for (int i = 0; i < 6; i++) {
    vec2 dir = vec2(cos(ang), sin(ang));
    float x = dot(dir, p) * freq + uTime * (0.6 + float(i) * 0.15) + float(i) * 1.7;
    float fade = 1.0 - smoothstep(0.2, 1.0, freq * dist * 0.02);
    g += amp * fade * cos(x) * freq * dir;
    amp *= 0.7;
    freq *= 1.45;
    ang += 2.39996;
  }
  return g * 0.006;
}

/** Simulated ripple slope at a point on the water (zero outside the simulated patch). */
vec2 ripples(vec2 p, float dist) {
  vec2 uv = (p - uSimRect.xy) / uSimRect.zw;
  if (uSimOn < 0.5 || uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec2(0.0);
  // Farther away, measure the slope over a wider span so fine rings blur instead of aliasing.
  vec2 o = uSimTexel * (1.0 + dist * 0.12);
  float hx = texture2D(uSim, uv + vec2(o.x, 0.0)).r - texture2D(uSim, uv - vec2(o.x, 0.0)).r;
  float hz = texture2D(uSim, uv + vec2(0.0, o.y)).r - texture2D(uSim, uv - vec2(0.0, o.y)).r;
  vec2 world = 2.0 * o * uSimRect.zw;
  return vec2(hx / world.x, hz / world.y) * 0.3;
}

/** The fish's outline under the surface, soft-edged; 0-1. */
float fishMask(vec2 p) {
  if (uFish.w < 0.01) return 0.0;
  vec2 d = p - uFish.xy;
  vec2 fwd = vec2(cos(uFish.z), sin(uFish.z));
  vec2 lat = vec2(-fwd.y, fwd.x);
  float lx = dot(d, fwd);
  float ly = dot(d, lat);
  // The body flexes more toward the tail.
  float tail = clamp(0.35 - lx, 0.0, 1.4);
  ly -= sin(lx * 3.2 - uFishPhase) * 0.16 * tail;
  float body = 0.24 * sqrt(max(0.0, 1.0 - pow((lx - 0.1) / 0.62, 2.0)));
  float shape = (1.0 - smoothstep(body * 0.3, body + 0.08, abs(ly))) * step(-0.52, lx) * step(lx, 0.72);
  // A fanned tail fin.
  float fin = smoothstep(-0.92, -0.62, lx) * (1.0 - smoothstep(-0.62, -0.48, lx));
  shape = max(shape, fin * (1.0 - smoothstep(0.06, 0.22, abs(ly))) * smoothstep(0.0, 0.12, abs(ly) + 0.05));
  return shape * uFish.w;
}

void main() {
  vec2 ndc = vUv * 2.0 - 1.0;
  vec3 rd = normalize(uCamRot * vec3(ndc.x * uTan.x, ndc.y * uTan.y, -1.0));
  vec3 ro = uCamPos;

  vec3 col;
  if (rd.y < 0.0) {
    float tw = -ro.y / min(rd.y, -1e-5);
    vec3 pos = ro + rd * tw;
    // Far off, ripples are seen edge-on; soften them so they don't alias into streaks.
    vec2 slope = ripples(pos.xz, tw) * mix(1.0, 0.2, smoothstep(6.0, 30.0, tw)) + breeze(pos.xz, tw);
    // Real ripples on still water are shallow; capping the tilt keeps reflections from flipping.
    slope /= max(1.0, length(slope) / mix(0.34, 0.18, smoothstep(2.0, 20.0, tw)));
    vec3 n = normalize(vec3(-slope.x, 1.0, -slope.y));

    vec3 view = -rd;
    float cosv = max(dot(n, view), 0.0);
    float fres = 0.06 + 0.94 * pow(1.0 - cosv, 4.0);
    vec3 refl = reflect(rd, n);
    refl.y = max(refl.y, 0.0005);
    vec3 mirror = scene(normalize(refl));

    // Below the surface: deep, still cobalt, with a pale koi glimpsed where the fish swims.
    vec3 body = uDeep * (0.8 + 0.25 * fbm(pos.xz * 0.15, 2));
    // Refraction bends the fish a little with the ripples above it.
    float koi = fishMask(pos.xz + slope * 0.6);
    body = mix(body, mix(uPetal, uLavender, 0.35) * 0.42, koi * 0.75);
    // Slopes facing the lamp catch a little more light, so ripples read even looking down.
    vec3 toLamp = normalize(vec3(uSun.x, 0.5, uSun.z));
    body *= 0.55 + 0.9 * clamp(dot(n, toLamp) / dot(vec3(0.0, 1.0, 0.0), toLamp), 0.0, 1.6) * 0.5 + 0.0;
    col = mix(body, mirror, clamp(fres + 0.42, 0.0, 1.0));

    // Glints where ripples tilt the surface toward the lamp.
    float sd = max(dot(normalize(refl), uSun), 0.0);
    col += uGlow * (pow(sd, 3000.0) * 5.0 + pow(sd, 450.0) * 0.35) * uRise;

    // Far out the surface settles into a clean mirror image.
    col = mix(col, scene(normalize(vec3(rd.x, -rd.y, rd.z))), 1.0 - exp(-tw * 0.004));

    // The far shore: the nearest ridge's foot sits just below the horizon, over the water.
    float shore;
    col = hills(rd, col, shore, false);

    // Low mist lying on the water toward the far shore.
    float az = atan(rd.x, -rd.z);
    float low = mist(az, rd.y, -0.03, 0.02, 7.0, false) * smoothstep(12.0, 70.0, tw);
    col = mix(col, mistColour(az), low * 0.45);
  } else {
    col = sky(rd, false);
  }

  // Gentle vignette, darker at the foot so the page below takes over smoothly.
  col *= mix(0.72, 1.0, smoothstep(0.0, 0.45, vUv.y));
  col *= 1.0 - 0.18 * pow(length(ndc * vec2(0.7, 0.9)), 2.0);
  col *= mix(0.3, 1.0, uRise) * (1.0 - uDim);

  // Dither to keep the smooth gradients free of banding.
  col += (hash12(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`;
