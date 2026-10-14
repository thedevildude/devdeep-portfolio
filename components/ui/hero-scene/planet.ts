import * as THREE from "three";
import type { PlanetSpec } from "./layout";
import { PLANET_FRAG, WORLD_VERT } from "./shaders";

/** ShaderMaterial writes colours straight to the canvas, so hand it sRGB values. */
const srgb = (hex: string) => new THREE.Color(hex).convertLinearToSRGB();

/** A planet disc (with room for its halo), centred on its local origin. */
export const makePlanetMesh = (
  p: Pick<PlanetSpec, "r" | "base" | "accent" | "accent2" | "rim" | "opacity">,
  seed: number,
  time: { value: number },
) =>
  new THREE.Mesh(
    new THREE.PlaneGeometry(p.r * 2.6, p.r * 2.6),
    new THREE.ShaderMaterial({
      uniforms: {
        uTime: time,
        uBase: { value: srgb(p.base) },
        uAccent: { value: srgb(p.accent) },
        uAccent2: { value: srgb(p.accent2) },
        uRim: { value: srgb(p.rim) },
        uSeed: { value: seed },
        uOpacity: { value: p.opacity ?? 1 },
      },
      vertexShader: WORLD_VERT,
      fragmentShader: PLANET_FRAG,
      transparent: true,
      depthTest: false,
    }),
  );
