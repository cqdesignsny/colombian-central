import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { FROM, NOTIFY_TO, SEGMENT_ID, getResend, resendApi } from "@/lib/resend";
import { welcomeEmail } from "@/lib/emails";
import { isHoneypotTripped, rateLimit, tooManyRequests } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: unknown; website?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad payload" }, { status: 400 });
  }

  // Honeypot: pretend success so bots don't learn they were caught.
  if (isHoneypotTripped(body.website)) {
    return NextResponse.json({ ok: true, already: true });
  }

  const email = body.email;
  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }
  const addr = email.trim().toLowerCase();

  if (!(await rateLimit(req, "newsletter", { limit: 5, windowMinutes: 10 }))) {
    return tooManyRequests();
  }

  const db = getDb();
  const rows = (await db`
    INSERT INTO subscribers (email, source) VALUES (${addr}, 'site')
    ON CONFLICT (email)
    DO UPDATE SET status = 'active', unsubscribed_at = NULL
    RETURNING (xmax = 0) AS is_new
  `) as Array<{ is_new: boolean }>;
  const isNew = rows[0]?.is_new === true;

  // Sync to Resend contacts + El Boletín segment. Best effort: the DB row is
  // the source of truth, so a Resend hiccup must not fail the signup.
  try {
    await resendApi("/contacts", {
      method: "POST",
      body: {
        email: addr,
        unsubscribed: false,
        ...(SEGMENT_ID ? { segments: [{ id: SEGMENT_ID }] } : {}),
      },
    });
  } catch (err) {
    console.error("[newsletter] Resend contact sync failed:", err);
  }

  if (isNew) {
    const { subject, html, text } = welcomeEmail(addr);
    const { error } = await getResend().emails.send(
      {
        from: FROM.boletin,
        to: [addr],
        replyTo: NOTIFY_TO,
        subject,
        html,
        text,
      },
      { idempotencyKey: `welcome-email/${addr}` },
    );
    if (error) console.error("[newsletter] welcome send failed:", error.message);
  }

  return NextResponse.json({ ok: true, already: !isNew });
}
