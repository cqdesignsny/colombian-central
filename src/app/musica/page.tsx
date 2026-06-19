import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { artists, genres, concerts, musicIntro } from "@/data/musica";
import { getSectionNews } from "@/lib/section-news";
import { ticketmasterSearch } from "@/config/partners";
import SectionHeader from "@/components/SectionHeader";
import ArticleCard from "@/components/ArticleCard";
import Reveal from "@/components/Reveal";
import TricolorBar from "@/components/TricolorBar";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Música: la banda sonora de Colombia",
  description:
    "Colombian music: the top artists in reggaetón, vallenato, salsa and cumbia, a guide to the genres, and upcoming concerts across the US in 2026.",
};

const statusStyle: Record<string, { label: string; cls: string }> = {
  confirmed: { label: "Confirmado", cls: "bg-amarillo text-ink" },
  partial: { label: "Fechas parciales", cls: "bg-azul text-paper" },
  tba: { label: "Por anunciar", cls: "border border-ink/30 text-ink-soft" },
};

export const revalidate = 900;

export default async function MusicaPage() {
  const musicaNews = await getSectionNews("musica", 3);
  return (
    <>
      {/* Hero (dark, concert energy) */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <Image
          src={musicIntro.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/50" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6">
          <Reveal>
            <p className="mb-4 text-xs font-bold tracking-[0.3em] text-amarillo uppercase">
              Música · La cultura
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-tight font-display text-[clamp(2.8rem,9vw,7rem)] uppercase">
              La banda sonora de Colombia
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="font-reading mt-5 max-w-2xl text-lg text-paper/80">{musicIntro.lede}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <a
              href="#artistas"
              className="mt-8 inline-block border-2 border-amarillo bg-amarillo px-7 py-4 text-sm font-bold tracking-[0.2em] text-ink uppercase transition-transform hover:-translate-y-0.5"
            >
              Conoce a los artistas
            </a>
          </Reveal>
        </div>
        <TricolorBar className="relative z-10 h-2" />
      </section>

      {/* Music news */}
      <section className="border-b border-linea bg-crema py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Lo último"
              title="Noticias de la música"
              sub="What is moving in Colombian music right now, from stadium tours to the folclor filling stages."
              href="/noticias"
              linkLabel="Todas las noticias"
            />
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {musicaNews.map((article, i) => (
              <Reveal key={article.slug} delay={(i % 3) * 0.06}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Genres */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Los géneros"
              title="De dónde viene el sabor"
              sub="Six sounds that built a country. Each one a region, a rhythm, a way of dancing."
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {genres.map((g, i) => (
              <Reveal key={g.name} delay={(i % 3) * 0.05}>
                <div className="flex h-full flex-col border-2 border-ink bg-crema p-6">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="display-tight font-display text-3xl uppercase">{g.name}</h3>
                    <span className="text-[11px] font-bold tracking-[0.15em] text-rojo uppercase">
                      {g.region}
                    </span>
                  </div>
                  <p className="font-reading mt-3 text-sm text-ink-soft">{g.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Artists */}
      <section id="artistas" className="scroll-mt-24 border-y border-linea bg-crema py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Los artistas"
              title="Quién suena ahora"
              sub="From global superstars to the ones your tío won't stop playing at the asado."
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((a, i) => (
              <Reveal key={a.name} delay={(i % 3) * 0.05}>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${a.name} música`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col border-2 border-ink/20 bg-paper p-6 transition-transform hover:-translate-y-1 hover:border-ink hover:shadow-[6px_6px_0_0_var(--color-ink)]"
                >
                  <span className="self-start bg-azul px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] text-paper uppercase">
                    {a.genre}
                  </span>
                  <h3 className="display-tight mt-3 font-display text-3xl uppercase">{a.name}</h3>
                  <p className="font-reading mt-2 flex-1 text-sm text-ink-soft">{a.note}</p>
                  <span className="mt-4 text-xs font-bold tracking-[0.2em] text-rojo uppercase">
                    Escuchar →
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Concerts */}
      <section id="conciertos" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="En vivo"
              title="Conciertos en EE.UU. 2026"
              sub="Colombian artists touring the States this year. Dates verified June 2026, but tours move, so confirm before you buy."
            />
          </Reveal>
          <div className="space-y-4">
            {concerts.map((c, i) => {
              const s = statusStyle[c.status];
              return (
                <Reveal key={c.artist} delay={i * 0.04}>
                  <div className="flex flex-col gap-4 border-2 border-ink bg-paper p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="display-tight font-display text-2xl uppercase">{c.artist}</h3>
                        <span className={`px-2 py-0.5 text-[10px] font-bold tracking-[0.18em] uppercase ${s.cls}`}>
                          {s.label}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-bold tracking-[0.1em] text-azul uppercase">
                        {c.tour}
                      </p>
                      <p className="font-reading mt-1 text-sm text-ink-soft">{c.cities}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-5 sm:justify-end">
                      <div className="sm:text-right">
                        <p className="font-display text-xl uppercase">{c.window}</p>
                        <p className="text-[11px] font-bold tracking-[0.2em] text-ink-soft uppercase">
                          {c.scale}
                        </p>
                      </div>
                      <a
                        href={ticketmasterSearch(`${c.artist} tour`)}
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                        className="shrink-0 border-2 border-ink bg-amarillo px-4 py-2.5 text-xs font-bold tracking-[0.18em] text-ink uppercase shadow-[3px_3px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5"
                      >
                        Buscar entradas →
                      </a>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
          <Reveal>
            <p className="font-reading mt-6 text-xs text-ink-soft/70">
              Ticket links go to Ticketmaster, where you can check dates and
              prices for your city. Tours move, so confirm before you buy.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-linea pb-4">
        <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6">
          <div className="border-2 border-ink bg-ink p-8 text-paper sm:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-bold tracking-[0.25em] text-amarillo uppercase">
                  El Boletín
                </p>
                <h2 className="display-tight font-display text-4xl uppercase sm:text-5xl">
                  No te pierdas un concierto
                </h2>
                <p className="font-reading mt-4 max-w-md text-paper/75">
                  We track every Colombian artist coming through the US. Join El Boletín and we
                  ping you when tickets drop in your city.
                </p>
              </div>
              <div className="lg:justify-self-end">
                <NewsletterForm dark />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
          <p className="mb-4 text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">
            Sigue explorando
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/comida"
              className="border-2 border-ink bg-paper px-5 py-3 text-sm font-bold tracking-[0.12em] uppercase transition-transform hover:-translate-y-0.5"
            >
              Comida colombiana →
            </Link>
            <Link
              href="/futbol"
              className="border-2 border-ink bg-paper px-5 py-3 text-sm font-bold tracking-[0.12em] uppercase transition-transform hover:-translate-y-0.5"
            >
              La Tricolor →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
