"use client";

import { useLayoutEffect, useRef } from "react";
import { preload } from "react-dom";

/*
 * Homepage loader, told in four beats:
 *   1. wind-up  — he grabs the rope and sinks into a lean
 *   2. strain   — heels dug in, teeth gritted, sweat flying; the divider won't budge
 *   3. budge    — it lurches free, he stumbles (shocked face, rope goes slack)
 *   4. haul     — he backpedals, dragging the divider left and uncovering the site;
 *                 if the page is still loading he gets stuck and strains again
 *
 * The divider *is* the block. Character parts: Kenney "Toon Characters 1" (CC0),
 * rigged here; see public/loader/CREDITS.txt.
 */
const GUY = "/loader/guy";

// Each part's joint inside its image (image px). The rig works in these px at scale 1.
const PARTS = {
  legBack: { src: "leg", pivot: [14, 6] },
  legFront: { src: "leg", pivot: [14, 6] },
  armBack: { src: "arm", pivot: [11, 9] },
  handBack: { src: "hand", pivot: [18, 17] },
  body: { src: "body", pivot: [38, 72] },
  head: { src: "headFocus", pivot: [53, 90] },
  armFront: { src: "arm", pivot: [11, 9] },
  handFront: { src: "hand", pivot: [18, 17] },
} as const;
type PartName = keyof typeof PARTS;
const PART_NAMES = Object.keys(PARTS) as PartName[];
const FACES = ["head", "headFocus", "headShock"] as const;

const ARM_DIR = Math.atan2(56 - 9, 32 - 11); // the arm image's own shoulder → wrist angle
const ARM_LEN = 52;
const ROPE_GAP = 230; // hips → divider, rig px
const RING_H = 118; // rope ring height above the ground, rig px
const SLAB_W = 34;
const D2R = Math.PI / 180;

const MAX_WAIT_MS = 6000;
const STALL_AT = 0.7; // how much of the page he may uncover before it has loaded
const SESSION_KEY = "dg-push-loader";

declare global {
  interface Window {
    __dgPushLoader?: "play" | "skip";
  }
}

// Runs while the HTML is parsed, so return visits / reduced motion never see a frame of the curtain.
const GATE_SCRIPT = `(function(){var p="play";try{if(sessionStorage.getItem("${SESSION_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)p="skip"}catch(e){}window.__dgPushLoader=p;if(p==="skip"){var el=document.getElementById("push-loader");if(el)el.style.display="none"}})()`;

const InlineScript = ({ html }: { html: string }) => (
  <script
    type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
    suppressHydrationWarning
    dangerouslySetInnerHTML={{ __html: html }}
  />
);

const hasPlayed = () => {
  try {
    return sessionStorage.getItem(SESSION_KEY) !== null;
  } catch {
    return false;
  }
};

const SCROLL_KEYS = new Set([
  " ",
  "ArrowDown",
  "ArrowUp",
  "PageDown",
  "PageUp",
  "Home",
  "End",
]);
const BLOCKED_EVENTS = ["wheel", "touchmove", "keydown"] as const;

const easeOut = (k: number) => 1 - (1 - k) ** 3;
const rotate = (x: number, y: number, deg: number): [number, number] => {
  const a = deg * D2R;
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
};

type Pose = {
  legFront: number;
  legBack: number;
  bob: number;
  lean: number;
  sqx: number;
  sqy: number;
  headSq: number;
  headTilt: number;
  grip: [number, number];
};

type Particle = {
  el: HTMLDivElement;
  kind: "sweat" | "dust";
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
};

const PushLoader = () => {
  for (const name of [...FACES, "body", "arm", "hand", "leg"])
    preload(`${GUY}/${name}.png`, { as: "image" });

  const rootRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const slabRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<SVGPathElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const partRefs = useRef<Partial<Record<PartName, HTMLImageElement>>>({});

  useLayoutEffect(() => {
    const root = rootRef.current!;
    // Only play on a hard load of this page; client-side navigations land here without the gate having run.
    // Hidden directly rather than via state, so the hydrated tree still matches the server HTML.
    if (window.__dgPushLoader !== "play" || hasPlayed()) {
      root.style.display = "none";
      return;
    }

    const curtain = curtainRef.current!;
    const slab = slabRef.current!;
    const ring = ringRef.current!;
    const rope = ropeRef.current!;
    const rig = rigRef.current!;
    const fx = fxRef.current!;
    const count = countRef.current!;
    const parts = partRefs.current as Record<PartName, HTMLImageElement>;

    // Hold the page still while the curtain is up (Lenis listens on window, so stop events on the way down).
    const block = (e: Event) => {
      if (e instanceof KeyboardEvent && !SCROLL_KEYS.has(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const opts = { capture: true, passive: false } as const;
    for (const type of BLOCKED_EVENTS)
      document.addEventListener(type, block, opts);

    let loaded = document.readyState === "complete";
    const onLoad = () => {
      document.fonts.ready.then(() => {
        loaded = true;
      });
    };
    if (!loaded) window.addEventListener("load", onLoad, { once: true });
    const failsafe = window.setTimeout(() => {
      loaded = true;
    }, MAX_WAIT_MS);

    // --- rig -------------------------------------------------------------------
    const place = (
      k: PartName,
      x: number,
      y: number,
      deg: number,
      sx = 1,
      sy = 1,
    ) => {
      const [px, py] = PARTS[k].pivot;
      parts[k].style.transform =
        `translate(${x - px}px,${y - py}px) rotate(${deg}deg) scale(${sx},${sy})`;
    };
    // Origin = ground under the hips; +deg turns clockwise. Returns the front hand and head in rig px.
    const pose = (s: Pose) => {
      // Hips drop as the legs splay, so the lower foot stays planted.
      const reach = Math.max(
        Math.cos(s.legFront * D2R),
        Math.cos(s.legBack * D2R),
      );
      const hipY = -(6 + 50 * reach) + s.bob;
      place("legBack", -8, hipY, s.legBack);
      place("legFront", 8, hipY, s.legFront);
      const lean = -s.lean;
      place("body", 0, hipY + 4, lean, s.sqx, s.sqy);
      const [nx, ny] = rotate(0, -64 * s.sqy, lean);
      const head: [number, number] = [nx, hipY + 4 + ny];
      place(
        "head",
        head[0],
        head[1],
        lean * 0.45 + s.headTilt,
        s.headSq,
        2 - s.headSq,
      );
      const arm = (
        armK: PartName,
        handK: PartName,
        ox: number,
        oy: number,
        target: [number, number],
      ) => {
        const [sx, sy] = rotate(ox, oy * s.sqy, lean);
        const sh: [number, number] = [sx, hipY + 4 + sy];
        const ang = Math.atan2(target[1] - sh[1], target[0] - sh[0]);
        place(armK, sh[0], sh[1], (ang - ARM_DIR) / D2R);
        const hand: [number, number] = [
          sh[0] + Math.cos(ang) * ARM_LEN,
          sh[1] + Math.sin(ang) * ARM_LEN,
        ];
        place(handK, hand[0], hand[1], ang / D2R - 90);
        return hand;
      };
      arm("armBack", "handBack", 10, -52, s.grip);
      const hand = arm("armFront", "handFront", 20, -50, [
        s.grip[0] + 6,
        s.grip[1] + 2,
      ]);
      return { hand, head, footX: 8 + Math.sin(-s.legFront * D2R) * 50 };
    };
    let face: (typeof FACES)[number] = "headFocus";
    const setFace = (f: (typeof FACES)[number]) => {
      if (f !== face) parts.head.src = `${GUY}/${(face = f)}.png`;
    };

    // --- effects ---------------------------------------------------------------
    const particles: Particle[] = [];
    const spawn = (
      kind: Particle["kind"],
      x: number,
      y: number,
      vx: number,
      vy: number,
      life: number,
    ) => {
      const el = document.createElement("div");
      el.className =
        kind === "sweat"
          ? "absolute left-0 top-0 h-2.5 w-[7px] rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-sky-300"
          : "absolute left-0 top-0 size-3 rounded-full bg-[#c9c2d6] blur-[1px]";
      fx.appendChild(el);
      particles.push({ el, kind, x, y, vx, vy, age: 0, life });
    };
    const stepParticles = (dt: number) => {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.age += dt;
        if (p.age >= p.life) {
          p.el.remove();
          particles.splice(i, 1);
          continue;
        }
        const k = p.age / p.life;
        if (p.kind === "sweat") {
          p.vy += 900 * dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          const deg = Math.atan2(p.vy, p.vx) / D2R + 90;
          p.el.style.transform = `translate(${p.x}px,${p.y}px) rotate(${deg}deg)`;
          p.el.style.opacity = String(1 - k * k);
        } else {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.el.style.transform = `translate(${p.x}px,${p.y}px) scale(${0.6 + k * 1.8})`;
          p.el.style.opacity = String((1 - k) * 0.9);
        }
      }
    };

    // --- story -------------------------------------------------------------------
    type Phase = "windup" | "strain" | "budge" | "haul";
    let phase: Phase = "windup";
    let phaseT = 0;
    let clock = 0;
    let phi = 0; // stride phase
    let strainMix = 0; // 0 = hauling pose, 1 = straining pose
    let v = 0;
    let stumble = 0;
    let slack = 0;
    let sweatT = 0;
    let dustT = 0;
    let slabX = window.innerWidth - SLAB_W;
    let last = 0;
    let raf = 0;
    let cancelled = false;

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      clock += dt;
      phaseT += dt;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const S = vw < 640 ? 0.62 : 1;
      const slabW = SLAB_W * S;
      const groundY = Math.round(vh * 0.7);
      const start = vw - slabW;
      const revealed = Math.max(0, Math.min(1, (start - slabX) / start));

      let wantStrain = 0;
      let windup = 1;
      if (phase === "windup") {
        windup = easeOut(Math.min(1, phaseT / 0.45));
        setFace(phaseT < 0.25 ? "head" : "headFocus");
        if (phaseT > 0.45) {
          phase = "strain";
          phaseT = 0;
        }
      } else if (phase === "strain") {
        wantStrain = 1;
        phi += dt * 16;
        slabX = start + Math.sin(clock * 55) * 1.2; // it shudders, but holds
        if (phaseT > 0.95) {
          phase = "budge";
          phaseT = 0;
        }
      } else if (phase === "budge") {
        const k = Math.min(1, phaseT / 0.28);
        slabX = start - 0.05 * vw * easeOut(k);
        stumble = Math.sin(Math.min(1, phaseT / 0.5) * Math.PI) * 18;
        slack = Math.sin(Math.min(1, phaseT / 0.35) * Math.PI);
        phi += dt * 9;
        setFace("headShock");
        if (phaseT > 0.55) {
          phase = "haul";
          phaseT = 0;
          stumble = slack = 0;
          setFace("headFocus");
        }
      } else {
        // Haul. Before the page has loaded he can't get past STALL_AT, and grinds to a halt there.
        const room = loaded
          ? 1
          : Math.max(0, Math.min(1, (STALL_AT - revealed) / 0.12));
        const target = (vw / 2.1) * (revealed > 0.98 ? 1.6 : 1) * room;
        v += (target - v) * Math.min(1, dt * (target > v ? 2.4 : 6));
        const moved = v * dt;
        slabX -= moved;
        phi += moved / (34 * S) + (v < 40 ? dt * 15 : 0);
        wantStrain = v < 40 ? 1 : 0;
        if (wantStrain) slabX += Math.sin(clock * 55) * 0.4;
      }
      strainMix += (wantStrain - strainMix) * Math.min(1, dt * 8);
      const sa = strainMix;

      // Pose
      const swing = 6 + 10 * (1 - sa);
      const s: Pose = {
        legFront: (-44 + swing * Math.sin(phi)) * windup + -6 * (1 - windup),
        legBack: (26 - swing * Math.sin(phi)) * windup + 6 * (1 - windup),
        bob: -3 * Math.abs(Math.sin(phi)) * windup,
        lean:
          (30 +
            sa * (10 + Math.sin(clock * 40) * 1.5) +
            (1 - sa) * 2 * Math.sin(2 * phi) -
            stumble * 0.6) *
          windup,
        sqx:
          1 +
          0.04 * sa +
          (phase === "windup" ? 0.06 * Math.sin(windup * Math.PI) : 0),
        sqy:
          1 -
          0.05 * sa +
          (1 - sa) * 0.03 * Math.sin(2 * phi) -
          (phase === "windup" ? 0.08 * Math.sin(windup * Math.PI) : 0),
        headSq: 1 + 0.05 * sa,
        headTilt: sa * Math.sin(clock * 35) * 2,
        grip: [0, 0],
      };
      const charX = slabX - (ROPE_GAP + stumble) * S;
      const ringY = groundY - RING_H * S;
      s.grip = [(slabX - charX) / S, -RING_H];
      rig.style.transform = `translate(${charX}px,${groundY}px) scale(${S})`;
      const out = pose(s);

      // Rope, from fist to ring; it sags only while slack.
      const hx = charX + out.hand[0] * S;
      const hy = groundY + out.hand[1] * S;
      const mx = (hx + slabX) / 2;
      const my = (hy + ringY) / 2 + slack * 40 * S;
      rope.setAttribute("d", `M${hx},${hy} Q${mx},${my} ${slabX},${ringY}`);
      rope.style.strokeWidth = `${5 * S}px`;

      slab.style.transform = `translate3d(${slabX}px,0,0)`;
      ring.style.top = `${ringY - 7 * S}px`;
      curtain.style.clipPath = `inset(0 ${Math.max(0, vw - slabX)}px 0 0)`;
      count.textContent = String(Math.round(revealed * 100));

      // Sweat flies off his head when he's straining; dust kicks up at his heels and the divider's foot.
      sweatT -= dt;
      if (sweatT <= 0 && phase !== "windup") {
        sweatT = sa > 0.5 ? 0.09 : 0.45;
        const hxw = charX + out.head[0] * S;
        const hyw = groundY + (out.head[1] - 80) * S;
        spawn(
          "sweat",
          hxw + (Math.random() * 30 - 10) * S,
          hyw,
          -60 - Math.random() * 120,
          -180 - Math.random() * 140,
          0.7,
        );
      }
      dustT -= dt;
      if (dustT <= 0 && phase !== "windup") {
        dustT = 0.08;
        if (sa > 0.5)
          spawn(
            "dust",
            charX + out.footX * S,
            groundY - 8,
            40 + Math.random() * 40,
            -20 - Math.random() * 30,
            0.5,
          );
        // Scuffs where the divider drags along the ground; short-lived so they don't litter the page.
        if ((v > 60 && Math.random() < 0.4) || phase === "budge")
          spawn(
            "dust",
            slabX + slabW - 6,
            groundY - 10 - Math.random() * 6,
            30 + Math.random() * 40,
            -15 - Math.random() * 25,
            0.32,
          );
      }
      stepParticles(dt);

      if (slabX <= -slabW - 4) {
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {}
        root.style.display = "none";
        cleanup();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    // Don't start the show until he's fully drawn.
    const ready = Promise.all(
      [...FACES, "body", "arm", "hand", "leg"].map((n) => {
        const img = new Image();
        img.src = `${GUY}/${n}.png`;
        return img.decode().catch(() => {});
      }),
    );
    Promise.race([ready, new Promise((r) => setTimeout(r, 2000))]).then(() => {
      if (cancelled) return;
      rig.style.opacity = "1";
      raf = requestAnimationFrame(tick);
    });

    function cleanup() {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
      window.removeEventListener("load", onLoad);
      for (const type of BLOCKED_EVENTS)
        document.removeEventListener(type, block, opts);
      for (const p of particles) p.el.remove();
      particles.length = 0;
    }
    return cleanup;
  }, []);

  return (
    <div
      ref={rootRef}
      id="push-loader"
      // Keep the loader's caption out of search result snippets.
      data-nosnippet
      role="status"
      aria-label="Loading"
      suppressHydrationWarning
      className="pointer-events-none fixed inset-0 z-100 overflow-hidden"
    >
      <InlineScript html={GATE_SCRIPT} />

      {/* The curtain: everything left of the divider. */}
      <div
        ref={curtainRef}
        className="pointer-events-auto absolute inset-0 bg-background"
      >
        <div className="absolute inset-x-0 top-[70svh] h-px bg-foreground/15" />
        <p className="absolute top-[calc(70svh+1.25rem)] left-4 text-xs font-medium tracking-[0.25em] text-muted uppercase sm:left-10 sm:text-sm">
          Hang tight, I&apos;ve got this{" "}
          <span ref={countRef} className="text-foreground tabular-nums">
            0
          </span>
          %
        </p>
      </div>

      <svg aria-hidden className="absolute inset-0 size-full overflow-visible">
        <path
          ref={ropeRef}
          fill="none"
          stroke="#7a4b24"
          strokeLinecap="round"
        />
      </svg>

      {/* The block: the divider itself, with a ring for the rope. */}
      <div
        ref={slabRef}
        aria-hidden
        className="absolute inset-y-0 left-0 w-5.5 bg-[linear-gradient(90deg,#fff8f8_0_14%,var(--foreground)_14%_76%,#d9bcc4_76%)] shadow-[-1px_0_0_rgba(0,0,0,0.4),10px_0_28px_rgba(0,0,0,0.35)] will-change-transform sm:w-8.5"
        style={{ transform: "translate3d(calc(100vw - 100%),0,0)" }}
      >
        <div
          ref={ringRef}
          className="absolute -left-1.25 size-2.25 rounded-full border-2 border-[#3b3f4c] sm:-left-1.75 sm:size-3.25 sm:border-[3px]"
        />
      </div>

      <div
        ref={rigRef}
        aria-hidden
        className="absolute top-0 left-0 size-0 opacity-0 will-change-transform"
      >
        {PART_NAMES.map((k) => (
          // Plain <img>: these are tiny rig pieces positioned by transform every frame, not content images.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={k}
            ref={(el) => {
              if (el) partRefs.current[k] = el;
            }}
            src={`${GUY}/${PARTS[k].src}.png`}
            alt=""
            draggable={false}
            className="absolute top-0 left-0 max-w-none"
            style={{
              transformOrigin: `${PARTS[k].pivot[0]}px ${PARTS[k].pivot[1]}px`,
            }}
          />
        ))}
      </div>

      <div ref={fxRef} aria-hidden className="absolute inset-0" />
    </div>
  );
};

export default PushLoader;
