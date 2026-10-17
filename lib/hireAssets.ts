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
