import { getDb } from "@/lib/db";
import { FROM, NOTIFY_TO, getResend } from "@/lib/resend";
import { orderCustomerEmail, orderOwnerEmail, type OrderEmailInput } from "@/lib/emails";
import { products } from "@/data/products";

/**
 * Shared order logic for the email-order route, the Stripe checkout route, and
 * the payment webhook. Prices always come from our catalog, never the client.
 */

export type PricedCart = { items: OrderEmailInput["items"]; subtotal: number };

/** Validate raw [{ slug, qty }] against the catalog and price it server-side. Null if anything is off. */
export function priceCart(rawItems: unknown): PricedCart | null {
  const list = Array.isArray(rawItems) ? rawItems : [];
  if (list.length === 0 || list.length > 50) return null;

  const items: OrderEmailInput["items"] = [];
  for (const raw of list) {
    const slug =
      typeof (raw as { slug?: unknown }).slug === "string" ? (raw as { slug: string }).slug : "";
    const qty = Number((raw as { qty?: unknown }).qty);
    const product = products.find((p) => p.slug === slug);
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > 20) return null;
    items.push({ name: product.name, qty, price: product.price });
  }

  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  return { items, subtotal };
}

/** Insert an order and return its id. paymentStatus 'unpaid' until a webhook confirms payment. */
export async function insertOrder(input: {
  name: string;
  email: string;
  address: string;
  items: OrderEmailInput["items"];
  subtotal: number;
  paymentStatus?: string;
  stripeSessionId?: string | null;
}): Promise<number> {
  const db = getDb();
  const rows = (await db`
    INSERT INTO orders (name, email, address, items, subtotal_cents, payment_status, stripe_session_id)
    VALUES (
      ${input.name}, ${input.email}, ${input.address},
      ${JSON.stringify(input.items)}::jsonb, ${Math.round(input.subtotal * 100)},
      ${input.paymentStatus ?? "unpaid"}, ${input.stripeSessionId ?? null}
    )
    RETURNING id
  `) as Array<{ id: number }>;
  return rows[0].id;
}

/** Send the owner notification and the customer confirmation. Idempotent per order id. */
export async function sendOrderEmails(order: OrderEmailInput): Promise<void> {
  const resend = getResend();

  const owner = orderOwnerEmail(order);
  const { error: ownerErr } = await resend.emails.send(
    {
      from: FROM.hola,
      to: [NOTIFY_TO],
      replyTo: order.email,
      subject: owner.subject,
      html: owner.html,
      text: owner.text,
    },
    { idempotencyKey: `order-notify/${order.id}` },
  );
  if (ownerErr) console.error("[order] owner notify failed:", ownerErr.message);

  const customer = orderCustomerEmail(order);
  const { error: custErr } = await resend.emails.send(
    {
      from: FROM.hola,
      to: [order.email],
      replyTo: NOTIFY_TO,
      subject: customer.subject,
      html: customer.html,
      text: customer.text,
    },
    { idempotencyKey: `order-confirm/${order.id}` },
  );
  if (custErr) console.error("[order] customer confirm failed:", custErr.message);
}

/**
 * Mark an order paid exactly once, then send its confirmation emails. Safe to
 * call from both the Stripe webhook and the success page: the WHERE guard makes
 * it idempotent, so whichever fires first wins and the other is a no-op.
 */
export async function finalizeOrder(orderId: number, amountTotalCents: number | null): Promise<void> {
  const db = getDb();
  const rows = (await db`
    UPDATE orders
    SET payment_status = 'paid', status = 'paid', amount_total_cents = ${amountTotalCents}, paid_at = now()
    WHERE id = ${orderId} AND payment_status <> 'paid'
    RETURNING id, name, email, address, items, subtotal_cents
  `) as Array<{
    id: number;
    name: string;
    email: string;
    address: string;
    items: OrderEmailInput["items"];
    subtotal_cents: number;
  }>;

  // No row means it was already finalized. Nothing to do.
  if (rows.length === 0) return;

  const o = rows[0];
  await sendOrderEmails({
    id: o.id,
    name: o.name,
    email: o.email,
    address: o.address,
    items: o.items,
    subtotal: o.subtotal_cents / 100,
  });
}
