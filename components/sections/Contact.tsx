"use client";

import { useRef, useState, type FormEvent } from "react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import WaveDivider, { oceanHeight } from "@/components/ui/WaveDivider";
import { track } from "@/lib/analytics";

const FIELD =
  "w-full rounded-md border border-background/25 bg-transparent px-4 py-3 font-slab text-base text-background outline-none transition-colors placeholder:text-background/50 focus:border-background";

const LABEL = "mb-2 block text-xs font-semibold uppercase sm:text-sm";

const Contact = () => {
  const started = useRef(false);
  const [sent, setSent] = useState(false);

  // Fires once per visit, the first time the visitor touches any field.
  const onFocus = () => {
    if (started.current) return;
    started.current = true;
    track("contact_form_start");
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: decide what happens with the message (email service, API route, ...).
    track("contact_form_submit");
    track("generate_lead", { form: "contact" });
    setSent(true);
  };

  const onInvalid = (e: FormEvent<HTMLFormElement>) => {
    track("contact_form_error", { field: (e.target as HTMLInputElement).name });
  };

  return (
    <section id="contact" className="text-petal-frost">
      <WaveDivider
        variant="ocean"
        seed={4}
        className="text-petal-frost bg-full-spectrum-blue"
      />
      <div
        className="bg-petal-frost py-12 text-background sm:py-20 lg:min-h-[calc(100svh-var(--wave))]"
        style={{ "--wave": `${oceanHeight(4)}px` } as React.CSSProperties}
      >
        <Container>
          <Reveal className="grid gap-10 lg:grid-cols-5 lg:gap-16">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-semibold uppercase sm:text-5xl lg:text-6xl">
                Contact Me
              </h2>
              <p className="mt-4 font-slab text-sm sm:mt-6 sm:text-lg">
                Have a product to build or a team to unblock? Tell me a little
                about it and I will get back to you.
              </p>
            </div>

            {sent ? (
              <div
                role="status"
                className="rounded-2xl bg-foreground p-6 text-background sm:p-10 lg:col-span-3"
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
                className="grid gap-5 sm:grid-cols-2 lg:col-span-3"
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
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 justify-self-start rounded-md bg-foreground px-6 py-3 font-slab text-sm text-background transition-opacity hover:opacity-85 sm:col-span-2"
                >
                  Send message <span aria-hidden>→</span>
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
