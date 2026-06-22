import type { Metadata } from "next";
import Link from "next/link";
import { articles } from "@/data/articles";
import { getArchiveStories } from "@/lib/paisa-stories";
import Reveal from "@/components/Reveal";

export const revalidate = 900;

export const metadata: Metadata = {
  title: "Hemeroteca: el archivo de Colombian Central",
  description:
    "The full library of everything we have published: every El Paisa news story and every crónica, oldest to newest, all in one index.",
};

type ArchiveEntry = {
  slug: string;
  title: string;
  label: string;
  date: string; // ISO or YYYY-MM-DD
};

/** Normalize any date value to its New York calendar day, as YYYY-MM-DD. */
function etDateKey(value: string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value.slice(0, 10);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

// The entry date is already a stable YYYY-MM-DD key; format it in UTC so it never
// shifts a day across timezones.
function monthLabel(key: string): string {
  const d = new Date(`${key}T00:00:00Z`);
  if (isNaN(d.getTime())) return "Sin fecha";
  return new Intl.DateTimeFormat("es", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  }).format(d);
}

function dayLabel(key: string): string {
  const d = new Date(`${key}T00:00:00Z`);
  if (isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("es", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
  }).format(d);
}

export default async function HemerotecaPage() {
  const stories = await getArchiveStories(400);

  const entries: ArchiveEntry[] = [
    ...articles.map((a) => ({
      slug: a.slug,
      title: a.title,
      label: a.category,
      date: a.date,
    })),
    ...stories.map((s) => ({
      slug: s.slug,
      title: s.title,
      label: s.category,
      date: etDateKey(s.created_at),
    })),
  ];

  // Newest first, de-duped by slug (a story and a seed should never both appear).
  const seen = new Set<string>();
  const sorted = entries
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((e) => (seen.has(e.slug) ? false : (seen.add(e.slug), true)));

  // Group into months, preserving newest-first order.
  const groups: Array<{ month: string; items: ArchiveEntry[] }> = [];
  for (const entry of sorted) {
    const month = monthLabel(entry.date);
    const last = groups[groups.length - 1];
    if (last && last.month === month) last.items.push(entry);
    else groups.push({ month, items: [entry] });
  }

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <Link
            href="/noticias"
            className="text-xs font-bold tracking-[0.25em] text-ink-soft uppercase hover:text-azul"
          >
            ← Noticias
          </Link>
          <p className="mt-6 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">
            <span className="flex gap-0.5" aria-hidden>
              <span className="h-2 w-3 bg-amarillo" />
              <span className="h-2 w-1.5 bg-azul" />
              <span className="h-2 w-1.5 bg-rojo" />
            </span>
            Hemeroteca
          </p>
          <h1 className="display-tight mt-3 font-display text-[clamp(2.6rem,7vw,5rem)] uppercase">
            El archivo completo
          </h1>
          <p className="font-reading mt-4 max-w-2xl text-lg text-ink-soft">
            Everything we have published, oldest to newest. The front pages show
            the last two months; this is the whole library, {sorted.length}{" "}
            {sorted.length === 1 ? "historia" : "historias"} y contando.
          </p>
        </Reveal>

        <div className="mt-12 space-y-12">
          {groups.map((group) => (
            <div key={group.month}>
              <h2 className="display-tight mb-4 border-b-2 border-ink pb-2 font-display text-2xl uppercase sm:text-3xl">
                {group.month}
              </h2>
              <ul className="divide-y divide-linea">
                {group.items.map((entry) => (
                  <li key={entry.slug}>
                    <Link
                      href={`/noticias/${entry.slug}`}
                      className="group flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-5"
                    >
                      <span className="shrink-0 text-xs font-bold tracking-[0.2em] text-ink-soft uppercase sm:w-28">
                        {dayLabel(entry.date)} · {entry.label}
                      </span>
                      <span className="font-reading text-lg leading-snug text-ink group-hover:text-azul">
                        {entry.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
