import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { detailsFromSession, getStripe } from "@/lib/stripe";
import { finalizeOrder } from "@/lib/orders";

// Stripe needs the raw body and the Node runtime to verify the signature.
export const runtime = "nodejs";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[stripe] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ ok: false }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(raw, sig, secret);
  } catch (err) {
    console.error("[stripe] signature verification failed:", (err as Error).message);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = Number(session.metadata?.order_id);
    if (Number.isInteger(orderId) && orderId > 0) {
      try {
        await finalizeOrder(orderId, detailsFromSession(session));
      } catch (err) {
        console.error("[stripe] finalize failed for order", orderId, (err as Error).message);
        // Non-2xx tells Stripe to retry the delivery.
        return NextResponse.json({ ok: false }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
