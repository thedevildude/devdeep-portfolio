import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Cover from "@/components/blog/Cover";
import Accent from "@/components/hire/Accent";
import {
  ContactButton,
  ContactDialogProvider,
} from "@/components/hire/ContactDialog";
import { barlowItalic } from "@/components/hire/fonts";
import { PRIMARY_BTN } from "@/components/hire/styles";
import Container from "@/components/ui/Container";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import JsonLd from "@/components/ui/JsonLd";
import Markdown, { getHeadings } from "@/components/ui/Markdown";
import PaperCallout from "@/components/ui/PaperCallout";
import Reveal from "@/components/ui/Reveal";
import { formatDate, getPost, getPosts } from "@/lib/blog";
import { LINKS, PAPERS, SITE } from "@/lib/constants";
import { blogCover } from "@/lib/hireAssets";
import { cn } from "@/lib/utils";

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

/** "Boomshare: a screen recorder…" → product name plain, the rest in the light italic accent. */
const accentTitle = (title: string) => {
  const i = title.indexOf(": ");
  return i === -1 ? title : `${title.slice(0, i + 1)} *${title.slice(i + 2)}*`;
};

const BlogPost = async ({ params }: PageProps<"/blog/[slug]">) => {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  const posts = await getPosts();
  const index = posts.findIndex((p) => p.slug === post.slug);
  const more = [1, 2].map((n) => posts[(index + n) % posts.length]);

  const url = `${SITE.url}/blog/${post.slug}`;
  const cover = blogCover(post.slug);
  const headings = getHeadings(post.body);
  const paper = post.work ? PAPERS[post.work] : undefined;
  const person = {
    "@type": "Person",
    name: AUTHOR,
    url: SITE.url,
    sameAs: [LINKS.linkedin, LINKS.github],
  };

  return (
    <div
      className={cn(
        barlowItalic.variable,
        "theme-sky flex flex-1 flex-col bg-background tracking-wide text-foreground",
      )}
    >
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
              image: cover
                ? [`${SITE.url}${cover}`, `${url}/opengraph-image`]
                : `${url}/opengraph-image`,
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
      <ContactDialogProvider topic="software engineer">
        <Header />
        <main className="flex-1">
          {/* Hero */}
          <section className="bg-linear-to-b from-sky-1 via-sky-2 to-sky-3/70 pt-32 pb-36 sm:pt-40 sm:pb-52">
            <Container>
              <Reveal y={24} className="mx-auto max-w-4xl">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-base font-medium text-foreground/70 transition-colors hover:text-ink-blue"
                >
                  <span aria-hidden>←</span> All case studies
                </Link>
                <p className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-foreground/70 sm:text-base">
                  <span className="rounded-full bg-white/70 px-3 py-1 font-medium text-ink-blue">
                    {post.tag}
                  </span>
                  <span>
                    <time dateTime={post.date}>{formatDate(post.date)}</time> ·{" "}
                    {post.readMinutes} min read
                  </span>
                </p>
                <h1 className="mt-5 pb-1 text-4xl leading-[1.1] font-semibold tracking-normal text-balance wrap-anywhere sm:text-5xl lg:text-6xl">
                  <Accent text={accentTitle(post.title)} />
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-pretty text-foreground/70 sm:text-xl">
                  {post.description}
                </p>
              </Reveal>
            </Container>
          </section>

          {/* Cover, lifted over the hero's lower edge */}
          <Container>
            <Reveal y={32} className="mx-auto -mt-24 max-w-6xl sm:-mt-36">
              <Cover
                slug={post.slug}
                alt={post.title}
                priority
                sizes="(min-width: 1280px) 1152px, 100vw"
                className="shadow-[0_40px_100px_-40px_rgba(16,48,174,0.35)]"
              />
            </Reveal>
          </Container>

          {/* Body with a sticky table of contents */}
          <Container>
            <div className="mx-auto grid max-w-6xl gap-12 py-16 sm:py-24 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16">
              <aside className="hidden lg:block">
                {headings.length > 1 && (
                  <nav
                    aria-label="On this page"
                    className="sticky top-28 border-l border-border pl-5"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      On this page
                    </p>
                    <ul className="mt-4 space-y-3 text-base leading-snug text-muted">
                      {headings.map((h) => (
                        <li key={h.id}>
                          <a
                            href={`#${h.id}`}
                            className="transition-colors hover:text-ink-blue"
                          >
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </aside>
              <article className="max-w-[68ch]">
                {paper && <PaperCallout paper={paper} className="mb-12" />}
                <Markdown source={post.body} />
              </article>
            </div>
          </Container>

          {/* Author */}
          <Container>
            <Reveal className="mx-auto max-w-6xl">
              <div className="grid items-center gap-8 rounded-4xl bg-linear-to-br from-sky-1 via-sky-2 to-sky-3 p-8 sm:grid-cols-[auto_1fr] sm:p-12 lg:grid-cols-[auto_1fr_auto]">
                <Image
                  src="/portrait.png"
                  alt={AUTHOR}
                  width={112}
                  height={112}
                  className="size-24 rounded-full bg-white/60 object-cover object-top sm:size-28"
                />
                <div>
                  <p className="text-2xl font-semibold sm:text-3xl">
                    Written by {AUTHOR}
                  </p>
                  <p className="mt-2 max-w-xl text-lg leading-relaxed text-foreground/70">
                    Senior software engineer based in India. Hired directly for
                    product work, from first commit to production.
                  </p>
                </div>
                <ContactButton
                  source="blog_post_author"
                  className={cn(PRIMARY_BTN, "justify-self-start")}
                >
                  Hire me <span aria-hidden>→</span>
                </ContactButton>
              </div>
            </Reveal>
          </Container>

          {/* More posts */}
          <section className="py-20 sm:py-28">
            <Container>
              <div className="mx-auto max-w-6xl">
                <h2 className="text-3xl font-normal tracking-normal sm:text-4xl">
                  <Accent text="More *case studies*" />
                </h2>
                <ul className="mt-10 grid gap-10 md:grid-cols-2">
                  {more.map((p, i) => (
                    <li key={p.slug}>
                      <Reveal delay={i * 0.08} y={24}>
                        <Link href={`/blog/${p.slug}`} className="group block">
                          <Cover
                            slug={p.slug}
                            alt={p.title}
                            sizes="(min-width: 768px) 45vw, 100vw"
                          />
                          <p className="mt-5 text-sm text-muted">
                            {p.tag} · {p.readMinutes} min read
                          </p>
                          <h3 className="mt-2 text-2xl leading-tight font-semibold text-balance transition-colors group-hover:text-ink-blue">
                            {p.title}
                          </h3>
                        </Link>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            </Container>
          </section>
        </main>
        <Footer />
      </ContactDialogProvider>
    </div>
  );
};

export default BlogPost;
