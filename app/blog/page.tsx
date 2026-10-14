import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/ui/JsonLd";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { formatDate, getPosts } from "@/lib/blog";
import { PAPERS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Blog — ${SITE.name}`,
  description:
    "Case studies and notes on the systems I have architected, led and shipped.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Blog — ${SITE.name}`,
    description:
      "Case studies and notes on the systems I have architected, led and shipped.",
    url: "/blog",
    type: "website",
  },
};

const BlogIndex = async () => {
  const posts = await getPosts();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: `${SITE.name} — Blog`,
          url: `${SITE.url}/blog`,
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${SITE.url}/blog/${p.slug}`,
            datePublished: p.date,
            dateModified: p.updated,
          })),
        }}
      />
      <Header />
      <main className="flex-1 pt-32 pb-20 sm:pt-44 sm:pb-28">
        <Container>
          <Reveal y={24}>
            <h1 className="text-4xl font-semibold uppercase sm:text-6xl lg:text-7xl">
              Blog
            </h1>
            <p className="mt-4 max-w-2xl font-slab text-base text-muted sm:mt-6 sm:text-xl">
              Case studies and notes on the systems I have architected, led and
              shipped.
            </p>
          </Reveal>

          <ul className="mt-12 divide-y divide-border border-y border-border sm:mt-20">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group grid gap-3 py-8 sm:grid-cols-[10rem_1fr_auto] sm:items-baseline sm:gap-10 sm:py-10"
                >
                  <span className="text-xs uppercase text-muted sm:text-sm">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                  </span>
                  <span>
                    <span className="block text-xl font-semibold uppercase transition-colors group-hover:text-accent sm:text-3xl">
                      {post.title}
                    </span>
                    <span className="mt-3 block max-w-2xl font-slab text-sm text-muted sm:text-lg">
                      {post.description}
                    </span>
                  </span>
                  <span className="flex items-center gap-3 text-xs uppercase text-muted sm:text-sm">
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5">
                      {post.tag}
                    </span>
                    {post.work && PAPERS[post.work] && (
                      <span className="rounded-full bg-accent px-2.5 py-0.5 text-accent-foreground">
                        IEEE paper
                      </span>
                    )}
                    {post.readMinutes} min
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default BlogIndex;
