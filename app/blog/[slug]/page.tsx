import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Container from "@/components/ui/Container";
import Markdown from "@/components/ui/Markdown";
import { formatDate, getPost, getPosts } from "@/lib/blog";
import { SITE } from "@/lib/constants";

export const generateStaticParams = async () =>
  (await getPosts()).map(({ slug }) => ({ slug }));

export const generateMetadata = async ({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> => {
  const post = await getPost((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title} — ${SITE.name}`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
};

const BlogPost = async ({ params }: PageProps<"/blog/[slug]">) => {
  const post = await getPost((await params).slug);
  if (!post) notFound();

  return (
    <>
      <Header />
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
              {formatDate(post.date)} · {post.readMinutes} min read
            </p>
            <h1 className="mt-4 text-3xl leading-tight font-semibold uppercase sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-5 font-slab text-lg text-muted sm:text-2xl">
              {post.description}
            </p>
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
