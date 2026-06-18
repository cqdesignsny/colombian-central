import type { Metadata } from "next";
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
      <section className="pt-16 pb-10 sm:pt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Noticias"
              title="Lo último de Colombia"
              sub="El Paisa reports the day's biggest Colombian stories, updated daily, from La Tricolor to the elections. Below, our own crónicas and guides."
            />
          </Reveal>
        </div>
      </section>

      {/* El Paisa's live news desk (auto-updated daily) */}
      <NewsFeed />

      {/* Evergreen crónicas and guides */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Crónicas y guías"
              title="Más de lo nuestro"
              sub="The stuff the family group chat argues about, written down properly."
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
