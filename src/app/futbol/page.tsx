import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { worldCup, squad } from "@/data/futbol";
import { products } from "@/data/products";
import { formatKickoff } from "@/lib/format";
import Countdown from "@/components/Countdown";
import MatchCard from "@/components/MatchCard";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import Ticker from "@/components/Ticker";
import ProductCard from "@/components/ProductCard";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Fútbol: La Tricolor en el Mundial 2026",
  description:
    "Colombia at the 2026 World Cup: Group K fixtures against Portugal, Uzbekistan and DR Congo, the squad, kickoff times, and where to watch.",
};

export default function FutbolPage() {
  const debut = formatKickoff(worldCup.debutKickoff);
  const jersey = products.find((p) => p.slug === "tricolor-26-jersey");

  return (
    <div className="bg-ink text-paper">
      {/* Hero */}
      <section className="relative flex min-h-[80svh] items-end overflow-hidden">
        <Image
          src="/images/futbol-stadium.jpg"
          alt="Colombian fans filling a stadium at night"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-4 pt-36 pb-14 sm:px-6">
          <Reveal>
            <p className="mb-4 text-xs font-bold tracking-[0.3em] text-amarillo uppercase">
              {worldCup.tournament} · Grupo {worldCup.group}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-tight font-display text-[clamp(3rem,9vw,7.5rem)] uppercase">
              La Tricolor
              <br />
              en el Mundial
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-xl text-lg text-paper/80">
              Seventh World Cup. First one with this generation in full bloom.
              Every fixture, every kickoff time, every excuse you need to leave
              work early. It all starts {debut.weekday}, {debut.date}.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-8">
              <p className="mb-3 text-xs font-bold tracking-[0.25em] text-paper/60 uppercase">
                Countdown to Colombia vs Uzbekistan · {debut.time}
              </p>
              <Countdown target={worldCup.debutKickoff} light />
            </div>
          </Reveal>
        </div>
      </section>

      <Ticker
        items={[
          "Grupo K",
          "COL vs UZB · Jun 17 · 10:00 PM ET · FS1",
          "COL vs COD · Jun 23 · 10:00 PM ET · FS1",
          "COL vs POR · Jun 27 · 7:30 PM ET · FOX",
          "Vamos mi selección",
        ]}
      />

      {/* Group K */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              dark
              eyebrow="El grupo"
              title="Grupo K, sin rodeos"
              sub={worldCup.format}
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {worldCup.groupTeams.map((team, i) => (
              <Reveal key={team.code} delay={i * 0.06}>
                <div
                  className={`flex h-full flex-col border p-6 ${
                    team.code === "COL"
                      ? "border-amarillo bg-amarillo/10"
                      : "border-paper/15 bg-paper/5"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={team.flag}
                    alt={`Flag of ${team.name}`}
                    className="mb-4 h-9 w-14 border border-paper/15 object-cover"
                  />
                  <p
                    className={`font-display text-5xl ${
                      team.code === "COL" ? "text-amarillo" : "text-paper"
                    }`}
                  >
                    {team.code}
                  </p>
                  <p className="mt-2 text-sm font-bold tracking-[0.2em] uppercase">
                    {team.name}
                  </p>
                  <p className="mt-3 text-sm text-paper/65">{team.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Fixtures */}
      <section className="border-y border-paper/10 bg-paper/[0.03] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              dark
              eyebrow="Calendario"
              title="Los tres partidos"
              sub={`${worldCup.kickoffNote} Two matches in Mexico, then Miami. Book the babysitter now.`}
            />
          </Reveal>
          <div className="grid gap-5 lg:grid-cols-3">
            {worldCup.fixtures.map((fixture, i) => (
              <Reveal key={fixture.matchday} delay={i * 0.07}>
                <MatchCard fixture={fixture} light />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-8 flex flex-wrap items-center gap-4 border border-paper/15 bg-paper/5 p-5 text-sm text-paper/75">
              <span className="border border-amarillo px-2 py-0.5 text-[11px] font-bold tracking-[0.2em] text-amarillo uppercase">
                Dato
              </span>
              Advance past the group and the round of 32 likely runs through
              Houston or Atlanta. The diaspora travel math is already happening
              in our Viajes section.
              <Link
                href="/viajes/mundial"
                className="font-bold text-amarillo underline-offset-4 hover:underline"
              >
                Guía de viaje al Mundial →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Squad */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              dark
              eyebrow={`DT: ${squad.coach}`}
              title="El núcleo"
              sub={squad.note}
            />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {squad.players.map((player, i) => (
              <Reveal key={player.name} delay={(i % 3) * 0.05}>
                <div
                  className={`flex h-full flex-col overflow-hidden border ${
                    player.captain
                      ? "border-amarillo bg-amarillo/10"
                      : "border-paper/15 bg-paper/5"
                  }`}
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink">
                    {player.image ? (
                      <Image
                        src={player.image}
                        alt={player.name}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-display text-6xl text-paper/20">
                          {player.name
                            .split(" ")
                            .map((w) => w[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                      </div>
                    )}
                    <span className="absolute top-2 left-2 border border-paper/20 bg-ink/60 px-2 py-0.5 text-[11px] font-bold tracking-[0.2em] text-paper/80 uppercase">
                      {player.position}
                    </span>
                    {player.captain && (
                      <span className="absolute top-2 right-2 bg-amarillo px-2 py-0.5 text-[11px] font-bold tracking-[0.2em] text-ink uppercase">
                        Capitán
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="display-tight font-display text-2xl uppercase">
                      {player.name}
                    </p>
                    <p className="mt-2 text-sm text-paper/65">{player.line}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-8 text-xs text-paper/40">
              Some player photos via Wikimedia Commons (CC BY-SA). Country flags are
              public domain.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Cross-sell + watch parties */}
      <section className="border-t border-paper/10 bg-paper/[0.03] py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <div>
              <h2 className="display-tight font-display text-4xl uppercase sm:text-6xl">
                Ponte la <span className="text-amarillo">amarilla</span>
              </h2>
              <p className="mt-4 max-w-md text-paper/75">
                Our fan-made &apos;26 jersey ships from Miami in days, and El
                Boletín carries the city-by-city watch party list the week of
                every match. Two problems solved.
              </p>
              <div className="mt-8">
                <NewsletterForm dark />
              </div>
              <Link
                href="/futbol/hinchada"
                className="mt-6 inline-block text-sm font-bold tracking-[0.18em] text-amarillo uppercase underline-offset-4 hover:underline"
              >
                Arma la pinta completa: Guía de la hinchada →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mx-auto w-full max-w-sm bg-paper p-1 text-ink">
              {jersey && <ProductCard product={jersey} />}
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
