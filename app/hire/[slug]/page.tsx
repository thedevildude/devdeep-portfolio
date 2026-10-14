import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/ui/JsonLd";
import LogoMarquee from "@/components/ui/LogoMarquee";
import Reveal from "@/components/ui/Reveal";
import { getPosts } from "@/lib/blog";
import { CONTACT, LINKS, SITE, WORKS } from "@/lib/constants";
import { SERVICES, getService } from "@/lib/services";

export const generateStaticParams = () =>
  SERVICES.map(({ slug }) => ({ slug }));

export const generateMetadata = async ({
  params,
}: PageProps<"/hire/[slug]">): Promise<Metadata> => {
  const service = getService((await params).slug);
  if (!service) return {};
  return {
    title: service.seoTitle,
    description: service.description,
    keywords: service.keywords,
    alternates: { canonical: `/hire/${service.slug}` },
    openGraph: {
      title: service.seoTitle,
      description: service.description,
      url: `/hire/${service.slug}`,
      siteName: SITE.name,
      type: "website",
    },
  };
};

const EYEBROW =
  "text-xs font-semibold uppercase tracking-widest text-accent sm:text-sm";
const PRIMARY_BTN =
  "inline-flex items-center gap-3 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold uppercase text-accent-foreground transition hover:brightness-110 sm:text-base";
const GHOST_BTN =
  "inline-flex items-center gap-3 rounded-full border border-border px-7 py-3.5 text-sm font-semibold uppercase transition hover:border-accent hover:text-accent sm:text-base";

/** Every slug is prerendered at build, so the full content ships in the static HTML for crawlers. */
export const instant = false;

const ServicePage = async ({ params }: PageProps<"/hire/[slug]">) => {
  const service = getService((await params).slug);
  if (!service) notFound();

  const posts = await getPosts();
  const url = `${SITE.url}/hire/${service.slug}`;
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
      <Header />
      <main className="flex-1 overflow-x-clip">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "ProfessionalService",
                name: `${SITE.name} — ${service.h1}`,
                url,
                description: service.description,
                areaServed: "Worldwide",
                provider: {
                  "@type": "Person",
                  name: "Devdeep Ghosh",
                  url: SITE.url,
                },
              },
              {
                "@type": "FAQPage",
                mainEntity: service.faqs.map((f) => ({
                  "@type": "Question",
                  name: f.q,
                  acceptedAnswer: { "@type": "Answer", text: f.a },
                })),
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
                    name: service.h1,
                    item: url,
                  },
                ],
              },
            ],
          }}
        />

        {/* Hero */}
        <section className="relative pt-32 pb-16 sm:pt-44 sm:pb-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 right-[-10%] size-168 rounded-full bg-accent/25 blur-[140px]"
          />
          <Container className="relative">
            <div className="grid items-center gap-12 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
              <Reveal y={24}>
                <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs uppercase sm:text-sm">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                  </span>
                  Available · India · Remote
                </p>
                <h1 className="mt-6 text-4xl leading-[1.05] font-semibold uppercase sm:text-6xl lg:text-7xl">
                  {service.h1}
                </h1>
                <p className="mt-6 max-w-2xl font-slab text-base text-muted sm:text-xl">
                  {service.intro}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <a href={CONTACT.contactUs} className={PRIMARY_BTN}>
                    Get in touch <span aria-hidden>→</span>
                  </a>
                  <a
                    href={LINKS.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={GHOST_BTN}
                  >
                    View resume
                  </a>
                </div>
              </Reveal>

              <Reveal
                y={40}
                delay={0.15}
                className="relative mx-auto w-full max-w-md"
              >
                <div className="relative aspect-square overflow-hidden rounded-3xl border border-border bg-linear-to-br from-surface to-background">
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-trom-accent/30 to-transparent"
                  />
                  <Image
                    src="/portrait.png"
                    alt="Devdeep Ghosh, senior full stack software engineer"
                    fill
                    priority
                    sizes="(min-width: 1024px) 28rem, 90vw"
                    className="object-contain object-bottom"
                  />
                </div>
                <div className="absolute -bottom-5 -left-3 rounded-2xl border border-border bg-background/90 px-5 py-3 backdrop-blur sm:-left-8">
                  <p className="text-2xl font-semibold">3+ yrs</p>
                  <p className="text-xs uppercase text-muted">in production</p>
                </div>
                <div className="absolute -top-4 -right-2 rounded-2xl bg-accent px-5 py-3 text-accent-foreground sm:-right-6">
                  <p className="text-2xl font-semibold">{WORKS.length}</p>
                  <p className="text-xs uppercase">case studies</p>
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        <LogoMarquee />

        {/* Why: bento */}
        <section className="py-20 sm:py-32">
          <Container>
            <Reveal>
              <p className={EYEBROW}>Why work with me</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold uppercase sm:text-5xl">
                One senior engineer, accountable end to end
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-6">
              {service.why.map((w, i) => {
                const layout = [
                  "lg:col-span-4 bg-accent text-accent-foreground",
                  "lg:col-span-2 bg-surface border border-border",
                  "lg:col-span-2 bg-surface border border-border",
                  "lg:col-span-4 bg-petal-frost text-background",
                ][i % 4];
                return (
                  <Reveal
                    key={w.title}
                    delay={i * 0.08}
                    y={32}
                    className={`rounded-3xl p-7 sm:p-10 ${layout}`}
                  >
                    <span className="text-5xl font-semibold opacity-30 sm:text-7xl">
                      0{i + 1}
                    </span>
                    <h3 className="mt-6 text-xl font-semibold uppercase sm:text-3xl">
                      {w.title}
                    </h3>
                    <p className="mt-3 max-w-xl font-slab text-sm opacity-80 sm:text-lg">
                      {w.body}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Scope */}
        <section className="border-t border-border py-20 sm:py-32">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
              <Reveal className="lg:sticky lg:top-32 lg:self-start">
                <p className={EYEBROW}>What I can build</p>
                <h2 className="mt-4 text-3xl font-semibold uppercase sm:text-5xl">
                  From first prototype to production
                </h2>
                <a href={CONTACT.contactUs} className={`${PRIMARY_BTN} mt-8`}>
                  Discuss your project <span aria-hidden>→</span>
                </a>
              </Reveal>
              <ul>
                {service.scope.map((item, i) => (
                  <Reveal key={item} delay={i * 0.05} y={24}>
                    <li className="group flex items-baseline gap-5 border-b border-border py-6 transition-colors hover:border-accent sm:py-8">
                      <span className="text-sm text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-slab text-lg transition-transform group-hover:translate-x-2 sm:text-2xl">
                        {item}
                      </span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* Proof */}
        <section className="border-t border-border bg-surface py-20 sm:py-32">
          <Container>
            <Reveal>
              <p className={EYEBROW}>Proof of work</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold uppercase sm:text-5xl">
                Real products, written up honestly
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-4 sm:mt-16 sm:grid-cols-2">
              {posts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 0.08} y={32}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col justify-between rounded-3xl border border-border bg-background p-7 transition hover:-translate-y-1 hover:border-accent sm:p-9"
                  >
                    <div>
                      <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs uppercase">
                        {post.tag}
                      </span>
                      <h3 className="mt-5 text-xl font-semibold uppercase sm:text-2xl">
                        {post.title}
                      </h3>
                      <p className="mt-3 font-slab text-sm text-muted sm:text-base">
                        {post.description}
                      </p>
                    </div>
                    <span className="mt-8 text-sm uppercase text-accent">
                      Read case study{" "}
                      <span
                        aria-hidden
                        className="inline-block transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* Process */}
        <section className="py-20 sm:py-32">
          <Container>
            <Reveal>
              <p className={EYEBROW}>How it works</p>
              <h2 className="mt-4 max-w-3xl text-3xl font-semibold uppercase sm:text-5xl">
                Simple, fast, no surprises
              </h2>
            </Reveal>
            <ol className="relative mt-12 grid gap-10 sm:mt-16 md:grid-cols-3 md:gap-8">
              <div
                aria-hidden
                className="absolute top-8 right-[16%] left-[8%] hidden h-px bg-linear-to-r from-accent via-border to-accent md:block"
              />
              {service.steps.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.12} y={32}>
                  <li className="relative">
                    <span className="relative z-10 flex size-16 items-center justify-center rounded-full border border-accent bg-background text-xl font-semibold text-accent">
                      {i + 1}
                    </span>
                    <h3 className="mt-6 text-xl font-semibold uppercase sm:text-2xl">
                      {s.title}
                    </h3>
                    <p className="mt-3 font-slab text-sm text-muted sm:text-lg">
                      {s.body}
                    </p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </Container>
        </section>

        {/* FAQ */}
        <section className="border-t border-border py-20 sm:py-32">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
              <Reveal>
                <p className={EYEBROW}>FAQ</p>
                <h2 className="mt-4 text-3xl font-semibold uppercase sm:text-5xl">
                  Questions, answered
                </h2>
              </Reveal>
              <Reveal delay={0.1} y={32}>
                <div className="divide-y divide-border border-y border-border">
                  {service.faqs.map((f) => (
                    <details key={f.q} className="group py-6">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold marker:content-none sm:text-2xl [&::-webkit-details-marker]:hidden">
                        {f.q}
                        <span
                          aria-hidden
                          className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-xl transition group-open:rotate-45 group-open:border-accent group-open:text-accent"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-4 max-w-2xl font-slab text-base text-muted sm:text-lg">
                        {f.a}
                      </p>
                    </details>
                  ))}
                </div>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="px-5 pb-20 sm:px-10 sm:pb-28 md:px-16 lg:px-32">
          <Reveal y={40}>
            <div className="relative overflow-hidden rounded-4xl bg-full-spectrum-blue px-7 py-14 text-petal-frost sm:px-16 sm:py-24">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-24 -bottom-32 size-112 rounded-full bg-petal-frost/20 blur-[100px]"
              />
              <h2 className="relative max-w-3xl text-3xl leading-tight font-semibold uppercase sm:text-6xl">
                Let&apos;s build something that ships
              </h2>
              <p className="relative mt-5 max-w-xl font-slab text-base opacity-90 sm:text-xl">
                Send a short brief. You&apos;ll get an honest answer on fit and
                availability within 24 hours.
              </p>
              <div className="relative mt-10 flex flex-wrap gap-4">
                <a
                  href={CONTACT.contactUs}
                  className="inline-flex items-center gap-3 rounded-full bg-petal-frost px-7 py-3.5 text-sm font-semibold text-background uppercase transition hover:scale-[1.03] sm:text-base"
                >
                  Email me <span aria-hidden>→</span>
                </a>
                <a
                  href={LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full border border-petal-frost/40 px-7 py-3.5 text-sm font-semibold uppercase transition hover:bg-petal-frost/10 sm:text-base"
                >
                  LinkedIn
                </a>
              </div>
              <nav
                aria-label="Related hiring pages"
                className="relative mt-12 flex flex-wrap gap-3 border-t border-petal-frost/25 pt-8"
              >
                <span className="w-full text-xs uppercase opacity-70">
                  Also see
                </span>
                {others.map((o) => (
                  <Link
                    key={o.slug}
                    href={`/hire/${o.slug}`}
                    className="rounded-full bg-petal-frost/15 px-4 py-2 text-xs uppercase transition hover:bg-petal-frost/25 sm:text-sm"
                  >
                    {o.h1}
                  </Link>
                ))}
              </nav>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ServicePage;
