import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { recipes, restaurantsByMetro, foodWays, comidaIntro } from "@/data/comida";
import { articlesForSection } from "@/data/articles";
import SectionHeader from "@/components/SectionHeader";
import ArticleCard from "@/components/ArticleCard";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Comida: recetas y restaurantes colombianos",
  description:
    "Cook authentic Colombian food with real recipes (arepas, bandeja paisa, ajiaco, sancocho), find Colombian restaurants in your US city, or stock your pantry. Comida de verdad.",
};

const mapsSearch = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const recipeImg: Record<string, string> = {
  "Arepa de Queso": "/images/comida/arepa.jpg",
  "Bandeja Paisa": "/images/comida/bandeja-paisa.jpg",
  "Ajiaco Santafereño": "/images/comida/ajiaco.jpg",
  "Empanadas Colombianas": "/images/comida/empanadas.jpg",
  "Sancocho": "/images/comida/sancocho.jpg",
  "Patacones": "/images/comida/patacones.jpg",
};

export default function ComidaPage() {
  const comidaNews = articlesForSection("comida", 3);
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-linea bg-paper">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pt-32 pb-16 sm:px-6 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="mb-4 flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">
                <span className="flex gap-0.5" aria-hidden>
                  <span className="h-2 w-3 bg-amarillo" />
                  <span className="h-2 w-1.5 bg-azul" />
                  <span className="h-2 w-1.5 bg-rojo" />
                </span>
                Comida · La cultura
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="display-tight font-display text-[clamp(2.8rem,8vw,6rem)] uppercase">
                El sabor de la tierra
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="font-reading mt-5 max-w-xl text-lg text-ink-soft">{comidaIntro.lede}</p>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-ink shadow-[8px_8px_0_0_var(--color-ink)]">
              <Image
                src={comidaIntro.heroImage}
                alt="Un festín colombiano: bandeja paisa, arepas, empanadas y ajiaco"
                fill
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Food news */}
      <section className="border-b border-linea bg-crema py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Del fogón"
              title="Novedades del sabor"
              sub="Colombian food news, from Michelin recognition to the arepa spots taking over US food halls."
              href="/noticias"
              linkLabel="Todas las noticias"
            />
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {comidaNews.map((article, i) => (
              <Reveal key={article.slug} delay={(i % 3) * 0.06}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ways to experience it */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Cuatro maneras"
              title="Vívela como quieras"
              sub="Cook it, find it near you, stock your pantry, or eat your way through Colombia."
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {foodWays.map((w, i) => (
              <Reveal key={w.title} delay={i * 0.05}>
                <Link
                  href={w.href}
                  className="flex h-full flex-col border-2 border-ink bg-crema p-6 transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-ink)]"
                >
                  <h3 className="display-tight font-display text-2xl uppercase">{w.title}</h3>
                  <p className="font-reading mt-2 flex-1 text-sm text-ink-soft">{w.desc}</p>
                  <span className="mt-4 text-xs font-bold tracking-[0.18em] text-azul uppercase">
                    {w.cta} →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Recipes */}
      <section id="recetas" className="scroll-mt-24 border-y border-linea bg-crema py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Recetas"
              title="Cocina lo nuestro"
              sub="The dishes every Colombian grew up on, the way they are actually made. Tap a recipe for the full ingredients and steps."
            />
          </Reveal>
          <div className="grid items-start gap-5 lg:grid-cols-2">
            {recipes.map((r, i) => (
              <Reveal key={r.name} delay={(i % 2) * 0.06}>
                <details className="group h-full overflow-hidden border-2 border-ink bg-paper">
                  <summary className="cursor-pointer list-none">
                    <div className="relative aspect-[16/9] w-full overflow-hidden border-b-2 border-ink">
                      <Image
                        src={recipeImg[r.name] ?? comidaIntro.heroImage}
                        alt={r.name}
                        fill
                        sizes="(max-width:1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex items-start justify-between gap-4 p-5">
                      <div>
                        <p className="text-[11px] font-bold tracking-[0.2em] text-rojo uppercase">
                          {r.region} · {r.time} · {r.difficulty}
                        </p>
                        <h3 className="display-tight mt-1 font-display text-3xl uppercase">{r.name}</h3>
                        <p className="font-reading mt-2 text-sm text-ink-soft">{r.blurb}</p>
                      </div>
                      <span
                        className="mt-1 font-display text-3xl text-azul transition-transform group-open:rotate-45"
                        aria-hidden
                      >
                        +
                      </span>
                    </div>
                  </summary>
                  <div className="border-t border-linea p-5">
                    <p className="text-[11px] font-bold tracking-[0.2em] text-ink-soft uppercase">
                      Ingredientes
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {r.ingredients.map((ing) => (
                        <li key={ing} className="flex items-start gap-2 text-sm text-ink-soft">
                          <span className="mt-0.5 font-bold text-amarillo" aria-hidden>
                            ✓
                          </span>
                          {ing}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-[11px] font-bold tracking-[0.2em] text-ink-soft uppercase">
                      Preparación
                    </p>
                    <ol className="mt-2 space-y-2.5">
                      {r.steps.map((step, n) => (
                        <li key={step} className="flex gap-3 text-sm text-ink-soft">
                          <span className="font-display text-xl text-rojo">{n + 1}</span>
                          <span className="pt-0.5">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Restaurant finder */}
      <section id="restaurantes" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Buscador"
              title="Comida colombiana cerca de ti"
              sub="The standout Colombian spots in the cities where la diáspora lives. Not in one of these? Use the button to find one near you."
            />
          </Reveal>

          <Reveal>
            <a
              href={mapsSearch("colombian restaurant")}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-8 inline-block border-2 border-ink bg-amarillo px-7 py-4 text-sm font-bold tracking-[0.2em] text-ink uppercase transition-transform hover:-translate-y-0.5"
            >
              Buscar cerca de mí →
            </a>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {restaurantsByMetro.map((m, i) => (
              <Reveal key={m.metro} delay={(i % 3) * 0.05}>
                <div className="flex h-full flex-col border-2 border-ink bg-paper p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="display-tight font-display text-2xl uppercase">{m.metro}</h3>
                    <a
                      href={mapsSearch(m.mapsQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-[11px] font-bold tracking-[0.15em] text-azul uppercase underline-offset-4 hover:underline"
                    >
                      Mapa →
                    </a>
                  </div>
                  <ul className="mt-4 space-y-3">
                    {m.restaurants.map((rest) => (
                      <li key={rest.name} className="border-t border-linea pt-3">
                        <p className="text-sm font-bold">{rest.name}</p>
                        <p className="text-xs font-bold tracking-[0.1em] text-ink-soft uppercase">
                          {rest.area}
                        </p>
                        <p className="font-reading mt-0.5 text-xs text-ink-soft">{rest.specialty}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-6 text-xs text-ink-soft/70">
              Restaurants change. Confirm hours before you go, and tell us your favorite we missed.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Pantry cross-sell */}
      <section className="border-t border-linea bg-ink py-16 text-paper sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-bold tracking-[0.25em] text-amarillo uppercase">
                Surte la despensa
              </p>
              <h2 className="display-tight font-display text-4xl uppercase sm:text-5xl">
                Lleva la tienda a tu cocina
              </h2>
              <p className="font-reading mt-4 max-w-md text-paper/75">
                Café de origen, bocadillo veleño, the chocolatera for your hot chocolate. The
                staples of a Colombian kitchen, shipped from Miami.
              </p>
            </div>
            <div className="lg:justify-self-end">
              <Link
                href="/tienda"
                className="inline-block border-2 border-amarillo bg-amarillo px-7 py-4 text-sm font-bold tracking-[0.2em] text-ink uppercase transition-transform hover:-translate-y-0.5"
              >
                Ir a la tienda
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* More */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
          <p className="mb-4 text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">
            Sigue explorando
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/musica"
              className="border-2 border-ink bg-paper px-5 py-3 text-sm font-bold tracking-[0.12em] uppercase transition-transform hover:-translate-y-0.5"
            >
              Música colombiana →
            </Link>
            <Link
              href="/viajes"
              className="border-2 border-ink bg-paper px-5 py-3 text-sm font-bold tracking-[0.12em] uppercase transition-transform hover:-translate-y-0.5"
            >
              Viajes a Colombia →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
