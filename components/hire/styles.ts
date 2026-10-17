import type { HireLayout } from "@/lib/services";

/** Icon colours cycle through these, like the reference's multi-colour icon rows. */
const TONES = [
  "bg-kiwi-soft text-kiwi",
  "bg-ixia-soft text-ixia",
  "bg-plum-soft text-plum",
  "bg-papaya-soft text-papaya",
  "bg-pomelo-soft text-pomelo",
  "bg-sky-1 text-ink-blue",
];
export const tone = (i: number) => TONES[i % TONES.length];
/** Just the soft background, or just the text colour, of a tone. */
export const toneBg = (i: number) => tone(i).split(" ")[0];
export const toneText = (i: number) => tone(i).split(" ")[1];

/** Hero and closing-band gradients, one per page theme. */
export const THEMES: Record<NonNullable<HireLayout["theme"]>, string> = {
  sky: "bg-linear-to-b from-sky-1 via-sky-2 to-sky-3",
  mint: "bg-linear-to-b from-mint-1 via-mint-2 to-mint-3",
  peach: "bg-linear-to-b from-peach-1 via-peach-2 to-peach-3",
  lilac: "bg-linear-to-b from-lilac-1 via-lilac-2 to-lilac-3",
};

export const H2 =
  "mx-auto max-w-4xl text-center text-4xl leading-[1.05] font-normal tracking-normal text-balance sm:text-5xl lg:text-6xl";
export const LEDE =
  "mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-pretty text-muted sm:text-xl";
export const PRIMARY_BTN =
  "inline-flex cursor-pointer items-center gap-3 rounded-full bg-foreground px-8 py-4 text-base font-medium text-background transition hover:bg-ink-blue sm:text-lg";
export const GHOST_BTN =
  "inline-flex items-center gap-3 rounded-full border border-foreground/20 bg-white/60 px-8 py-4 text-base font-medium backdrop-blur transition hover:border-foreground sm:text-lg";
