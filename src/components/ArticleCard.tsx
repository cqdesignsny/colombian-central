import Link from "next/link";
import Image from "next/image";
import { categoryColors, type Article } from "@/data/articles";
import { formatArticleDate } from "@/lib/format";

export default function ArticleCard({
  article,
  large = false,
}: {
  article: Article;
  large?: boolean;
}) {
  return (
    <Link
      href={`/noticias/${article.slug}`}
      className="group flex h-full flex-col border-2 border-ink bg-paper transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-ink)]"
    >
      <div
        className={`relative overflow-hidden ${large ? "aspect-[16/9]" : "aspect-[3/2]"}`}
      >
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes={
            large
              ? "(max-width: 1024px) 100vw, 66vw"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold tracking-[0.18em] uppercase ${categoryColors[article.category]}`}
        >
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="mb-2 text-xs font-bold tracking-[0.2em] text-ink-soft uppercase">
          {formatArticleDate(article.date)} · {article.readTime}
        </p>
        <h3
          className={`display-tight font-display uppercase group-hover:text-azul ${
            large ? "text-3xl sm:text-4xl" : "text-2xl"
          }`}
        >
          {article.title}
        </h3>
        <p className="mt-3 line-clamp-2 text-sm text-ink-soft">
          {article.excerpt}
        </p>
        <span className="mt-4 text-xs font-bold tracking-[0.25em] text-rojo uppercase">
          Leer →
        </span>
      </div>
    </Link>
  );
}
