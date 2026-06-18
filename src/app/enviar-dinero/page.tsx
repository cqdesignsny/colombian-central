import type { Metadata } from "next";
import Link from "next/link";
import { remitProviders, remitQuickPicks, remitFaqs, remitIntro } from "@/data/remittance";
import { partnerHref } from "@/config/partners";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import Stamp from "@/components/Stamp";
import AffiliateLink from "@/components/AffiliateLink";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Enviar dinero a Colombia: Wise vs Remitly vs Xe vs Western Union (2026)",
  description:
    "The honest guide to sending money to Colombia in 2026. Compare Wise, Remitly, Xe and Western Union on rate, fees, speed and cash pickup. Mejor tasa, menos comisión.",
};

// Qualitative matrix for the at-a-glance table. Keeps us honest: no fake numbers.
const matrix: Record<string, { rate: string; speed: string; cash: string; bank: string }> = {
  wise: { rate: "Best", speed: "Fast", cash: "No", bank: "Yes" },
  remitly: { rate: "Good", speed: "Minutes", cash: "Yes", bank: "Yes" },
  xe: { rate: "Good", speed: "1 to 2 days", cash: "Limited", bank: "Yes" },
  "western-union": { rate: "Higher", speed: "Minutes", cash: "Yes", bank: "Yes" },
};

export default function EnviarDineroPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-linea bg-paper">
        <Stamp className="absolute -top-6 right-2 hidden h-40 w-40 text-azul/15 sm:block lg:right-10" />
        <div className="relative mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6">
          <Reveal>
            <p className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">
              <span className="flex gap-0.5" aria-hidden>
                <span className="h-2 w-3 bg-amarillo" />
                <span className="h-2 w-1.5 bg-azul" />
                <span className="h-2 w-1.5 bg-rojo" />
              </span>
              Guías · Dinero
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-tight max-w-4xl font-display text-[clamp(2.6rem,8vw,6rem)] uppercase">
              Enviar plata a Colombia
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-2xl text-lg text-ink-soft">{remitIntro.lede}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href="#cara-a-cara"
                className="inline-block border-2 border-ink bg-amarillo px-7 py-4 text-sm font-bold tracking-[0.2em] text-ink uppercase transition-transform hover:-translate-y-0.5"
              >
                Compara las opciones
              </a>
              <span className="text-xs font-bold tracking-[0.2em] text-ink-soft uppercase">
                {remitIntro.updated}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Disclosure */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <Reveal>
          <AffiliateDisclosure />
        </Reveal>
      </div>

      {/* Quick picks */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Elige rápido"
              title="¿Qué necesitas hoy?"
              sub="Three common situations, three clear picks. Tap through to a live quote."
            />
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {remitQuickPicks.map((pick, i) => (
              <Reveal key={pick.scenario} delay={i * 0.06}>
                <div className="flex h-full flex-col border-2 border-ink bg-crema p-6">
                  <p className="text-[11px] font-bold tracking-[0.25em] text-ink-soft uppercase">
                    {pick.scenario}
                  </p>
                  <p className="display-tight mt-2 font-display text-4xl uppercase">
                    {pick.pick}
                  </p>
                  <p className="mt-3 flex-1 text-sm text-ink-soft">{pick.why}</p>
                  <AffiliateLink
                    href={partnerHref(pick.partner)}
                    ariaLabel={`Send money with ${pick.pick}`}
                    className="mt-5 inline-flex items-center justify-center gap-2 border-2 border-ink bg-amarillo px-4 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-transform hover:-translate-y-0.5"
                  >
                    Ver con {pick.pick}
                    <span aria-hidden>→</span>
                  </AffiliateLink>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Head to head */}
      <section id="cara-a-cara" className="scroll-mt-24 border-y border-linea bg-crema py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Cara a cara"
              title="Las cuatro opciones"
              sub="What each one is genuinely best at, and the one thing to watch before you send."
            />
          </Reveal>
          <div className="grid gap-6 lg:grid-cols-2">
            {remitProviders.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05}>
                <div
                  className={`flex h-full flex-col border-2 bg-paper p-6 sm:p-7 ${
                    p.highlight ? "border-ink shadow-[6px_6px_0_0_var(--color-ink)]" : "border-ink/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="display-tight font-display text-3xl uppercase">{p.name}</h3>
                      <p className="mt-1 text-sm text-ink-soft">{p.tagline}</p>
                    </div>
                    {p.badge && (
                      <span
                        className={`shrink-0 px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] uppercase ${
                          p.highlight ? "bg-amarillo text-ink" : "bg-azul text-paper"
                        }`}
                      >
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-xs font-bold tracking-[0.15em] text-azul uppercase">
                    Mejor para: {p.bestFor}
                  </p>

                  <ul className="mt-4 space-y-2">
                    {p.strengths.map((s) => (
                      <li key={s} className="flex items-start gap-2 text-sm text-ink-soft">
                        <span className="mt-0.5 font-bold text-rojo" aria-hidden>
                          ✓
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-4 border-l-2 border-rojo pl-3 text-sm text-ink-soft">
                    <span className="font-bold text-ink">Ojo:</span> {p.watchOut}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.delivery.map((d) => (
                      <span
                        key={d}
                        className="border border-linea bg-crema px-2.5 py-1 text-[11px] font-bold tracking-[0.1em] text-ink-soft uppercase"
                      >
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 border-t border-dashed border-ink/20 pt-5">
                    {p.partner ? (
                      <AffiliateLink
                        href={partnerHref(p.partner)}
                        ariaLabel={`Send money to Colombia with ${p.name}`}
                        className="inline-flex items-center gap-2 border-2 border-ink bg-amarillo px-5 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-transform hover:-translate-y-0.5"
                      >
                        Enviar con {p.name}
                        <span aria-hidden>→</span>
                      </AffiliateLink>
                    ) : (
                      <p className="text-xs font-bold tracking-[0.15em] text-ink-soft uppercase">
                        Comparison only. We do not earn on {p.name}.
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* At a glance table */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="De un vistazo"
              title="La tabla"
              sub="The short version. Rates and fees move daily, so treat this as direction, not gospel, and check the live quote."
            />
          </Reveal>
          <Reveal>
            <div className="overflow-x-auto border-2 border-ink">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="bg-ink text-paper">
                    <th className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                      Servicio
                    </th>
                    <th className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">Tasa</th>
                    <th className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                      Velocidad
                    </th>
                    <th className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                      Efectivo
                    </th>
                    <th className="px-4 py-3 text-xs font-bold tracking-[0.18em] uppercase">
                      A Nequi / banco
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {remitProviders.map((p) => {
                    const m = matrix[p.slug];
                    return (
                      <tr key={p.slug} className="border-t border-linea bg-paper">
                        <td className="px-4 py-3 font-display text-xl uppercase">{p.name}</td>
                        <td className="px-4 py-3 text-sm font-bold text-ink-soft">{m.rate}</td>
                        <td className="px-4 py-3 text-sm text-ink-soft">{m.speed}</td>
                        <td className="px-4 py-3 text-sm text-ink-soft">{m.cash}</td>
                        <td className="px-4 py-3 text-sm text-ink-soft">{m.bank}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-linea bg-crema py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader eyebrow="Preguntas" title="Lo que todos preguntan" />
          </Reveal>
          <div className="mx-auto max-w-3xl space-y-3">
            {remitFaqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.03}>
                <details
                  name="remit-faq"
                  className="group border-2 border-ink bg-paper px-5 py-4"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-bold text-ink">
                    {f.q}
                    <span className="font-display text-2xl text-azul transition-transform group-open:rotate-45" aria-hidden>
                      +
                    </span>
                  </summary>
                  <p className="font-reading mt-3 text-base leading-relaxed text-ink-soft">
                    {f.a}
                  </p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter capture */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="border-2 border-ink bg-ink p-8 text-paper sm:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-bold tracking-[0.25em] text-amarillo uppercase">
                  El Boletín
                </p>
                <h2 className="display-tight font-display text-4xl uppercase sm:text-5xl">
                  Rate drops, in your inbox
                </h2>
                <p className="mt-4 max-w-md text-paper/75">
                  We watch the promos and the rate wars so you do not have to. Join El Boletín and
                  we will ping you when there is real money to be saved sending home.
                </p>
              </div>
              <div className="lg:justify-self-end">
                <NewsletterForm dark />
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
              href="/viajes/mundial"
              className="border-2 border-ink bg-paper px-5 py-3 text-sm font-bold tracking-[0.12em] uppercase transition-transform hover:-translate-y-0.5"
            >
              Viaje al Mundial →
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
