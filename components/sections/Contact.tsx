"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import WaveDivider, { oceanHeight } from "@/components/ui/WaveDivider";
import { track } from "@/lib/analytics";

const FIELD =
  "w-full rounded-xl border border-transparent bg-studio-gray/70 px-4 py-3.5 font-slab text-base text-background outline-none transition placeholder:text-background/40 hover:bg-studio-gray focus:border-full-spectrum-blue focus:bg-white focus:ring-4 focus:ring-full-spectrum-blue/15";

const LABEL =
  "mb-2 block text-xs font-semibold tracking-wider uppercase sm:text-sm";

const Contact = () => {
  const started = useRef(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // Fires once per visit, the first time the visitor touches any field.
  const onFocus = () => {
    if (started.current) return;
    started.current = true;
    track("contact_form_start");
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error ?? "Something went wrong.");
      }
      track("contact_form_submit");
      track("generate_lead", { form: "contact" });
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  const onInvalid = (e: FormEvent<HTMLFormElement>) => {
    track("contact_form_error", { field: (e.target as HTMLInputElement).name });
  };

  return (
    <section id="contact" className="text-studio-gray">
      <WaveDivider
        variant="ocean"
        seed={4}
        className="text-studio-gray"
      />
      <div
        className="bg-studio-gray pt-12 text-background sm:pt-20 lg:flex lg:flex-col lg:min-h-[calc(100svh-var(--wave))]"
        style={{ "--wave": `${oceanHeight(4)}px` } as React.CSSProperties}
      >
        <Container className="lg:flex lg:flex-1">
          <Reveal className="grid gap-10 lg:flex-1 lg:grid-cols-5 lg:gap-16">
            <div className="flex flex-col lg:col-span-2">
              <h2 className="text-3xl font-semibold uppercase sm:text-5xl lg:text-6xl">
                Contact Me
              </h2>
              <p className="mt-4 font-slab text-sm sm:mt-6 sm:text-lg">
                Have a product to build or a team to unblock? Tell me a little
                about it and I will get back to you.
              </p>
              <Image
                src="/portrait-bw.webp"
                alt="Devdeep Ghosh"
                width={1000}
                height={1000}
                sizes="(min-width: 1024px) 36rem, 90vw"
                className="mx-auto mt-8 block w-72 sm:w-96 lg:mx-0 lg:mt-auto lg:max-w-xl"
              />
            </div>

            {sent ? (
              <div
                role="status"
                className="rounded-2xl bg-background p-6 text-foreground sm:p-10 lg:col-span-3"
              >
                <p className="text-2xl font-semibold uppercase sm:text-3xl">
                  Thanks for reaching out
                </p>
                <p className="mt-3 font-slab">I will get back to you soon.</p>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                onInvalid={onInvalid}
                onFocus={onFocus}
                className="grid content-start gap-5 rounded-3xl bg-white p-6 shadow-[0_24px_60px_-24px_rgba(5,7,13,0.25)] sm:grid-cols-2 sm:p-8 lg:col-span-3 lg:self-start"
              >
                <div>
                  <label htmlFor="contact-name" className={LABEL}>
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    required
                    autoComplete="name"
                    className={FIELD}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className={LABEL}>
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={FIELD}
                    placeholder="you@company.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="contact-message" className={LABEL}>
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    className={`${FIELD} resize-y`}
                    placeholder="What are you working on?"
                  />
                </div>
                {/* Honeypot: hidden from people, tempting to bots. */}
                <input
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  className="absolute -left-[9999px] h-0 w-0 opacity-0"
                />
                {error && (
                  <p role="alert" className="font-slab text-sm text-red-600 sm:col-span-2">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-3 justify-self-start rounded-xl bg-background px-7 py-3.5 font-slab text-sm text-foreground transition-colors hover:bg-full-spectrum-blue disabled:opacity-60 sm:col-span-2"
                >
                  {sending ? "Sending…" : "Send message"} <span aria-hidden>→</span>
                </button>
              </form>
            )}
          </Reveal>
        </Container>
      </div>
    </section>
  );
};

export default Contact;
