import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/ui/JsonLd";
import Markdown from "@/components/ui/Markdown";
import PaperCallout from "@/components/ui/PaperCallout";
import { formatDate, getPost, getPosts } from "@/lib/blog";
import { LINKS, PAPERS, SITE } from "@/lib/constants";

const AUTHOR = "Devdeep Ghosh";

export const generateStaticParams = async () =>
  (await getPosts()).map(({ slug }) => ({ slug }));

export const generateMetadata = async ({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> => {
  const post = await getPost((await params).slug);
  if (!post) return {};
  const title = post.seoTitle ?? post.title;
  return {
    title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: AUTHOR }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description: post.description,
      url: `/blog/${post.slug}`,
      siteName: SITE.name,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [AUTHOR],
      tags: post.keywords,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.description,
    },
  };
};

/** Every slug is prerendered at build, so the full content ships in the static HTML for crawlers. */
export const instant = false;

const BlogPost = async ({ params }: PageProps<"/blog/[slug]">) => {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  const url = `${SITE.url}/blog/${post.slug}`;
  const paper = post.work ? PAPERS[post.work] : undefined;
  const person = {
    "@type": "Person",
    name: AUTHOR,
    url: SITE.url,
    sameAs: [LINKS.linkedin, LINKS.github],
  };

  return (
    <>
      <Header />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "BlogPosting",
              headline: post.title,
              description: post.description,
              keywords: post.keywords.join(", "),
              datePublished: post.date,
              dateModified: post.updated,
              mainEntityOfPage: url,
              url,
              image: `${url}/opengraph-image`,
              author: person,
              publisher: person,
              inLanguage: "en",
              articleSection: post.tag,
              ...(paper && {
                citation: {
                  "@type": "ScholarlyArticle",
                  name: paper.title,
                  url: paper.url,
                  sameAs: `https://doi.org/${paper.doi}`,
                  identifier: {
                    "@type": "PropertyValue",
                    propertyID: "DOI",
                    value: paper.doi,
                  },
                  author: paper.authors.map((name) => ({
                    "@type": "Person",
                    name,
                  })),
                  datePublished: paper.published,
                  publisher: { "@type": "Organization", name: "IEEE" },
                  isPartOf: {
                    "@type": "Event",
                    name: paper.conference,
                    location: paper.location,
                  },
                },
              }),
              wordCount: post.body.split(/\s+/).length,
            },
            {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: SITE.url,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Blog",
                  item: `${SITE.url}/blog`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: post.title,
                  item: url,
                },
              ],
            },
          ],
        }}
      />
      <main className="flex-1 pt-32 pb-20 sm:pt-44 sm:pb-28">
        <Container>
          <article className="mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="text-xs uppercase text-muted hover:text-foreground sm:text-sm"
            >
              ← All posts
            </Link>
            <p className="mt-8 flex items-center gap-3 text-xs uppercase text-muted sm:text-sm">
              <span className="rounded-full bg-white/10 px-2.5 py-0.5">
                {post.tag}
              </span>
              <time dateTime={post.date}>{formatDate(post.date)}</time> ·{" "}
              {post.readMinutes} min read
            </p>
            <h1 className="mt-4 text-3xl leading-tight font-semibold uppercase sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 font-slab text-lg text-muted sm:text-2xl">
              {post.description}
            </p>
            {paper && <PaperCallout paper={paper} className="mt-8 sm:mt-10" />}
            <div className="mt-10 border-t border-border pt-10 sm:mt-14 sm:pt-14">
              <Markdown source={post.body} />
            </div>
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default BlogPost;
