import * as THREE from "three";
import {
  SPARKLE_FRAG,
  WISH_TAIL_FRAG,
  WISH_TAIL_VERT,
  WORLD_VERT,
} from "./shaders";

/** Where the badge goes, in CSS px from the scene's top-left, and whether it's showing. */
export type WishState = { x: number; y: number; visible: boolean };

/** The current view: camera centre and half-extents in world px, plus the canvas size in CSS px. */
export type View = {
  camX: number;
  camY: number;
  halfW: number;
  halfH: number;
  width: number;
  height: number;
};

/** Timing (seconds). The star flies in, holds until the wish is made, then shoots off. */
const FIRST = [4, 6];
const EVERY = [15, 30];
const IN_FOR = 0.75;
/** If nobody makes the wish, the star moves on by itself after this long. */
const HOLD_MAX = 15;
const OUT_FOR = 0.8;
/** How far along its path the star stops. */
const HOLD_AT = 0.42;

const additive = (
  uniforms: Record<string, { value: number }>,
  vertexShader: string,
  fragmentShader: string,
) =>
  new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
  });

/**
 * An easter egg: now and then a bright shooting star crosses open sky, stops partway, and
 * waits for a wish. Returns a per-frame update, which reports where the badge should sit, and
 * release(), which sends the star on its way.
 */
export const addWishStar = (
  scene: THREE.Scene,
  onWish: (state: WishState) => void,
) => {
  const tailOpacity = { value: 0 };
  const tail = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1).translate(0.5, 0, 0),
    additive({ uOpacity: tailOpacity }, WISH_TAIL_VERT, WISH_TAIL_FRAG),
  );
  const headOpacity = { value: 0 };
  const spin = { value: 0 };
  const head = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    additive({ uOpacity: headOpacity, uSpin: spin }, WORLD_VERT, SPARKLE_FRAG),
  );
  tail.renderOrder = head.renderOrder = 3;
  scene.add(tail, head);

  const between = ([lo, hi]: number[]) => lo + Math.random() * (hi - lo);
  type Phase = "waiting" | "in" | "hold" | "out";
  let phase: Phase = "waiting";
  let phaseAt = 0;
  let nextAt = between(FIRST);
  let released = false;
  const from = new THREE.Vector2();
  const dir = new THREE.Vector2();
  let travel = 0;
  let showing = false;

  const report = (state: WishState) => {
    if (state.visible || showing) onWish(state);
    showing = state.visible;
  };
  const enter = (next: Phase, t: number) => {
    phase = next;
    phaseAt = t;
  };

  const update = (t: number, view: View) => {
    const local = t - phaseAt;
    if (phase === "waiting") {
      tailOpacity.value = headOpacity.value = 0;
      if (showing) report({ x: 0, y: 0, visible: false });
      if (t < nextAt) return;
      // A fresh flight through open sky on the right, clear of the hero card, heading down-left.
      const wide = view.width >= 768 && view.width > view.height;
      const sx = wide ? between([0.66, 0.88]) : between([0.45, 0.8]);
      const sy = between([0.1, 0.26]);
      from.set(
        view.camX + (sx - 0.5) * 2 * view.halfW,
        view.camY - (sy - 0.5) * 2 * view.halfH,
      );
      const angle = Math.PI + 0.5 + (Math.random() - 0.5) * 0.3;
      dir.set(Math.cos(angle), Math.sin(angle));
      travel = view.halfW * (wide ? 0.75 : 1.1);
      released = false;
      enter("in", t);
      return;
    }
    if (phase === "in" && local >= IN_FOR) enter("hold", t);
    else if (phase === "hold" && (released || local >= HOLD_MAX))
      enter("out", t);
    else if (phase === "out" && local >= OUT_FOR) {
      nextAt = t + between(EVERY);
      enter("waiting", t);
      return;
    }

    // Progress along the path, and how bright the star is.
    const since = t - phaseAt;
    let p = HOLD_AT;
    let fade = 1;
    if (phase === "in") {
      const k = since / IN_FOR;
      p = HOLD_AT * (1 - Math.pow(1 - k, 2.5));
      fade = Math.min(1, k * 3);
    } else if (phase === "out") {
      const k = since / OUT_FOR;
      p = HOLD_AT + (1 - HOLD_AT) * k * k;
      fade = 1 - k;
    }

    const x = from.x + dir.x * travel * p;
    const y = from.y + dir.y * travel * p;
    const holding = phase === "hold";
    // While holding, the tail draws in and the sparkle breathes.
    const tailLen = holding ? 230 * (1 - 0.6 * Math.min(1, since * 1.2)) : 260;
    const pulse = holding ? 1 + 0.18 * Math.sin(since * 4) : 1;
    tail.position.set(x, y, 0);
    tail.rotation.z = Math.atan2(-dir.y, -dir.x);
    tail.scale.set(tailLen, 7, 1);
    tailOpacity.value = fade;
    head.position.set(x, y, 0);
    head.scale.setScalar(110 * pulse);
    headOpacity.value = fade;
    spin.value = t * 0.6;

    const scale = view.width / (2 * view.halfW);
    report({
      x: (x - (view.camX - view.halfW)) * scale,
      y: (view.camY + view.halfH - y) * scale,
      visible: holding,
    });
  };

  return {
    update,
    release: () => {
      released = true;
    },
  };
};
