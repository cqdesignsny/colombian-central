import type { Metadata } from "next";
import Image from "next/image";
import { articles } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import NewsletterForm from "@/components/NewsletterForm";
import NewsFeed from "@/components/NewsFeed";

// ISR: El Paisa's news desk reads the DB; regenerate at most every 15 minutes.
export const revalidate = 900;

export const metadata: Metadata = {
  title: "Noticias: lo último de Colombia",
  description:
    "Daily Colombia news from El Paisa's desk: La Tricolor at the World Cup, the elections, the economy, culture and music, plus our own stories on food, travel and the diaspora.",
};

export default function NoticiasPage() {
  const [featured, ...rest] = [...articles].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <>
      {/* Hero: El Paisa delivers the news */}
      <section className="border-b border-linea pt-12 sm:pt-16">
        <div className="mx-auto grid max-w-7xl items-end gap-6 px-4 sm:px-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="pb-10 sm:pb-14">
            <Reveal>
              <p className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">
                <span className="flex gap-0.5" aria-hidden>
                  <span className="h-2 w-3 bg-amarillo" />
                  <span className="h-2 w-1.5 bg-azul" />
                  <span className="h-2 w-1.5 bg-rojo" />
                </span>
                Noticias
              </p>
              <h1 className="display-tight font-display text-[clamp(2.8rem,8vw,6rem)] uppercase">
                Lo último de Colombia
              </h1>
              <p className="font-reading mt-4 max-w-xl text-lg text-ink-soft">
                El Paisa reports the day&apos;s biggest Colombian stories, updated
                daily, from La Tricolor to the elections. Plus our own fútbol,
                música, comida and travel coverage, all in one place.
              </p>
            </Reveal>
          </div>
          <div className="relative mx-auto -mb-px h-72 w-full max-w-[20rem] self-end sm:h-80 lg:mx-0 lg:h-[26rem] lg:max-w-none">
            <Image
              src="/brand/El-Paisa.png"
              alt="El Paisa, nuestro corresponsal"
              fill
              priority
              sizes="(max-width: 1024px) 320px, 420px"
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </section>

      {/* El Paisa's live news desk (auto-updated daily) */}
      <NewsFeed />

      {/* Evergreen crónicas and guides */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Todo lo nuestro"
              title="Del fútbol a la mesa"
              sub="Every story we write across the site, fútbol, música, comida and viajes, plus the crónicas the family group chat argues about."
            />
          </Reveal>
          <div className="grid gap-5 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <ArticleCard article={featured} large />
            </Reveal>
            <div className="flex flex-col gap-5">
              {rest.slice(0, 2).map((article, i) => (
                <Reveal key={article.slug} delay={i * 0.07}>
                  <ArticleCard article={article} />
                </Reveal>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(2).map((article, i) => (
              <Reveal key={article.slug} delay={i * 0.06}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-linea bg-amarillo py-16">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="display-tight font-display text-4xl uppercase sm:text-5xl">
              No te pierdas ni una
            </h2>
            <p className="mt-2 max-w-md font-medium">
              El Boletín lands every Thursday with the week in lo colombiano.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
