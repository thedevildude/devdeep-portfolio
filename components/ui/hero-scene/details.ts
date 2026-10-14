import * as THREE from "three";
import { BELT, CENTER, GALAXIES, MOONS, ORBIT_ARCS, RING, at, clamp01 } from "./layout";
import { makePlanetMesh } from "./planet";
import {
  BELT_FRAG,
  BELT_VERT,
  DOT_FRAG,
  GALAXY_FRAG,
  RING_FRAG,
  WORLD_VERT,
} from "./shaders";

type Uniform<T> = { value: T };

type DetailsContext = {
  scene: THREE.Scene;
  /** The group that sways around the starburst; satellites ride along with it. */
  galaxy: THREE.Group;
  /** Planet meshes in PLANETS order, already positioned and scaled each frame. */
  planets: THREE.Mesh[];
  time: Uniform<number>;
  since: Uniform<number>;
  starScale: Uniform<number>;
  rand: () => number;
  gauss: () => number;
};

const additive = (uniforms: Record<string, Uniform<unknown>>, fragmentShader: string) =>
  new THREE.ShaderMaterial({
    uniforms,
    vertexShader: WORLD_VERT,
    fragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthTest: false,
  });

/**
 * The scene's finer layers: an asteroid belt round the core, a ringed planet, orbiting moons,
 * distant galaxies and satellites on the orbit arcs.
 * Returns a per-frame update, to run after the planets have moved.
 *
 * Draw order: sky 0 → galaxies 0.5 → galaxy group 1 → far belt / far ring / far moons →
 * planets 2 → near moons / near ring / near belt.
 */
export const addDetails = ({ scene, galaxy, planets, time, since, starScale, rand, gauss }: DetailsContext) => {
  // Asteroid belt: one geometry, drawn as a far half and a near half around the core planet.
  const beltGeo = new THREE.BufferGeometry();
  const beltAttr = (fill: () => number) =>
    new THREE.Float32BufferAttribute(Float32Array.from({ length: BELT.count }, fill), 1);
  beltGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(BELT.count * 3), 3));
  beltGeo.setAttribute("aRadius", beltAttr(() => BELT.radius + gauss() * BELT.spread));
  beltGeo.setAttribute("aAngle", beltAttr(() => rand() * Math.PI * 2));
  beltGeo.setAttribute("aSize", beltAttr(() => (rand() < 0.06 ? 5 : 2 + rand() * 2.2)));
  beltGeo.setAttribute("aPhase", beltAttr(rand));
  const belts = [0, 1].map((nearHalf) => {
    const points = new THREE.Points(
      beltGeo,
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: time,
          uScale: starScale,
          uSince: since,
          uTilt: { value: BELT.tilt },
          uSquash: { value: BELT.squash },
          uNearHalf: { value: nearHalf },
        },
        vertexShader: BELT_VERT,
        fragmentShader: BELT_FRAG,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthTest: false,
      }),
    );
    points.position.set(CENTER[0], CENTER[1], 0);
    points.frustumCulled = false;
    points.renderOrder = nearHalf ? 2.6 : 1.5;
    scene.add(points);
    return points;
  });

  // Rings round the pink planet, split the same way so the planet sits inside them.
  const ringHost = planets[RING.planet];
  const ringSize = (ringHost.geometry as THREE.PlaneGeometry).parameters.width / 2.6;
  const rings = [0, 1].map((nearHalf) => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(ringSize * RING.outer * 2, ringSize * RING.outer * 2),
      new THREE.ShaderMaterial({
        uniforms: {
          uInner: { value: RING.inner / RING.outer },
          uTilt: { value: RING.tilt },
          uSquash: { value: RING.squash },
          uNearHalf: { value: nearHalf },
          uOpacity: { value: 0.85 },
          uColA: { value: new THREE.Color(RING.colA).convertLinearToSRGB() },
          uColB: { value: new THREE.Color(RING.colB).convertLinearToSRGB() },
        },
        vertexShader: WORLD_VERT,
        fragmentShader: RING_FRAG,
        transparent: true,
        depthTest: false,
      }),
    );
    mesh.renderOrder = nearHalf ? 2.4 : 1.8;
    scene.add(mesh);
    return mesh;
  });

  // Moons pass behind their planet on the far side of the orbit, in front on the near side.
  const moons = MOONS.map((m, i) => {
    const mesh = makePlanetMesh(m.spec, 40 + i * 5.3, time);
    scene.add(mesh);
    return { ...m, mesh, phase: rand() * Math.PI * 2 };
  });

  // Distant spiral galaxies, revealed as the shockwave passes.
  const galaxies = GALAXIES.map((g, i) => {
    const opacity = { value: 0 };
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(g.size * 2, g.size * 2),
      additive(
        {
          uTime: time,
          uTilt: { value: g.tilt },
          uSquash: { value: g.squash },
          uSeed: { value: i * 7.1 },
          uOpacity: opacity,
          uTint: { value: new THREE.Vector3(...g.tint) },
        },
        GALAXY_FRAG,
      ),
    );
    const [x, y] = at(g.x, g.y);
    mesh.position.set(x, y, 0);
    mesh.renderOrder = 0.5;
    scene.add(mesh);
    return { opacity, delay: Math.hypot(x - CENTER[0], y - CENTER[1]) / 1800 };
  });

  // Satellites: small lights gliding along each orbit arc, fading at its ends.
  const satellites = ORBIT_ARCS.map(([radius, from, to], i) => {
    const opacity = { value: 0 };
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), additive({ uOpacity: opacity }, DOT_FRAG));
    galaxy.add(mesh);
    return { mesh, opacity, radius, from, to, period: 9 + i * 4.5, offset: rand() };
  });

  return (t: number) => {
    const s = since.value;

    for (const belt of belts) belt.rotation.z = galaxy.rotation.z;

    for (const ring of rings) {
      ring.position.copy(ringHost.position);
      ring.scale.copy(ringHost.scale);
    }

    for (const m of moons) {
      const host = planets[m.planet];
      const a = m.phase + t * m.speed;
      const ox = Math.cos(a) * m.orbit;
      const oy = Math.sin(a) * m.orbit * m.squash;
      const c = Math.cos(m.tilt);
      const sn = Math.sin(m.tilt);
      m.mesh.position.set(host.position.x + c * ox - sn * oy, host.position.y + sn * ox + c * oy, 0);
      m.mesh.scale.copy(host.scale);
      m.mesh.renderOrder = Math.sin(a) > 0 ? 1.9 : 2.2;
    }

    for (const g of galaxies) g.opacity.value = 0.8 * clamp01((s - g.delay) / 1.2);

    for (const sat of satellites) {
      const p = (t / sat.period + sat.offset) % 1;
      const a = THREE.MathUtils.degToRad(sat.from + (sat.to - sat.from) * p);
      sat.mesh.position.set(Math.cos(a) * sat.radius, Math.sin(a) * sat.radius, 0);
      sat.opacity.value = Math.sin(Math.PI * p) * clamp01((s - 2) / 1.5);
    }
  };
};
