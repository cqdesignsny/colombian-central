import type { Metadata } from "next";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "How Colombian Central collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="display-tight font-display text-4xl uppercase sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-ink-soft">Last updated June 18, 2026.</p>
        <div className="font-reading mt-8 space-y-5 text-[17px] leading-relaxed text-ink">
          <p>
            Colombian Central ({site.domain}) respects your privacy. This policy
            explains what we collect, how we use it, and the choices you have.
          </p>
          <h2 className="font-display text-2xl uppercase">What we collect</h2>
          <p>
            When you subscribe to our newsletter or place an order, we collect
            your email address. At checkout, our payment processor collects your
            name, shipping address, and phone number to fulfill the order. We do
            not see or store full payment card numbers. We also keep basic
            request logs (including IP address) to prevent abuse and keep the
            site running.
          </p>
          <h2 className="font-display text-2xl uppercase">How we use it</h2>
          <p>
            To fulfill and confirm orders, send El Boletín (our newsletter) if
            you opted in, respond to your messages, protect the site from spam
            and fraud, and improve what we offer.
          </p>
          <h2 className="font-display text-2xl uppercase">Who we share it with</h2>
          <p>
            Only the service providers that run the site: Stripe (payments),
            Resend (email), Vercel (hosting), Neon (database), and shipping
            carriers for delivery. We do not sell your personal information.
            Some outbound links on our guides are affiliate links (including
            Amazon Associates), and those partners may set their own cookies
            when you click.
          </p>
          <h2 className="font-display text-2xl uppercase">Email and your choices</h2>
          <p>
            The newsletter is opt-in, and every email includes a one-click
            unsubscribe. You can ask us to access, correct, or delete your
            personal information at any time by emailing{" "}
            <a
              href={`mailto:${site.publicEmail}`}
              className="font-semibold text-azul underline underline-offset-2"
            >
              {site.publicEmail}
            </a>
            .
          </p>
          <h2 className="font-display text-2xl uppercase">Contact</h2>
          <p>
            Questions about this policy? Write to{" "}
            <a
              href={`mailto:${site.publicEmail}`}
              className="font-semibold text-azul underline underline-offset-2"
            >
              {site.publicEmail}
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
