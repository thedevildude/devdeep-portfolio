import { cn } from "@/lib/utils";
import { PAPERS } from "@/lib/constants";

type PaperCalloutProps = {
  paper: (typeof PAPERS)[string];
  className?: string;
};

/** Prominent "published research" card with the full citation; links out to the paper. */
const PaperCallout = ({ paper, className }: PaperCalloutProps) => (
  <a
    href={paper.url}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      "group relative block overflow-hidden rounded-2xl border border-border bg-surface p-5 transition hover:border-accent sm:p-8",
      className,
    )}
  >
    <div
      aria-hidden
      className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-accent/20 blur-3xl"
    />
    <div className="relative flex items-start gap-5 sm:gap-7">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground sm:size-16">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-6 sm:size-8"
          aria-hidden
        >
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </svg>
      </span>
      <div className="flex-1">
        <p className="text-xs font-semibold tracking-widest text-accent uppercase">
          Published research · {paper.conferenceShort} · {paper.venue}
        </p>
        <h3 className="mt-2 text-lg leading-snug font-semibold sm:text-2xl">
          {paper.title}
        </h3>
        <p className="mt-3 font-slab text-sm text-foreground sm:text-base">
          {paper.authors.join(", ")}
        </p>
        <p className="mt-1 font-slab text-xs text-muted sm:text-sm">
          {paper.conference}, {paper.location}, {paper.dates}.
        </p>
        <p className="mt-1 font-slab text-xs text-muted sm:text-sm">
          DOI {paper.doi}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent uppercase">
          Read the paper
          <span
            aria-hidden
            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          >
            ↗
          </span>
        </span>
      </div>
    </div>
  </a>
);

export default PaperCallout;
