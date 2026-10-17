import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Optional artwork for a hire page, read from public/hire/<slug>/<file>.
 * Returns the public URL when the file exists, or null so the page renders without it.
 */
export const hireAsset = (slug: string, file: string) => {
  const url = `/hire/${slug}/${file}`;
  return existsSync(path.join(process.cwd(), "public", url)) ? url : null;
};

/** Optional artwork shared by every hire page, read from public/hire/<file>. */
export const sharedHireAsset = (file: string) => {
  const url = `/hire/${file}`;
  return existsSync(path.join(process.cwd(), "public", url)) ? url : null;
};

/** A blog post's cover, read from public/blog/<slug>/cover.webp, or null if it isn't there yet. */
export const blogCover = (slug: string) => {
  const url = `/blog/${slug}/cover.webp`;
  return existsSync(path.join(process.cwd(), "public", url)) ? url : null;
};
