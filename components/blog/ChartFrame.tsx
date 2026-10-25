"use client";

import { type FocusEvent, type PointerEvent, type ReactNode, useRef, useState } from "react";

type Tip = {
  x: number;
  y: number;
  title: string;
  rows: { name?: string; value: string; tone?: string }[];
};

const KEY: Record<string, string> = {
  accent: "#1030ae",
  muted: "#8793a6",
  blue: "#2a78d6",
  orange: "#eb6834",
};

/**
 * Wraps a chart and shows one tooltip for whichever mark (`data-tip`) is hovered or focused.
 * The marks and their values are rendered on the server; this only adds the readout, so a chart
 * with no JavaScript still shows every number through its labels and its table.
 */
const ChartFrame = ({ children }: { children: ReactNode }) => {
  const frame = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<Tip | null>(null);

  const show = (el: Element, clientX: number, clientY: number) => {
    const box = frame.current?.getBoundingClientRect();
    const raw = el.getAttribute("data-tip");
    if (!box || !raw) return setTip(null);
    try {
      const data = JSON.parse(raw) as Omit<Tip, "x" | "y">;
      setTip({
        ...data,
        x: Math.min(Math.max(clientX - box.left, 90), box.width - 90),
        y: clientY - box.top,
      });
    } catch {
      setTip(null);
    }
  };

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = (e.target as Element).closest("[data-tip]");
    if (el) show(el, e.clientX, e.clientY);
    else setTip(null);
  };

  const onFocus = (e: FocusEvent<HTMLDivElement>) => {
    const el = (e.target as Element).closest("[data-tip]");
    if (!el) return;
    const r = el.getBoundingClientRect();
    show(el, r.left + r.width / 2, r.top);
  };

  return (
    <div
      ref={frame}
      className="relative"
      onPointerMove={onMove}
      onPointerDown={onMove}
      onPointerLeave={() => setTip(null)}
      onFocus={onFocus}
      onBlur={() => setTip(null)}
    >
      {children}
      {tip && (
        <div
          role="status"
          className="pointer-events-none absolute z-20 w-max max-w-[16rem] -translate-x-1/2 -translate-y-full rounded-xl bg-white px-3 py-2 text-sm shadow-lg ring-1 ring-black/10"
          style={{ left: tip.x, top: tip.y - 10 }}
        >
          <div className="text-[13px] leading-tight text-[#4e5058]">{tip.title}</div>
          <ul className="mt-1 space-y-0.5">
            {tip.rows.map((r, i) => (
              <li key={i} className="flex items-center gap-2 leading-snug">
                {r.tone && (
                  <span
                    aria-hidden
                    className="h-0.5 w-3 shrink-0 rounded-full"
                    style={{ background: KEY[r.tone] }}
                  />
                )}
                <span className="font-semibold text-[#050811]">{r.value}</span>
                {r.name && <span className="text-[#4e5058]">{r.name}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChartFrame;
