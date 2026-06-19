import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { destinations, destinationBySlug } from "@/data/destinations";
import { formatPrice } from "@/lib/format";
import { site } from "@/config/site";
import Reveal from "@/components/Reveal";
import DestinationCard from "@/components/DestinationCard";
import TripInquiryForm from "@/components/TripInquiryForm";
import JsonLd from "@/components/JsonLd";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = destinationBySlug(slug);
  if (!d) return {};
  return {
    title: `${d.name}: guía de viaje (${d.region})`,
    description: d.blurb,
    openGraph: { images: [{ url: d.image }] },
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = destinationBySlug(slug);
  if (!d) notFound();

  const related = destinations.filter((x) => x.slug !== d.slug).slice(0, 3);
  const ld = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: `${d.name}, Colombia`,
    description: d.blurb,
    image: `${site.url}${d.image}`,
    url: `${site.url}/viajes/${d.slug}`,
    touristType: d.bestFor,
  };

  return (
    <>
      <JsonLd data={ld} />

      {/* Hero */}
      <section className="relative flex min-h-[60svh] items-end overflow-hidden bg-ink">
        <Image
          src={d.image}
          alt={d.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="relative mx-auto w-full max-w-5xl px-4 pt-32 pb-12 sm:px-6">
          <Reveal>
            <Link
              href="/viajes"
              className="text-xs font-bold tracking-[0.25em] text-amarillo uppercase hover:text-paper"
            >
              ← Viajes
            </Link>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="mt-5 text-xs font-bold tracking-[0.3em] text-amarillo uppercase">
              {d.region}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="display-tight font-display text-[clamp(2.8rem,9vw,6rem)] text-paper uppercase">
              {d.name}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="font-reading mt-3 max-w-2xl text-lg text-paper/85">
              {d.tagline}
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <div className="mt-5 flex flex-wrap gap-2">
              {d.bestFor.map((t) => (
                <span
                  key={t}
                  className="border border-paper/40 px-2.5 py-1 text-[11px] font-bold tracking-[0.15em] text-paper/90 uppercase"
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <Reveal>
              <div className="font-reading space-y-5 text-[19px] leading-relaxed text-ink">
                {d.intro.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </Reveal>
            <Reveal>
              <h2 className="display-tight mt-12 mb-5 font-display text-3xl uppercase">
                Qué hacer
              </h2>
              <ul className="space-y-3">
                {d.highlights.map((h) => (
                  <li
                    key={h}
                    className="font-reading flex items-start gap-3 text-ink-soft"
                  >
                    <span className="mt-1 font-bold text-rojo" aria-hidden>
                      ✓
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal>
              <h2 className="display-tight mt-12 mb-5 font-display text-3xl uppercase">
                Antes de ir
              </h2>
              <ul className="space-y-3">
                {d.knowBeforeYouGo.map((k) => (
                  <li
                    key={k}
                    className="font-reading flex items-start gap-3 text-ink-soft"
                  >
                    <span className="mt-1 font-bold text-azul" aria-hidden>
                      →
                    </span>
                    {k}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <div>
            <div className="sticky top-28 border-2 border-ink bg-crema p-6">
              <p className="text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">
                El resumen
              </p>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-[11px] font-bold tracking-[0.15em] text-azul uppercase">
                    Mejor época
                  </dt>
                  <dd className="font-reading mt-1 text-ink-soft">{d.bestTime}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold tracking-[0.15em] text-azul uppercase">
                    Días ideales
                  </dt>
                  <dd className="mt-1 text-ink-soft">{d.idealDays}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-bold tracking-[0.15em] text-azul uppercase">
                    Costo estimado
                  </dt>
                  <dd className="mt-1">
                    <span className="font-display text-3xl">
                      {formatPrice(d.costFrom)}
                    </span>{" "}
                    <span className="text-ink-soft">por persona</span>
                  </dd>
                  <dd className="font-reading mt-1 text-xs text-ink-soft">
                    {d.costNote}
                  </dd>
                </div>
              </dl>
              <a
                href="#cotiza"
                className="mt-6 block border-2 border-ink bg-amarillo px-5 py-3.5 text-center text-sm font-bold tracking-[0.2em] text-ink uppercase shadow-[3px_3px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
              >
                Pedir cotización →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quote form */}
      <section
        id="cotiza"
        className="scroll-mt-24 border-t border-linea bg-crema py-16 sm:py-20"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal>
            <p className="mb-3 text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">
              Cotiza tu viaje
            </p>
            <h2 className="display-tight font-display text-4xl uppercase sm:text-5xl">
              {d.name}, hecho a tu medida
            </h2>
            <p className="font-reading mt-4 max-w-xl text-ink-soft">
              Tell us the dates, the crew, and the vibe. A Colombian who has
              actually been to {d.name} builds the trip with you and sends a real
              itinerary and price within a day.
            </p>
          </Reveal>
          <div className="mt-8 border-2 border-ink bg-paper p-6 sm:p-8">
            <TripInquiryForm defaultTrip={`Destination: ${d.name}`} />
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <h2 className="display-tight mb-8 font-display text-3xl uppercase sm:text-4xl">
              Otros destinos
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((rd, i) => (
              <Reveal key={rd.slug} delay={i * 0.06}>
                <DestinationCard destination={rd} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
