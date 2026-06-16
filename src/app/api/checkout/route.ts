import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { priceCart, insertOrder, sendOrderEmails } from "@/lib/orders";
import type { OrderEmailInput } from "@/lib/emails";
import { isHoneypotTripped, rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { site } from "@/config/site";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  name?: unknown;
  email?: unknown;
  address?: unknown;
  items?: unknown;
  website?: unknown;
};

function siteUrl() {
  return process.env.SITE_URL || site.url;
}

/**
 * Checkout. When Stripe is configured, creates a pending order and a Stripe
 * Checkout Session and returns its URL for redirect. When it is not (pre-launch),
 * falls back to the email-order flow so the store still works. Either way prices
 * come from the catalog, never the client.
 */
export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad payload" }, { status: 400 });
  }

  if (isHoneypotTripped(body.website)) {
    return NextResponse.json({ ok: true, orderId: 0 });
  }
  if (!(await rateLimit(req, "order", { limit: 10, windowMinutes: 10 }))) {
    return tooManyRequests();
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const address = typeof body.address === "string" ? body.address.trim().slice(0, 600) : "";
  if (!name || !EMAIL_RE.test(email) || !address) {
    return NextResponse.json(
      { ok: false, error: "Name, email and address are required" },
      { status: 400 },
    );
  }

  const priced = priceCart(body.items);
  if (!priced) {
    return NextResponse.json({ ok: false, error: "Invalid cart" }, { status: 400 });
  }

  // Pre-launch fallback: no Stripe key, so confirm by email like before.
  if (!isStripeConfigured()) {
    const id = await insertOrder({ name, email, address, items: priced.items, subtotal: priced.subtotal });
    const order: OrderEmailInput = { id, name, email, address, items: priced.items, subtotal: priced.subtotal };
    await sendOrderEmails(order);
    return NextResponse.json({ ok: true, fallback: true, orderId: id });
  }

  // Stripe live: pending order, then a Checkout Session that points back to it.
  const id = await insertOrder({
    name,
    email,
    address,
    items: priced.items,
    subtotal: priced.subtotal,
    paymentStatus: "unpaid",
  });

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create(
    {
      mode: "payment",
      line_items: priced.items.map((i) => ({
        quantity: i.qty,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(i.price * 100),
          product_data: { name: i.name },
        },
      })),
      customer_email: email,
      metadata: { order_id: String(id) },
      payment_intent_data: { metadata: { order_id: String(id) } },
      success_url: `${siteUrl()}/gracias?order=${id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/tienda?canceled=1`,
    },
    { idempotencyKey: `checkout-session/${id}` },
  );

  // Record the session id for reconciliation and webhook matching.
  const db = getDb();
  await db`UPDATE orders SET stripe_session_id = ${session.id} WHERE id = ${id}`;

  return NextResponse.json({ ok: true, url: session.url });
}
