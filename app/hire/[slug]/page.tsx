import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import Container from "@/components/ui/Container";
import JsonLd from "@/components/ui/JsonLd";
import Reveal from "@/components/ui/Reveal";
import { CONTACT, SITE } from "@/lib/constants";
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

const H2 = "text-xs uppercase tracking-widest text-muted sm:text-sm";

const ServicePage = async ({ params }: PageProps<"/hire/[slug]">) => {
  const service = getService((await params).slug);
  if (!service) notFound();

  const url = `${SITE.url}/hire/${service.slug}`;
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <>
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
              provider: { "@type": "Person", name: "Devdeep Ghosh", url: SITE.url },
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
                { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
                { "@type": "ListItem", position: 2, name: service.h1, item: url },
              ],
            },
          ],
        }}
      />
      <Header />
      <main className="flex-1 pt-32 pb-20 sm:pt-44 sm:pb-28">
        <Container>
          <div className="mx-auto max-w-4xl">
            <Reveal y={24}>
              <h1 className="text-4xl leading-tight font-semibold uppercase sm:text-6xl">
                {service.h1}
              </h1>
              <p className="mt-6 font-slab text-lg text-muted sm:text-2xl">
                {service.intro}
              </p>
              <a
                href={CONTACT.contactUs}
                className="mt-8 inline-block rounded-full bg-foreground px-6 py-3 text-sm font-semibold uppercase text-background sm:text-base"
              >
                Get in touch
              </a>
            </Reveal>

            <section className="mt-16 sm:mt-24">
              <h2 className={H2}>Why work with me</h2>
              <div className="mt-8 grid gap-10 sm:grid-cols-2">
                {service.why.map((w) => (
                  <div key={w.title}>
                    <h3 className="text-xl font-semibold uppercase">{w.title}</h3>
                    <p className="mt-3 font-slab text-base text-muted sm:text-lg">
                      {w.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-16 sm:mt-24">
              <h2 className={H2}>What I can build for you</h2>
              <ul className="mt-8 divide-y divide-border border-y border-border">
                {service.scope.map((item) => (
                  <li key={item} className="py-4 font-slab text-base sm:text-xl">
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="mt-16 sm:mt-24">
              <h2 className={H2}>How it works</h2>
              <ol className="mt-8 grid gap-10 sm:grid-cols-3">
                {service.steps.map((s, i) => (
                  <li key={s.title}>
                    <span className="text-sm text-muted">0{i + 1}</span>
                    <h3 className="mt-2 text-xl font-semibold uppercase">
                      {s.title}
                    </h3>
                    <p className="mt-3 font-slab text-base text-muted">{s.body}</p>
                  </li>
                ))}
              </ol>
            </section>

            <section className="mt-16 sm:mt-24">
              <h2 className={H2}>Frequently asked questions</h2>
              <dl className="mt-8 divide-y divide-border border-y border-border">
                {service.faqs.map((f) => (
                  <div key={f.q} className="py-6">
                    <dt className="text-lg font-semibold sm:text-2xl">{f.q}</dt>
                    <dd className="mt-3 font-slab text-base text-muted sm:text-lg">
                      {f.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section className="mt-16 sm:mt-24">
              <h2 className={H2}>Also see</h2>
              <ul className="mt-6 space-y-3">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/hire/${o.slug}`}
                      className="text-xl font-semibold uppercase hover:text-accent"
                    >
                      {o.h1} →
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/blog"
                    className="text-xl font-semibold uppercase hover:text-accent"
                  >
                    Read my case studies →
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default ServicePage;
