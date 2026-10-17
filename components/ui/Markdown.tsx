import { Fragment, type ReactNode } from "react";

/** Inline: `code`, **bold**, *italic*, [text](url). */
const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

/** URL-safe anchor for a heading, shared by the headings and the table of contents. */
export const headingId = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** The post's `##` headings, in order, for the table of contents. */
export const getHeadings = (source: string) =>
  source
    .split(/\n{2,}/)
    .filter((b) => b.startsWith("## "))
    .map((b) => {
      const text = b.slice(3).trim();
      return { id: headingId(text), text };
    });

const inline = (text: string): ReactNode[] =>
  text.split(INLINE).map((part, i) => {
    if (part.startsWith("`"))
      return (
        <code
          key={i}
          className="rounded-md bg-sky-1 px-1.5 py-0.5 font-sans text-[0.9em] text-ink-blue"
        >
          {part.slice(1, -1)}
        </code>
      );
    if (part.startsWith("**"))
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    if (part.startsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const external = /^https?:/.test(link[2]);
      return (
        <a
          key={i}
          href={link[2]}
          {...(external && { target: "_blank", rel: "noopener noreferrer" })}
          className="text-ink-blue underline decoration-ink-blue/30 underline-offset-4 transition-colors hover:decoration-ink-blue"
        >
          {link[1]}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });

/**
 * A deliberately small renderer for the blog's posts: `##` / `###` headings, paragraphs,
 * `-` lists, `>` quotes and the inline styles above. Blocks are separated by blank lines.
 */
const Markdown = ({ source }: { source: string }) => (
  <div className="space-y-6 font-slab text-lg leading-[1.8] text-foreground/85">
    {source.split(/\n{2,}/).map((block, i) => {
      if (block.startsWith("### "))
        return (
          <h3
            key={i}
            className="pt-4 font-sans text-2xl leading-tight font-semibold text-foreground"
          >
            {block.slice(4)}
          </h3>
        );
      if (block.startsWith("## ")) {
        const text = block.slice(3).trim();
        return (
          <h2
            key={i}
            id={headingId(text)}
            className="scroll-mt-28 pt-10 font-sans text-3xl leading-tight font-semibold text-foreground sm:text-4xl"
          >
            {text}
          </h2>
        );
      }
      if (block.startsWith("> "))
        return (
          <blockquote
            key={i}
            className="rounded-3xl bg-sky-1 px-7 py-6 font-sans text-xl leading-relaxed text-ink-blue italic sm:text-2xl"
          >
            {inline(block.replace(/^> ?/gm, " ").trim())}
          </blockquote>
        );
      if (block.startsWith("- "))
        return (
          <ul key={i} className="space-y-3">
            {block.split("\n").map((li, j) => (
              <li key={j} className="relative pl-7">
                <span
                  aria-hidden
                  className="absolute top-[0.8em] left-0 h-0.5 w-3.5 rounded-full bg-ink-blue"
                />
                {inline(li.replace(/^- /, ""))}
              </li>
            ))}
          </ul>
        );
      return <p key={i}>{inline(block.replace(/\n/g, " "))}</p>;
    })}
  </div>
);

export default Markdown;
