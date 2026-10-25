import { CONTACT, SITE } from "@/lib/constants";
import { clientKey, rateLimit } from "@/lib/rateLimit";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const bad = (error: string, status = 400, headers?: HeadersInit) =>
  Response.json({ ok: false, error }, { status, headers });

/** Single-line text: control characters (including CR and LF) become spaces. */
const oneLine = (s: string) => s.replace(/[\u0000-\u001f\u007f\u2028\u2029]+/g, " ").trim();

// A conventional, deliberately strict address: one mailbox, no quotes, commas or angle brackets.
const EMAIL_RE =
  /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

const MAX_BODY_BYTES = 20_000; // fields allow ~5.4KB of text; JSON escaping needs some room

/**
 * Browsers send Origin on cross-site POSTs. Accept it only when it is the host this request was
 * made to (so previews and other domains keep working) or the site's canonical address.
 */
const originAllowed = (request: Request) => {
  const origin = request.headers.get("origin");
  if (!origin) return true; // not a browser form post; the rate limits cover scripts
  let host: string;
  try {
    host = new URL(origin).host;
  } catch {
    return false;
  }
  const requested = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const canonical = new URL(SITE.url).hostname;
  return host === requested || host === canonical || host === canonical.replace(/^www\./, "");
};

export async function POST(request: Request) {
  const apiKey = process.env.NEXT_RESEND_API_KEY;
  if (!apiKey || !CONTACT.email) return bad("Contact form is not configured.", 500);

  if (!originAllowed(request)) return bad("Forbidden.", 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return bad("Unsupported content type.", 415);
  }

  // Per visitor, then overall: the second cap holds even if callers are made to look different.
  const mine = rateLimit(`contact:${clientKey(request)}`, 3, 10 * 60_000);
  const everyone = rateLimit("contact:all", 30, 60 * 60_000);
  const limited = !mine.ok ? mine : !everyone.ok ? everyone : null;
  if (limited && !limited.ok) {
    return bad("Too many messages. Please try again later.", 429, {
      "Retry-After": String(limited.retryAfter),
    });
  }

  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) return bad("Message too large.", 413);
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return bad("Message too large.", 413);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return bad("Invalid request.");
    body = parsed as Record<string, unknown>;
  } catch {
    return bad("Invalid request.");
  }

  // Honeypot: real visitors never see or fill this field. Pretend success to bots.
  if (typeof body.website === "string" && body.website) {
    return Response.json({ ok: true });
  }

  const name = typeof body.name === "string" ? oneLine(body.name) : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) return bad("Please fill in every field.");
  if (name.length > 100 || email.length > 200 || message.length > 5000) {
    return bad("One of the fields is too long.");
  }
  if (!EMAIL_RE.test(email)) return bad("Invalid email address.");

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Without a verified domain, Resend only allows this sender and only
        // delivers to the email address that owns the Resend account.
        from: "Portfolio <onboarding@resend.dev>",
        to: [CONTACT.email],
        reply_to: email,
        subject: `New message from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.error("Resend request failed", error instanceof Error ? error.name : error);
    return bad("Could not send your message. Please try again.", 502);
  }

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return bad("Could not send your message. Please try again.", 502);
  }

  return Response.json({ ok: true });
}
