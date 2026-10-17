"use client";

import { useLayoutEffect, useRef } from "react";
import { preload } from "react-dom";

/*
 * Homepage loader: a figure jogs right → left hauling a cardboard box on a rope,
 * and the site is uncovered in the box's wake.
 *
 * Character + Jog_Fwd_Loop from Quaternius' "Universal Animation Library" (CC0),
 * rendered to a sprite sheet with three.js; see public/loader/CREDITS.txt.
 */
const SHEET_SRC = "/loader/hauler.webp";

// Sheet geometry. Frames are rendered at 2× — sizes below are CSS px at scale 1.
const COLS = 6;
const FRAMES = 24;
const FRAME_W = 345;
const FRAME_H = 201;
// Right edge of the box and the ground line inside a frame.
const BOX_RIGHT = 302;
const GROUND_Y = 199;
// Distance the planted foot travels per frame, so legs keep pace with the ground instead of skating.
const STRIDE_PER_FRAME = 22.35;

// Fraction of the run the hauler may cover before the page has finished loading.
const WAIT_CAP = 0.7;
const RUN_SECONDS = 2.8;
const MAX_WAIT_MS = 6000;
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

const SCROLL_KEYS = new Set([" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"]);
const BLOCKED_EVENTS = ["wheel", "touchmove", "keydown"] as const;

const PushLoader = () => {
  preload(SHEET_SRC, { as: "image", fetchPriority: "high" });

  const rootRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const edgeRef = useRef<HTMLDivElement>(null);
  const haulerRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current!;
    // Only play on a hard load of this page; client-side navigations land here without the gate having run.
    // Hidden directly rather than via state, so the hydrated tree still matches the server HTML.
    if (window.__dgPushLoader !== "play" || hasPlayed()) {
      root.style.display = "none";
      return;
    }

    const curtain = curtainRef.current!;
    const edge = edgeRef.current!;
    const hauler = haulerRef.current!;
    const count = countRef.current!;

    // Hold the page still while the curtain is up (Lenis listens on window, so stop events on the way down).
    const block = (e: Event) => {
      if (e instanceof KeyboardEvent && !SCROLL_KEYS.has(e.key)) return;
      e.preventDefault();
      e.stopPropagation();
    };
    const opts = { capture: true, passive: false } as const;
    for (const type of BLOCKED_EVENTS) document.addEventListener(type, block, opts);

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

    let p = 0;
    let elapsed = 0;
    let frameClock = 0;
    let lastX: number | null = null;
    let last = 0;
    let raf = 0;
    let cancelled = false;
    let revealedAll = false;

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      elapsed += dt;

      // Ease in from a standstill, and slow to a strain as we near the cap while still loading.
      const cap = loaded ? 1 : WAIT_CAP;
      const startUp = Math.min(1, elapsed / 0.5);
      const brake = loaded ? 1 : Math.min(1, Math.max(0, (cap - p) / 0.18));
      const effort = startUp * startUp * Math.max(brake, 0.04);
      // Once the page is fully uncovered, hurry the exit instead of making people wait for it.
      const exitBoost = revealedAll ? 2.2 : 1;
      p = Math.min(cap, p + ((effort * exitBoost) / RUN_SECONDS) * dt);

      const scale = hauler.offsetWidth / FRAME_W;
      const vw = window.innerWidth;
      const boxRight = BOX_RIGHT * scale;
      // Enter with the box's back edge on the right edge of the screen; finish once the box has left on the left.
      const startX = vw - boxRight;
      const endX = -boxRight - 8;
      const x = startX + p * (endX - startX);
      const edgeX = x + boxRight;

      hauler.style.transform = `translate3d(${x}px,0,0)`;
      curtain.style.clipPath = `inset(0 ${Math.max(0, vw - edgeX)}px 0 0)`;
      edge.style.transform = `translate3d(${edgeX}px,0,0)`;
      revealedAll = edgeX <= 0;
      edge.style.opacity = revealedAll ? "0" : "1";
      count.textContent = String(Math.round(Math.max(0, Math.min(1, 1 - edgeX / vw)) * 100));

      // Step the legs by ground covered so feet plant; while straining in place, keep them churning slowly.
      const moved = lastX === null ? 0 : Math.abs(lastX - x);
      lastX = x;
      frameClock += moved / (STRIDE_PER_FRAME * scale) + (moved < 0.2 ? dt * 6 : 0);
      const frame = Math.floor(frameClock) % FRAMES;
      hauler.style.backgroundPosition = `${-(frame % COLS) * FRAME_W * scale}px ${-Math.floor(frame / COLS) * FRAME_H * scale}px`;

      if (p >= 1) {
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {}
        root.style.display = "none";
        cleanup();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    // Don't start hauling until the figure can actually be seen.
    const img = new Image();
    img.src = SHEET_SRC;
    Promise.race([img.decode().catch(() => {}), new Promise((r) => setTimeout(r, 2000))]).then(() => {
      if (!cancelled) raf = requestAnimationFrame(tick);
    });

    function cleanup() {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
      window.removeEventListener("load", onLoad);
      for (const type of BLOCKED_EVENTS) document.removeEventListener(type, block, opts);
    }
    return cleanup;
  }, []);

  return (
    <div
      ref={rootRef}
      id="push-loader"
      role="status"
      aria-label="Loading"
      suppressHydrationWarning
      className="pointer-events-none fixed inset-0 z-[100] [--s:0.72] sm:[--s:1] lg:[--s:1.25]"
    >
      <InlineScript html={GATE_SCRIPT} />

      {/* The curtain: cut back from the right as the box passes. */}
      <div
        ref={curtainRef}
        className="pointer-events-auto absolute inset-0 bg-background"
        style={{ clipPath: "inset(0 0 0 0)" }}
      >
        <div className="absolute inset-x-0 h-px bg-foreground/15" style={{ top: "68svh" }} />
        <p
          className="absolute left-4 text-xs font-medium tracking-[0.25em] text-muted uppercase sm:left-10 sm:text-sm"
          style={{ top: "calc(68svh + 1.25rem)" }}
        >
          Unpacking the portfolio{" "}
          <span ref={countRef} className="text-foreground tabular-nums">
            0
          </span>
          %
        </p>
      </div>

      {/* Seam where the curtain has been dragged back to. */}
      <div
        ref={edgeRef}
        className="absolute inset-y-0 left-0 w-px bg-accent opacity-0 shadow-[0_0_24px_2px_var(--accent)]"
      />

      <div
        ref={haulerRef}
        aria-hidden
        className="absolute left-0 will-change-transform"
        style={{
          top: `calc(68svh - var(--s) * ${GROUND_Y}px)`,
          width: `calc(var(--s) * ${FRAME_W}px)`,
          height: `calc(var(--s) * ${FRAME_H}px)`,
          // Parked off the right edge until the first frame places it.
          transform: "translate3d(100vw,0,0)",
          backgroundImage: `url(${SHEET_SRC})`,
          backgroundSize: `calc(var(--s) * ${FRAME_W * COLS}px) calc(var(--s) * ${FRAME_H * (FRAMES / COLS)}px)`,
          backgroundRepeat: "no-repeat",
        }}
      />
    </div>
  );
};

export default PushLoader;
