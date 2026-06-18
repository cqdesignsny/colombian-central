import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { FROM, getResend, siteUrl } from "@/lib/resend";
import { abandonedCartEmail, type OrderEmailInput } from "@/lib/emails";

export const runtime = "nodejs";

/**
 * Abandoned-cart recovery. Vercel Cron hits this hourly. An "abandoned cart" is
 * an order that never reached payment_status='paid'. We send up to three nudges
 * (~1h / ~24h / ~72h), no discounts, then stop. reminder_stage tracks progress
 * so each stage fires once; the idempotency key is a second guard. Carts older
 * than 7 days are left alone. Vercel adds the CRON_SECRET as a bearer token.
 */
export async function GET(req: Request) {
  // Fail closed: a missing secret must not open the endpoint to anyone.
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const db = getDb();
  const rows = (await db`
    SELECT id, email, items, subtotal_cents, reminder_stage
    FROM orders
    WHERE payment_status = 'unpaid'
      AND email IS NOT NULL
      AND created_at > now() - interval '7 days'
      AND (
        (reminder_stage = 0 AND created_at < now() - interval '1 hour') OR
        (reminder_stage = 1 AND reminder_last_at < now() - interval '23 hours') OR
        (reminder_stage = 2 AND reminder_last_at < now() - interval '48 hours')
      )
    ORDER BY id ASC
    LIMIT 50
  `) as Array<{
    id: number;
    email: string;
    items: OrderEmailInput["items"];
    subtotal_cents: number;
    reminder_stage: number;
  }>;

  const resend = getResend();
  let sent = 0;

  for (const o of rows) {
    // Re-check payment in case a Stripe webhook marked it paid since the SELECT.
    const fresh = (await db`
      SELECT payment_status FROM orders WHERE id = ${o.id}
    `) as Array<{ payment_status: string }>;
    if (fresh[0]?.payment_status !== "unpaid") continue;

    const stage = (o.reminder_stage + 1) as 1 | 2 | 3;
    const mail = abandonedCartEmail({
      id: o.id,
      email: o.email,
      items: o.items,
      subtotal: o.subtotal_cents / 100,
      stage,
      recoverUrl: `${siteUrl()}/tienda`,
    });

    const { error } = await resend.emails.send(
      {
        from: FROM.hola,
        to: [o.email],
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      },
      { idempotencyKey: `cart-reminder/${o.id}/${stage}` },
    );

    if (error) {
      console.error("[cron/abandoned] send failed for order", o.id, error.message);
      continue;
    }
    await db`UPDATE orders SET reminder_stage = ${stage}, reminder_last_at = now() WHERE id = ${o.id}`;
    sent++;
  }

  return NextResponse.json({ ok: true, eligible: rows.length, sent });
}
