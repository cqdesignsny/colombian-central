import Link from "next/link";
import Image from "next/image";
import {
  getLatestStories,
  categoryImage,
  type PaisaStory,
} from "@/lib/paisa-stories";

function storyDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

function StoryCard({ s, large = false }: { s: PaisaStory; large?: boolean }) {
  const img = s.image || categoryImage(s.category);
  return (
    <Link
      href={`/noticias/${s.slug}`}
      className="group flex h-full flex-col border-2 border-ink bg-paper transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-ink)]"
    >
      <div
        className={`relative w-full overflow-hidden ${large ? "aspect-[16/9]" : "aspect-[3/2]"}`}
      >
        <Image
          src={img}
          alt={s.title}
          fill
          sizes={large ? "(min-width:1024px) 66vw, 100vw" : "(min-width:1024px) 33vw, 100vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 bg-amarillo px-2 py-0.5 text-[10px] font-bold tracking-[0.18em] text-ink uppercase">
          {s.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3
          className={`display-tight font-display uppercase ${large ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"}`}
        >
          {s.title}
        </h3>
        {s.dek && <p className="mt-2 flex-1 text-sm text-ink-soft">{s.dek}</p>}
        <p className="mt-3 text-[11px] font-bold tracking-[0.2em] text-ink-soft uppercase">
          {storyDate(s.created_at)} · El Paisa
        </p>
      </div>
    </Link>
  );
}

/**
 * El Paisa's live news desk: the stories he writes himself each day (see
 * /api/paisa/refresh). Async server component; renders nothing until he has
 * published, so the page is never broken while the desk is empty.
 */
export default async function NewsFeed() {
  const stories = await getLatestStories(9);
  if (stories.length === 0) return null;
  const [lead, ...rest] = stories;

  return (
    <section className="border-b border-linea pb-16 sm:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex items-center gap-4">
          <span className="relative h-20 w-16 shrink-0 overflow-hidden">
            <Image
              src="/brand/El-Paisa.png"
              alt="El Paisa, reportero"
              fill
              sizes="64px"
              className="object-contain object-bottom"
            />
          </span>
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-rojo uppercase">
              El Escritorio de El Paisa
            </p>
            <h2 className="display-tight font-display text-3xl uppercase sm:text-4xl">
              Noticias al día
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Lo más reciente de Colombia, reportado por El Paisa todos los días.
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StoryCard s={lead} large />
          </div>
          <div className="flex flex-col gap-5">
            {rest.slice(0, 2).map((s) => (
              <StoryCard key={s.id} s={s} />
            ))}
          </div>
        </div>
        {rest.length > 2 && (
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(2).map((s) => (
              <StoryCard key={s.id} s={s} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
