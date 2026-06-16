import type { Metadata } from "next";
import Link from "next/link";
import { worldCup } from "@/data/futbol";
import { hostCities, insurancePicks, mundialIntro } from "@/data/tours";
import { formatKickoff } from "@/lib/format";
import { partnerHref } from "@/config/partners";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import TricolorBar from "@/components/TricolorBar";
import AffiliateLink from "@/components/AffiliateLink";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Viaje al Mundial 2026: sigue a Colombia en CDMX, Guadalajara y Miami",
  description:
    "Travel guide for Colombia's 2026 World Cup group games in Mexico City, Guadalajara and Miami. Where the hinchada gathers, things to do, tours and travel insurance.",
};

export default function ViajeMundialPage() {
  return (
    <>
      {/* Hero (dark, Mundial energy) */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6">
          <Reveal>
            <p className="mb-4 text-xs font-bold tracking-[0.3em] text-amarillo uppercase">
              Guías · Viaje al Mundial
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-tight font-display text-[clamp(2.8rem,9vw,7rem)] uppercase">
              Sigue a la Tricolor
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-2xl text-lg text-paper/80">{mundialIntro.lede}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <a
              href="#sedes"
              className="mt-8 inline-block border-2 border-amarillo bg-amarillo px-7 py-4 text-sm font-bold tracking-[0.2em] text-ink uppercase transition-transform hover:-translate-y-0.5"
            >
              Ver las sedes
            </a>
          </Reveal>
        </div>
        <TricolorBar className="h-2" />
      </section>

      {/* Disclosure */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <Reveal>
          <AffiliateDisclosure />
        </Reveal>
      </div>

      {/* Host cities */}
      <section id="sedes" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Las sedes"
              title="Tres ciudades, tres partidos"
              sub="Every group game and how to travel for it. Dates and venues pulled straight from the fixture list."
            />
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-3">
            {hostCities.map((host, i) => {
              const fixture = worldCup.fixtures.find((f) => f.matchday === host.matchday);
              const when = fixture ? formatKickoff(fixture.kickoff) : null;
              return (
                <Reveal key={host.city} delay={i * 0.06}>
                  <div className="flex h-full flex-col border-2 border-ink bg-paper">
                    <div className="bg-ink px-5 py-4 text-paper">
                      <p className="text-[11px] font-bold tracking-[0.25em] text-amarillo uppercase">
                        Partido {host.matchday}
                      </p>
                      <p className="display-tight mt-1 font-display text-2xl uppercase">
                        Colombia vs {fixture?.opponent ?? ""}
                      </p>
                      {when && (
                        <p className="mt-1 text-xs font-bold tracking-[0.15em] text-paper/70 uppercase">
                          {when.weekday}, {when.date} · {when.time}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="font-display text-3xl uppercase">{host.city}</p>
                      <p className="text-xs font-bold tracking-[0.2em] text-azul uppercase">
                        {fixture?.venue ?? ""} · {host.country}
                      </p>
                      <p className="mt-3 text-sm text-ink-soft">{host.vibe}</p>

                      <ul className="mt-4 space-y-2">
                        {host.fanTips.map((tip) => (
                          <li key={tip} className="flex items-start gap-2 text-sm text-ink-soft">
                            <span className="mt-0.5 font-bold text-rojo" aria-hidden>
                              ✓
                            </span>
                            {tip}
                          </li>
                        ))}
                      </ul>

                      <p className="mt-5 text-[11px] font-bold tracking-[0.2em] text-ink-soft uppercase">
                        Para hacer
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {host.experiences.map((exp) => (
                          <span
                            key={exp}
                            className="border border-linea bg-crema px-2.5 py-1 text-[11px] font-medium text-ink-soft"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>

                      <AffiliateLink
                        href={partnerHref("getyourguide")}
                        ariaLabel={`Find tours and experiences in ${host.city}`}
                        className="mt-6 inline-flex items-center justify-center gap-2 border-2 border-ink bg-amarillo px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase transition-transform hover:-translate-y-0.5"
                      >
                        Tours en {host.city}
                        <span aria-hidden>→</span>
                      </AffiliateLink>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Booking platforms */}
      <section className="border-y border-linea bg-crema py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Reserva tus tours"
              title="Experiencias, sin dolores de cabeza"
              sub="Two platforms we trust for tours and activities in the host cities and across Colombia. Book ahead, skip the lines, support the guide."
            />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {(["viator", "getyourguide"] as const).map((slug, i) => (
              <Reveal key={slug} delay={i * 0.06}>
                <div className="flex h-full flex-col border-2 border-ink bg-paper p-6 sm:p-7">
                  <h3 className="display-tight font-display text-3xl uppercase">
                    {slug === "viator" ? "Viator" : "GetYourGuide"}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-ink-soft">
                    {slug === "viator"
                      ? "Huge catalog of tours and day trips, free cancellation on most, reviews you can trust from Tripadvisor."
                      : "Skip-the-line tickets and local experiences with instant mobile vouchers. Great for last-minute matchday plans."}
                  </p>
                  <AffiliateLink
                    href={partnerHref(slug)}
                    ariaLabel={`Browse experiences on ${slug === "viator" ? "Viator" : "GetYourGuide"}`}
                    className="mt-5 inline-flex items-center gap-2 border-2 border-ink bg-amarillo px-5 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-transform hover:-translate-y-0.5"
                  >
                    Explorar
                    <span aria-hidden>→</span>
                  </AffiliateLink>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Antes de volar"
              title="No salgas sin seguro"
              sub="A clinic visit abroad costs more than the policy. Cheap peace of mind for a trip across the border."
            />
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {insurancePicks.map((pick, i) => (
              <Reveal key={pick.partner} delay={i * 0.06}>
                <div className="flex h-full flex-col border-2 border-ink/30 bg-paper p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="display-tight font-display text-3xl uppercase">{pick.name}</h3>
                    <span className="bg-azul px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] text-paper uppercase">
                      Seguro
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-ink-soft">{pick.line}</p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {pick.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-ink-soft">
                        <span className="mt-0.5 font-bold text-rojo" aria-hidden>
                          ✓
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>
                  <AffiliateLink
                    href={partnerHref(pick.partner)}
                    ariaLabel={`Get covered with ${pick.name}`}
                    className="mt-5 inline-flex items-center gap-2 border-2 border-ink bg-amarillo px-5 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-transform hover:-translate-y-0.5"
                  >
                    Cotiza con {pick.name}
                    <span aria-hidden>→</span>
                  </AffiliateLink>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Colombia cross-link */}
      <section className="border-y border-linea bg-ink py-16 text-paper sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.25em] text-amarillo uppercase">
                Después del Mundial
              </p>
              <h2 className="display-tight font-display text-4xl uppercase sm:text-5xl">
                La tierrita te espera
              </h2>
              <p className="mt-4 max-w-md text-paper/75">{mundialIntro.colombiaCrossLink}</p>
            </div>
            <div className="lg:justify-self-end">
              <Link
                href="/viajes"
                className="inline-block border-2 border-amarillo bg-amarillo px-7 py-4 text-sm font-bold tracking-[0.2em] text-ink uppercase transition-transform hover:-translate-y-0.5"
              >
                Planea tu viaje a Colombia
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter capture */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="border-2 border-ink bg-crema p-8 sm:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">
                  El Boletín
                </p>
                <h2 className="display-tight font-display text-4xl uppercase sm:text-5xl">
                  Matchday plans, sorted
                </h2>
                <p className="mt-4 max-w-md text-ink-soft">
                  Watch parties, travel deals, and where the hinchada is meeting up in each city.
                  Join El Boletín and travel with the parche.
                </p>
              </div>
              <div className="lg:justify-self-end">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More guides */}
      <section className="border-t border-linea pb-20">
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
          <p className="mb-4 text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">
            Más guías
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/enviar-dinero"
              className="border-2 border-ink bg-paper px-5 py-3 text-sm font-bold tracking-[0.12em] uppercase transition-transform hover:-translate-y-0.5"
            >
              Enviar dinero a Colombia →
            </Link>
            <Link
              href="/futbol/hinchada"
              className="border-2 border-ink bg-paper px-5 py-3 text-sm font-bold tracking-[0.12em] uppercase transition-transform hover:-translate-y-0.5"
            >
              Guía de la hinchada →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
