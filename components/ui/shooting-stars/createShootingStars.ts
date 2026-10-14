import * as THREE from "three";

/**
 * Shooting stars for the deep dives heading: sparkle heads streaking down-left with tapered
 * tails, shedding glittering dust, over a few twinkling stars.
 * Laid out in a fixed 430×290 design space (y up), scaled to fit the host, which keeps that
 * aspect ratio. Draws in the host's CSS colour on a transparent canvas.
 */
const W = 430;
const H = 290;

/** Design point given y-down, as in the original illustration → scene (y up). */
const pt = (x: number, y: number) => new THREE.Vector2(x, H - y);

/** Where each star starts, its size, and its timing (seconds), staggered so none move together. */
const STARS = [
  { x: 380, y: 30, scale: 1, delay: 0.2, duration: 2.2, rest: 2.8 },
  { x: 270, y: 100, scale: 0.7, delay: 1.6, duration: 1.8, rest: 2.6 },
  { x: 425, y: 150, scale: 0.85, delay: 3.0, duration: 2.4, rest: 3.0 },
  { x: 190, y: 40, scale: 0.55, delay: 0.9, duration: 1.9, rest: 2.9 },
  { x: 345, y: 225, scale: 0.6, delay: 2.4, duration: 1.7, rest: 2.5 },
];

const TWINKLES = [
  { x: 60, y: 130, size: 6 },
  { x: 90, y: 230, size: 4 },
  { x: 200, y: 26, size: 4 },
  { x: 410, y: 100, size: 5 },
  { x: 130, y: 180, size: 3 },
  { x: 250, y: 270, size: 3 },
];

/** Down-left, matching the original streaks. */
const DIR = new THREE.Vector2(-1, -0.58).normalize();
const TRAVEL = 190;
const TAIL = 200;
const DUST_MAX = 700;
const DUST_LIFE = 1.1;
const DUST_RATE = 45; // per star per second while it's flying

// Colours arrive premultiplied by alpha, for the transparent canvas.
const TAIL_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    p.y *= 1.0 - uv.x * 0.9; // taper toward the end of the tail
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const TAIL_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float along = pow(1.0 - vUv.x, 1.8);
    float across = 1.0 - pow(abs(vUv.y - 0.5) * 2.0, 2.0);
    float a = along * across * uOpacity;
    gl_FragColor = vec4(mix(uColor, vec3(1.0), along * 0.5) * a, a);
  }
`;

const HEAD_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uSpin;
  varying vec2 vUv;
  void main() {
    vec2 c = vUv * 2.0 - 1.0;
    float s = sin(uSpin), co = cos(uSpin);
    c = mat2(co, -s, s, co) * c;
    float core = exp(-dot(c, c) * 30.0);
    float cross = exp(-abs(c.x) * 20.0) * exp(-abs(c.y) * 2.6)
                + exp(-abs(c.y) * 20.0) * exp(-abs(c.x) * 2.6);
    float halo = exp(-length(c) * 5.0) * 0.35;
    float a = clamp(core + cross + halo, 0.0, 1.0) * uOpacity;
    gl_FragColor = vec4(mix(uColor, vec3(1.0), core) * a, a);
  }
`;

const DUST_VERT = /* glsl */ `
  attribute vec2 aVel;
  attribute float aBirth;
  attribute float aSize;
  uniform float uTime;
  uniform float uScale;
  varying float vAlpha;
  void main() {
    float age = uTime - aBirth;
    float life = clamp(age / ${DUST_LIFE.toFixed(2)}, 0.0, 1.0);
    vAlpha = (1.0 - life) * step(0.0, age) * step(age, ${DUST_LIFE.toFixed(2)});
    vec2 p = position.xy + aVel * age;
    gl_PointSize = aSize * uScale * (1.0 - life * 0.6);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
  }
`;

const TWINKLE_VERT = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform float uScale;
  varying float vAlpha;
  void main() {
    vAlpha = 0.3 + 0.35 * (0.5 + 0.5 * sin(uTime * (1.0 + aPhase) + aPhase * 6.28));
    gl_PointSize = aSize * 1.6 * uScale;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const POINT_FRAG = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord * 2.0 - 1.0;
    float a = exp(-dot(c, c) * 5.0) * vAlpha;
    gl_FragColor = vec4(uColor * a, a);
  }
`;

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** Builds the stars into host in the given colour and starts them; returns a teardown. */
export const createShootingStars = (host: HTMLElement, cssColor: string) => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, premultipliedAlpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace; // shaders write display values
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.className = "absolute inset-0 size-full";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, W, H, 0, -10, 10);

  const color = { value: new THREE.Color(cssColor).convertLinearToSRGB() };
  const time = { value: 0 };
  const pointScale = { value: 1 };
  const material = (vertexShader: string, fragmentShader: string, uniforms: Record<string, unknown>) =>
    new THREE.ShaderMaterial({
      uniforms: { uColor: color, ...uniforms },
      vertexShader,
      fragmentShader,
      transparent: true,
      premultipliedAlpha: true,
      depthTest: false,
      depthWrite: false,
    });

  // Twinkling background stars.
  const twinkleGeo = new THREE.BufferGeometry();
  twinkleGeo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(TWINKLES.flatMap((s) => [...pt(s.x, s.y).toArray(), 0]), 3),
  );
  twinkleGeo.setAttribute("aSize", new THREE.Float32BufferAttribute(TWINKLES.map((s) => s.size), 1));
  twinkleGeo.setAttribute("aPhase", new THREE.Float32BufferAttribute(TWINKLES.map((_, i) => (i * 0.37) % 1), 1));
  scene.add(new THREE.Points(twinkleGeo, material(TWINKLE_VERT, POINT_FRAG, { uTime: time, uScale: pointScale })));

  // Dust: a ring buffer of specks, each moving on its own from where and when it was shed.
  const dustPos = new Float32Array(DUST_MAX * 3);
  const dustVel = new Float32Array(DUST_MAX * 2);
  const dustBirth = new Float32Array(DUST_MAX).fill(-100);
  const dustSize = new Float32Array(DUST_MAX);
  const dustGeo = new THREE.BufferGeometry();
  const dynamic = (array: Float32Array, size: number) =>
    new THREE.BufferAttribute(array, size).setUsage(THREE.DynamicDrawUsage);
  dustGeo.setAttribute("position", dynamic(dustPos, 3));
  dustGeo.setAttribute("aVel", dynamic(dustVel, 2));
  dustGeo.setAttribute("aBirth", dynamic(dustBirth, 1));
  dustGeo.setAttribute("aSize", dynamic(dustSize, 1));
  const dust = new THREE.Points(dustGeo, material(DUST_VERT, POINT_FRAG, { uTime: time, uScale: pointScale }));
  dust.frustumCulled = false;
  scene.add(dust);
  let dustNext = 0;
  const shed = (at: THREE.Vector2, t: number, scale: number) => {
    const i = dustNext;
    dustNext = (dustNext + 1) % DUST_MAX;
    dustPos.set([at.x, at.y, 0], i * 3);
    // Drift back along the tail, scattering a little.
    dustVel.set(
      [-DIR.x * 10 + (Math.random() - 0.5) * 14, -DIR.y * 10 + (Math.random() - 0.5) * 14 - 4],
      i * 2,
    );
    dustBirth[i] = t;
    dustSize[i] = (2.5 + Math.random() * 3) * Math.max(0.6, scale);
  };

  const stars = STARS.map((s) => {
    const tailOpacity = { value: 0 };
    const tail = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1).translate(0.5, 0, 0),
      material(TAIL_VERT, TAIL_FRAG, { uOpacity: tailOpacity }),
    );
    // The tail trails behind the head, back up-right.
    tail.rotation.z = Math.atan2(-DIR.y, -DIR.x);
    const headOpacity = { value: 0 };
    const spin = { value: 0 };
    const head = new THREE.Mesh(
      new THREE.PlaneGeometry(70 * s.scale, 70 * s.scale),
      material(VERT, HEAD_FRAG, { uOpacity: headOpacity, uSpin: spin }),
    );
    scene.add(tail, head);
    return { ...s, start: pt(s.x, s.y), tail, head, tailOpacity, headOpacity, spin, owed: 0 };
  });

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    renderer.setSize(w, h, false);
    pointScale.value = (w / W) * renderer.getPixelRatio();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  const headAt = new THREE.Vector2();
  const start = performance.now();
  let lastT = 0;
  const render = (t = (performance.now() - start) / 1000) => {
    const dt = Math.min(0.1, Math.max(0, t - lastT));
    lastT = t;
    time.value = t;

    for (const s of stars) {
      const local = t - s.delay;
      const cycle = s.duration + s.rest;
      const p = local < 0 ? 2 : (local % cycle) / s.duration;
      if (p > 1) {
        s.tailOpacity.value = 0;
        s.headOpacity.value = 0;
        s.owed = 0;
        continue;
      }
      // Quick out of the gate, easing as it fades.
      const travel = TRAVEL * s.scale * (1 - Math.pow(1 - p, 2.2));
      headAt.copy(s.start).addScaledVector(DIR, travel);
      const fade = Math.sin(Math.PI * p);
      s.head.position.set(headAt.x, headAt.y, 0);
      s.tail.position.set(headAt.x, headAt.y, 0);
      s.tail.scale.set(TAIL * s.scale * Math.pow(fade, 0.6) + 1e-3, 8 * s.scale, 1);
      s.tailOpacity.value = fade * 0.85;
      s.headOpacity.value = fade;
      s.spin.value = t * 0.8 + s.delay;

      s.owed += dt * DUST_RATE * fade;
      for (; s.owed >= 1; s.owed--) shed(headAt, t, s.scale);
    }
    for (const name of ["position", "aVel", "aBirth", "aSize"]) dustGeo.getAttribute(name).needsUpdate = true;

    renderer.render(scene, camera);
  };

  // Only animate while the section is on screen.
  let visible = true;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  io.observe(host);
  if (reducedMotion) {
    // A still frame with the stars mid-flight.
    for (const s of stars) s.delay = 0;
    render(0.9);
  } else {
    renderer.setAnimationLoop(() => visible && render());
  }

  return () => {
    renderer.setAnimationLoop(null);
    ro.disconnect();
    io.disconnect();
    scene.traverse((obj) => {
      const o = obj as THREE.Mesh;
      o.geometry?.dispose();
      (o.material as THREE.Material | undefined)?.dispose();
    });
    renderer.dispose();
    renderer.domElement.remove();
  };
};
