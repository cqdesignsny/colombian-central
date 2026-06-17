import Link from "next/link";
import Image from "next/image";
import { getLatestPaisaPosts } from "@/lib/paisa-posts";

/**
 * "El Escritorio de El Paisa": the feed El Paisa writes himself (see
 * /api/paisa/refresh). Async server component. Renders nothing until he has
 * posted, so the page is never broken while the desk is empty.
 */
export default async function PaisaDesk() {
  const posts = await getLatestPaisaPosts(6);
  if (posts.length === 0) return null;

  return (
    <section className="border-y border-linea bg-crema py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-8 flex items-center gap-3">
          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-ink bg-paper">
            <Image
              src="/images/paisa/el-paisa.png"
              alt="El Paisa"
              fill
              sizes="48px"
              className="origin-top scale-[1.55] object-cover object-top"
            />
          </span>
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-rojo uppercase">
              El Escritorio de El Paisa
            </p>
            <h2 className="display-tight font-display text-3xl uppercase sm:text-4xl">
              Lo que dice El Paisa
            </h2>
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((p) => (
            <article
              key={p.id}
              className="flex h-full flex-col border-2 border-ink bg-paper p-5"
            >
              <span className="self-start bg-amarillo px-2 py-0.5 text-[10px] font-bold tracking-[0.18em] text-ink uppercase">
                {p.category}
              </span>
              <h3 className="display-tight mt-3 font-display text-2xl uppercase">{p.title}</h3>
              <p className="mt-2 flex-1 text-sm text-ink-soft">{p.body}</p>
              {p.link && (
                <Link
                  href={p.link}
                  className="mt-4 text-xs font-bold tracking-[0.18em] text-azul uppercase underline-offset-4 hover:underline"
                >
                  Ver más →
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
