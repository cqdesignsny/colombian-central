import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { FROM, NOTIFY_TO, getResend } from "@/lib/resend";
import { inquiryCustomerEmail, inquiryOwnerEmail, type InquiryEmailInput } from "@/lib/emails";
import { isHoneypotTripped, rateLimit, tooManyRequests } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad payload" }, { status: 400 });
  }

  if (isHoneypotTripped(body.website)) {
    return NextResponse.json({ ok: true, inquiryId: 0 });
  }
  if (!(await rateLimit(req, "inquiry", { limit: 10, windowMinutes: 10 }))) {
    return tooManyRequests();
  }

  const field = (key: string, max: number) =>
    typeof body[key] === "string" ? (body[key] as string).trim().slice(0, max) : "";

  const name = field("name", 120);
  const email = field("email", 200).toLowerCase();
  const trip = field("trip", 200);
  const travelers = field("travelers", 40);
  const dates = field("dates", 200);
  const notes = field("notes", 2000);

  if (!name || !EMAIL_RE.test(email) || !trip) {
    return NextResponse.json({ ok: false, error: "Name, email and trip are required" }, { status: 400 });
  }

  const db = getDb();
  const rows = (await db`
    INSERT INTO trip_inquiries (name, email, trip, travelers, dates, notes)
    VALUES (${name}, ${email}, ${trip}, ${travelers}, ${dates}, ${notes})
    RETURNING id
  `) as Array<{ id: number }>;
  const id = rows[0].id;

  const inquiry: InquiryEmailInput = { id, name, email, trip, travelers, dates, notes };
  const resend = getResend();

  const owner = inquiryOwnerEmail(inquiry);
  const { error: ownerErr } = await resend.emails.send(
    {
      from: FROM.hola,
      to: [NOTIFY_TO],
      replyTo: email,
      subject: owner.subject,
      html: owner.html,
      text: owner.text,
    },
    { idempotencyKey: `inquiry-notify/${id}` },
  );
  if (ownerErr) console.error("[inquiry] owner notify failed:", ownerErr.message);

  const customer = inquiryCustomerEmail(inquiry);
  const { error: custErr } = await resend.emails.send(
    {
      from: FROM.hola,
      to: [email],
      replyTo: NOTIFY_TO,
      subject: customer.subject,
      html: customer.html,
      text: customer.text,
    },
    { idempotencyKey: `inquiry-confirm/${id}` },
  );
  if (custErr) console.error("[inquiry] customer confirm failed:", custErr.message);

  return NextResponse.json({ ok: true, inquiryId: id });
}
