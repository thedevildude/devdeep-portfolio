import Accent from "@/components/hire/Accent";
import HireIcon from "@/components/hire/HireIcon";
import { H2, LEDE, tone, toneBg, toneText } from "@/components/hire/styles";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import type { HireLayout, Service } from "@/lib/services";
import { cn } from "@/lib/utils";

/** "What I do": the eight duties, in one of three layouts. */
export const DutiesSection = ({
  service,
  variant = "grid",
}: {
  service: Service;
  variant?: HireLayout["duties"];
}) => (
  <section className="bg-surface py-20 sm:py-28">
    <Container>
      <Reveal>
        <h2 className={H2}>
          <Accent text={service.roleTitle} />
        </h2>
        <p className={LEDE}>{service.roleIntro}</p>
      </Reveal>

      {variant === "grid" && (
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
      )}

      {variant === "list" && (
        <ul className="mx-auto mt-14 grid max-w-5xl gap-x-12 md:grid-cols-2">
          {service.duties.map((d, i) => (
            <li key={d.title}>
              <Reveal
                delay={(i % 2) * 0.06}
                y={20}
                className="flex gap-5 border-b border-border py-6"
              >
                <span
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-full",
                    tone(i),
                  )}
                >
                  <HireIcon name={d.icon} className="size-5.5" />
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{d.title}</h3>
                  <p className="mt-1.5 text-base leading-relaxed text-muted">
                    {d.body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      )}

      {variant === "bento" && (
        <ul className="mx-auto mt-14 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {service.duties.map((d, i) => (
            <li
              key={d.title}
              // A 2×2 lead tile plus one wide tile fill three rows of four exactly (8 items, 12 cells).
              className={cn(
                i === 0 && "lg:col-span-2 lg:row-span-2",
                i === 7 && "lg:col-span-2",
              )}
            >
              <Reveal
                delay={(i % 4) * 0.06}
                y={24}
                className={cn(
                  "flex h-full flex-col justify-between gap-10 rounded-4xl p-7",
                  i === 0 && "lg:p-10",
                  i === 0 ? "bg-ink-blue text-white" : "bg-background",
                )}
              >
                <span
                  className={cn(
                    "flex size-12 items-center justify-center rounded-2xl",
                    i === 0 ? "bg-white/15 text-white" : tone(i),
                  )}
                >
                  <HireIcon name={d.icon} className="size-6" />
                </span>
                <div>
                  <h3
                    className={cn(
                      "font-semibold",
                      i === 0 ? "text-3xl lg:text-4xl" : "text-xl",
                    )}
                  >
                    {d.title}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 text-base leading-relaxed",
                      i === 0 ? "text-white/80 sm:text-lg" : "text-muted",
                    )}
                  >
                    {d.body}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </Container>
  </section>
);

/** "Why hire in India, and why me": three reasons, in one of three layouts. */
export const WhySection = ({
  service,
  variant = "cards",
}: {
  service: Service;
  variant?: HireLayout["why"];
}) => {
  if (variant === "split") {
    return (
      <section className="py-20 sm:py-28">
        <Container>
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
            <Reveal className="lg:sticky lg:top-32 lg:self-start">
              <h2 className="text-4xl leading-[1.05] font-normal tracking-normal text-balance sm:text-5xl">
                <Accent text={service.whyTitle} />
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-pretty text-muted sm:text-xl">
                {service.whyIntro}
              </p>
            </Reveal>
            <ul className="space-y-4">
              {service.why.map((w, i) => (
                <li key={w.title}>
                  <Reveal
                    delay={i * 0.08}
                    y={24}
                    className="flex gap-6 rounded-4xl border border-border p-7 sm:p-9"
                  >
                    <span
                      className={cn(
                        "flex size-13 shrink-0 items-center justify-center rounded-2xl",
                        tone(i),
                      )}
                    >
                      <HireIcon name={w.icon} className="size-6" />
                    </span>
                    <div>
                      <h3 className="text-2xl font-semibold">{w.title}</h3>
                      <p className="mt-2 text-lg leading-relaxed text-muted">
                        {w.body}
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <h2 className={H2}>
            <Accent text={service.whyTitle} />
          </h2>
          <p className={LEDE}>{service.whyIntro}</p>
        </Reveal>

        {variant === "numbered" ? (
          <ol className="mx-auto mt-14 max-w-5xl divide-y divide-border border-y border-border">
            {service.why.map((w, i) => (
              <li key={w.title}>
                <Reveal
                  delay={i * 0.08}
                  y={20}
                  className="grid gap-4 py-9 sm:grid-cols-[8rem_1fr] sm:gap-10"
                >
                  <span
                    className={cn(
                      "text-6xl leading-none font-semibold tracking-normal sm:text-7xl",
                      toneText(i),
                    )}
                  >
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-2xl font-semibold sm:text-3xl">
                      {w.title}
                    </h3>
                    <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
                      {w.body}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        ) : (
          <ul className="mx-auto mt-14 grid max-w-6xl gap-5 md:grid-cols-3">
            {service.why.map((w, i) => (
              <li key={w.title}>
                <Reveal
                  delay={i * 0.08}
                  y={32}
                  className={cn(
                    "flex h-full flex-col rounded-4xl p-8 sm:p-10",
                    toneBg(i),
                  )}
                >
                  <span
                    className={cn(
                      "flex size-13 items-center justify-center rounded-2xl bg-white",
                      toneText(i),
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
        )}
      </Container>
    </section>
  );
};

/** "How hiring me works": the five steps, as a row or a vertical timeline. */
export const ProcessSection = ({
  service,
  title,
  intro,
  variant = "row",
}: {
  service: Service;
  title: string;
  intro: string;
  variant?: HireLayout["process"];
}) => (
  <section className="py-20 sm:py-28">
    <Container>
      <Reveal>
        <h2 className={H2}>
          <Accent text={title} />
        </h2>
        <p className={LEDE}>{intro}</p>
      </Reveal>

      {variant === "timeline" ? (
        <ol className="relative mx-auto mt-14 max-w-3xl">
          <div
            aria-hidden
            className="absolute top-2 bottom-2 left-7 w-px bg-border"
          />
          {service.steps.map((s, i) => (
            <li key={s.title} className="relative pb-10 pl-24 last:pb-0">
              <Reveal delay={i * 0.06} y={20}>
                <span
                  className={cn(
                    "absolute top-0 left-0 flex size-14 items-center justify-center rounded-full text-2xl font-semibold ring-8 ring-background",
                    tone(i),
                  )}
                >
                  {i + 1}
                </span>
                <h3 className="pt-3 text-2xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-lg leading-relaxed text-muted">
                  {s.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      ) : (
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
      )}
    </Container>
  </section>
);
