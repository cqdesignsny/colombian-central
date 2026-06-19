import { NextResponse } from "next/server";
import { getResend, FROM, NOTIFY_TO } from "@/lib/resend";
import { inboundEmailLooksLikeSpam } from "@/lib/antispam";

export const runtime = "nodejs";

/**
 * Inbound email forwarding. Resend receives mail sent to any address at
 * colombiancentral.com (root MX -> Resend Inbound, with "Receiving" enabled on
 * the domain) and POSTs an `email.received` webhook here. We verify the
 * signature, fetch the full message, and forward it to the business inbox
 * (NOTIFY_TO = cesar@creativequalitymarketing.com), with reply-to set to the
 * original sender so a reply goes straight back to them.
 *
 * Webhook bodies carry only metadata, so the body/attachments are fetched via
 * the receiving API. Fails closed if the signing secret is not configured.
 */
type ReceivedEvent = {
  type?: string;
  data?: {
    email_id?: string;
    from?: string;
    to?: string[];
    subject?: string;
  };
};

export async function POST(req: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[inbound] RESEND_WEBHOOK_SECRET not set");
    return new NextResponse("not configured", { status: 503 });
  }

  // Raw body is required for signature verification.
  const payload = await req.text();
  const headers = {
    id: req.headers.get("svix-id") ?? "",
    timestamp: req.headers.get("svix-timestamp") ?? "",
    signature: req.headers.get("svix-signature") ?? "",
  };
  if (!headers.id || !headers.timestamp || !headers.signature) {
    return new NextResponse("missing signature headers", { status: 400 });
  }

  const resend = getResend();

  let event: ReceivedEvent;
  try {
    event = resend.webhooks.verify({
      payload,
      headers,
      webhookSecret: secret,
    }) as ReceivedEvent;
  } catch (err) {
    console.error("[inbound] signature verify failed:", err);
    return new NextResponse("invalid signature", { status: 400 });
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ ok: true, skipped: event.type ?? "unknown" });
  }

  const emailId = event.data?.email_id;
  if (!emailId) {
    return NextResponse.json({ ok: true, skipped: "no email_id" });
  }

  try {
    const received = (await resend.emails.receiving.get(emailId)) as {
      data?: {
        from?: string;
        to?: string[];
        subject?: string;
        html?: string | null;
        text?: string | null;
      } | null;
      error?: { message?: string } | null;
    };
    if (received.error || !received.data) {
      throw new Error(received.error?.message ?? "could not fetch email");
    }
    const email = received.data;

    const from = email.from ?? event.data?.from ?? "unknown sender";
    const to = (email.to ?? event.data?.to ?? []).join(", ");
    const subject = email.subject ?? event.data?.subject ?? "(no subject)";
    const intro = `Forwarded from Colombian Central inbound.\nTo: ${to}\nFrom: ${from}\n\n`;

    // Don't forward obvious solicitation/spam (still stored in Resend's inbox).
    // HTML-only mail has text === null, so fall back to stripped HTML.
    const scanText =
      email.text ?? (email.html ? email.html.replace(/<[^>]+>/g, " ") : "");
    if (inboundEmailLooksLikeSpam(subject, scanText)) {
      return NextResponse.json({ ok: true, skipped: "spam" });
    }

    const { error: sendError } = await resend.emails.send({
      from: FROM.hola,
      to: [NOTIFY_TO],
      replyTo: from,
      subject: `[CC ${to || "inbound"}] ${subject}`,
      ...(email.html
        ? { html: email.html, text: email.text ?? undefined }
        : { text: intro + (email.text ?? "(no body)") }),
    });
    if (sendError) throw new Error(sendError.message);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[inbound] forward failed:", err);
    return new NextResponse("forward failed", { status: 502 });
  }
}
