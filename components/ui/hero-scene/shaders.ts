import { IMG_H, IMG_W } from "./layout";

/** GLSL for the hero scene. Every shader writes display-ready (sRGB) colours. */

export const NOISE = /* glsl */ `
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 4; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
    return v;
  }
`;

export const WORLD_VERT = /* glsl */ `
  varying vec2 vPos;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vPos = world.xy;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

/** The sky: smooth deep space easing to brand blue at the edges, a Milky Way, and the bang. */
export const SKY_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec2 uCenter;
  uniform float uBand;    // Milky Way angle
  uniform float uReveal;  // shockwave radius
  uniform float uFront;   // shockwave brightness
  uniform float uFlash;   // white-out at the bang
  varying vec2 vPos;
  ${NOISE}

  void main() {
    float t = uTime;
    vec2 rel = vPos - uCenter;

    vec3 space = vec3(0.016, 0.035, 0.170);
    vec3 glow  = vec3(0.070, 0.150, 0.560);
    vec3 edge  = vec3(0.010, 0.110, 0.520); // deep #0145fd

    // One smooth gradient: navy round the core, deepening blue toward the edges.
    vec3 col = mix(space, edge, smoothstep(0.25, 1.4, length(rel / vec2(${IMG_W / 2}.0, ${IMG_H / 2}.0))));
    col = mix(col, glow, exp(-length(rel / vec2(1.3, 1.0)) / 320.0));

    // The Milky Way: a soft band with mottled light and a dark dust lane.
    vec2 dir = vec2(cos(uBand), sin(uBand));
    float along = dot(rel, dir);
    float across = dot(rel, vec2(-dir.y, dir.x));
    float wobble = (fbm(vec2(along * 0.004, 7.0)) - 0.5) * 120.0;
    float band = exp(-pow((across - wobble) / 170.0, 2.0));
    float mott = fbm(vec2(along * 0.006 + t * 0.01, across * 0.014));
    float dustY = across - wobble + 12.0 + (fbm(vec2(along * 0.008, 3.0)) - 0.5) * 70.0;
    float dust = exp(-pow(dustY / 26.0, 2.0)) * smoothstep(0.35, 0.6, fbm(vec2(along * 0.01, 9.0)));
    float milky = band * (0.3 + mott) * (1.0 - dust * 0.75) * smoothstep(1700.0, 500.0, abs(along));
    vec3 milkyCol = mix(vec3(0.35, 0.45, 1.0), vec3(1.0, 0.86, 0.96), smoothstep(0.4, 1.0, band * mott * 1.5));
    col += milkyCol * milky * 0.4;

    // Big bang: everything outside the shockwave is still empty space; the front glows.
    float front = length(rel) - uReveal;
    col = mix(col, space * 0.5, smoothstep(-30.0, 30.0, front));
    col += vec3(0.75, 0.85, 1.0) * exp(-abs(front) / 40.0) * uFront;
    col = mix(col, vec3(1.0, 0.97, 1.0), uFlash);

    gl_FragColor = vec4(col, 1.0);
  }
`;

/**
 * The starburst's rays: one instanced strip per ray, fanning out from behind the core planet.
 * Each strip spans x 0→1 along the ray and y ±0.5 across it, tapering toward the tip.
 */
export const RAY_VERT = /* glsl */ `
  attribute float aAngle;
  attribute float aLength;
  attribute float aWidth;
  attribute float aPhase;
  uniform float uTime;
  uniform float uRadius; // where rays start: just inside the planet's rim
  uniform float uGrow;   // 0 → 1 as the rays shoot out after the bang
  varying float vAlong;
  varying float vAcross;
  varying float vShine;
  void main() {
    float a = aAngle + uTime * 0.04;
    vec2 dir = vec2(cos(a), sin(a));
    vec2 perp = vec2(-dir.y, dir.x);
    // Each ray breathes and flickers on its own clock.
    float breathe = 0.7 + 0.3 * sin(uTime * (0.6 + aPhase) + aPhase * 40.0);
    float len = aLength * breathe * uGrow;
    float width = aWidth * (1.0 - position.x * 0.8);
    vec2 p = dir * (uRadius + position.x * len) + perp * position.y * width;
    vAlong = position.x;
    vAcross = position.y * 2.0;
    vShine = (0.55 + 0.45 * sin(uTime * (1.5 + aPhase * 2.0) + aPhase * 90.0)) * breathe;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
  }
`;

export const RAY_FRAG = /* glsl */ `
  varying float vAlong;
  varying float vAcross;
  varying float vShine;
  void main() {
    float fade = pow(1.0 - vAlong, 1.6) * (1.0 - vAcross * vAcross);
    gl_FragColor = vec4(vec3(0.80, 0.92, 1.0) * fade * vShine * 0.9, 1.0);
  }
`;

/** A soft corona hugging the core planet's rim; before the bang it is the charging point. */
export const CORONA_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uRadius;
  uniform float uCharge; // 0 → 1 while charging, then swells at the bang and settles
  uniform float uSettled; // 0 before the bang, 1 once the planet is out
  varying vec2 vUv;
  void main() {
    float r = length((vUv * 2.0 - 1.0) * 200.0);
    float pulse = 1.0 + 0.08 * sin(uTime * 1.4);
    float point = exp(-r / (6.0 + 30.0 * uCharge)) * (1.0 - uSettled) * 1.6;
    float rim = exp(-max(r - uRadius, 0.0) / (16.0 * pulse)) * smoothstep(uRadius * 0.7, uRadius, r);
    float halo = exp(-r / (70.0 * pulse)) * 0.25;
    vec3 col = vec3(0.78, 0.94, 1.0) * (point + (rim * 0.9 + halo) * uSettled * uCharge);
    gl_FragColor = vec4(col, 1.0);
  }
`;

/** A planet: lit disc with drifting surface patches, bright rim and a soft halo. */
export const PLANET_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec3 uBase;
  uniform vec3 uAccent;
  uniform vec3 uAccent2;
  uniform vec3 uRim;
  uniform float uSeed;
  uniform float uOpacity;
  varying vec2 vUv;
  ${NOISE}

  void main() {
    vec2 d = (vUv * 2.0 - 1.0) * 1.3;
    float r = length(d);
    float aa = fwidth(r) * 1.5;
    float disc = 1.0 - smoothstep(1.0 - aa, 1.0, r);

    vec3 n = vec3(d, sqrt(max(0.0, 1.0 - r * r)));
    float light = dot(n, normalize(vec3(-0.45, 0.5, 0.75)));

    vec2 sp = vec2(atan(n.x, n.z) + uTime * 0.04, n.y) * 1.6;
    float s = fbm(sp * 2.0 + uSeed);
    vec3 col = mix(uBase, uAccent, smoothstep(0.45, 0.58, s));
    col = mix(col, uAccent2, smoothstep(0.62, 0.68, s));
    col *= 0.65 + 0.45 * light;
    col = mix(col, uRim, smoothstep(0.72, 1.0, r) * 0.8);

    float halo = (1.0 - disc) * exp(-(r - 1.0) * 14.0) * 0.5;
    float alpha = max(disc, halo) * uOpacity;
    gl_FragColor = vec4(mix(uRim, col, disc), alpha);
  }
`;

export const STAR_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSparkle;
  uniform float uTime;
  uniform float uScale;
  uniform float uSince; // seconds since the bang
  varying float vTwinkle;
  varying float vSparkle;
  void main() {
    // Stars fly out from the bang, the farthest arriving last.
    float k = clamp((uSince - length(position.xy) / 1800.0) / 0.9, 0.0, 1.0);
    k = 1.0 - pow(1.0 - k, 3.0);
    vTwinkle = (0.55 + 0.45 * sin(uTime * (0.8 + aPhase * 1.6) + aPhase * 30.0)) * k;
    vSparkle = aSparkle;
    gl_PointSize = aSize * uScale * (aSparkle > 0.5 ? 0.85 + 0.25 * vTwinkle : 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position * k, 1.0);
  }
`;

export const STAR_FRAG = /* glsl */ `
  varying float vTwinkle;
  varying float vSparkle;
  void main() {
    vec2 c = gl_PointCoord * 2.0 - 1.0;
    float dotGlow = exp(-dot(c, c) * (vSparkle > 0.5 ? 40.0 : 9.0));
    float cross = (exp(-abs(c.x) * 45.0) * exp(-abs(c.y) * 2.5)
                 + exp(-abs(c.y) * 45.0) * exp(-abs(c.x) * 2.5)) * vSparkle;
    float i = (dotGlow + cross) * vTwinkle;
    gl_FragColor = vec4(vec3(0.92, 0.95, 1.0) * i, 1.0);
  }
`;

/** Glitter: fine shimmering motes that drift aside from the cursor, swept in by the bang. */
export const GLITTER_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uScale;
  uniform float uSince;
  uniform vec2 uCenter;
  uniform vec2 uMouse;   // cursor in world space
  uniform float uMouseOn; // eases to 0 when the cursor leaves
  varying float vShine;
  varying vec3 vColor;
  void main() {
    vec2 rel = position.xy - uCenter;
    float k = clamp((uSince - length(rel) / 1800.0) / 1.2, 0.0, 1.0);
    k = 1.0 - pow(1.0 - k, 3.0);
    // Drift slowly with the paint.
    vec2 drift = vec2(sin(uTime * 0.3 + aPhase * 20.0), cos(uTime * 0.25 + aPhase * 13.0)) * 10.0;
    vec2 p = uCenter + rel * k + drift;
    // Drift softly aside from the cursor with a little swirl, and twinkle as it passes.
    vec2 away = p - uMouse;
    float near = exp(-dot(away, away) / (160.0 * 160.0)) * uMouseOn;
    vec2 out_ = normalize(away + 1e-3);
    p += (out_ * (18.0 + aPhase * 14.0) + vec2(-out_.y, out_.x) * 10.0) * near;
    float flicker = pow(0.5 + 0.5 * sin(uTime * (2.0 + aPhase * 4.0) + aPhase * 60.0), 4.0);
    vShine = (0.3 + 0.7 * flicker + near * 0.9) * k;
    vColor = aColor;
    gl_PointSize = aSize * uScale * (0.7 + 0.5 * flicker + near * 0.3);
    gl_Position = projectionMatrix * viewMatrix * vec4(p, 0.0, 1.0);
  }
`;

export const GLITTER_FRAG = /* glsl */ `
  varying float vShine;
  varying vec3 vColor;
  void main() {
    vec2 c = gl_PointCoord * 2.0 - 1.0;
    float g = exp(-dot(c, c) * 7.0);
    gl_FragColor = vec4(vColor * g * vShine, 1.0);
  }
`;

/** A shooting star: a streak that brightens toward its head (uv.x = 1). */
export const STREAK_FRAG = /* glsl */ `
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float body = pow(vUv.x, 3.0) * (1.0 - abs(vUv.y - 0.5) * 2.0);
    gl_FragColor = vec4(vec3(0.9, 0.95, 1.0) * body * uOpacity, 1.0);
  }
`;
