import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const DIR = path.join(process.cwd(), "content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  tag: string;
  /** Project this post covers; matches an id in WORKS. */
  work?: string;
  readMinutes: number;
};

export type Post = PostMeta & { body: string };

/** Frontmatter is flat `key: value` lines between two `---` fences. */
const parse = (slug: string, raw: string): Post => {
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
  if (!match) throw new Error(`content/blog/${slug}.md is missing frontmatter`);
  const fields = Object.fromEntries(
    match[1].split("\n").map((line) => {
      const i = line.indexOf(":");
      return [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }),
  );
  const body = match[2].trim();
  return {
    slug,
    title: fields.title,
    description: fields.description,
    date: fields.date,
    tag: fields.tag ?? "Note",
    work: fields.work,
    readMinutes: Math.max(1, Math.round(body.split(/\s+/).length / 220)),
    body,
  };
};

/** Cached so the filesystem read happens once per build instead of counting as runtime data. */
export const getPosts = async (): Promise<Post[]> => {
  "use cache";
  const files = (await readdir(DIR)).filter((f) => f.endsWith(".md"));
  const posts = await Promise.all(
    files.map(async (f) => {
      const slug = f.replace(/\.md$/, "");
      return parse(slug, await readFile(path.join(DIR, f), "utf8"));
    }),
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
};

export const getPost = async (slug: string) =>
  (await getPosts()).find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
