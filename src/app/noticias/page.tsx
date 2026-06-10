import type { Metadata } from "next";
import { articles } from "@/data/articles";
import ArticleCard from "@/components/ArticleCard";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Noticias: fútbol, cultura y la diáspora",
  description:
    "Stories on La Tricolor, Colombian food, music, travel and the diaspora. Written by people who grew up with it.",
};

export default function NoticiasPage() {
  const [featured, ...rest] = [...articles].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return (
    <>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Noticias"
              title="Lo último de lo nuestro"
              sub="Fútbol, cultura, gastronomía, música, viajes. The stuff the family group chat argues about, written down properly."
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
