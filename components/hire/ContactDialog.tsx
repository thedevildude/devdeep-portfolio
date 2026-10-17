"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type OpenContact = (source: string) => void;

const ContactContext = createContext<OpenContact | null>(null);

const FIELD =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3.5 text-base text-foreground outline-none transition placeholder:text-muted/70 focus:border-ink-blue focus:bg-white focus:ring-4 focus:ring-ink-blue/15";
const LABEL = "mb-2 block text-sm font-medium";

/**
 * Wraps a hire page so any "Hire me" button can open one shared contact
 * dialog instead of sending the visitor away to the homepage form.
 * `topic` prefills the message with the page the visitor came from.
 */
export const ContactDialogProvider = ({
  topic,
  children,
}: {
  topic: string;
  children: ReactNode;
}) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const started = useRef(false);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const open = useCallback<OpenContact>((source) => {
    track("contact_dialog_open", { source });
    dialog.current?.showModal();
  }, []);

  const close = () => dialog.current?.close();

  const onFocus = () => {
    if (started.current) return;
    started.current = true;
    track("contact_form_start", { form: "hire_dialog" });
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
      track("contact_form_submit", { form: "hire_dialog" });
      track("generate_lead", { form: "hire_dialog" });
      setSent(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <ContactContext.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        aria-labelledby="contact-dialog-title"
        // Clicking the dimmed backdrop (the dialog element itself) closes it.
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto w-[min(36rem,calc(100vw-2rem))] max-w-none rounded-4xl bg-background p-0 text-foreground shadow-[0_40px_120px_-30px_rgba(5,8,17,0.45)] backdrop:bg-foreground/40 backdrop:backdrop-blur-sm open:animate-[contact-in_0.25s_ease-out]"
      >
        <div className="relative p-6 sm:p-9">
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-5 right-5 flex size-10 items-center justify-center rounded-full bg-surface text-xl transition hover:bg-border"
          >
            <span aria-hidden>×</span>
          </button>

          {sent ? (
            <div role="status" className="py-6 pr-10">
              <p id="contact-dialog-title" className="text-3xl font-normal">
                Thanks, I&apos;ll be in touch
              </p>
              <p className="mt-3 text-lg text-muted">
                You&apos;ll hear back from me within 24 hours.
              </p>
              <button
                type="button"
                onClick={close}
                className="mt-8 rounded-full bg-foreground px-7 py-3.5 font-medium text-background transition hover:bg-ink-blue"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <h2
                id="contact-dialog-title"
                className="pr-12 text-3xl font-normal sm:text-4xl"
              >
                Tell me about your project
              </h2>
              <p className="mt-3 text-base text-muted sm:text-lg">
                A few lines is enough. You&apos;ll get an honest answer on fit
                and availability within 24 hours.
              </p>
              <form
                onSubmit={onSubmit}
                onFocus={onFocus}
                className="mt-7 grid gap-5 sm:grid-cols-2"
              >
                <div>
                  <label htmlFor="hire-name" className={LABEL}>
                    Name
                  </label>
                  <input
                    id="hire-name"
                    name="name"
                    required
                    autoComplete="name"
                    className={FIELD}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="hire-email" className={LABEL}>
                    Work email
                  </label>
                  <input
                    id="hire-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className={FIELD}
                    placeholder="you@company.com"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="hire-message" className={LABEL}>
                    What are you building?
                  </label>
                  <textarea
                    id="hire-message"
                    name="message"
                    required
                    rows={5}
                    defaultValue={`Hi Devdeep, I'm interested in hiring you as a ${topic}.\n\n`}
                    className={cn(FIELD, "resize-y")}
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
                  <p role="alert" className="text-sm text-plum sm:col-span-2">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-foreground px-8 py-4 text-base font-medium text-background transition hover:bg-ink-blue disabled:opacity-60 sm:col-span-2 sm:justify-self-start"
                >
                  {sending ? "Sending…" : "Send message"}{" "}
                  <span aria-hidden>→</span>
                </button>
              </form>
            </>
          )}
        </div>
      </dialog>
    </ContactContext.Provider>
  );
};

/** A button that opens the page's contact dialog. */
export const ContactButton = ({
  source,
  className,
  children,
}: {
  /** Where on the page it was clicked, for analytics (e.g. "hero"). */
  source: string;
  className?: string;
  children: ReactNode;
}) => {
  const open = useContext(ContactContext);
  return (
    <button type="button" onClick={() => open?.(source)} className={className}>
      {children}
    </button>
  );
};
