/**
 * Charts for blog posts. A post places one with `{{chart:<id>}}` on its own line (see
 * components/ui/Markdown.tsx); the data lives here so every number is in one reviewable place.
 *
 * Colour roles: `accent` is the post's subject (the new thing), `muted` is the baseline it is
 * compared with, and `blue` / `orange` are the two validated categorical slots for charts whose
 * parts are different things rather than before and after.
 */

export type Tone = "accent" | "muted" | "blue" | "orange";

export type BarRow = {
  label: string;
  value: number;
  /** Measured range; drawn as a whisker and shown in the tooltip and table. */
  lo?: number;
  hi?: number;
  tone?: Tone;
};

type Base = {
  title: string;
  caption: string;
  /** Screen-reader summary of what the chart shows. */
  alt: string;
};

export type ChartSpec =
  | (Base & {
      kind: "bars";
      unit: string;
      decimals?: number;
      rows: BarRow[];
      /** A reference line, e.g. "same speed as the baseline". */
      ref?: { value: number; label: string };
    })
  | (Base & {
      kind: "multiples";
      panels: { title: string; unit: string; decimals?: number; rows: BarRow[] }[];
    })
  | (Base & {
      kind: "columns";
      unit: string;
      yLabel: string;
      decimals?: number;
      categories: string[];
      series: { name: string; tone: Tone; values: number[]; tones?: Tone[] }[];
    })
  | (Base & {
      kind: "lines";
      unit: string;
      yLabel: string;
      xLabel: string;
      decimals?: number;
      xs: number[];
      xTicks?: number[];
      yTicks?: number[];
      series: { name: string; tone: Tone; values: (number | null)[] }[];
      vline?: { x: number; label: string };
    })
  | (Base & {
      kind: "stack";
      unit: string;
      decimals?: number;
      max: number;
      rows: { label: string; parts: { name: string; value: number }[] }[];
      limit?: { value: number; label: string };
    });

export const CHARTS: Record<string, ChartSpec> = {
  "mlx-step-time": {
    kind: "bars",
    title: "Seconds per 1024px step",
    caption:
      "Qwen-Image 2.1 Turbo on an M5 MacBook Air, cool machine. A lighter band shows the measured range. Int8 is opt-in; over a whole image it was worth 12 to 20 percent.",
    alt: "Horizontal bars of seconds per step: PyTorch GGUF 15.4, MLX port 9.4, with fused kernels 8.3 to 8.5, with int8 matmuls 5.7 to 6.0.",
    unit: "s",
    rows: [
      { label: "GGUF on PyTorch (MPS)", value: 15.4, tone: "muted" },
      { label: "MLX port, 4-bit", value: 9.4 },
      { label: "+ fused kernels", value: 8.4, lo: 8.3, hi: 8.5 },
      { label: "+ int8 matmuls", value: 5.85, lo: 5.7, hi: 6.0 },
    ],
  },
  "mlx-reference-edit": {
    kind: "bars",
    title: "Seconds per step with two reference images",
    caption:
      "The attention cache held every layer's full keys and values. Copying the slice and evaluating each layer as it finished removed the swap.",
    alt: "Before the cache fix a step took 35 to 58 seconds; after, 10.8 seconds.",
    unit: "s",
    rows: [
      { label: "Before the cache fix", value: 46.5, lo: 35, hi: 58, tone: "muted" },
      { label: "After", value: 10.8 },
    ],
  },
  "int8-kernel-speed": {
    kind: "bars",
    title: "Speed of the int8 matmul, relative to the 4-bit matmul",
    caption:
      "Higher is faster; 1× is the quantized matmul MLX already ships. The first kernel applied each group's scale inside the loop, which stalled the matrix units.",
    alt: "The first int8 kernel ran at about 0.2 to 0.25 times the speed of the 4-bit matmul. After splitting out a weight conversion kernel it ran 1.38 to 1.66 times faster.",
    unit: "×",
    decimals: 2,
    ref: { value: 1, label: "Same as 4-bit" },
    rows: [
      { label: "First kernel: per-group scales in the loop", value: 0.225, lo: 0.2, hi: 0.25, tone: "muted" },
      { label: "Weight conversion, then a pure int8 GEMM", value: 1.52, lo: 1.38, hi: 1.66 },
    ],
  },
  "int8-block-rounds": {
    kind: "columns",
    title: "Four transformer blocks, seconds per pass",
    caption:
      "Krea 2 on the M5 Air, alternating the two paths each round with a pause between. The ratio held between 1.43 and 1.57 in every round.",
    alt: "Four rounds of timings. The 4-bit path took 2.3 to 2.6 seconds each round; the int8 path took 1.6 to 1.7.",
    unit: "s",
    yLabel: "seconds",
    decimals: 2,
    categories: ["Round 1", "Round 2", "Round 3", "Round 4"],
    series: [
      { name: "4-bit matmuls", tone: "muted", values: [2.564, 2.291, 2.523, 2.344] },
      { name: "Int8 matmuls", tone: "accent", values: [1.638, 1.597, 1.676, 1.632] },
    ],
  },
  "moss-int8-images": {
    kind: "columns",
    title: "Seconds per image, four prompts",
    caption:
      "MOSS-Image Turbo, a whole image each, before and after turning int8 on. The average fell about 18 percent. Later images ran slower in both series, so the pairs are not like for like.",
    alt: "Four prompts timed before and after int8: 115.7 to 97.8, 130.3 to 118.6, 139.8 to 115.3, and 160.1 to 118.4 seconds.",
    unit: "s",
    yLabel: "seconds",
    decimals: 1,
    categories: ["Prompt 1", "Prompt 2", "Prompt 3", "Prompt 4"],
    series: [
      { name: "Before int8", tone: "muted", values: [115.7, 130.3, 139.8, 160.1] },
      { name: "With int8", tone: "accent", values: [97.8, 118.6, 115.3, 118.4] },
    ],
  },
  "krea-memory": {
    kind: "stack",
    title: "Memory needed to run Krea 2, in GB",
    caption:
      "Budgets from component sizes. The MLX transformer's 7.21 GB was measured with every array evaluated; the other figures are estimates, and real peaks move with the OS and what else is open.",
    alt: "The GGUF build needs 7.5 GB of transformer plus 8.3 GB of text encoder and VAE, 15.8 GB in total. The MLX build needs 7.21 GB plus 3.4 GB, about 10.6 GB. The machine has 16 GB.",
    unit: "GB",
    max: 18,
    limit: { value: 16, label: "16 GB machine" },
    rows: [
      {
        label: "GGUF Q4_K_M with the PyTorch text encoder",
        parts: [
          { name: "Transformer", value: 7.5 },
          { name: "Text encoder and VAE", value: 8.3 },
        ],
      },
      {
        label: "MLX 4-bit with the MLX text encoder",
        parts: [
          { name: "Transformer", value: 7.21 },
          { name: "Text encoder and VAE", value: 3.4 },
        ],
      },
    ],
  },
  "krea-encoder-fidelity": {
    kind: "lines",
    title: "How close the 4-bit text encoder is to bf16",
    caption:
      "Cosine similarity of each of the twelve tapped layers against Krea's own bf16 PyTorch encoder, one prompt. The vertical axis starts at 0.98. The bf16 weights in my MLX code were measured at three taps, which isolates 4-bit rounding from porting bugs.",
    alt: "The 4-bit MLX encoder scores 0.988 to 0.994 across twelve layers. The same MLX code with bf16 weights scores 0.9999 or better at the three layers measured.",
    unit: "",
    yLabel: "cosine similarity",
    xLabel: "Tapped layer",
    decimals: 4,
    xs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    yTicks: [0.98, 0.985, 0.99, 0.995, 1],
    series: [
      {
        name: "4-bit MLX encoder",
        tone: "accent",
        values: [0.9944, 0.9917, 0.9903, 0.9901, 0.9906, 0.9919, 0.9926, 0.9925, 0.9925, 0.9917, 0.9917, 0.9877],
      },
      {
        name: "bf16 weights, same MLX code",
        tone: "muted",
        values: [0.99999, null, null, null, null, 0.99995, null, null, null, null, null, 0.99994],
      },
    ],
  },
  "vae-conv-compare": {
    kind: "multiples",
    title: "Decoding one 1024px image, Conv3d against Conv2d",
    caption:
      "Qwen-Image VAE on PyTorch MPS, 512px tiles, M5 MacBook Air. Peak is memory above the baseline before the decode; held is what the driver still had allocated after it finished. The Conv2d peak was measured twice (2.24 and 2.38 GB).",
    alt: "Conv3d took 6.7 seconds, peaked 15.25 GB above baseline and left 12.36 GB allocated. Conv2d took 2.7 seconds, peaked about 2.3 GB and left 0.43 GB.",
    panels: [
      {
        title: "Decode time",
        unit: "s",
        rows: [
          { label: "Conv3d", value: 6.7, tone: "muted" },
          { label: "Conv2d", value: 2.7 },
        ],
      },
      {
        title: "Peak memory",
        unit: "GB",
        decimals: 2,
        rows: [
          { label: "Conv3d", value: 15.25, tone: "muted" },
          { label: "Conv2d", value: 2.3, lo: 2.24, hi: 2.38 },
        ],
      },
      {
        title: "Held afterwards",
        unit: "GB",
        decimals: 2,
        rows: [
          { label: "Conv3d", value: 12.36, tone: "muted" },
          { label: "Conv2d", value: 0.43 },
        ],
      },
    ],
  },
  "vae-first-decode": {
    kind: "columns",
    title: "Peak memory of six decodes in one process, in run order",
    caption:
      "Same latent every time, Conv3d decoder. Whichever tile size ran first peaked near 15 GB; a table of tile sizes alone would have blamed the wrong thing.",
    alt: "Six decodes in order: 512px tiles peaked 15.4 GB, then 256px 3.4, 384px 4.1, 512px 5.5, 768px 8.1 and 256px 8.0 GB.",
    unit: "GB",
    yLabel: "GB above baseline",
    decimals: 1,
    categories: ["512px\nrun 1", "256px\nrun 2", "384px\nrun 3", "512px\nrun 4", "768px\nrun 5", "256px\nrun 6"],
    series: [
      {
        name: "Peak above baseline",
        tone: "muted",
        values: [15.39, 3.38, 4.05, 5.47, 8.13, 7.97],
        tones: ["accent", "muted", "muted", "muted", "muted", "muted"],
      },
    ],
  },
  "timing-drift": {
    kind: "lines",
    title: "The same forward pass, timed again and again",
    caption:
      "Krea 2 on the M5 Air, same input and weights, nothing changed between timings. The two paths alternated, so the crossing lines are noise from the machine, not a result.",
    alt: "The 4-bit path took 19.6, 23.9, 30.1 and 41.2 seconds on four timings. The int8 path took 19.1, 40.5 and 29.5 on timings two to four.",
    unit: "s",
    yLabel: "seconds",
    xLabel: "Timing",
    decimals: 1,
    xs: [1, 2, 3, 4],
    xTicks: [1, 2, 3, 4],
    yTicks: [0, 10, 20, 30, 40, 50],
    series: [
      { name: "4-bit matmuls", tone: "muted", values: [19.58, 23.91, 30.05, 41.23] },
      { name: "Int8 matmuls", tone: "accent", values: [null, 19.13, 40.47, 29.54] },
    ],
  },
  "halo-profile": {
    kind: "lines",
    title: "Colour difference from the original, across the mask edge",
    caption:
      "Mean over 21 rows and the three colour channels, for the moon edit. Zero means the pixel matches the original. Left of the line is inside the mask.",
    alt: "With a plain paste-back the area inside the mask sits about 20 levels darker than the original, ramping in over about 40 pixels. With the tone correction it stays within about 2 levels near the edge and 7 at the far left.",
    unit: "levels",
    yLabel: "levels (0 to 255)",
    xLabel: "Pixels from the mask edge",
    decimals: 1,
    xs: [-134, -124, -114, -104, -94, -84, -74, -64, -54, -44, -34, -24, -14, -4, 6, 16, 26, 36, 46],
    xTicks: [-120, -80, -40, 0, 40],
    yTicks: [-25, -20, -15, -10, -5, 0],
    vline: { x: 0, label: "mask edge" },
    series: [
      {
        name: "Plain paste-back",
        tone: "muted",
        values: [-22.3, -21.1, -20.7, -20.8, -21.2, -20.6, -19.9, -19.7, -19.6, -19.2, -16.8, -12.0, -4.6, -1.2, -0.2, 0, 0, 0, 0],
      },
      {
        name: "With tone correction",
        tone: "accent",
        values: [-6.7, -4.9, -3.2, -1.7, -1.4, -0.8, -0.2, -0.4, -1.0, -2.2, -2.3, -1.0, 2.0, 1.7, 0.6, 0, 0, 0, 0],
      },
    ],
  },
};
