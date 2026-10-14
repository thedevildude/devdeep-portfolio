import * as THREE from "three";
import {
  BAND_ANGLE,
  BANG_AT,
  BURST_SCREEN_X,
  CENTER,
  CORE_PLANET,
  IMG_H,
  IMG_W,
  ORBIT_ARCS,
  PLANETS,
  RAYS,
  REVEAL_FOR,
  REVEAL_RADIUS,
  SPARKLES,
  at,
  clamp01,
  easeOutBack,
  easeOutCubic,
} from "./layout";
import {
  CORONA_FRAG,
  GLITTER_FRAG,
  GLITTER_VERT,
  RAY_FRAG,
  RAY_VERT,
  SKY_FRAG,
  STAR_FRAG,
  STAR_VERT,
  STREAK_FRAG,
  WORLD_VERT,
} from "./shaders";
import { addDetails } from "./details";
import { makePlanetMesh } from "./planet";
import { addWishStar, type WishState } from "./wish";

/**
 * A live Three.js take on the hero artwork: deep space with a Milky Way band, a starburst
 * fanning out from behind a central planet, planets, orbit lines, stars, cursor-shy glitter and
 * the odd shooting star, plus the finer layers in details.ts. It opens with a big bang: the core charges, flashes, and a shockwave
 * reveals the scene.
 *
 * The scene is laid out in the artwork's own pixel space (1920×1088, origin at its centre,
 * y up) and the orthographic camera "covers" the section the way object-cover would.
 */

/** Builds the scene into host and starts it; returns its teardown, and a way to release the wish star. */
export const createHeroScene = (host: HTMLElement, onWish: (state: WishState) => void) => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.domElement.className = "absolute inset-0 size-full";
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
  camera.position.z = 50;

  // The shaders write display-ready (sRGB) colours, so pass them through unconverted.
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;

  const time = { value: 0 };
  // The cursor in world space, for the glitter to scatter from; mouseOn fades it in and out.
  const mouseWorld = new THREE.Vector2(1e5, 1e5);
  const mouseOn = { value: 0 };
  const since = { value: 0 };
  const center = new THREE.Vector2(...CENTER);

  const skyUniforms = {
    uTime: time,
    uCenter: { value: center },
    uBand: { value: BAND_ANGLE },
    uReveal: { value: 0 },
    uFront: { value: 0 },
    uFlash: { value: 0 },
  };
  // The sky is a little larger than the artwork so the camera never sees past it.
  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(IMG_W * 1.2, IMG_H * 1.2),
    new THREE.ShaderMaterial({
      uniforms: skyUniforms,
      vertexShader: WORLD_VERT,
      fragmentShader: SKY_FRAG,
      depthTest: false,
    }),
  );
  scene.add(sky);

  // Everything in the "galaxy" sways gently around the starburst.
  const galaxy = new THREE.Group();
  galaxy.position.set(CENTER[0], CENTER[1], 0);
  galaxy.renderOrder = 1;
  scene.add(galaxy);

  const lineMat = new THREE.LineBasicMaterial({
    // Raw display values, like the shaders (built-in colours would be linearised).
    color: new THREE.Color().setRGB(0.96, 0.93, 0.96, THREE.LinearSRGBColorSpace),
    transparent: true,
    opacity: 0,
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
  galaxy.add(...ORBIT_ARCS.map(([radius, from, to]) => arc(radius, from, to)));

  // Spokes from the starburst out to the planets and edges, plus a small constellation.
  const spokeEnds = [
    [975, -40], [790, 120], [1190, 218], [1385, 290], [612, 175], [565, 300], [1300, 520],
  ];
  const spokePts: number[] = [];
  for (const [x, y] of spokeEnds) {
    const [wx, wy] = at(x, y);
    const dx = wx - CENTER[0];
    const dy = wy - CENTER[1];
    const len = Math.hypot(dx, dy);
    spokePts.push((dx / len) * 50, (dy / len) * 50, 0, dx, dy, 0);
  }
  const constellation = [[1100, 365], [1190, 410], [1320, 425], [1190, 410], [1200, 472]];
  for (let i = 0; i < constellation.length - 1; i += 2) {
    for (const [x, y] of [constellation[i], constellation[i + 1]]) {
      const [wx, wy] = at(x, y);
      spokePts.push(wx - CENTER[0], wy - CENTER[1], 0);
    }
  }
  const spokeGeo = new THREE.BufferGeometry();
  spokeGeo.setAttribute("position", new THREE.Float32BufferAttribute(spokePts, 3));
  galaxy.add(new THREE.LineSegments(spokeGeo, lineMat));

  // Stars: a field across open space, a dense drift along the Milky Way, and the sparkles.
  const starPos: number[] = [];
  const starSize: number[] = [];
  const starPhase: number[] = [];
  const starSparkle: number[] = [];
  const rand = (() => {
    let s = 7;
    return () => ((s = (s * 16807) % 2147483647) / 2147483647);
  })();
  const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand());
  const addStar = (x: number, y: number, size: number, sparkle = 0) => {
    starPos.push(x, y, 0);
    starSize.push(size);
    starPhase.push(rand());
    starSparkle.push(sparkle);
  };
  for (let n = 0; n < 420; n++) {
    const x = (rand() - 0.5) * IMG_W * 1.2;
    const y = (rand() - 0.5) * IMG_H * 1.2;
    addStar(x, y, rand() < 0.1 ? 7 : 2.5 + rand() * 3);
  }
  const bandDir = [Math.cos(BAND_ANGLE), Math.sin(BAND_ANGLE)];
  for (let n = 0; n < 1600; n++) {
    const along = (rand() - 0.5) * 2400;
    const across = gauss() * 95;
    const x = bandDir[0] * along - bandDir[1] * across;
    const y = bandDir[1] * along + bandDir[0] * across;
    addStar(x, y, rand() < 0.04 ? 5 : 1.4 + rand() * 1.8);
  }
  for (const [x, y, size] of SPARKLES) {
    const [wx, wy] = at(x, y);
    addStar(wx - CENTER[0], wy - CENTER[1], size, 1);
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
        uniforms: { uTime: time, uScale: starScale, uSince: since },
        vertexShader: STAR_VERT,
        fragmentShader: STAR_FRAG,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
      }),
    ),
  );

  // The starburst: a corona hugging the core planet, and instanced ray strips fanning out
  // from behind its rim (the planet itself is drawn with the others, on top).
  const corona = {
    uTime: time,
    uRadius: { value: CORE_PLANET.r },
    uCharge: { value: 0 },
    uSettled: { value: 0 },
  };
  galaxy.add(
    new THREE.Mesh(
      new THREE.PlaneGeometry(600, 600),
      new THREE.ShaderMaterial({
        uniforms: corona,
        vertexShader: WORLD_VERT,
        fragmentShader: CORONA_FRAG,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
      }),
    ),
  );

  const strip = new THREE.PlaneGeometry(1, 1).translate(0.5, 0, 0);
  const rayGeo = new THREE.InstancedBufferGeometry();
  rayGeo.setIndex(strip.getIndex());
  rayGeo.setAttribute("position", strip.getAttribute("position"));
  rayGeo.instanceCount = RAYS.count;
  const rayAttr = (fill: (i: number) => number) =>
    new THREE.InstancedBufferAttribute(Float32Array.from({ length: RAYS.count }, (_, i) => fill(i)), 1);
  rayGeo.setAttribute("aAngle", rayAttr((i) => ((i + rand() * 0.8) / RAYS.count) * Math.PI * 2));
  // Mostly short rays with the occasional long one, like the painted burst.
  rayGeo.setAttribute("aLength", rayAttr(() => RAYS.minLength + (RAYS.maxLength - RAYS.minLength) * rand() ** 2.2));
  rayGeo.setAttribute("aWidth", rayAttr(() => 1.2 + rand() * 2.4));
  rayGeo.setAttribute("aPhase", rayAttr(() => rand()));
  const rays = { uTime: time, uRadius: { value: CORE_PLANET.r * 0.85 }, uGrow: { value: 0 } };
  galaxy.add(
    new THREE.Mesh(
      rayGeo,
      new THREE.ShaderMaterial({
        uniforms: rays,
        vertexShader: RAY_VERT,
        fragmentShader: RAY_FRAG,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
      }),
    ),
  );

  // Glittering motes across the sky, and a spray of dust around the starburst.
  const glPos: number[] = [];
  const glSize: number[] = [];
  const glPhase: number[] = [];
  const glColor: number[] = [];
  const addGlitter = (rx: number, ry: number, size: number, color: number[]) => {
    glPos.push(rx + CENTER[0], ry + CENTER[1], 0);
    glSize.push(size);
    glPhase.push(rand());
    glColor.push(...color);
  };
  const tints = [[0.88, 0.92, 1], [1, 0.86, 0.95], [0.8, 0.76, 1]];
  for (let n = 0; n < 2400; n++) {
    const rx = (rand() - 0.5) * IMG_W * 1.1 - CENTER[0];
    const ry = (rand() - 0.5) * IMG_H * 1.1 - CENTER[1];
    addGlitter(rx, ry, 1.6 + rand() * 1.8, tints[Math.floor(rand() * tints.length)]);
  }
  for (let n = 0; n < 700; n++) {
    const a = rand() * Math.PI * 2;
    const r = 40 + Math.abs(gauss()) * 260;
    addGlitter(Math.cos(a) * r * 1.3, Math.sin(a) * r, 1.2 + rand() * 2.2, [1, 0.94, 1]);
  }
  const glGeo = new THREE.BufferGeometry();
  glGeo.setAttribute("position", new THREE.Float32BufferAttribute(glPos, 3));
  glGeo.setAttribute("aSize", new THREE.Float32BufferAttribute(glSize, 1));
  glGeo.setAttribute("aPhase", new THREE.Float32BufferAttribute(glPhase, 1));
  glGeo.setAttribute("aColor", new THREE.Float32BufferAttribute(glColor, 3));
  const glitter = new THREE.Points(
    glGeo,
    new THREE.ShaderMaterial({
      uniforms: {
        uTime: time,
        uScale: starScale,
        uSince: since,
        uCenter: { value: center },
        uMouse: { value: mouseWorld },
        uMouseOn: mouseOn,
      },
      vertexShader: GLITTER_VERT,
      fragmentShader: GLITTER_FRAG,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthTest: false,
    }),
  );
  glitter.renderOrder = 1;
  scene.add(glitter);

  // Shooting stars streak across open sky every few seconds.
  const streaks = [0, 1].map((i) => {
    const opacity = { value: 0 };
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.ShaderMaterial({
        uniforms: { uOpacity: opacity },
        vertexShader: WORLD_VERT,
        fragmentShader: STREAK_FRAG,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
      }),
    );
    mesh.scale.set(260, 2.5, 1);
    mesh.renderOrder = 1;
    scene.add(mesh);
    return { mesh, opacity, period: 5.5 + i * 3.1, offset: 2.5 + i * 2.2, cycle: -1, x: 0, y: 0, a: 0 };
  });

  // Planets drift on their own slow cycles and pop in as the shockwave reaches them.
  const planets = [...PLANETS, CORE_PLANET].map((p, i) => {
    const mesh = makePlanetMesh(p, i * 3.7, time);
    const [x, y] = at(p.x, p.y);
    mesh.position.set(x, y, 0);
    mesh.renderOrder = 2;
    scene.add(mesh);
    const reach = Math.max(0, Math.hypot(x - CENTER[0], y - CENTER[1]) - p.r) / REVEAL_RADIUS;
    return {
      mesh,
      x,
      y,
      phase: i * 1.9,
      amp: p === CORE_PLANET ? 0 : p.r > 100 ? 6 : p.r > 30 ? 12 : 16,
      // When the shockwave's front reaches the planet's edge (inverse of easeOutCubic).
      appear: BANG_AT + REVEAL_FOR * (1 - Math.cbrt(1 - Math.min(reach, 0.999))),
    };
  });

  const updateDetails = addDetails({
    scene,
    galaxy,
    planets: planets.map((p) => p.mesh),
    time,
    since,
    starScale,
    rand,
    gauss,
  });

  const wish = addWishStar(scene, onWish);

  let viewW = 1;
  let viewH = 1;
  let wide = true;
  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    renderer.setSize(w, h, false);
    // Cover: the artwork fills the viewport, cropping whichever axis overflows.
    const worldScale = Math.max(w / IMG_W, h / IMG_H);
    viewW = w / worldScale;
    viewH = h / worldScale;
    wide = w >= 768 && w > h;
    camera.left = -viewW / 2;
    camera.right = viewW / 2;
    camera.top = viewH / 2;
    camera.bottom = -viewH / 2;
    starScale.value = worldScale * renderer.getPixelRatio();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);

  // Pointer: parallax from its place in the window, and its position over the scene (0–1).
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, sx: 0, sy: 0, over: false };
  const onPointer = (e: PointerEvent) => {
    pointer.tx = e.clientX / window.innerWidth - 0.5;
    pointer.ty = e.clientY / window.innerHeight - 0.5;
    const rect = host.getBoundingClientRect();
    pointer.sx = (e.clientX - rect.left) / rect.width;
    pointer.sy = (e.clientY - rect.top) / rect.height;
    pointer.over = pointer.sx >= 0 && pointer.sx <= 1 && pointer.sy >= 0 && pointer.sy <= 1;
  };
  const onLeave = () => (pointer.over = false);
  window.addEventListener("pointermove", onPointer);
  document.addEventListener("pointerleave", onLeave);

  const start = performance.now();
  let lastT = 0;
  let scrollEased = 0;
  const render = (t = (performance.now() - start) / 1000) => {
    // Frame-rate independent easing: the share of the remaining distance to cover this frame.
    const dt = Math.min(0.1, Math.max(0, t - lastT));
    lastT = t;
    const ease = (rate: number) => 1 - Math.exp(-dt * rate);
    time.value = t;

    // Big bang: the point charges, flashes, and the shockwave sweeps the scene in.
    const s = t - BANG_AT;
    since.value = Math.max(0, s);
    const reveal = clamp01(s / REVEAL_FOR);
    skyUniforms.uReveal.value = s < 0 ? 0 : REVEAL_RADIUS * easeOutCubic(reveal);
    skyUniforms.uFront.value = s < 0 ? 0 : 1 - reveal;
    skyUniforms.uFlash.value = s < 0 ? 0 : 0.9 * Math.exp(-s * 5);
    corona.uCharge.value = s < 0 ? (t / BANG_AT) ** 2 : 1 + 2.5 * Math.exp(-s * 3);
    corona.uSettled.value = clamp01(s / 0.3);
    rays.uGrow.value = s < 0 ? 0 : easeOutCubic(clamp01(s / 1.4));
    lineMat.opacity = 0.5 * clamp01((s - 0.8) / 1.4);

    galaxy.rotation.z = Math.sin(t * 0.05) * 0.06;
    skyUniforms.uBand.value = BAND_ANGLE + galaxy.rotation.z;

    planets.forEach(({ mesh, x, y, phase, amp, appear }) => {
      mesh.position.x = x + Math.sin(t * 0.25 + phase) * amp;
      mesh.position.y = y + Math.cos(t * 0.2 + phase) * amp;
      mesh.scale.setScalar(Math.max(0, easeOutBack(clamp01((t - appear) / 0.7))));
    });
    updateDetails(t);

    for (const st of streaks) {
      const local = t - st.offset;
      const cycle = Math.floor(local / st.period);
      const p = (local - cycle * st.period) / 0.9;
      if (local < 0 || p > 1) {
        st.opacity.value = 0;
        continue;
      }
      if (cycle !== st.cycle) {
        // A fresh start point, heading down-left like the painted flow.
        st.cycle = cycle;
        st.x = (rand() - 0.3) * 1100;
        st.y = (rand() - 0.2) * 600;
        st.a = Math.PI + 0.35 + (rand() - 0.5) * 0.4;
      }
      const travel = p * 520;
      st.mesh.position.set(
        CENTER[0] + st.x + Math.cos(st.a) * travel,
        CENTER[1] + st.y + Math.sin(st.a) * travel,
        0,
      );
      st.mesh.rotation.z = st.a;
      st.opacity.value = Math.sin(Math.PI * p);
    }

    // Zoomed in enough to frame the starburst right of the card, breathing slowly, with a
    // touch of pointer parallax; it starts tight on the bang and pulls back.
    pointer.x += (pointer.tx - pointer.x) * ease(2.4);
    pointer.y += (pointer.ty - pointer.y) * ease(2.4);
    // Scrolling past the hero pushes the camera in toward the starburst.
    // Eased toward the scroll position, so the push-in glides instead of stepping with it.
    scrollEased += (clamp01(window.scrollY / window.innerHeight) - scrollEased) * ease(3);
    const scroll = scrollEased;
    const intro = Math.exp(-t * 0.9);
    const zoom = (1.18 + 0.04 * Math.sin(t * 0.08)) * (1 + 1.6 * intro) * (1 + scroll * 0.8);
    camera.zoom = zoom;
    const halfW = viewW / 2 / zoom;
    const halfH = viewH / 2 / zoom;
    const burstX = wide ? BURST_SCREEN_X : 0.5;
    const camX = CENTER[0] - (burstX - 0.5) * 2 * halfW + pointer.x * 24;
    const camY = CENTER[1] * 0.5 - pointer.y * 16;
    const clamp = (v: number, lim: number) => Math.max(-lim, Math.min(lim, v));
    camera.position.x = clamp(camX, Math.max(0, IMG_W / 2 - halfW));
    camera.position.y = clamp(camY, Math.max(0, IMG_H / 2 - halfH));
    camera.updateProjectionMatrix();
    wish.update(t, {
      camX: camera.position.x,
      camY: camera.position.y,
      halfW,
      halfH,
      width: host.clientWidth,
      height: host.clientHeight,
    });

    // The dust follows the cursor lazily, so it drifts aside rather than scattering.
    const mx = camera.position.x + (pointer.sx - 0.5) * 2 * halfW;
    const my = camera.position.y - (pointer.sy - 0.5) * 2 * halfH;
    if (mouseOn.value < 0.01) mouseWorld.set(mx, my);
    mouseWorld.x += (mx - mouseWorld.x) * ease(2.1);
    mouseWorld.y += (my - mouseWorld.y) * ease(2.1);
    mouseOn.value += ((pointer.over ? 1 : 0) - mouseOn.value) * ease(1.8);

    renderer.render(scene, camera);
  };

  // Only animate while the hero is on screen.
  let visible = true;
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  io.observe(host);
  if (reducedMotion) {
    render(30);
  } else {
    renderer.setAnimationLoop(() => visible && render());
  }

  const dispose = () => {
    renderer.setAnimationLoop(null);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("pointermove", onPointer);
    document.removeEventListener("pointerleave", onLeave);
    scene.traverse((obj) => {
      const o = obj as THREE.Mesh;
      o.geometry?.dispose();
      const mat = o.material as THREE.Material | undefined;
      mat?.dispose();
    });
    renderer.dispose();
    renderer.domElement.remove();
  };

  return { dispose, releaseWish: wish.release };
};
