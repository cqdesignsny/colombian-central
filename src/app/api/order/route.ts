import { NextResponse } from "next/server";
import { priceCart, insertOrder, sendOrderEmails } from "@/lib/orders";
import type { OrderEmailInput } from "@/lib/emails";
import { isHoneypotTripped, rateLimit, tooManyRequests } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  name?: unknown;
  email?: unknown;
  address?: unknown;
  items?: unknown;
  website?: unknown;
};

/**
 * Email-order route: no online payment, owner and customer get a confirmation
 * and payment is arranged by hand. This is the pre-Stripe fallback; once Stripe
 * is configured the cart uses /api/checkout instead.
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

  const id = await insertOrder({ name, email, address, items: priced.items, subtotal: priced.subtotal });
  const order: OrderEmailInput = { id, name, email, address, items: priced.items, subtotal: priced.subtotal };
  await sendOrderEmails(order);

  return NextResponse.json({ ok: true, orderId: id });
}
