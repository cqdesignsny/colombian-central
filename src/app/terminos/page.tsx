import type { Metadata } from "next";
import { site } from "@/config/site";

export const metadata: Metadata = {
  title: "Términos de Servicio",
  description: "The terms for using Colombian Central and buying from our shop.",
};

export default function TermsPage() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="display-tight font-display text-4xl uppercase sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-3 text-sm text-ink-soft">Last updated June 18, 2026.</p>
        <div className="font-reading mt-8 space-y-5 text-[17px] leading-relaxed text-ink">
          <p>
            By using {site.domain} you agree to these terms. If you do not
            agree, please do not use the site.
          </p>
          <h2 className="font-display text-2xl uppercase">Independent fan media</h2>
          <p>
            Colombian Central is independent fan media. It is not affiliated
            with, endorsed by, or sponsored by FIFA, the Federación Colombiana
            de Fútbol, or any team, league, or brand. Apparel we sell is
            unofficial fanwear, not official federation product. Team and
            tournament references are editorial.
          </p>
          <h2 className="font-display text-2xl uppercase">Orders and pricing</h2>
          <p>
            Prices are in U.S. dollars and may change. We may decline or cancel
            an order and issue a refund (for example, for pricing errors or
            items that become unavailable). See our{" "}
            <a
              href="/envios-devoluciones"
              className="font-semibold text-azul underline underline-offset-2"
            >
              Shipping &amp; Returns
            </a>{" "}
            policy for delivery and returns.
          </p>
          <h2 className="font-display text-2xl uppercase">Affiliate links</h2>
          <p>
            Some links on the site are affiliate links, including the Amazon
            Associates program. We may earn a commission when you buy through
            them, at no extra cost to you. As an Amazon Associate we earn from
            qualifying purchases.
          </p>
          <h2 className="font-display text-2xl uppercase">Content and El Paisa</h2>
          <p>
            Our content, brand, and designs are ours; please do not copy or
            resell them. Some news on the site is written with AI assistance
            (our mascot, El Paisa) from public sources and may contain errors.
            Nothing here is legal, medical, financial, or travel-safety advice.
          </p>
          <h2 className="font-display text-2xl uppercase">As-is; liability</h2>
          <p>
            The site is provided &ldquo;as is.&rdquo; To the extent permitted by
            law, Colombian Central is not liable for indirect or incidental
            damages arising from your use of the site or products. These terms
            are governed by the laws of the United States and the State of New
            York.
          </p>
          <h2 className="font-display text-2xl uppercase">Contact</h2>
          <p>
            Questions? Write to{" "}
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
