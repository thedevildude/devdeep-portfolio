import { cn } from "@/lib/utils";

type PaperCalloutProps = {
  url: string;
  venue: string;
  className?: string;
};

/** Prominent "published research" card; links out to the paper. */
const PaperCallout = ({ url, venue, className }: PaperCalloutProps) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "group relative flex items-center gap-5 overflow-hidden rounded-2xl border border-border bg-surface p-5 transition hover:border-accent sm:gap-7 sm:p-7",
      className,
    )}
  >
    <div
      aria-hidden
      className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-accent/20 blur-3xl"
    />
    <span className="relative flex size-14 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground sm:size-16">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-7 sm:size-8"
        aria-hidden
      >
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
        <path d="M14 3v5h5M9 13h6M9 17h4" />
      </svg>
    </span>
    <span className="relative flex-1">
      <span className="block text-xs font-semibold tracking-widest text-accent uppercase">
        Published research · {venue}
      </span>
      <span className="mt-1 block text-lg font-semibold uppercase sm:text-2xl">
        Read the paper behind this project
      </span>
      <span className="mt-1 block font-slab text-sm text-muted sm:text-base">
        A decentralized approach to storing and sharing medical records.
      </span>
    </span>
    <span
      aria-hidden
      className="relative text-2xl transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
    >
      ↗
    </span>
  </a>
);

export default PaperCallout;
