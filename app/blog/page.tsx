import type { Metadata } from "next";
import Link from "next/link";
import Cover from "@/components/blog/Cover";
import Accent from "@/components/hire/Accent";
import {
  ContactButton,
  ContactDialogProvider,
} from "@/components/hire/ContactDialog";
import DiwaliLights from "@/components/hire/DiwaliLights";
import { barlowItalic } from "@/components/hire/fonts";
import { PRIMARY_BTN } from "@/components/hire/styles";
import Container from "@/components/ui/Container";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import JsonLd from "@/components/ui/JsonLd";
import Reveal from "@/components/ui/Reveal";
import { formatDate, getPosts, type Post } from "@/lib/blog";
import { PAPERS, SITE } from "@/lib/constants";
import { blogCover } from "@/lib/hireAssets";
import { cn } from "@/lib/utils";

const DESCRIPTION =
  "Case studies and notes on the systems I have architected, led and shipped.";

export const metadata: Metadata = {
  title: `Blog | ${SITE.name}`,
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Blog | ${SITE.name}`,
    description: DESCRIPTION,
    url: "/blog",
    type: "website",
  },
};

/** Tag, IEEE badge, date and reading time on one line. */
const Meta = ({ post }: { post: Post }) => (
  <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
    <span className="rounded-full bg-sky-1 px-3 py-1 font-medium text-ink-blue">
      {post.tag}
    </span>
    {post.work && PAPERS[post.work] && (
      <span className="rounded-full bg-ink-blue px-3 py-1 font-medium text-white">
        IEEE paper
      </span>
    )}
    <span>
      <time dateTime={post.date}>{formatDate(post.date)}</time> ·{" "}
      {post.readMinutes} min read
    </span>
  </p>
);

const BlogIndex = async () => {
  const [featured, ...rest] = await getPosts();
  const posts = [featured, ...rest];

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
          "@type": "Blog",
          name: `${SITE.name} Blog`,
          url: `${SITE.url}/blog`,
          blogPost: posts.map((p) => ({
            "@type": "BlogPosting",
            headline: p.title,
            url: `${SITE.url}/blog/${p.slug}`,
            datePublished: p.date,
            dateModified: p.updated,
            ...(blogCover(p.slug) && {
              image: `${SITE.url}${blogCover(p.slug)}`,
            }),
          })),
        }}
      />
      <ContactDialogProvider topic="software engineer">
        <Header />
        <main className="flex-1">
          {/* Hero */}
          <section className="bg-linear-to-b from-sky-1 via-sky-2/60 to-background pt-32 pb-14 sm:pt-40 sm:pb-20">
            <Container>
              <Reveal y={24} className="max-w-4xl">
                <h1 className="text-5xl leading-[1.1] font-normal tracking-normal text-balance sm:text-6xl lg:text-7xl">
                  <Accent text="Case studies from *systems I've shipped*" />
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pretty text-muted sm:text-xl">
                  {DESCRIPTION}
                </p>
              </Reveal>
            </Container>
          </section>

          {/* Latest post, given the most room */}
          <section className="pb-20 sm:pb-28">
            <Container>
              <Reveal y={32}>
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group grid items-center gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-14"
                >
                  <Cover
                    slug={featured.slug}
                    alt={featured.title}
                    priority
                    sizes="(min-width: 1024px) 58vw, 100vw"
                  />
                  <div>
                    <Meta post={featured} />
                    <h2 className="mt-5 text-3xl leading-[1.1] font-semibold tracking-normal text-balance transition-colors group-hover:text-ink-blue sm:text-4xl lg:text-5xl">
                      {featured.title}
                    </h2>
                    <p className="mt-5 text-lg leading-relaxed text-pretty text-muted">
                      {featured.description}
                    </p>
                    <span className="mt-8 inline-flex items-center gap-2 text-lg font-medium text-ink-blue">
                      Read the case study
                      <span
                        aria-hidden
                        className="transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            </Container>
          </section>

          <DiwaliLights
            seed={12}
            className="-my-14 bg-linear-to-b from-background to-surface"
          />

          {/* Everything else, in a staggered two-column grid */}
          <section className="bg-surface py-20 sm:py-28">
            <Container>
              <ul className="mx-auto grid max-w-6xl gap-x-10 gap-y-16 md:grid-cols-2 md:gap-y-20">
                {rest.map((post, i) => (
                  <li key={post.slug} className={cn(i % 2 === 1 && "md:mt-28")}>
                    <Reveal delay={(i % 2) * 0.08} y={32}>
                      <Link href={`/blog/${post.slug}`} className="group block">
                        <Cover
                          slug={post.slug}
                          alt={post.title}
                          sizes="(min-width: 768px) 45vw, 100vw"
                        />
                        <div className="mt-6">
                          <Meta post={post} />
                          <h2 className="mt-4 text-2xl leading-tight font-semibold tracking-normal text-balance transition-colors group-hover:text-ink-blue sm:text-3xl">
                            {post.title}
                          </h2>
                          <p className="mt-3 line-clamp-3 text-base leading-relaxed text-muted sm:text-lg">
                            {post.description}
                          </p>
                        </div>
                      </Link>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </Container>
          </section>

          {/* Closing call to action */}
          <section className="bg-linear-to-b from-surface via-sky-2 to-sky-3 py-24 sm:py-32">
            <Container>
              <Reveal className="mx-auto max-w-3xl text-center">
                <h2 className="text-4xl leading-[1.1] font-normal tracking-normal text-balance sm:text-5xl lg:text-6xl">
                  <Accent text="Building something *like this*?" />
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pretty text-foreground/70 sm:text-xl">
                  Tell me what you&apos;re working on. I reply within 24 hours.
                </p>
                <ContactButton
                  source="blog_index"
                  className={cn(PRIMARY_BTN, "mt-9")}
                >
                  Hire me <span aria-hidden>→</span>
                </ContactButton>
              </Reveal>
            </Container>
          </section>
        </main>
        <Footer />
      </ContactDialogProvider>
    </div>
  );
};

export default BlogIndex;
