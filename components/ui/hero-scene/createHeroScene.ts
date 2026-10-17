import * as THREE from "three";
import { FRAG, SIM_FRAG, VERT } from "./shaders";

/**
 * The hero's live backdrop: a still river at dusk, running out through layered hills toward
 * the horizon, ray traced in a full-screen pass. "Devdeep" means the divine lamp, so the scene opens with a lamp rising
 * where the river meets the sky.
 *
 * The water near the camera is a small wave simulation. A click drops a stone into it; moving
 * the cursor leads a fish, which follows with a little lag, beats its tail and leaves a wake.
 * Now and then something rises far off, so the river never looks frozen.
 */

/** Site palette (globals.css brand colours and the hero artwork), as display sRGB. */
const PALETTE = {
  uZenith: "#060b2e",
  uCobalt: "#0a35d6",
  uLavender: "#8f8cf2",
  uPetal: "#fde5f4",
  uGlow: "#fff6fb",
  uDeep: "#031046",
  uForest: "#050a26",
};

/** Seconds the lamp takes to rise, and where it settles above the horizon (radians). */
const RISE_FOR = 3.2;
const LAMP_ELEVATION = 0.04;

/** The simulated patch of water, in world units (x across, z away from the camera). */
const SIM = { minX: -30, maxX: 30, minZ: -52, maxZ: 0.8 };
const SIM_STEPS_PER_SECOND = 60;
const MAX_DROPS = 12;

const CAMERA_HEIGHT = 1.15;

/**
 * Tree-line silhouette, as a coverage mask. Source: "Forest Treeline Silhouette 3" by GDJ,
 * openclipart.org/detail/315866 (public domain).
 */
const TREELINE = { src: "/hero/treeline.webp", aspect: 800 / 237, height: 237 };

const srgb = (hex: string) => new THREE.Color(hex).convertLinearToSRGB();
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const easeOutCubic = (x: number) => 1 - (1 - x) ** 3;
const wrapAngle = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** Builds the scene into host and starts it; returns its teardown, or null without WebGL. */
export const createHeroScene = (host: HTMLElement) => {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
  } catch {
    return null;
  }
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  // The pass is per pixel, so resolution is the main cost; it adapts further below.
  let pixelRatio = Math.min(window.devicePixelRatio, coarse ? 1 : 1.25);
  renderer.setPixelRatio(pixelRatio);
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.domElement.className = "absolute inset-0 size-full";
  host.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
  camera.rotation.order = "YXZ";
  const quadGeo = new THREE.PlaneGeometry(2, 2);

  // ---------------------------------------------------------------- ripple simulation

  const simSize = new THREE.Vector2(SIM.maxX - SIM.minX, SIM.maxZ - SIM.minZ);
  const simW = coarse ? 320 : 560;
  const simH = Math.round((simW * simSize.y) / simSize.x);
  const canSimulate =
    !reducedMotion &&
    (renderer.extensions.has("EXT_color_buffer_half_float") || renderer.extensions.has("EXT_color_buffer_float"));
  const makeTarget = () =>
    new THREE.WebGLRenderTarget(simW, simH, {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: false,
    });
  let simRead = canSimulate ? makeTarget() : null;
  let simWrite = canSimulate ? makeTarget() : null;

  const drops = Array.from({ length: MAX_DROPS }, () => new THREE.Vector4());
  let dropCount = 0;
  const simUniforms = {
    uPrev: { value: simRead?.texture ?? null },
    uTexel: { value: new THREE.Vector2(1 / simW, 1 / simH) },
    uSize: { value: simSize },
    uDrops: { value: drops },
    uDropCount: { value: 0 },
  };
  const simScene = new THREE.Scene();
  const simMat = new THREE.ShaderMaterial({
    uniforms: simUniforms,
    vertexShader: VERT,
    fragmentShader: SIM_FRAG,
    depthTest: false,
  });
  const simQuad = new THREE.Mesh(quadGeo, simMat);
  simQuad.frustumCulled = false;
  simScene.add(simQuad);

  /** Queue a disturbance at a point on the water (world x, z). */
  const drop = (x: number, z: number, radius: number, strength: number) => {
    if (dropCount >= MAX_DROPS) return;
    const u = (x - SIM.minX) / simSize.x;
    const v = (z - SIM.minZ) / simSize.y;
    if (u < 0 || u > 1 || v < 0 || v > 1) return;
    drops[dropCount++].set(u, v, radius, strength);
  };

  const stepSim = () => {
    if (!simRead || !simWrite) return;
    simUniforms.uPrev.value = simRead.texture;
    simUniforms.uDropCount.value = dropCount;
    renderer.setRenderTarget(simWrite);
    renderer.render(simScene, camera);
    [simRead, simWrite] = [simWrite, simRead];
    dropCount = 0;
  };

  // ---------------------------------------------------------------- the river

  const uniforms = {
    uTime: { value: 0 },
    uCamPos: { value: new THREE.Vector3(0, CAMERA_HEIGHT, 0) },
    uCamRot: { value: new THREE.Matrix3() },
    uTan: { value: new THREE.Vector2(1, 1) },
    uSun: { value: new THREE.Vector3(0, 0, -1) },
    uRise: { value: 0 },
    uDim: { value: 0 },
    uCloudOct: { value: coarse ? 4 : 5 },
    uPix: { value: 0.001 },
    uSim: { value: simRead?.texture ?? null },
    uSimOn: { value: canSimulate ? 1 : 0 },
    uSimRect: { value: new THREE.Vector4(SIM.minX, SIM.minZ, simSize.x, simSize.y) },
    uSimTexel: { value: new THREE.Vector2(1 / simW, 1 / simH) },
    uTrees: { value: null as THREE.Texture | null },
    uTreesOn: { value: 0 },
    uTreesAspect: { value: TREELINE.aspect },
    uTreesTexH: { value: TREELINE.height },
    uFish: { value: new THREE.Vector4(0, -8, -Math.PI / 2, 0) },
    uFishPhase: { value: 0 },
    ...Object.fromEntries(Object.entries(PALETTE).map(([k, hex]) => [k, { value: srgb(hex) }])),
  };
  // The trees fade in once their small texture arrives; the scene renders fine without them.
  let disposed = false;
  let treeTex: THREE.Texture | null = null;
  new THREE.TextureLoader().load(TREELINE.src, (tex) => {
    if (disposed) return tex.dispose();
    tex.wrapS = THREE.MirroredRepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    tex.colorSpace = THREE.NoColorSpace;
    treeTex = tex;
    uniforms.uTrees.value = tex;
    uniforms.uTreesOn.value = 1;
    if (reducedMotion) still();
  });

  const scene = new THREE.Scene();
  const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG, depthTest: false });
  const quad = new THREE.Mesh(quadGeo, mat);
  quad.frustumCulled = false;
  scene.add(quad);

  /**
   * Framing. Wide layouts sit the horizon just below the middle, with the river (and the lamp
   * at its end) running off to the right of the hero card; narrow ones raise the horizon above
   * the card and look straight down the river.
   */
  const frame = { pitch: 0, yaw: 0, tanX: 1, tanY: 1 };
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    renderer.setSize(w, h, false);
    const wide = w >= 768 && w > h;
    camera.fov = wide ? 46 : 48;
    camera.aspect = w / h;
    frame.tanY = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    frame.tanX = frame.tanY * camera.aspect;
    uniforms.uTan.value.set(frame.tanX, frame.tanY);
    uniforms.uPix.value = (2 * frame.tanY) / Math.max(1, h * pixelRatio);
    const horizon = wide ? 0.56 : 0.3;
    frame.pitch = Math.atan((2 * horizon - 1) * frame.tanY);
    frame.yaw = Math.atan((wide ? 0.34 : 0) * frame.tanX);
  };
  resize();

  const setLamp = (rise: number) => {
    const elevation = THREE.MathUtils.lerp(-0.03, LAMP_ELEVATION, rise);
    uniforms.uSun.value.set(0, Math.sin(elevation), -Math.cos(elevation));
    uniforms.uRise.value = rise;
  };

  const place = (t: number, lookX: number, lookY: number) => {
    // Drifting on still water: barely any bob.
    uniforms.uCamPos.value.y = CAMERA_HEIGHT + Math.sin(t * 0.4) * 0.015;
    camera.rotation.set(frame.pitch + lookY * 0.02, frame.yaw - lookX * 0.035, Math.sin(t * 0.23) * 0.002);
    camera.updateMatrixWorld();
    uniforms.uCamRot.value.setFromMatrix4(camera.matrixWorld);
  };

  // ---------------------------------------------------------------- pointer → water

  const dir = new THREE.Vector3();
  /** Where a screen point lands on the water (world x, z), or null above the horizon. */
  const toWater = (clientX: number, clientY: number) => {
    const rect = host.getBoundingClientRect();
    const u = (clientX - rect.left) / rect.width;
    const v = (clientY - rect.top) / rect.height;
    if (u < 0 || u > 1 || v < 0 || v > 1) return null;
    dir.set((u * 2 - 1) * frame.tanX, (1 - v * 2) * frame.tanY, -1).applyMatrix3(uniforms.uCamRot.value).normalize();
    if (dir.y > -0.005) return null;
    const t = -uniforms.uCamPos.value.y / dir.y;
    return { x: uniforms.uCamPos.value.x + dir.x * t, z: uniforms.uCamPos.value.z + dir.z * t };
  };

  /**
   * The fish. It chases the cursor's spot on the water, easing in as it arrives, turns with
   * a limited rate, and beats its tail faster the faster it swims.
   */
  const fish = {
    x: 4,
    z: -10,
    vx: 0,
    vz: 0,
    heading: -Math.PI / 2,
    phase: 0,
    tx: 4,
    tz: -10,
    lastSeen: -100,
    visible: 0,
    wasSwimming: false,
  };

  const look = { x: 0, y: 0, tx: 0, ty: 0 };
  let now = 0;
  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType === "mouse") {
      look.tx = e.clientX / window.innerWidth - 0.5;
      look.ty = e.clientY / window.innerHeight - 0.5;
    }
    const hit = toWater(e.clientX, e.clientY);
    if (!hit) return;
    fish.tx = THREE.MathUtils.clamp(hit.x, SIM.minX + 2, SIM.maxX - 2);
    fish.tz = THREE.MathUtils.clamp(hit.z, SIM.minZ + 2, -0.8);
    // Out of sight, it rises from the deep just behind the cursor rather than crossing the river.
    if (fish.visible < 0.03) {
      fish.x = fish.tx + 1.2;
      fish.z = fish.tz - 1.6;
      fish.vx = fish.vz = 0;
      fish.heading = Math.atan2(fish.tz - fish.z, fish.tx - fish.x);
    }
    fish.lastSeen = now;
  };

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    const target = e.target as Element | null;
    if (target?.closest("a, button, input, textarea, select, [role='button']")) return;
    const hit = toWater(e.clientX, e.clientY);
    if (!hit) return;
    // A stone: one firm drop, and a smaller rebound just inside it.
    drop(hit.x, hit.z, 0.85, -0.55);
    drop(hit.x, hit.z, 0.35, 0.25);
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });

  const swim = (dt: number) => {
    const dx = fish.tx - fish.x;
    const dz = fish.tz - fish.z;
    const dist = Math.hypot(dx, dz);
    // Arrive: full speed when far, easing off close in.
    const want = Math.min(6, dist * 3.2);
    const wx = dist > 0.05 ? (dx / dist) * want : 0;
    const wz = dist > 0.05 ? (dz / dist) * want : 0;
    const k = 1 - Math.exp(-dt * 3.2);
    fish.vx += (wx - fish.vx) * k;
    fish.vz += (wz - fish.vz) * k;
    const speed = Math.hypot(fish.vx, fish.vz);
    if (speed > 0.08) {
      // Fish can't turn on the spot.
      const turn = wrapAngle(Math.atan2(fish.vz, fish.vx) - fish.heading);
      fish.heading = wrapAngle(fish.heading + THREE.MathUtils.clamp(turn, -dt * 4.5, dt * 4.5));
    }
    // Swim along the heading, so the path curves instead of sliding sideways.
    fish.x += Math.cos(fish.heading) * speed * dt;
    fish.z += Math.sin(fish.heading) * speed * dt;
    fish.phase += dt * (3 + speed * 4.5);

    // Visible while the cursor has been over the water recently.
    const present = now - fish.lastSeen < 4 ? 1 : 0;
    fish.visible += (present - fish.visible) * (1 - Math.exp(-dt * 1.5));

    // The wake: the head pushes a little water up, the tail swishes from side to side.
    const swimming = speed > 0.25;
    if (swimming && fish.visible > 0.05) {
      const fx = Math.cos(fish.heading);
      const fz = Math.sin(fish.heading);
      const effort = Math.min(1, 0.3 + speed / 3);
      const wag = Math.sin(fish.phase) * 0.22;
      drop(fish.x + fx * 0.45, fish.z + fz * 0.45, 0.3, 0.012 * effort);
      drop(fish.x - fx * 0.7 - fz * wag, fish.z - fz * 0.7 + fx * wag, 0.24, -0.02 * effort);
    }
    // Coming to rest, it touches the surface: one small ring.
    if (fish.wasSwimming && speed < 0.2 && fish.visible > 0.3) drop(fish.x, fish.z, 0.3, -0.08);
    fish.wasSwimming = speed > 0.5 ? true : speed < 0.2 ? false : fish.wasSwimming;

    uniforms.uFish.value.set(fish.x, fish.z, fish.heading, fish.visible * 0.9);
    uniforms.uFishPhase.value = fish.phase;
  };

  // Something rises out on the river every few seconds.
  let nextRise = 2.5;
  const ambient = (t: number) => {
    if (t < nextRise) return;
    nextRise = t + 3 + Math.random() * 5;
    const z = THREE.MathUtils.lerp(-7, -24, Math.random());
    const x = THREE.MathUtils.lerp(-16, 16, Math.random());
    drop(x, z, 0.4, -0.22);
  };

  // ---------------------------------------------------------------- loop

  /** A single settled frame, for reduced motion. */
  const still = () => {
    uniforms.uTime.value = 12;
    setLamp(1);
    place(12, 0, 0);
    renderer.render(scene, camera);
  };

  const ro = new ResizeObserver(() => {
    resize();
    if (reducedMotion) still();
  });
  ro.observe(host);

  const start = performance.now();
  let last = 0;
  let simClock = 0;
  let scrollEased = 0;
  let slowFrames = 0;
  let sampled = 0;
  const render = () => {
    const t = (performance.now() - start) / 1000;
    const dt = Math.min(0.05, Math.max(0, t - last));
    last = t;
    now = t;
    const ease = (rate: number) => 1 - Math.exp(-dt * rate);

    uniforms.uTime.value = t;
    setLamp(easeOutCubic(clamp01((t - 0.2) / RISE_FOR)));

    look.x += (look.tx - look.x) * ease(2);
    look.y += (look.ty - look.y) * ease(2);
    place(t, look.x, look.y);

    if (canSimulate) {
      swim(dt);
      ambient(t);
      // Fixed-rate steps keep ripple speed the same at any frame rate.
      simClock += dt * SIM_STEPS_PER_SECOND;
      let steps = Math.min(4, Math.floor(simClock));
      simClock -= Math.floor(simClock);
      while (steps-- > 0) stepSim();
      uniforms.uSim.value = simRead!.texture;
      renderer.setRenderTarget(null);
    }

    // The hero is sticky; as the page slides over it, the river dims toward the dark sections.
    scrollEased += (clamp01(window.scrollY / window.innerHeight) - scrollEased) * ease(4);
    uniforms.uDim.value = scrollEased * 0.55;

    renderer.render(scene, camera);

    // If frames run long after the first second, drop the resolution a step.
    if (t > 1 && pixelRatio > 0.6) {
      sampled++;
      if (dt > 1 / 40) slowFrames++;
      if (sampled === 90) {
        if (slowFrames > 45) {
          pixelRatio = Math.max(0.6, pixelRatio * 0.8);
          renderer.setPixelRatio(pixelRatio);
          resize();
        }
        sampled = slowFrames = 0;
      }
    }
  };

  // Only animate while the hero is on screen.
  let visible = true;
  const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
  io.observe(host);
  if (reducedMotion) still();
  else renderer.setAnimationLoop(() => visible && render());

  const dispose = () => {
    disposed = true;
    treeTex?.dispose();
    renderer.setAnimationLoop(null);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerdown", onPointerDown);
    quadGeo.dispose();
    mat.dispose();
    simMat.dispose();
    simRead?.dispose();
    simWrite?.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };

  return { dispose };
};
