import Link from "next/link";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  sub?: string;
  href?: string;
  linkLabel?: string;
  dark?: boolean;
};

export default function SectionHeader({
  eyebrow,
  title,
  sub,
  href,
  linkLabel = "Ver todo",
  dark = false,
}: SectionHeaderProps) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6 sm:mb-12">
      <div className="max-w-3xl">
        <p
          className={`mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.25em] uppercase ${
            dark ? "text-paper/60" : "text-ink-soft"
          }`}
        >
          <span className="flex gap-0.5" aria-hidden>
            <span className="h-2 w-3 bg-amarillo" />
            <span className="h-2 w-1.5 bg-azul" />
            <span className="h-2 w-1.5 bg-rojo" />
          </span>
          {eyebrow}
        </p>
        <h2
          className={`display-tight font-display text-4xl uppercase sm:text-6xl ${
            dark ? "text-paper" : "text-ink"
          }`}
        >
          {title}
        </h2>
        {sub && (
          <p
            className={`font-reading mt-4 max-w-xl text-lg ${dark ? "text-paper/70" : "text-ink-soft"}`}
          >
            {sub}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className={`group flex items-center gap-2 text-sm font-bold tracking-[0.2em] uppercase ${
            dark ? "text-amarillo" : "text-azul"
          }`}
        >
          {linkLabel}
          <span className="transition-transform group-hover:translate-x-1.5">
            →
          </span>
        </Link>
      )}
    </div>
  );
}
