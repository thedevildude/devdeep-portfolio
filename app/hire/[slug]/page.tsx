import type { Metadata } from "next";
import { Barlow_Semi_Condensed } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Accent from "@/components/hire/Accent";
import DiwaliLights from "@/components/hire/DiwaliLights";
import HireIcon from "@/components/hire/HireIcon";
import Container from "@/components/ui/Container";
import Footer from "@/components/ui/Footer";
import Header from "@/components/ui/Header";
import JsonLd from "@/components/ui/JsonLd";
import Reveal from "@/components/ui/Reveal";
import { getPosts } from "@/lib/blog";
import { BRANDS, LINKS, SITE } from "@/lib/constants";
import { hireAsset, sharedHireAsset } from "@/lib/hireAssets";
import { HIRE_SHARED, SERVICES, getService } from "@/lib/services";
import { cn } from "@/lib/utils";

/** Real light italic for the highlighted headline phrase; only the hire pages load it. */
const barlowItalic = Barlow_Semi_Condensed({
  variable: "--font-barlow-italic",
  subsets: ["latin"],
  weight: "300",
  style: "italic",
  display: "swap",
});

export const generateStaticParams = () =>
  SERVICES.map(({ slug }) => ({ slug }));

export const generateMetadata = async ({
  params,
}: PageProps<"/hire/[slug]">): Promise<Metadata> => {
  const service = getService((await params).slug);
  if (!service) return {};
  const og = hireAsset(service.slug, "og.png");
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
      ...(og && { images: [{ url: og, width: 1200, height: 630 }] }),
    },
  };
};

/** Every slug is prerendered at build, so the full content ships in the static HTML for crawlers. */
export const instant = false;

/** Icon colours cycle through these, like the reference's multi-colour icon rows. */
const TONES = [
  "bg-kiwi-soft text-kiwi",
  "bg-ixia-soft text-ixia",
  "bg-plum-soft text-plum",
  "bg-papaya-soft text-papaya",
  "bg-pomelo-soft text-pomelo",
  "bg-sky-1 text-ink-blue",
];
const tone = (i: number) => TONES[i % TONES.length];

const SKY = "bg-linear-to-b from-sky-1 via-sky-2 to-sky-3";
const H2 =
  "mx-auto max-w-4xl text-center text-4xl leading-[1.05] font-normal tracking-normal text-balance sm:text-5xl lg:text-6xl";
const LEDE =
  "mx-auto mt-5 max-w-2xl text-center text-lg leading-relaxed text-pretty text-muted sm:text-xl";
const PRIMARY_BTN =
  "inline-flex items-center gap-3 rounded-full bg-foreground px-8 py-4 text-base font-medium text-background transition hover:bg-ink-blue sm:text-lg";
const GHOST_BTN =
  "inline-flex items-center gap-3 rounded-full border border-foreground/20 bg-white/60 px-8 py-4 text-base font-medium backdrop-blur transition hover:border-foreground sm:text-lg";
/** The contact form lives on the homepage. */
const CONTACT_HREF = "/#contact";

const ServicePage = async ({ params }: PageProps<"/hire/[slug]">) => {
  const service = getService((await params).slug);
  if (!service) notFound();

  const posts = await getPosts();
  const url = `${SITE.url}/hire/${service.slug}`;
  const others = SERVICES.filter((s) => s.slug !== service.slug);
  const overviewArt = hireAsset(service.slug, "overview.webp");
  // A page-specific closing image wins; otherwise every hire page shares one.
  const ctaArt =
    hireAsset(service.slug, "cta.png") ?? sharedHireAsset("cta.png");
  const meRow = sharedHireAsset("me-row.webp");

  return (
    <div
      className={cn(
        barlowItalic.variable,
        "theme-sky flex flex-1 flex-col bg-background tracking-wide text-foreground",
      )}
    >
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
        <section className={cn("relative pt-36 text-center sm:pt-44", SKY)}>
          <Container>
            <Reveal y={24}>
              <h1 className="mx-auto mt-7 max-w-5xl text-5xl leading-none font-normal tracking-normal text-balance sm:text-6xl lg:text-[5.25rem]">
                <Accent text={service.headline} />
              </h1>
              <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-pretty text-foreground/75 sm:text-xl">
                {service.intro}
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <a href={CONTACT_HREF} className={PRIMARY_BTN}>
                  {service.heroCta} <span aria-hidden>→</span>
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
              <ul
                aria-label="Core skills"
                className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-2"
              >
                {service.chips.map((chip, i) => (
                  <li
                    key={chip}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-sm font-medium",
                      tone(i),
                    )}
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </Reveal>
            {!meRow && (
              <Reveal
                y={40}
                delay={0.15}
                className="relative mx-auto mt-10 aspect-square w-full max-w-sm sm:max-w-md"
              >
                <Image
                  src="/portrait.png"
                  alt="Devdeep Ghosh, senior full stack software engineer"
                  fill
                  priority
                  sizes="(min-width: 640px) 28rem, 24rem"
                  className="object-contain object-bottom"
                />
              </Reveal>
            )}
          </Container>
          {meRow && (
            <Reveal y={40} delay={0.15} className="mt-12">
              {/* Repeats edge to edge, like a crowd; each copy is the same five illustrations of me. */}
              <div
                role="img"
                aria-label="Illustrations of Devdeep Ghosh: arms crossed, coding on a laptop, waving, thinking, and with a coffee"
                className="h-32 bg-bottom bg-repeat-x sm:h-44 lg:h-56"
                style={{
                  backgroundImage: `url(${meRow})`,
                  backgroundSize: "auto 100%",
                }}
              />
            </Reveal>
          )}
        </section>

        {/* Trust strip */}
        <section
          aria-labelledby="trust-title"
          className="border-b border-border py-10 sm:py-12"
        >
          <Container>
            <h2
              id="trust-title"
              className="text-center text-sm font-medium text-muted"
            >
              Engineering I&apos;ve shipped for
            </h2>
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:gap-x-16">
              {BRANDS.map((brand) => (
                <li key={brand.name}>
                  <Image
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    title={brand.name}
                    width={160}
                    height={48}
                    className="h-8 w-auto object-contain opacity-70 brightness-0 transition hover:opacity-100 sm:h-10"
                  />
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Overview */}
        <section className="py-20 sm:py-28">
          <Container>
            <div
              className={cn(
                "mx-auto grid max-w-6xl items-center gap-12 lg:gap-16",
                overviewArt && "lg:grid-cols-[1.5fr_1fr]",
              )}
            >
              <Reveal className={cn(!overviewArt && "mx-auto max-w-3xl")}>
                <h2
                  className={cn(
                    "text-4xl leading-[1.05] font-normal tracking-normal text-balance sm:text-5xl",
                    !overviewArt && "text-center",
                  )}
                >
                  {service.overview.title}
                </h2>
                {service.overview.paragraphs.map((p) => (
                  <p
                    key={p}
                    className="mt-5 text-lg leading-relaxed text-muted"
                  >
                    {p}
                  </p>
                ))}
                <div className="mt-8 rounded-3xl bg-surface p-6 sm:p-8">
                  <p className="font-semibold">When you hire me, you get:</p>
                  <ul className="mt-4 space-y-3">
                    {service.overview.gets.map((item, i) => (
                      <li key={item} className="flex items-start gap-3">
                        <span
                          className={cn(
                            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
                            tone(i),
                          )}
                        >
                          <HireIcon name="check" className="size-3.5" />
                        </span>
                        <span className="text-lg">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              {overviewArt && (
                <Reveal
                  delay={0.1}
                  y={32}
                  className="relative mx-auto aspect-4/3 w-full max-w-md overflow-hidden rounded-4xl bg-sky-1"
                >
                  <Image
                    src={overviewArt}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 28rem, 90vw"
                    className="object-cover"
                  />
                </Reveal>
              )}
            </div>
          </Container>
        </section>

        <DiwaliLights
          seed={7}
          className="-my-14 bg-linear-to-b from-background to-surface"
        />

        {/* What I do */}
        <section className="bg-surface py-20 sm:py-28">
          <Container>
            <Reveal>
              <h2 className={H2}>
                <Accent text={service.roleTitle} />
              </h2>
              <p className={LEDE}>{service.roleIntro}</p>
            </Reveal>
            <ul className="mx-auto mt-14 grid max-w-6xl gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {service.duties.map((d, i) => (
                <li key={d.title}>
                  <Reveal delay={(i % 4) * 0.06} y={24} className="text-center">
                    <span
                      className={cn(
                        "mx-auto flex size-15 items-center justify-center rounded-2xl",
                        tone(i),
                      )}
                    >
                      <HireIcon name={d.icon} className="size-7" />
                    </span>
                    <h3 className="mt-5 text-xl font-semibold">{d.title}</h3>
                    <p className="mx-auto mt-2 max-w-xs text-base leading-relaxed text-muted">
                      {d.body}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Why India, why me */}
        <section className="py-20 sm:py-28">
          <Container>
            <Reveal>
              <h2 className={H2}>
                <Accent text={service.whyTitle} />
              </h2>
              <p className={LEDE}>{service.whyIntro}</p>
            </Reveal>
            <ul className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-3">
              {service.why.map((w, i) => (
                <li key={w.title}>
                  <Reveal
                    delay={i * 0.08}
                    y={32}
                    className={cn(
                      "flex h-full flex-col rounded-4xl p-8 sm:p-10",
                      tone(i).split(" ")[0],
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-13 items-center justify-center rounded-2xl bg-white",
                        tone(i).split(" ")[1],
                      )}
                    >
                      <HireIcon name={w.icon} className="size-6" />
                    </span>
                    <h3 className="mt-8 text-2xl font-semibold sm:text-3xl">
                      {w.title}
                    </h3>
                    <p className="mt-3 text-lg leading-relaxed text-foreground/75">
                      {w.body}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        <DiwaliLights seed={23} className="-my-14" />

        {/* Process */}
        <section className="py-20 sm:py-28">
          <Container>
            <Reveal>
              <h2 className={H2}>
                <Accent text={HIRE_SHARED.processTitle} />
              </h2>
              <p className={LEDE}>{HIRE_SHARED.processIntro}</p>
            </Reveal>
            <ol className="relative mx-auto mt-14 grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6">
              <div
                aria-hidden
                className="absolute top-7 right-[10%] left-[10%] hidden h-px bg-border lg:block"
              />
              {service.steps.map((s, i) => (
                <li key={s.title} className="relative">
                  <Reveal delay={i * 0.08} y={24}>
                    <span
                      className={cn(
                        "relative z-10 flex size-14 items-center justify-center rounded-full text-2xl font-semibold ring-8 ring-background",
                        tone(i),
                      )}
                    >
                      {i + 1}
                    </span>
                    <h3 className="mt-5 text-xl font-semibold">{s.title}</h3>
                    <p className="mt-2 text-base leading-relaxed text-muted">
                      {s.body}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ol>
            <Reveal className="mt-14 text-center">
              <p className="mx-auto inline-block max-w-3xl rounded-3xl bg-surface px-6 py-4 text-lg">
                {HIRE_SHARED.processClose}
              </p>
            </Reveal>
          </Container>
        </section>

        {/* Ways to work */}
        <section className="bg-surface py-20 sm:py-28">
          <Container>
            <Reveal>
              <h2 className={H2}>
                <Accent text={HIRE_SHARED.engageTitle} />
              </h2>
              <p className={LEDE}>{HIRE_SHARED.engageIntro}</p>
            </Reveal>
            <ul className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-3">
              {HIRE_SHARED.engagements.map((e, i) => (
                <li key={e.name}>
                  <Reveal
                    delay={i * 0.08}
                    y={32}
                    className="h-full rounded-4xl border border-border bg-background p-8 sm:p-10"
                  >
                    <span
                      className={cn(
                        "inline-block rounded-full px-3 py-1 text-sm font-medium",
                        tone(i),
                      )}
                    >
                      0{i + 1}
                    </span>
                    <h3 className="mt-6 text-2xl font-semibold sm:text-3xl">
                      {e.name}
                    </h3>
                    <dl className="mt-6 divide-y divide-border border-t border-border">
                      {[
                        ["Best for", e.bestFor],
                        ["How we work", e.howWeWork],
                        ["Commitment", e.commitment],
                      ].map(([k, v]) => (
                        <div key={k} className="py-4">
                          <dt className="text-sm text-muted">{k}</dt>
                          <dd className="mt-1 text-lg">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </Reveal>
                </li>
              ))}
            </ul>
            <Reveal className="mx-auto mt-10 max-w-3xl text-center text-base text-muted">
              {HIRE_SHARED.engageNote}
            </Reveal>
          </Container>
        </section>

        {/* Alternatives */}
        <section className="py-20 sm:py-28">
          <Container>
            <Reveal>
              <h2 className={H2}>
                <Accent text={HIRE_SHARED.compareTitle} />
              </h2>
              <p className={LEDE}>{HIRE_SHARED.compareIntro}</p>
            </Reveal>
            <Reveal y={32} className="mx-auto mt-14 max-w-6xl">
              <div className="overflow-x-auto rounded-3xl border border-border">
                <table className="w-full min-w-3xl border-collapse text-left">
                  <thead>
                    <tr>
                      <th scope="col" className="w-1/5 p-5">
                        <span className="sr-only">Compare</span>
                      </th>
                      {HIRE_SHARED.compareColumns.map((c, i) => (
                        <th
                          key={c}
                          scope="col"
                          className={cn(
                            "p-5 text-lg font-semibold",
                            i === 0 && "bg-ink-blue text-white",
                          )}
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {HIRE_SHARED.compareRows.map((row) => (
                      <tr key={row.label} className="border-t border-border">
                        <th
                          scope="row"
                          className="p-5 align-top text-base font-semibold"
                        >
                          {row.label}
                        </th>
                        {row.values.map((v, i) => (
                          <td
                            key={i}
                            className={cn(
                              "p-5 align-top text-base",
                              i === 0
                                ? "bg-sky-1/50 font-medium text-ink-blue"
                                : "text-muted",
                            )}
                          >
                            {v}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </Container>
        </section>

        <DiwaliLights
          seed={41}
          className="-my-14 bg-linear-to-b from-background to-surface"
        />

        {/* Proof */}
        <section className="bg-surface py-20 sm:py-28">
          <Container>
            <Reveal>
              <h2 className={H2}>
                <Accent text={HIRE_SHARED.proofTitle} />
              </h2>
              <p className={LEDE}>{HIRE_SHARED.proofIntro}</p>
            </Reveal>
            <ul className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-2">
              {posts.map((post, i) => (
                <li key={post.slug}>
                  <Reveal delay={(i % 2) * 0.08} y={32} className="h-full">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex h-full flex-col justify-between rounded-4xl border border-border bg-background p-8 transition hover:-translate-y-1 hover:border-ink-blue sm:p-10"
                    >
                      <div>
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-sm font-medium",
                            tone(i),
                          )}
                        >
                          {post.tag}
                        </span>
                        <h3 className="mt-6 text-2xl leading-snug font-semibold">
                          {post.title}
                        </h3>
                        <p className="mt-3 text-base leading-relaxed text-muted">
                          {post.description}
                        </p>
                      </div>
                      <span className="mt-8 font-medium text-ink-blue">
                        Read the case study{" "}
                        <span
                          aria-hidden
                          className="inline-block transition-transform group-hover:translate-x-1"
                        >
                          →
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </section>

        {/* Key facts */}
        <section aria-label="Key facts" className="py-20 sm:py-28">
          <Container>
            <Reveal y={32}>
              <dl
                className={cn(
                  "mx-auto grid max-w-6xl overflow-hidden rounded-4xl sm:grid-cols-2 lg:grid-cols-4",
                  SKY,
                )}
              >
                {HIRE_SHARED.stats.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col-reverse p-8 text-center sm:p-10"
                  >
                    <dt className="mx-auto mt-3 max-w-56 text-base text-foreground/75">
                      {s.label}
                    </dt>
                    <dd className="text-6xl font-semibold tracking-normal text-ink-blue sm:text-7xl">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </Container>
        </section>

        {/* Stack */}
        <section className="pb-20 sm:pb-28">
          <Container>
            <Reveal>
              <h2 className={H2}>
                <Accent text={HIRE_SHARED.stackTitle} />
              </h2>
            </Reveal>
            <Reveal y={32} className="mx-auto mt-14 max-w-4xl">
              <table className="w-full border-collapse text-left">
                <thead className="sr-only">
                  <tr>
                    <th scope="col">Category</th>
                    <th scope="col">Technologies</th>
                  </tr>
                </thead>
                <tbody>
                  {service.stack.map((row, i) => (
                    <tr
                      key={row.category}
                      className="flex flex-col gap-3 border-t border-border py-5 last:border-b sm:table-row"
                    >
                      <th
                        scope="row"
                        className="text-lg font-semibold sm:w-56 sm:py-5 sm:align-top"
                      >
                        {row.category}
                      </th>
                      <td className="sm:py-5">
                        <ul className="flex flex-wrap gap-2">
                          {row.items.map((item) => (
                            <li
                              key={item}
                              className={cn(
                                "rounded-full px-3.5 py-1 text-base",
                                tone(i),
                              )}
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </Container>
        </section>

        <DiwaliLights
          seed={88}
          className="-my-14 bg-linear-to-b from-background to-surface"
        />

        {/* FAQ */}
        <section className="bg-surface py-20 sm:py-28">
          <Container>
            <Reveal>
              <h2 className={H2}>
                <Accent text={HIRE_SHARED.faqTitle} />
              </h2>
            </Reveal>
            <Reveal delay={0.1} y={32} className="mx-auto mt-14 max-w-3xl">
              <div className="space-y-3">
                {service.faqs.map((f) => (
                  <details
                    key={f.q}
                    className="group rounded-3xl bg-background px-6 py-5 sm:px-8"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold marker:content-none sm:text-xl [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <span
                        aria-hidden
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface text-xl transition group-open:rotate-45 group-open:bg-ink-blue group-open:text-white"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-lg leading-relaxed text-muted">
                      {f.a}
                    </p>
                  </details>
                ))}
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Related */}
        <nav aria-labelledby="related-title" className="py-20 sm:py-28">
          <Container>
            <Reveal>
              <h2 id="related-title" className={H2}>
                <Accent text={HIRE_SHARED.relatedTitle} />
              </h2>
            </Reveal>
            <ul className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2">
              {others.map((o, i) => (
                <li key={o.slug}>
                  <Reveal delay={i * 0.08} y={24} className="h-full">
                    <Link
                      href={`/hire/${o.slug}`}
                      className={cn(
                        "group flex h-full items-center justify-between gap-6 rounded-4xl p-8 transition hover:-translate-y-1",
                        tone(i + 3).split(" ")[0],
                      )}
                    >
                      <span>
                        <span className="block text-sm text-foreground/60">
                          Hire me as a
                        </span>
                        <span className="mt-1 block text-2xl font-semibold">
                          {o.role}
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white text-xl transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Container>
        </nav>

        {/* CTA */}
        <section className="px-5 pb-20 sm:px-10 sm:pb-28 md:px-16 lg:px-32">
          <Reveal y={40}>
            <div
              className={cn(
                "relative overflow-hidden rounded-4xl px-7 pt-16 text-center sm:px-16 sm:pt-24",
                SKY,
                !ctaArt && "pb-16 sm:pb-24",
              )}
            >
              <h2 className="mx-auto max-w-4xl text-4xl leading-none font-normal tracking-normal text-balance sm:text-6xl lg:text-7xl">
                <Accent text={service.ctaTitle} />
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-foreground/75 sm:text-xl">
                {service.ctaBody}
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <a href={CONTACT_HREF} className={PRIMARY_BTN}>
                  Start a conversation <span aria-hidden>→</span>
                </a>
                <a
                  href={LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={GHOST_BTN}
                >
                  LinkedIn
                </a>
              </div>
              {ctaArt && (
                <div className="relative mx-auto mt-10 mb-6 aspect-1376/250 w-full max-w-5xl">
                  <Image
                    src={ctaArt}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 64rem, 90vw"
                    className="object-contain"
                  />
                </div>
              )}
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicePage;
