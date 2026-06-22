import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { destinations, packages, travelNotes } from "@/data/destinations";
import { getSectionNews } from "@/lib/section-news";
import { formatPrice } from "@/lib/format";
import SectionHeader from "@/components/SectionHeader";
import DestinationCard from "@/components/DestinationCard";
import ArticleCard from "@/components/ArticleCard";
import Reveal from "@/components/Reveal";
import TripInquiryForm from "@/components/TripInquiryForm";

export const metadata: Metadata = {
  title: "Viajes: trips to Colombia, planned by Colombians",
  description:
    "Custom trips to Cartagena, the Coffee Axis, Tayrona, Medellín and beyond. Plus World Cup travel packages. Tell us the trip, we build it.",
};

export const revalidate = 900;

export default async function ViajesPage() {
  const viajesNews = await getSectionNews("viajes", 3);
  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[70svh] items-end overflow-hidden bg-ink">
        <Image
          src="/images/cocora.jpg"
          alt="Wax palms in the Cocora Valley"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pt-32 pb-14 sm:px-6">
          <Reveal>
            <p className="mb-4 text-xs font-bold tracking-[0.3em] text-amarillo uppercase">
              Viajes · Colombian Central Travel
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-tight font-display text-[clamp(3rem,9vw,7rem)] text-paper uppercase">
              Viaja a la tierrita
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="font-reading mt-5 max-w-xl text-lg text-paper/85">
              {travelNotes.promise}
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <a
              href="#cotiza"
              className="mt-8 inline-block border-2 border-amarillo bg-amarillo px-7 py-4 text-sm font-bold tracking-[0.2em] text-ink uppercase transition-transform hover:-translate-y-0.5"
            >
              Plan my trip
            </a>
          </Reveal>
        </div>
      </section>

      {/* World Cup travel guide banner */}
      <section className="border-b border-linea bg-ink text-paper">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-amarillo uppercase">
              Mundial 2026
            </p>
            <p className="mt-1 font-display text-2xl uppercase sm:text-3xl">
              Sigue a la Tricolor a CDMX, Guadalajara y Miami
            </p>
          </div>
          <Link
            href="/viajes/mundial"
            className="shrink-0 border-2 border-amarillo bg-amarillo px-6 py-3 text-sm font-bold tracking-[0.2em] text-ink uppercase transition-transform hover:-translate-y-0.5"
          >
            Ver la guía
          </Link>
        </div>
      </section>

      {/* Travel news (up top: latest first) */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Lo último"
              title="Noticias de viaje"
              sub="Guides, the best time to go, and the trips worth taking right now, from people who actually go."
              href="/noticias"
              linkLabel="Todas las noticias"
            />
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {viajesNews.map((article, i) => (
              <Reveal key={article.slug} delay={i * 0.06}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="border-t border-linea py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Destinos"
              title="¿Pa' dónde vamos?"
              sub="Nine starting points. Every one of them can anchor a full trip, and every trip we plan is built around you, not a fixed bus route."
            />
          </Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination, i) => (
              <Reveal key={destination.slug} delay={i * 0.05}>
                <div id={destination.slug}>
                  <DestinationCard destination={destination} />
                  <div className="border border-t-0 border-linea bg-paper p-4">
                    <p className="font-reading text-sm text-ink-soft">{destination.blurb}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <p className="text-xs font-bold tracking-[0.2em] text-azul uppercase">
                        Ideal: {destination.idealDays}
                      </p>
                      <Link
                        href={`/viajes/${destination.slug}`}
                        className="text-xs font-bold tracking-[0.18em] text-rojo uppercase underline-offset-4 hover:underline"
                      >
                        Ver guía →
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="border-y border-linea bg-crema py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Paquetes"
              title="Rutas listas pa' salir"
              sub={travelNotes.pricing}
            />
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-2">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.slug} delay={i * 0.06}>
                <div className="flex h-full flex-col border-2 border-dashed border-ink/30 bg-paper p-6 sm:flex-row sm:gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[11px] font-bold tracking-[0.25em] text-ink-soft uppercase">
                        {pkg.duration}
                      </p>
                      {pkg.tag && (
                        <span className="bg-rojo px-2 py-0.5 text-[10px] font-bold tracking-[0.2em] text-paper uppercase">
                          {pkg.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="display-tight mt-2 font-display text-3xl uppercase">
                      {pkg.name}
                    </h3>
                    <p className="mt-1 text-sm font-bold tracking-[0.15em] text-azul uppercase">
                      {pkg.route}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {pkg.highlights.map((highlight) => (
                        <li
                          key={highlight}
                          className="font-reading flex items-start gap-2 text-sm text-ink-soft"
                        >
                          <span className="mt-0.5 font-bold text-rojo">✓</span>
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6 flex shrink-0 flex-row items-center justify-between gap-4 border-t border-dashed border-ink/30 pt-5 sm:mt-0 sm:w-36 sm:flex-col sm:items-end sm:justify-center sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6 sm:text-right">
                    <div>
                      <p className="text-[11px] font-bold tracking-[0.25em] text-ink-soft uppercase">
                        Desde
                      </p>
                      <p className="font-display text-4xl">
                        {formatPrice(pkg.priceFrom)}
                      </p>
                    </div>
                    <a
                      href="#cotiza"
                      className="border-2 border-ink bg-amarillo px-4 py-2.5 text-xs font-bold tracking-[0.2em] uppercase transition-transform hover:-translate-y-0.5"
                    >
                      Cotizar
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry form */}
      <section id="cotiza" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-5">
            <Reveal className="lg:col-span-2">
              <div>
                <SectionHeader
                  eyebrow="Cotiza tu viaje"
                  title="Cuéntanos el sueño"
                  sub="Going back to see la familia, first trip with the partner, Mundial road trip with the parceros. Whatever it is, describe it and we come back with a real plan and a real price."
                />
                <ul className="font-reading space-y-3 text-sm text-ink-soft">
                  <li className="flex gap-3">
                    <span className="font-display text-2xl text-amarillo">1</span>
                    Tell us the trip in two minutes.
                  </li>
                  <li className="flex gap-3">
                    <span className="font-display text-2xl text-azul">2</span>
                    We send an itinerary and quote within a day.
                  </li>
                  <li className="flex gap-3">
                    <span className="font-display text-2xl text-rojo">3</span>
                    You tweak, approve, and pack. Nos vemos en Colombia.
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-3">
              <div className="border border-linea bg-crema p-6 sm:p-8">
                <TripInquiryForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
