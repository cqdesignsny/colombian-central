import Stripe from "stripe";
import type { FinalizeDetails } from "@/lib/orders";

/**
 * Stripe client, lazily built from STRIPE_SECRET_KEY. Like the rest of the
 * launch wiring, payments are gated: until the CQM account is connected and the
 * key is set, isStripeConfigured() is false and the store falls back to the
 * email-order flow. Add the key and card checkout turns on, no code change.
 */
let cached: Stripe | null = null;

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  // Omit apiVersion so the SDK uses its pinned latest, per Stripe guidance.
  if (!cached) cached = new Stripe(key);
  return cached;
}

export function isStripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

type AddressLike = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
  country?: string | null;
};

function formatAddress(a: AddressLike): string {
  const cityLine = [a.city, a.state, a.postal_code].filter(Boolean).join(", ");
  return [a.line1, a.line2, cityLine, a.country].filter(Boolean).join("\n");
}

/** Pull the name, shipping address, phone and marketing opt-in Stripe Checkout collected. */
export function detailsFromSession(session: Stripe.Checkout.Session): FinalizeDetails {
  const cd = session.customer_details;
  // shipping_details moved under collected_information across API versions; read both.
  const loose = session as unknown as {
    collected_information?: { shipping_details?: { name?: string | null; address?: AddressLike } | null } | null;
    shipping_details?: { name?: string | null; address?: AddressLike } | null;
  };
  const shipping = loose.collected_information?.shipping_details ?? loose.shipping_details ?? null;
  const addr = shipping?.address ?? cd?.address ?? null;
  const promo = session.consent?.promotions;

  return {
    amountTotalCents: session.amount_total ?? null,
    name: shipping?.name ?? cd?.name ?? null,
    address: addr ? formatAddress(addr) : null,
    phone: cd?.phone ?? null,
    marketingOptIn: promo === "opt_in" ? true : promo === "opt_out" ? false : null,
  };
}
