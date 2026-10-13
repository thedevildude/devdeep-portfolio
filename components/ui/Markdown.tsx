import { Fragment, type ReactNode } from "react";

/** Inline: `code`, **bold**, *italic*, [text](url). */
const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

const inline = (text: string): ReactNode[] =>
  text.split(INLINE).map((part, i) => {
    if (part.startsWith("`"))
      return (
        <code
          key={i}
          className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em]"
        >
          {part.slice(1, -1)}
        </code>
      );
    if (part.startsWith("**"))
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      const external = /^https?:/.test(link[2]);
      return (
        <a
          key={i}
          href={link[2]}
          {...(external && { target: "_blank", rel: "noopener noreferrer" })}
          className="underline underline-offset-4 hover:text-accent"
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
  <div className="space-y-6 font-slab text-base leading-relaxed sm:text-lg">
    {source.split(/\n{2,}/).map((block, i) => {
      if (block.startsWith("### "))
        return (
          <h3
            key={i}
            className="pt-2 font-sans text-lg font-semibold uppercase sm:text-xl"
          >
            {block.slice(4)}
          </h3>
        );
      if (block.startsWith("## "))
        return (
          <h2
            key={i}
            className="pt-6 font-sans text-2xl font-semibold uppercase sm:text-3xl"
          >
            {block.slice(3)}
          </h2>
        );
      if (block.startsWith("> "))
        return (
          <blockquote key={i} className="border-l-2 border-accent pl-5 italic">
            {inline(block.replace(/^> ?/gm, " ").trim())}
          </blockquote>
        );
      if (block.startsWith("- "))
        return (
          <ul key={i} className="list-disc space-y-2 pl-6 marker:text-accent">
            {block.split("\n").map((li, j) => (
              <li key={j}>{inline(li.replace(/^- /, ""))}</li>
            ))}
          </ul>
        );
      return <p key={i}>{inline(block.replace(/\n/g, " "))}</p>;
    })}
  </div>
);

export default Markdown;
