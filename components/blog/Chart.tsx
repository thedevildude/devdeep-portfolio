import { Fragment, type ReactNode } from "react";
import { type BarRow, CHARTS, type ChartSpec, type Tone } from "@/lib/charts";
import ChartFrame from "./ChartFrame";

/**
 * Charts for blog posts, rendered on the server as HTML and SVG. Colour roles: the accent is the
 * subject, gray is the baseline, and blue / orange are the two validated categorical slots.
 * Every chart carries hover and focus tooltips (see ChartFrame) and a table twin, so no value is
 * reachable only through colour or a tooltip.
 */

const VARS = {
  "--c-accent": "#1030ae",
  "--c-muted": "#8793a6",
  "--c-blue": "#2a78d6",
  "--c-orange": "#eb6834",
  "--c-ink": "#050811",
  "--c-ink2": "#4e5058",
  "--c-tick": "#5f6672",
  "--c-grid": "#e3e6ec",
  "--c-axis": "#c3c9d4",
} as React.CSSProperties;

const COLOR: Record<Tone, string> = {
  accent: "var(--c-accent)",
  muted: "var(--c-muted)",
  blue: "var(--c-blue)",
  orange: "var(--c-orange)",
};

const fmt = (v: number, d = 1) => v.toFixed(d);
const withUnit = (text: string, unit: string) =>
  !unit ? text : unit === "×" ? `${text}×` : `${text} ${unit}`;

const NICE = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
const niceUp = (v: number) => {
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  return (NICE.find((s) => s >= n - 1e-9) ?? 10) * p;
};
const niceStep = (raw: number) => {
  const p = 10 ** Math.floor(Math.log10(raw));
  const n = raw / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
};
const ticksTo = (max: number, count = 4) => {
  const step = niceStep(max / count);
  const top = Math.ceil(max / step - 1e-9) * step;
  return Array.from({ length: Math.round(top / step) + 1 }, (_, i) => +(i * step).toFixed(6));
};

type TipRow = { name?: string; value: string; tone?: Tone };
const tip = (title: string, rows: TipRow[]) => ({
  "data-tip": JSON.stringify({ title, rows }),
  tabIndex: 0,
  "aria-label": `${title}: ${rows.map((r) => `${r.name ? `${r.name} ` : ""}${r.value}`).join(", ")}`,
});

const rangeText = (r: BarRow, d: number) => {
  if (r.lo === undefined || r.hi === undefined) return fmt(r.value, d);
  const whole = Number.isInteger(r.lo) && Number.isInteger(r.hi);
  return `${fmt(r.lo, whole ? 0 : d)}–${fmt(r.hi, whole ? 0 : d)}`;
};

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

const Legend = ({ items, line }: { items: { name: string; tone: Tone }[]; line?: boolean }) => (
  <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-sm" style={{ color: "var(--c-ink2)" }}>
    {items.map((it) => (
      <li key={it.name} className="flex items-center gap-2">
        <span
          aria-hidden
          className={line ? "h-0.5 w-4 rounded-full" : "size-2.5 rounded-sm"}
          style={{ background: COLOR[it.tone] }}
        />
        {it.name}
      </li>
    ))}
  </ul>
);

const TableTwin = ({ head, rows }: { head: string[]; rows: string[][] }) => (
  <details className="mt-5 text-sm">
    <summary
      className="w-fit cursor-pointer font-medium select-none"
      style={{ color: "var(--c-accent)" }}
    >
      View as table
    </summary>
    <div className="mt-3 overflow-x-auto" style={{ contain: "inline-size" }}>
      <table className="w-full border-collapse text-left tabular-nums" style={{ color: "var(--c-ink)" }}>
        <thead>
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="border-b py-1.5 pr-4 font-medium"
                style={{ borderColor: "var(--c-axis)", color: "var(--c-ink2)" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="border-b py-1.5 pr-4" style={{ borderColor: "var(--c-grid)" }}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </details>
);

const Figure = ({
  spec,
  legend,
  table,
  children,
}: {
  spec: ChartSpec;
  legend?: ReactNode;
  table: ReactNode;
  children: ReactNode;
}) => (
  <figure
    className="my-8 rounded-3xl border bg-white p-5 font-sans tracking-normal sm:p-7"
    style={{ ...VARS, borderColor: "var(--c-grid)" }}
  >
    <figcaption className="mb-4 text-lg leading-snug font-semibold" style={{ color: "var(--c-ink)" }}>
      {spec.title}
    </figcaption>
    {legend}
    <ChartFrame>{children}</ChartFrame>
    <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--c-ink2)" }}>
      {spec.caption}
    </p>
    {table}
  </figure>
);

// ---------------------------------------------------------------------------
// Horizontal bars (HTML, so labels stay readable on a phone)
// ---------------------------------------------------------------------------

const Bars = ({
  rows,
  unit,
  decimals = 1,
  reference,
  labelAbove,
}: {
  rows: BarRow[];
  unit: string;
  decimals?: number;
  reference?: { value: number; label: string };
  labelAbove?: boolean;
}) => {
  const top = Math.max(...rows.map((r) => r.hi ?? r.value), reference?.value ?? 0);
  const axis = niceUp(top * (labelAbove ? 1.5 : 1.25));
  const pct = (v: number) => (v / axis) * 100;

  const track = (r: BarRow) => {
    const text = withUnit(rangeText(r, decimals), unit);
    return (
      <div
        className="relative h-8 rounded-md outline-none hover:bg-black/[0.03] focus-visible:bg-black/[0.05]"
        {...tip(r.label, [{ value: text, tone: r.tone ?? "accent" }])}
      >
        <div className="absolute inset-y-0 left-0 w-px" style={{ background: "var(--c-axis)" }} />
        {r.lo !== undefined && r.hi !== undefined ? (
          <>
            <div
              className="absolute top-1/2 h-5 -translate-y-1/2"
              style={{ width: `${pct(r.lo)}%`, background: COLOR[r.tone ?? "accent"] }}
            />
            <div
              aria-hidden
              className="absolute top-1/2 h-5 -translate-y-1/2 rounded-r-[4px]"
              style={{
                left: `${pct(r.lo)}%`,
                width: `${pct(r.hi) - pct(r.lo)}%`,
                background: COLOR[r.tone ?? "accent"],
                opacity: 0.38,
              }}
            />
          </>
        ) : (
          <div
            className="absolute top-1/2 h-5 -translate-y-1/2 rounded-r-[4px]"
            style={{ width: `${pct(r.value)}%`, background: COLOR[r.tone ?? "accent"] }}
          />
        )}
        <span
          className="absolute top-1/2 -translate-y-1/2 text-[15px] font-semibold whitespace-nowrap"
          style={{ left: `calc(${pct(r.hi ?? r.value)}% + 10px)`, color: "var(--c-ink)" }}
        >
          {text}
        </span>
      </div>
    );
  };

  if (labelAbove) {
    return (
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="mb-1 text-sm" style={{ color: "var(--c-ink2)" }}>
              {r.label}
            </div>
            {track(r)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${reference ? "pt-6" : ""}`}>
      <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-x-3 gap-y-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
        {rows.map((r) => (
          <Fragment key={r.label}>
            <div className="text-[15px] leading-snug" style={{ color: "var(--c-ink2)" }}>
              {r.label}
            </div>
            {track(r)}
          </Fragment>
        ))}
      </div>
      {reference && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 left-[8.25rem] sm:left-[12.75rem]"
        >
          <div className="absolute inset-y-0" style={{ left: `${pct(reference.value)}%` }}>
            <span
              className="absolute top-0 -translate-x-1/2 text-xs whitespace-nowrap"
              style={{ color: "var(--c-ink2)" }}
            >
              {reference.label}
            </span>
            <div className="absolute top-5 bottom-0 w-px" style={{ background: "var(--c-ink2)", opacity: 0.5 }} />
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Stacked bar (HTML)
// ---------------------------------------------------------------------------

const STACK_TONES: Tone[] = ["blue", "orange"];

const Stack = ({ spec }: { spec: Extract<ChartSpec, { kind: "stack" }> }) => {
  const d = spec.decimals ?? 1;
  const pct = (v: number) => (v / spec.max) * 100;
  return (
    <div className="relative pt-6">
      <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] items-center gap-x-3 gap-y-4 sm:grid-cols-[12rem_minmax(0,1fr)]">
        {spec.rows.map((row) => {
          const total = row.parts.reduce((s, p) => s + p.value, 0);
          return (
            <Fragment key={row.label}>
              <div className="text-[15px] leading-snug" style={{ color: "var(--c-ink2)" }}>
                {row.label}
              </div>
              <div className="relative h-9">
                <div className="absolute inset-0 flex gap-0.5">
                  {row.parts.map((p, i) => {
                    const tone = STACK_TONES[i];
                    const text = withUnit(fmt(p.value, d), spec.unit);
                    return (
                      <div
                        key={p.name}
                        className="flex items-center justify-center text-sm font-semibold text-white outline-none last:rounded-r-[4px] hover:brightness-110 focus-visible:brightness-110"
                        style={{ width: `${pct(p.value)}%`, background: COLOR[tone] }}
                        {...tip(row.label, [{ name: p.name, value: text, tone }])}
                      >
                        {pct(p.value) >= 24 ? text : null}
                      </div>
                    );
                  })}
                </div>
                <span
                  className="absolute top-1/2 -translate-y-1/2 text-[15px] font-semibold whitespace-nowrap"
                  style={{ left: `calc(${pct(total)}% + 10px)`, color: "var(--c-ink)" }}
                >
                  {withUnit(fmt(total, d), spec.unit)}
                </span>
              </div>
            </Fragment>
          );
        })}
      </div>
      {spec.limit && (
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 left-[8.25rem] sm:left-[12.75rem]">
          <div className="absolute inset-y-0" style={{ left: `${pct(spec.limit.value)}%` }}>
            <span
              className="absolute top-0 -translate-x-full pr-1.5 text-xs whitespace-nowrap"
              style={{ color: "var(--c-ink2)" }}
            >
              {spec.limit.label}
            </span>
            <div className="absolute top-5 bottom-0 w-px" style={{ background: "var(--c-ink)" }} />
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// SVG charts. Laid out twice, once for a phone and once for wider screens, so text stays at a
// readable size on both instead of shrinking with the viewBox.
// ---------------------------------------------------------------------------

type Size = { W: number; H: number };

const Svg = ({ alt, W, H, children }: { alt: string } & Size & { children: ReactNode }) => (
  <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={alt} className="block h-auto w-full font-sans">
    {children}
  </svg>
);

const Responsive = ({ render }: { render: (size: Size) => ReactNode }) => (
  <>
    <div className="hidden sm:block">{render({ W: 560, H: 300 })}</div>
    <div className="sm:hidden">{render({ W: 340, H: 290 })}</div>
  </>
);

const topRound = (x: number, y: number, w: number, h: number, r = 4) => {
  const rr = Math.min(r, h, w / 2);
  return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`;
};

const Columns = ({ spec, W, H }: { spec: Extract<ChartSpec, { kind: "columns" }> } & Size) => {
  const d = spec.decimals ?? 1;
  const multi = spec.categories.some((c) => c.includes("\n"));
  const m = { l: W < 400 ? 42 : 52, r: 10, t: 28, b: multi ? 60 : 40 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;
  const maxV = Math.max(...spec.series.flatMap((s) => s.values));
  const ticks = ticksTo(maxV, 4);
  const yMax = ticks[ticks.length - 1];
  const y = (v: number) => m.t + ih - (v / yMax) * ih;
  const n = spec.categories.length;
  const k = spec.series.length;
  const slot = iw / n;
  const bw = Math.min(24, (slot * 0.64 - (k - 1) * 2) / k);
  const cluster = k * bw + (k - 1) * 2;

  return (
    <Svg alt={spec.alt} W={W} H={H}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={m.l} x2={W - m.r} y1={y(t)} y2={y(t)} stroke={t === 0 ? "var(--c-axis)" : "var(--c-grid)"} strokeWidth={1} />
          <text x={m.l - 8} y={y(t) + 4} textAnchor="end" fontSize={12} fill="var(--c-tick)" className="tabular-nums">
            {t}
          </text>
        </g>
      ))}
      <text x={m.l} y={14} fontSize={12} fill="var(--c-tick)">
        {spec.yLabel}
      </text>
      {spec.categories.map((cat, i) => {
        const x0 = m.l + slot * i + (slot - cluster) / 2;
        const label = cat.split("\n");
        const rows: TipRow[] = spec.series.map((s) => ({ name: s.name, value: withUnit(fmt(s.values[i], d), spec.unit), tone: s.tones?.[i] ?? s.tone }));
        return (
          <g key={cat}>
            {spec.series.map((s, j) => {
              const v = s.values[i];
              const h = (v / yMax) * ih;
              return <path key={s.name} d={topRound(x0 + j * (bw + 2), y(v), bw, h)} fill={COLOR[s.tones?.[i] ?? s.tone]} />;
            })}
            <text x={m.l + slot * i + slot / 2} y={H - m.b + 20} textAnchor="middle" fontSize={12} fill="var(--c-ink2)">
              {label.map((line, li) => (
                <tspan key={li} x={m.l + slot * i + slot / 2} dy={li === 0 ? 0 : 15}>
                  {line}
                </tspan>
              ))}
            </text>
            <rect
              x={m.l + slot * i}
              y={m.t - 6}
              width={slot}
              height={ih + 6}
              fill="transparent"
              className="outline-none hover:fill-black/[0.04] focus-visible:fill-black/[0.06]"
              role="img"
              {...tip(cat.replace("\n", " "), rows)}
            />
          </g>
        );
      })}
    </Svg>
  );
};

const Lines = ({ spec, W, H }: { spec: Extract<ChartSpec, { kind: "lines" }> } & Size) => {
  const d = spec.decimals ?? 1;
  const m = { l: W < 400 ? 46 : 56, r: 14, t: 30, b: 50 };
  const iw = W - m.l - m.r;
  const ih = H - m.t - m.b;
  const xMin = Math.min(...spec.xs);
  const xMax = Math.max(...spec.xs);
  const vals = spec.series.flatMap((s) => s.values.filter((v): v is number => v !== null));
  const yTicks = spec.yTicks ?? ticksTo(Math.max(...vals), 4);
  const yMin = yTicks[0];
  const yMax = yTicks[yTicks.length - 1];
  const X = (v: number) => m.l + 10 + ((v - xMin) / (xMax - xMin)) * (iw - 20);
  const Y = (v: number) => m.t + ih - ((v - yMin) / (yMax - yMin)) * ih;
  const xTicks = spec.xTicks ?? spec.xs;
  const markEvery = spec.xs.length <= 12;

  const path = (values: (number | null)[]) => {
    let out = "";
    let pen = false;
    values.forEach((v, i) => {
      if (v === null) {
        pen = false;
        return;
      }
      out += `${pen ? "L" : "M"}${X(spec.xs[i]).toFixed(1)},${Y(v).toFixed(1)}`;
      pen = true;
    });
    return out;
  };

  return (
    <Svg alt={spec.alt} W={W} H={H}>
      {yTicks.map((t) => (
        <g key={t}>
          <line x1={m.l} x2={W - m.r} y1={Y(t)} y2={Y(t)} stroke={t === 0 || t === yMin ? "var(--c-axis)" : "var(--c-grid)"} strokeWidth={1} />
          <text x={m.l - 8} y={Y(t) + 4} textAnchor="end" fontSize={12} fill="var(--c-tick)" className="tabular-nums">
            {t}
          </text>
        </g>
      ))}
      <text x={m.l} y={14} fontSize={12} fill="var(--c-tick)">
        {spec.yLabel}
      </text>
      {xTicks.map((t) => (
        <text key={t} x={X(t)} y={H - m.b + 20} textAnchor="middle" fontSize={12} fill="var(--c-tick)" className="tabular-nums">
          {t}
        </text>
      ))}
      <text x={m.l + iw / 2} y={H - 8} textAnchor="middle" fontSize={12} fill="var(--c-ink2)">
        {spec.xLabel}
      </text>
      {spec.vline && (
        <g>
          <line x1={X(spec.vline.x)} x2={X(spec.vline.x)} y1={m.t - 4} y2={m.t + ih} stroke="var(--c-ink2)" strokeOpacity={0.55} strokeWidth={1} />
          <text x={X(spec.vline.x) + 6} y={m.t + ih - 8} fontSize={12} fill="var(--c-ink2)">
            {spec.vline.label}
          </text>
        </g>
      )}
      {spec.series.map((s) => {
        const last = (() => {
          for (let i = s.values.length - 1; i >= 0; i--) if (s.values[i] !== null) return i;
          return -1;
        })();
        return (
          <g key={s.name}>
            <path d={path(s.values)} fill="none" stroke={COLOR[s.tone]} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            {s.values.map((v, i) =>
              v !== null && (markEvery || i === last) ? (
                <circle key={i} cx={X(spec.xs[i])} cy={Y(v)} r={4.5} fill={COLOR[s.tone]} stroke="#fff" strokeWidth={2} />
              ) : null,
            )}
          </g>
        );
      })}
      {spec.xs.map((x, i) => {
        const x0 = i === 0 ? m.l : (X(spec.xs[i - 1]) + X(x)) / 2;
        const x1 = i === spec.xs.length - 1 ? W - m.r : (X(x) + X(spec.xs[i + 1])) / 2;
        const rows: TipRow[] = spec.series
          .filter((s) => s.values[i] !== null)
          .map((s) => ({ name: s.name, value: withUnit(fmt(s.values[i] as number, d), spec.unit), tone: s.tone }));
        return (
          <g key={x} className="group">
            <line
              x1={X(x)}
              x2={X(x)}
              y1={m.t}
              y2={m.t + ih}
              stroke="var(--c-ink2)"
              strokeOpacity={0.35}
              className="opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
            />
            <rect x={x0} y={m.t} width={x1 - x0} height={ih} fill="transparent" className="outline-none" role="img" {...tip(`${spec.xLabel} ${x}`, rows)} />
          </g>
        );
      })}
    </Svg>
  );
};

// ---------------------------------------------------------------------------

const Chart = ({ id }: { id: string }) => {
  const spec = CHARTS[id];
  if (!spec) throw new Error(`Unknown chart "${id}" — add it to lib/charts.ts`);

  switch (spec.kind) {
    case "bars": {
      const d = spec.decimals ?? 1;
      return (
        <Figure
          spec={spec}
          table={
            <TableTwin
              head={["Item", `Value (${spec.unit})`, "Range"]}
              rows={spec.rows.map((r) => [
                r.label,
                fmt(r.value, d),
                r.lo !== undefined && r.hi !== undefined ? `${fmt(r.lo, d)} to ${fmt(r.hi, d)}` : "—",
              ])}
            />
          }
        >
          <Bars rows={spec.rows} unit={spec.unit} decimals={d} reference={spec.ref} />
        </Figure>
      );
    }
    case "multiples":
      return (
        <Figure
          spec={spec}
          table={
            <TableTwin
              head={["Measure", "Item", "Value"]}
              rows={spec.panels.flatMap((p) =>
                p.rows.map((r) => [p.title, r.label, withUnit(rangeText(r, p.decimals ?? 1), p.unit)]),
              )}
            />
          }
        >
          <div className="grid gap-7 sm:grid-cols-3">
            {spec.panels.map((p) => (
              <div key={p.title}>
                <div className="mb-3 text-[15px] font-semibold" style={{ color: "var(--c-ink)" }}>
                  {p.title}
                </div>
                <Bars rows={p.rows} unit={p.unit} decimals={p.decimals ?? 1} labelAbove />
              </div>
            ))}
          </div>
        </Figure>
      );
    case "columns": {
      const d = spec.decimals ?? 1;
      return (
        <Figure
          spec={spec}
          legend={spec.series.length > 1 ? <Legend items={spec.series} /> : undefined}
          table={
            <TableTwin
              head={["", ...spec.series.map((s) => `${s.name} (${spec.unit})`)]}
              rows={spec.categories.map((c, i) => [c.replace("\n", " "), ...spec.series.map((s) => fmt(s.values[i], d))])}
            />
          }
        >
          <Responsive render={(size) => <Columns spec={spec} {...size} />} />
        </Figure>
      );
    }
    case "lines": {
      const d = spec.decimals ?? 1;
      return (
        <Figure
          spec={spec}
          legend={<Legend items={spec.series} line />}
          table={
            <TableTwin
              head={[spec.xLabel, ...spec.series.map((s) => s.name)]}
              rows={spec.xs.map((x, i) => [String(x), ...spec.series.map((s) => (s.values[i] === null ? "—" : fmt(s.values[i] as number, d)))])}
            />
          }
        >
          <Responsive render={(size) => <Lines spec={spec} {...size} />} />
        </Figure>
      );
    }
    case "stack": {
      const d = spec.decimals ?? 1;
      const names = spec.rows[0].parts.map((p) => p.name);
      return (
        <Figure
          spec={spec}
          legend={<Legend items={names.map((name, i) => ({ name, tone: STACK_TONES[i] }))} />}
          table={
            <TableTwin
              head={["Build", ...names.map((n) => `${n} (${spec.unit})`), `Total (${spec.unit})`]}
              rows={spec.rows.map((r) => [
                r.label,
                ...r.parts.map((p) => fmt(p.value, d)),
                fmt(r.parts.reduce((s, p) => s + p.value, 0), d),
              ])}
            />
          }
        >
          <Stack spec={spec} />
        </Figure>
      );
    }
  }
};

export default Chart;
