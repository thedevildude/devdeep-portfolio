"use client";

import { useEffect, useRef } from "react";

/**
 * A live Three.js take on the hero artwork: ink-wash waves spiralling around a central
 * starburst, with planets, orbit lines and twinkling stars.
 * The scene is laid out in the artwork's own pixel space (1920×1088, origin at its centre,
 * y up) and the orthographic camera "covers" the section the way object-cover would.
 */
const IMG_W = 1920;
const IMG_H = 1088;

/** Artwork pixel (x right, y down) → world (origin centre, y up). */
const at = (x: number, y: number): [number, number] => [x - IMG_W / 2, IMG_H / 2 - y];

const CENTER = at(975, 440);

const NOISE = /* glsl */ `
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
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
    return v;
  }
`;

const WORLD_VERT = /* glsl */ `
  varying vec2 vPos;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vPos = world.xy;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

/** The waves: a domain-warped two-arm spiral, banded into the artwork's flat paint colours. */
const WAVES_FRAG = /* glsl */ `
  uniform float uTime;
  uniform vec2 uCenter;
  varying vec2 vPos;
  ${NOISE}

  // Antialiased step whose softness tracks the pixel footprint of x.
  float aaStep(float edge, float x) {
    float w = fwidth(x) * 1.2;
    return smoothstep(edge - w, edge + w, x);
  }

  void main() {
    vec2 q = (vPos - uCenter) / 544.0;
    float t = uTime;

    // Slow-moving warp field gives the paint its torn, flowing edges.
    vec2 warp = vec2(fbm(q * 1.7 + vec2(0.0, t * 0.035)),
                     fbm(q * 1.7 + vec2(5.2, 1.3 - t * 0.03)));
    vec2 p = q + (warp - 0.5) * 0.5;

    float r = length(p * vec2(0.6, 1.0));
    float a = atan(p.y, p.x);
    float lr = log(r + 0.06);

    // Two spiral arms, turning slowly; the ripple term sends waves outward along them.
    float spiral = a - t * 0.02 + 2.0 * lr;
    float arms = sin(spiral * 2.0) + 0.2 * sin(r * 9.0 - t * 0.5 + a);

    // Streaks stretched along the arms. Polar noise has a seam where atan wraps, so blend two
    // copies whose seams sit on opposite sides.
    float a2 = atan(-p.y, -p.x) + 3.14159;
    float s1 = fbm(vec2((a - t * 0.02) * 2.2 + lr * 4.4, lr * 1.2 - t * 0.05) * vec2(1.6, 2.5));
    float s2 = fbm(vec2((a2 - t * 0.02) * 2.2 + lr * 4.4 + 17.0, lr * 1.2 - t * 0.05) * vec2(1.6, 2.5));
    float streak = mix(s1, s2, smoothstep(2.2, 3.0, abs(a)));

    float detail = fbm(p * 2.6 + warp * 1.5 - vec2(t * 0.04, 0.0));
    float v = arms * 0.75 + (streak - 0.5) * 1.6 + (detail - 0.5) * 0.7;

    vec3 royal     = vec3(0.118, 0.184, 0.784);
    vec3 royalDeep = vec3(0.071, 0.118, 0.580);
    vec3 ink       = vec3(0.024, 0.035, 0.150);
    vec3 periwink  = vec3(0.420, 0.530, 0.880);
    vec3 lavender  = vec3(0.560, 0.530, 0.910);
    vec3 pink      = vec3(0.955, 0.760, 0.855);
    vec3 palePink  = vec3(0.985, 0.900, 0.920);
    vec3 voidDeep  = vec3(0.027, 0.047, 0.230);
    vec3 voidGlow  = vec3(0.075, 0.140, 0.540);

    // Outer sea of royal blue, deepening in the troughs.
    vec3 col = mix(royal, royalDeep, smoothstep(-0.1, -0.8, v) * 0.7);

    // Lavender-periwinkle swells, hatched with fine contour lines that flow with the wave.
    float swell = aaStep(0.0, v);
    vec3 swellCol = mix(periwink, lavender, smoothstep(0.2, 0.75, fbm(p * 1.3 + 9.0)));
    float L = v * 18.0;
    float contour = 1.0 - smoothstep(0.0, fwidth(L) * 1.3, abs(fract(L) - 0.5) - 0.42);
    swellCol = mix(swellCol, royalDeep, contour * 0.5);
    col = mix(col, swellCol, swell);

    // Pink crests, with the palest pink on the highest parts.
    col = mix(col, pink, aaStep(0.3, v));
    col = mix(col, palePink, aaStep(0.62, v + (detail - 0.5) * 0.4));

    // Ink splatter in the troughs beside the crests.
    float splat = fbm(p * 5.0 + vec2(3.1, t * 0.02));
    float splatBand = smoothstep(0.3, 0.0, abs(v + 0.2));
    col = mix(col, ink, aaStep(0.66, splat * (0.5 + splatBand * 0.7)));

    // The calm, starry void around the starburst.
    float voidEdge = r + (detail - 0.5) * 0.32;
    float voidMask = 1.0 - aaStep(0.5, voidEdge);
    float glow = smoothstep(0.65, 0.0, length(q * vec2(0.75, 1.0)));
    vec3 voidCol = mix(voidDeep, voidGlow, glow * 0.85);
    voidCol += (fbm(q * 4.0 + t * 0.01) - 0.5) * 0.05;
    col = mix(col, voidCol, voidMask);

    gl_FragColor = vec4(col, 1.0);
  }
`;

/** The central starburst: a hot core and a fan of hairline rays that slowly turn and breathe. */
const BURST_FRAG = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  float h1(float n) { return fract(sin(n * 127.1) * 43758.5453); }

  void main() {
    vec2 d = (vUv * 2.0 - 1.0) * 520.0;
    float r = length(d);
    float a = atan(d.y, d.x) + uTime * 0.015;

    float N = 220.0;
    float s = (a / 6.28318 + 0.5) * N;
    float idx = floor(s);
    float h = h1(idx);
    float len = mix(70.0, 500.0, h * h) * (0.8 + 0.2 * sin(uTime * 0.9 + h * 50.0));
    float px = abs(fract(s) - 0.5) * 6.28318 / N * r;
    float on = step(0.3, h1(idx + 7.0));
    float ray = on * (1.0 - smoothstep(0.0, 0.9, px)) * (1.0 - smoothstep(0.0, len, r));

    float pulse = 1.0 + 0.12 * sin(uTime * 1.3);
    float core = exp(-r / (13.0 * pulse)) * 1.4 + exp(-r / 70.0) * 0.35;

    vec3 col = vec3(0.78, 0.97, 1.0) * core + vec3(0.82, 0.88, 1.0) * ray * 0.8;
    gl_FragColor = vec4(col, 1.0);
  }
`;

/** A flat, illustrated planet: shaded disc with drifting surface patches and a bright rim. */
const PLANET_FRAG = /* glsl */ `
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

    vec2 sp = vec2(atan(n.x, n.z) + uTime * 0.02, n.y) * 1.6;
    float s = fbm(sp * 2.0 + uSeed);
    vec3 col = mix(uBase, uAccent, smoothstep(0.45, 0.58, s));
    col = mix(col, uAccent2, smoothstep(0.62, 0.68, s));
    col *= 0.6 + 0.5 * light;
    col = mix(col, uRim, smoothstep(0.72, 1.0, r) * 0.75);

    float halo = (1.0 - disc) * exp(-(r - 1.0) * 14.0) * 0.5;
    float alpha = max(disc, halo) * uOpacity;
    gl_FragColor = vec4(mix(uRim, col, disc), alpha);
  }
`;

const STAR_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute float aSparkle;
  uniform float uTime;
  uniform float uScale;
  varying float vTwinkle;
  varying float vSparkle;
  void main() {
    vTwinkle = 0.55 + 0.45 * sin(uTime * (0.8 + aPhase) + aPhase * 30.0);
    vSparkle = aSparkle;
    gl_PointSize = aSize * uScale * (aSparkle > 0.5 ? 0.85 + 0.25 * vTwinkle : 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const STAR_FRAG = /* glsl */ `
  varying float vTwinkle;
  varying float vSparkle;
  void main() {
    vec2 c = gl_PointCoord * 2.0 - 1.0;
    float dotGlow = exp(-dot(c, c) * (vSparkle > 0.5 ? 40.0 : 9.0));
    float cross = (exp(-abs(c.x) * 45.0) * exp(-abs(c.y) * 2.5)
                 + exp(-abs(c.y) * 45.0) * exp(-abs(c.x) * 2.5)) * vSparkle;
    float i = (dotGlow + cross) * vTwinkle;
    gl_FragColor = vec4(vec3(0.88, 0.95, 1.0) * i, 1.0);
  }
`;

type PlanetSpec = {
  x: number;
  y: number;
  r: number;
  base: string;
  accent: string;
  accent2: string;
  rim: string;
  opacity?: number;
};

const PLANETS: PlanetSpec[] = [
  { x: 640, y: 70, r: 185, base: "#6d74d6", accent: "#b6b0ee", accent2: "#f1e9f6", rim: "#e6e9ff" },
  { x: 1190, y: 108, r: 45, base: "#7cb6c2", accent: "#b6e1de", accent2: "#dcf3ef", rim: "#e8fbff" },
  { x: 760, y: 380, r: 52, base: "#d7a0ae", accent: "#f2c7c6", accent2: "#7d73b8", rim: "#ffe9ee" },
  { x: 1855, y: 383, r: 66, base: "#c4a0e4", accent: "#e6c6ef", accent2: "#f7e4f7", rim: "#fff4ff" },
  { x: 90, y: 1060, r: 340, base: "#2a3fd6", accent: "#7d8ae6", accent2: "#e6c8ea", rim: "#dfe6ff", opacity: 0.95 },
  { x: 1640, y: 1105, r: 335, base: "#2236d0", accent: "#9cbde6", accent2: "#e8f4f2", rim: "#e9f6ff" },
  { x: 1255, y: 885, r: 40, base: "#5d77d8", accent: "#8ea6ea", accent2: "#c9d6f6", rim: "#d9e4ff", opacity: 0.75 },
  { x: 612, y: 970, r: 20, base: "#e2a9b8", accent: "#f4cfd2", accent2: "#c08aa6", rim: "#fff0f2" },
  { x: 900, y: 215, r: 9, base: "#8cc6cc", accent: "#c4e9e6", accent2: "#e6f8f6", rim: "#f0ffff" },
  { x: 1835, y: 178, r: 11, base: "#8cc6cc", accent: "#c4e9e6", accent2: "#e6f8f6", rim: "#f0ffff" },
  { x: 1385, y: 430, r: 13, base: "#d9967c", accent: "#efc0a4", accent2: "#a77a8a", rim: "#ffe6d8" },
  { x: 1632, y: 760, r: 15, base: "#d9967c", accent: "#efc0a4", accent2: "#a77a8a", rim: "#ffe6d8" },
  { x: 1608, y: 535, r: 14, base: "#9a8fd8", accent: "#c8bdf0", accent2: "#efe6fb", rim: "#f4efff" },
];

/** Bright four-point stars, as painted. [x, y, size] in artwork pixels. */
const SPARKLES: [number, number, number][] = [
  [1100, 255, 46], [1190, 300, 40], [1320, 315, 54], [1178, 995, 60],
  [350, 6, 44], [1200, 362, 22], [845, 255, 18], [1530, 210, 20],
];

const HeroBackdrop = () => {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.domElement.className = "absolute inset-0 size-full";
      host.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
      camera.position.z = 50;

      const time = { value: 0 };
      const center = new THREE.Vector2(...CENTER);

      // Waves fill a plane a little larger than the artwork so parallax never shows an edge.
      const waves = new THREE.Mesh(
        new THREE.PlaneGeometry(IMG_W * 1.4, IMG_H * 1.6),
        new THREE.ShaderMaterial({
          uniforms: { uTime: time, uCenter: { value: center } },
          vertexShader: WORLD_VERT,
          fragmentShader: WAVES_FRAG,
          depthTest: false,
        }),
      );
      scene.add(waves);

      // Everything in the "galaxy" turns gently around the starburst.
      const galaxy = new THREE.Group();
      galaxy.position.set(CENTER[0], CENTER[1], 0);
      scene.add(galaxy);

      const lineMat = new THREE.LineBasicMaterial({
        color: "#d8ddff",
        transparent: true,
        opacity: 0.4,
        depthTest: false,
      });
      const arc = (radius: number, from: number, to: number) => {
        const pts: InstanceType<typeof THREE.Vector3>[] = [];
        for (let i = 0; i <= 96; i++) {
          const a = THREE.MathUtils.degToRad(from + ((to - from) * i) / 96);
          pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0));
        }
        return new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat);
      };
      galaxy.add(arc(330, -35, 168), arc(195, 25, 158), arc(560, 52, 122));

      // Spokes from the starburst out to the planets and edges, plus a small constellation.
      const spokeEnds = [
        [975, -40], [790, 120], [1190, 108], [1385, 180], [612, 175], [565, 300], [1300, 520],
      ];
      const spokePts: number[] = [];
      for (const [x, y] of spokeEnds) {
        const [wx, wy] = at(x, y);
        const dx = wx - CENTER[0];
        const dy = wy - CENTER[1];
        const len = Math.hypot(dx, dy);
        spokePts.push((dx / len) * 50, (dy / len) * 50, 0, dx, dy, 0);
      }
      const constellation = [[1100, 255], [1190, 300], [1320, 315], [1190, 300], [1200, 362]];
      for (let i = 0; i < constellation.length - 1; i += 2) {
        for (const [x, y] of [constellation[i], constellation[i + 1]]) {
          const [wx, wy] = at(x, y);
          spokePts.push(wx - CENTER[0], wy - CENTER[1], 0);
        }
      }
      const spokeGeo = new THREE.BufferGeometry();
      spokeGeo.setAttribute("position", new THREE.Float32BufferAttribute(spokePts, 3));
      galaxy.add(new THREE.LineSegments(spokeGeo, lineMat));

      // Stars: mostly in the dark void, a scattering elsewhere, plus the painted sparkles.
      const starPos: number[] = [];
      const starSize: number[] = [];
      const starPhase: number[] = [];
      const starSparkle: number[] = [];
      const rand = (() => {
        let s = 7;
        return () => ((s = (s * 16807) % 2147483647) / 2147483647);
      })();
      for (let i = 0; i < 420; i++) {
        const inVoid = i < 320;
        const a = rand() * Math.PI * 2;
        const rr = Math.sqrt(rand());
        const x = inVoid ? Math.cos(a) * rr * 640 : (rand() - 0.5) * IMG_W;
        const y = inVoid ? Math.sin(a) * rr * 380 + 110 : (rand() - 0.5) * IMG_H - CENTER[1];
        starPos.push(x, y, 0);
        starSize.push(rand() < 0.1 ? 7 : 2.5 + rand() * 3);
        starPhase.push(rand());
        starSparkle.push(0);
      }
      for (const [x, y, size] of SPARKLES) {
        const [wx, wy] = at(x, y);
        starPos.push(wx - CENTER[0], wy - CENTER[1], 0);
        starSize.push(size);
        starPhase.push(rand());
        starSparkle.push(1);
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
      starGeo.setAttribute("aSize", new THREE.Float32BufferAttribute(starSize, 1));
      starGeo.setAttribute("aPhase", new THREE.Float32BufferAttribute(starPhase, 1));
      starGeo.setAttribute("aSparkle", new THREE.Float32BufferAttribute(starSparkle, 1));
      const starScale = { value: 1 };
      galaxy.add(
        new THREE.Points(
          starGeo,
          new THREE.ShaderMaterial({
            uniforms: { uTime: time, uScale: starScale },
            vertexShader: STAR_VERT,
            fragmentShader: STAR_FRAG,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false,
          }),
        ),
      );

      const burst = new THREE.Mesh(
        new THREE.PlaneGeometry(1040, 1040),
        new THREE.ShaderMaterial({
          uniforms: { uTime: time },
          vertexShader: WORLD_VERT,
          fragmentShader: BURST_FRAG,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthTest: false,
        }),
      );
      galaxy.add(burst);

      // Planets bob a little on their own slow cycles.
      const planets = PLANETS.map((p, i) => {
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(p.r * 2.6, p.r * 2.6),
          new THREE.ShaderMaterial({
            uniforms: {
              uTime: time,
              uBase: { value: new THREE.Color(p.base) },
              uAccent: { value: new THREE.Color(p.accent) },
              uAccent2: { value: new THREE.Color(p.accent2) },
              uRim: { value: new THREE.Color(p.rim) },
              uSeed: { value: i * 3.7 },
              uOpacity: { value: p.opacity ?? 1 },
            },
            vertexShader: WORLD_VERT,
            fragmentShader: PLANET_FRAG,
            transparent: true,
            depthTest: false,
          }),
        );
        const [x, y] = at(p.x, p.y);
        mesh.position.set(x, y, 0);
        scene.add(mesh);
        return { mesh, x, y, phase: i * 1.9, amp: Math.min(14, 4 + p.r * 0.03) };
      });

      // ShaderMaterial colours are written straight to the canvas, so feed it sRGB values.
      for (const { mesh } of planets) {
        const u = (mesh.material as InstanceType<typeof THREE.ShaderMaterial>).uniforms;
        for (const key of ["uBase", "uAccent", "uAccent2", "uRim"]) {
          u[key].value.convertLinearToSRGB();
        }
      }

      waves.renderOrder = 0;
      galaxy.renderOrder = 1;
      planets.forEach(({ mesh }) => (mesh.renderOrder = 2));

      let worldScale = 1;
      const resize = () => {
        const { clientWidth: w, clientHeight: h } = host;
        renderer.setSize(w, h, false);
        // Cover: the artwork fills the viewport, cropping whichever axis overflows.
        worldScale = Math.max(w / IMG_W, h / IMG_H);
        camera.left = -w / 2 / worldScale;
        camera.right = w / 2 / worldScale;
        camera.top = h / 2 / worldScale;
        camera.bottom = -h / 2 / worldScale;
        camera.updateProjectionMatrix();
        starScale.value = worldScale * renderer.getPixelRatio();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
      const onPointer = (e: PointerEvent) => {
        pointer.tx = e.clientX / window.innerWidth - 0.5;
        pointer.ty = e.clientY / window.innerHeight - 0.5;
      };
      window.addEventListener("pointermove", onPointer);

      const clock = new THREE.Clock();
      const render = () => {
        const t = clock.getElapsedTime();
        time.value = t;

        galaxy.rotation.z = t * 0.006;
        planets.forEach(({ mesh, x, y, phase, amp }) => {
          mesh.position.x = x + Math.sin(t * 0.21 + phase) * amp;
          mesh.position.y = y + Math.cos(t * 0.17 + phase) * amp;
        });

        // Slow push-in toward the starburst, with a touch of pointer parallax.
        pointer.x += (pointer.tx - pointer.x) * 0.04;
        pointer.y += (pointer.ty - pointer.y) * 0.04;
        const zoom = 1.06 + 0.06 * Math.sin(t * 0.08);
        camera.zoom = zoom;
        camera.position.x = CENTER[0] * (1 - 1 / zoom) + pointer.x * 24;
        camera.position.y = CENTER[1] * (1 - 1 / zoom) - pointer.y * 16;
        camera.updateProjectionMatrix();

        renderer.render(scene, camera);
      };

      // Only animate while the hero is on screen.
      let visible = true;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      io.observe(host);
      if (reducedMotion) {
        clock.elapsedTime = 20;
        render();
      } else {
        renderer.setAnimationLoop(() => visible && render());
      }

      cleanup = () => {
        renderer.setAnimationLoop(null);
        ro.disconnect();
        io.disconnect();
        window.removeEventListener("pointermove", onPointer);
        scene.traverse((obj) => {
          const o = obj as InstanceType<typeof THREE.Mesh>;
          o.geometry?.dispose();
          const mat = o.material as InstanceType<typeof THREE.Material> | undefined;
          mat?.dispose();
        });
        renderer.dispose();
        renderer.domElement.remove();
      };
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div ref={hostRef} className="absolute inset-0 isolate overflow-hidden bg-[#1e2fc8]">
      {/* Dark wash so the artwork sits back behind the hero copy. */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-black/20" />
    </div>
  );
};

export default HeroBackdrop;
