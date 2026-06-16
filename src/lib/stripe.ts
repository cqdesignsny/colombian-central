import Stripe from "stripe";

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
