import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, categoryColors } from "@/data/articles";
import { formatArticleDate } from "@/lib/format";
import ArticleCard from "@/components/ArticleCard";
import Reveal from "@/components/Reveal";
import NewsletterForm from "@/components/NewsletterForm";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: { images: [{ url: article.image }] },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);
  const [lede, ...paragraphs] = article.body;

  return (
    <>
      <article className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            href="/noticias"
            className="text-xs font-bold tracking-[0.25em] text-ink-soft uppercase hover:text-azul"
          >
            ← Noticias
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span
              className={`px-2.5 py-1 text-[11px] font-bold tracking-[0.18em] uppercase ${categoryColors[article.category]}`}
            >
              {article.category}
            </span>
            <span className="text-xs font-bold tracking-[0.2em] text-ink-soft uppercase">
              {formatArticleDate(article.date)} · {article.readTime}
            </span>
          </div>
          <h1 className="display-tight mt-4 font-display text-4xl uppercase sm:text-6xl">
            {article.title}
          </h1>
          <p className="mt-6 font-serif text-2xl italic leading-snug text-ink-soft">
            {lede}
          </p>
        </div>
        <div className="mx-auto mt-10 max-w-5xl px-4 sm:px-6">
          <div className="relative aspect-[16/9] overflow-hidden border border-linea">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover"
            />
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-3xl space-y-6 px-4 text-[17px] leading-relaxed text-ink sm:px-6">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
          <div className="flex items-center gap-2 pt-4" aria-hidden>
            <span className="h-2.5 w-5 bg-amarillo" />
            <span className="h-2.5 w-2.5 bg-azul" />
            <span className="h-2.5 w-2.5 bg-rojo" />
          </div>
        </div>
      </article>

      <section className="border-t border-linea bg-crema py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <h2 className="display-tight mb-8 font-display text-3xl uppercase sm:text-4xl">
              Sigue leyendo
            </h2>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.06}>
                <ArticleCard article={a} />
              </Reveal>
            ))}
          </div>
          <div className="mt-12 flex flex-col items-start gap-4 border-t border-linea pt-10 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-md font-medium">
              Get the next one in your inbox. El Boletín, every Thursday.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
