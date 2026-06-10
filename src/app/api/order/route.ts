import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { FROM, NOTIFY_TO, getResend } from "@/lib/resend";
import { orderCustomerEmail, orderOwnerEmail, type OrderEmailInput } from "@/lib/emails";
import { products } from "@/data/products";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  name?: unknown;
  email?: unknown;
  address?: unknown;
  items?: unknown;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad payload" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const address = typeof body.address === "string" ? body.address.trim().slice(0, 600) : "";
  const rawItems = Array.isArray(body.items) ? body.items : [];

  if (!name || !EMAIL_RE.test(email) || !address) {
    return NextResponse.json({ ok: false, error: "Name, email and address are required" }, { status: 400 });
  }
  if (rawItems.length === 0 || rawItems.length > 50) {
    return NextResponse.json({ ok: false, error: "Cart is empty" }, { status: 400 });
  }

  // Prices come from our catalog, never from the client.
  const items: OrderEmailInput["items"] = [];
  for (const raw of rawItems) {
    const slug = typeof (raw as { slug?: unknown }).slug === "string" ? (raw as { slug: string }).slug : "";
    const qty = Number((raw as { qty?: unknown }).qty);
    const product = products.find((p) => p.slug === slug);
    if (!product || !Number.isInteger(qty) || qty < 1 || qty > 20) {
      return NextResponse.json({ ok: false, error: "Invalid cart item" }, { status: 400 });
    }
    items.push({ name: product.name, qty, price: product.price });
  }
  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);

  const db = getDb();
  const rows = (await db`
    INSERT INTO orders (name, email, address, items, subtotal_cents)
    VALUES (${name}, ${email}, ${address}, ${JSON.stringify(items)}::jsonb, ${Math.round(subtotal * 100)})
    RETURNING id
  `) as Array<{ id: number }>;
  const id = rows[0].id;

  const order: OrderEmailInput = { id, name, email, address, items, subtotal };
  const resend = getResend();

  const owner = orderOwnerEmail(order);
  const { error: ownerErr } = await resend.emails.send(
    {
      from: FROM.hola,
      to: [NOTIFY_TO],
      replyTo: email,
      subject: owner.subject,
      html: owner.html,
      text: owner.text,
    },
    { idempotencyKey: `order-notify/${id}` },
  );
  if (ownerErr) console.error("[order] owner notify failed:", ownerErr.message);

  const customer = orderCustomerEmail(order);
  const { error: custErr } = await resend.emails.send(
    {
      from: FROM.hola,
      to: [email],
      replyTo: NOTIFY_TO,
      subject: customer.subject,
      html: customer.html,
      text: customer.text,
    },
    { idempotencyKey: `order-confirm/${id}` },
  );
  if (custErr) console.error("[order] customer confirm failed:", custErr.message);

  return NextResponse.json({ ok: true, orderId: id });
}
