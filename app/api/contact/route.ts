import { CONTACT } from "@/lib/constants";

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const bad = (error: string, status = 400) =>
  Response.json({ ok: false, error }, { status });

export async function POST(request: Request) {
  const apiKey = process.env.NEXT_RESEND_API_KEY;
  if (!apiKey || !CONTACT.email) return bad("Contact form is not configured.", 500);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad("Invalid request.");
  }

  // Honeypot: real visitors never see or fill this field. Pretend success to bots.
  if (typeof body.website === "string" && body.website) {
    return Response.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) return bad("Please fill in every field.");
  if (name.length > 100 || email.length > 200 || message.length > 5000) {
    return bad("One of the fields is too long.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Invalid email address.");

  const res = await fetch("https://api.resend.com/emails", {
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
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return bad("Could not send your message. Please try again.", 502);
  }

  return Response.json({ ok: true });
}
