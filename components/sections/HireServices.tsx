import Link from "next/link";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { CONTACT } from "@/lib/constants";
import { SERVICES } from "@/lib/services";

const HireServices = () => (
  <section id="hire" className="py-20 sm:py-32">
    <Container>
      <Reveal>
        <p className="text-xs font-semibold tracking-widest text-accent uppercase sm:text-sm">
          Work with me
        </p>
        <h2 className="mt-4 max-w-4xl text-3xl font-semibold uppercase sm:text-5xl lg:text-6xl">
          Hire a senior software engineer in India
        </h2>
        <p className="mt-6 max-w-3xl font-slab text-base text-muted sm:text-xl">
          I&apos;m a senior full stack software engineer based in India,
          available for remote contract and full-time work. I build production
          React, Next.js and TypeScript applications, AI-powered products and
          Blockchain systems for startups and engineering teams, and I work
          directly with you, with no agency in between.
        </p>
      </Reveal>

      <ul className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-3">
        {SERVICES.slice(0, 3).map((service, i) => (
          <li key={service.slug}>
            <Reveal delay={i * 0.08} y={32} className="h-full">
              <Link
                href={`/hire/${service.slug}`}
                className="group flex h-full flex-col justify-between gap-8 rounded-3xl border border-border bg-surface p-7 transition hover:-translate-y-1 hover:border-accent sm:p-9"
              >
                <div>
                  <span className="text-sm text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-xl font-semibold uppercase sm:text-2xl">
                    {service.h1}
                  </h3>
                  <p className="mt-3 font-slab text-sm text-muted sm:text-base">
                    {service.description}
                  </p>
                </div>
                <span className="text-sm uppercase text-accent">
                  Learn more{" "}
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

      {/* The rest of the hire pages, as plain links: good for visitors and for crawlers. */}
      <Reveal className="mt-8">
        <ul className="flex flex-wrap gap-2">
          {SERVICES.slice(3).map((service) => (
            <li key={service.slug}>
              <Link
                href={`/hire/${service.slug}`}
                className="inline-block rounded-full border border-border px-4 py-2 text-sm transition hover:border-accent hover:text-accent"
              >
                {service.role}
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="mt-10 sm:mt-14">
        <a
          href={CONTACT.contactUs}
          className="inline-flex items-center gap-3 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold uppercase text-accent-foreground transition hover:brightness-110 sm:text-base"
        >
          Get in touch <span aria-hidden>→</span>
        </a>
      </Reveal>
    </Container>
  </section>
);

export default HireServices;
