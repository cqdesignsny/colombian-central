import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { priceCart, insertOrder } from "@/lib/orders";
import { isHoneypotTripped, rateLimit, tooManyRequests } from "@/lib/rate-limit";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { siteUrl } from "@/lib/resend";
import { products } from "@/data/products";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  email?: unknown;
  items?: unknown;
  website?: unknown;
};

/**
 * Checkout. We capture only the email here (so abandoned carts are recoverable);
 * Stripe Checkout collects the name, shipping address and phone with autofill and
 * wallets. Line items carry product images so the Stripe page looks like ours.
 * Prices always come from the catalog, never the client.
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

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "A valid email is required" }, { status: 400 });
  }

  const priced = priceCart(body.items);
  if (!priced) {
    return NextResponse.json({ ok: false, error: "Invalid cart" }, { status: 400 });
  }

  // Subscription products (the mystery box) bill monthly via Stripe subscription
  // mode. Stripe can't cleanly mix one-time and recurring in one session, so a
  // mixed cart is rejected UP FRONT, before any order row is created.
  const rawList = (body.items as Array<{ slug?: unknown; qty?: unknown }>) ?? [];
  const inCart = rawList
    .map((r) => products.find((p) => p.slug === r.slug))
    .filter((p): p is (typeof products)[number] => Boolean(p));
  const anyRecurring = inCart.some((p) => p.recurring);
  const allRecurring = inCart.length > 0 && inCart.every((p) => p.recurring);
  if (anyRecurring && !allRecurring) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Las suscripciones se pagan por separado. Deja solo la suscripción en el carrito y vuelve a intentar.",
      },
      { status: 400 },
    );
  }
  const subscription = allRecurring;

  // Dormant fallback: no Stripe key, so just save the cart as a recoverable lead.
  if (!isStripeConfigured()) {
    const id = await insertOrder({ email, items: priced.items, subtotal: priced.subtotal });
    return NextResponse.json({ ok: true, fallback: true, orderId: id });
  }

  const id = await insertOrder({
    email,
    items: priced.items,
    subtotal: priced.subtotal,
    paymentStatus: "unpaid",
  });

  // Build line items from the catalog with absolute image URLs for Checkout.
  const lineItems = rawList.map((r) => {
    const product = products.find((p) => p.slug === r.slug)!;
    const images = product.image ? [`${siteUrl()}${product.image}`] : undefined;
    return {
      quantity: Number(r.qty),
      price_data: {
        currency: "usd",
        unit_amount: Math.round(product.price * 100),
        ...(product.recurring ? { recurring: { interval: product.recurring } } : {}),
        product_data: { name: product.name, ...(images ? { images } : {}) },
      },
    };
  });

  const orderLabel = priced.items.map((i) => `${i.qty}x ${i.name}`).join(", ");
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create(
    {
      mode: subscription ? "subscription" : "payment",
      line_items: lineItems,
      customer_email: email,
      shipping_address_collection: { allowed_countries: ["US"] },
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      metadata: { order_id: String(id) },
      ...(subscription
        ? {
            subscription_data: {
              description: `Suscripción #${id}: ${orderLabel}`,
              metadata: { order_id: String(id) },
            },
          }
        : {
            payment_intent_data: {
              description: `Pedido #${id}: ${orderLabel}`,
              metadata: { order_id: String(id) },
            },
          }),
      success_url: `${siteUrl()}/gracias?order=${id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl()}/tienda?canceled=1`,
    },
    { idempotencyKey: `checkout-session/${id}` },
  );

  const db = getDb();
  await db`UPDATE orders SET stripe_session_id = ${session.id} WHERE id = ${id}`;

  return NextResponse.json({ ok: true, url: session.url });
}
