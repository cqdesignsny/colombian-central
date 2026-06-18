import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles, categoryColors } from "@/data/articles";
import {
  getStoryBySlug,
  getLatestStories,
  categoryImage,
} from "@/lib/paisa-stories";
import { formatArticleDate } from "@/lib/format";
import { site } from "@/config/site";
import ArticleCard from "@/components/ArticleCard";
import Reveal from "@/components/Reveal";
import NewsletterForm from "@/components/NewsletterForm";
import JsonLd from "@/components/JsonLd";
import { articleLd } from "@/lib/jsonld";

// Static articles are prebuilt; El Paisa's DB stories render on demand (ISR).
export const revalidate = 900;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

function storyDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (article) {
    return {
      title: article.title,
      description: article.excerpt,
      openGraph: { images: [{ url: article.image }] },
    };
  }
  const story = await getStoryBySlug(slug);
  if (story) {
    return {
      title: story.title,
      description: story.dek ?? undefined,
      openGraph: {
        images: [{ url: story.image || categoryImage(story.category) }],
        type: "article",
      },
    };
  }
  return {};
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  // Evergreen, hand-written article.
  if (article) {
    const related = articles.filter((a) => a.slug !== article.slug).slice(0, 3);
    const [lede, ...paragraphs] = article.body;
    return (
      <>
        <JsonLd data={articleLd(article)} />
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
          <div className="font-reading mx-auto mt-10 max-w-3xl space-y-6 px-4 text-[19px] leading-relaxed text-ink sm:px-6">
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
          </div>
        </section>
      </>
    );
  }

  // El Paisa's daily news story (from the DB).
  const story = await getStoryBySlug(slug);
  if (!story) notFound();

  const img = story.image || categoryImage(story.category);
  const paragraphs = story.body.split(/\n+/).filter((p) => p.trim().length > 0);
  const related = (await getLatestStories(4)).filter((s) => s.slug !== story.slug).slice(0, 3);

  const newsLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: story.title,
    description: story.dek ?? undefined,
    image: img.startsWith("http") ? img : `${site.url}${img}`,
    datePublished: story.created_at,
    dateModified: story.created_at,
    articleSection: story.category,
    inLanguage: "en-US",
    author: { "@type": "Organization", name: site.brand, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.brand,
      logo: {
        "@type": "ImageObject",
        url: `${site.url}/brand/Col-Central_logo-New.png`,
      },
    },
    mainEntityOfPage: `${site.url}/noticias/${story.slug}`,
  };

  return (
    <>
      <JsonLd data={newsLd} />
      <article className="py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            href="/noticias"
            className="text-xs font-bold tracking-[0.25em] text-ink-soft uppercase hover:text-azul"
          >
            ← Noticias
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="bg-amarillo px-2.5 py-1 text-[11px] font-bold tracking-[0.18em] text-ink uppercase">
              {story.category}
            </span>
            <span className="text-xs font-bold tracking-[0.2em] text-ink-soft uppercase">
              {storyDate(story.created_at)} · Reportado por El Paisa
            </span>
          </div>
          <h1 className="display-tight mt-4 font-display text-4xl uppercase sm:text-6xl">
            {story.title}
          </h1>
          {story.dek && (
            <p className="mt-6 font-serif text-2xl italic leading-snug text-ink-soft">
              {story.dek}
            </p>
          )}
        </div>
        <div className="mx-auto mt-10 max-w-5xl px-4 sm:px-6">
          <div className="relative aspect-[16/9] overflow-hidden border border-linea">
            <Image
              src={img}
              alt={story.title}
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

          {story.sources.length > 0 && (
            <div className="border-t border-linea pt-5">
              <p className="text-xs font-bold tracking-[0.2em] text-ink-soft uppercase">
                Fuentes
              </p>
              <ul className="mt-2 space-y-1">
                {story.sources.map((src, i) => (
                  <li key={i} className="text-sm">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="text-azul underline underline-offset-2 hover:opacity-70"
                    >
                      {src.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* El Paisa byline */}
          <div className="mt-4 flex items-center gap-4 border-t border-linea pt-6">
            <span className="relative h-24 w-20 shrink-0">
              <Image
                src="/brand/El-Paisa.png"
                alt="El Paisa"
                fill
                sizes="80px"
                className="object-contain object-bottom"
              />
            </span>
            <p className="text-sm text-ink-soft">
              Reportado por <strong className="text-ink">El Paisa</strong>, nuestro
              corresponsal colombiano.
            </p>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-linea bg-crema py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <Reveal>
              <h2 className="display-tight mb-8 font-display text-3xl uppercase sm:text-4xl">
                Más noticias
              </h2>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((s) => (
                <Link
                  key={s.id}
                  href={`/noticias/${s.slug}`}
                  className="group flex h-full flex-col border-2 border-ink bg-paper transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-ink)]"
                >
                  <div className="relative aspect-[3/2] w-full overflow-hidden">
                    <Image
                      src={s.image || categoryImage(s.category)}
                      alt={s.title}
                      fill
                      sizes="(min-width:768px) 33vw, 100vw"
                      className="object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-amarillo px-2 py-0.5 text-[10px] font-bold tracking-[0.18em] text-ink uppercase">
                      {s.category}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="display-tight font-display text-xl uppercase">
                      {s.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-linea bg-amarillo py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-md font-medium">
            Get the day&apos;s Colombia headlines in your inbox. El Boletín, every
            Thursday.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
