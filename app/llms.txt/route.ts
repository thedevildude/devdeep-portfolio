import { getPosts } from "@/lib/blog";
import { HOMEPAGE_METADATA, LINKS, SITE } from "@/lib/constants";
import { SERVICES } from "@/lib/services";

export const GET = async () => {
  const posts = await getPosts();
  const body = `# ${SITE.name} (Devdeep Ghosh)

> ${HOMEPAGE_METADATA.description}

Devdeep is a senior full stack software engineer based in India, available for remote contract and full-time work. Focus areas: React, Next.js, TypeScript, AI engineering, Blockchain and forward deployed engineering.

## Hire

${SERVICES.map((s) => `- [${s.h1}](${SITE.url}/hire/${s.slug}): ${s.description}`).join("\n")}

## Case studies

${posts.map((p) => `- [${p.title}](${SITE.url}/blog/${p.slug}): ${p.description}`).join("\n")}

## Optional

- [Home](${SITE.url}): Portfolio and selected work
- [Blog](${SITE.url}/blog): All case studies
- [LinkedIn](${LINKS.linkedin})
- [GitHub](${LINKS.github})
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
