import type { Metadata } from "next";
import Link from "next/link";
import ClearCart from "@/components/ClearCart";
import TricolorBar from "@/components/TricolorBar";
import { getStripe, isStripeConfigured } from "@/lib/stripe";
import { finalizeOrder } from "@/lib/orders";

export const metadata: Metadata = {
  title: "¡Gracias por tu compra!",
  description: "Tu pedido fue recibido.",
  robots: { index: false },
};

export default async function GraciasPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; session_id?: string }>;
}) {
  const { order, session_id } = await searchParams;

  // Belt and suspenders: confirm payment and finalize the order here too. The
  // webhook is the primary path; this covers the redirect itself and the case
  // where no webhook is configured yet. finalizeOrder is idempotent, so it is
  // safe even when the webhook also fires.
  if (isStripeConfigured() && session_id) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(session_id);
      const orderId = Number(session.metadata?.order_id);
      if (session.payment_status === "paid" && Number.isInteger(orderId) && orderId > 0) {
        await finalizeOrder(orderId, session.amount_total ?? null);
      }
    } catch (err) {
      console.error("[gracias] finalize failed:", (err as Error).message);
    }
  }

  return (
    <section className="flex min-h-[70svh] flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      {/* Empties the cart now that payment is done. */}
      <ClearCart />

      <p className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.3em] text-ink-soft uppercase">
        <span className="flex gap-0.5" aria-hidden>
          <span className="h-2 w-3 bg-amarillo" />
          <span className="h-2 w-1.5 bg-azul" />
          <span className="h-2 w-1.5 bg-rojo" />
        </span>
        Pedido confirmado
      </p>

      <h1 className="display-tight font-display text-[clamp(3rem,11vw,6.5rem)] uppercase">
        ¡Gracias, parce!
      </h1>

      {order && (
        <p className="mt-4 font-display text-3xl uppercase">
          Pedido <span className="text-rojo">#{order}</span>
        </p>
      )}

      <p className="mt-5 max-w-lg text-ink-soft">
        Your payment went through and your order is locked in. Confirmation is already in your inbox,
        and we ship from Miami in a few business days. Cualquier cosa, escríbenos.
      </p>

      <div className="mt-9 w-full max-w-xs">
        <TricolorBar className="h-1.5" />
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/tienda"
            className="border-2 border-ink bg-amarillo px-6 py-3.5 text-sm font-bold tracking-[0.2em] uppercase transition-transform hover:-translate-y-0.5"
          >
            Seguir comprando
          </Link>
          <Link
            href="/"
            className="border-2 border-ink bg-paper px-6 py-3.5 text-sm font-bold tracking-[0.2em] uppercase transition-transform hover:-translate-y-0.5"
          >
            Inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
