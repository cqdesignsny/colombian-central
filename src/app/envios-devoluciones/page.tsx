import type { Metadata } from "next";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Envíos y Devoluciones",
  description:
    "Shipping times, costs, and our return and refund policy at Colombian Central.",
};

export default function ShippingReturnsPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="display-tight font-display text-4xl uppercase sm:text-5xl">
          Shipping &amp; Returns
        </h1>
        <p className="mt-3 text-sm text-ink-soft">Last updated June 18, 2026.</p>
        <div className="font-reading mt-8 space-y-5 text-[17px] leading-relaxed text-ink">
          <h2 className="font-display text-2xl uppercase">Shipping</h2>
          <p>
            We ship within the United States from Miami. Most orders are
            processed in 1 to 2 business days and arrive within 2 to 7 business
            days after that. Shipping is free on orders over $75; otherwise it
            is calculated at checkout.
          </p>
          <p>
            Artisan and made-to-order pieces (for example certain artesanías)
            are crafted to order and can take 1 to 2 weeks longer. We note that
            on the product when it applies.
          </p>
          <h2 className="font-display text-2xl uppercase">Returns</h2>
          <p>
            If something is not right, you have 30 days from delivery to return
            unused items in their original condition for a refund to your
            original payment method, after we receive and inspect them. For
            health and safety reasons, food and other perishable goods, and
            custom or made-to-order items, are final sale and cannot be
            returned.
          </p>
          <h2 className="font-display text-2xl uppercase">Damaged or wrong items</h2>
          <p>
            If your order arrives damaged or incorrect, email us within 7 days
            of delivery and we will make it right with a replacement or refund.
          </p>
          <h2 className="font-display text-2xl uppercase">Subscriptions</h2>
          <p>
            Subscription boxes (such as La Caja Mecato) renew monthly. You can
            cancel anytime before your next renewal date and you will not be
            charged again.
          </p>
          <h2 className="font-display text-2xl uppercase">Start a return</h2>
          <p>
            Email{" "}
            <a
              href={`mailto:${site.publicEmail}`}
              className="font-semibold text-azul underline underline-offset-2"
            >
              {site.publicEmail}
            </a>{" "}
            with your order number and we will help you out.
          </p>
        </div>
      </div>
    </section>
  );
}
