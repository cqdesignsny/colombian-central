import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { worldCup } from "@/data/futbol";
import { products } from "@/data/products";
import { destinations } from "@/data/destinations";
import { articles } from "@/data/articles";
import { formatKickoff } from "@/lib/format";
import Ticker from "@/components/Ticker";
import Countdown from "@/components/Countdown";
import Reveal from "@/components/Reveal";
import SectionHeader from "@/components/SectionHeader";
import ProductCard from "@/components/ProductCard";
import ArticleCard from "@/components/ArticleCard";
import DestinationCard from "@/components/DestinationCard";
import MatchCard from "@/components/MatchCard";
import NewsletterForm from "@/components/NewsletterForm";
import Stamp from "@/components/Stamp";

const tickerItems = [
  "Mundial 2026 · Grupo K",
  "Colombia vs Uzbekistan · Jun 17 · Estadio Azteca",
  "Colombia vs DR Congo · Jun 23 · Guadalajara",
  "Colombia vs Portugal · Jun 27 · Miami",
  "Todo lo nuestro, en un solo lugar",
];

export default function Home() {
  const debut = formatKickoff(worldCup.debutKickoff);

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-[92svh] items-end overflow-hidden bg-ink">
        <Image
          src="/images/hero-cartagena.jpg"
          alt="Golden hour on a colonial street in Cartagena"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />
        <Stamp className="absolute top-10 right-6 hidden h-32 w-32 text-paper/90 sm:block lg:right-12 lg:h-40 lg:w-40" />

        <div className="relative mx-auto w-full max-w-7xl px-4 pt-40 pb-16 sm:px-6 sm:pb-20">
          <Reveal>
            <p className="mb-5 inline-flex items-center gap-3 border border-paper/40 px-3 py-1.5 text-xs font-bold tracking-[0.25em] text-paper uppercase backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-amarillo" />
              Grupo K · Debut {debut.date} · Estadio Azteca
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-tight max-w-5xl font-display text-[clamp(3.2rem,10vw,8.5rem)] text-paper uppercase">
              Todo lo nuestro,
              <br />
              <span className="text-amarillo">en un solo lugar.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-lg text-paper/85">
              Colombian news, La Tricolor at the World Cup, products from back
              home, and trips to the motherland. If it&apos;s Colombian, it
              lives here.
            </p>
          </Reveal>
          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/futbol"
                className="border-2 border-amarillo bg-amarillo px-7 py-4 text-sm font-bold tracking-[0.2em] text-ink uppercase transition-transform hover:-translate-y-0.5"
              >
                El Mundial empieza ya
              </Link>
              <Link
                href="/viajes"
                className="border-2 border-paper/70 px-7 py-4 text-sm font-bold tracking-[0.2em] text-paper uppercase transition-colors hover:bg-paper hover:text-ink"
              >
                Plan your trip
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Ticker items={tickerItems} />

      {/* World Cup */}
      <section className="bg-ink py-20 text-paper sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <Reveal>
              <div>
                <SectionHeader
                  dark
                  eyebrow="Rumbo al Mundial 2026"
                  title="La Tricolor está de vuelta"
                  sub="Seventh World Cup. A squad in its prime. Three group matches, and two of them within driving distance of half the diaspora. It does not get better than this."
                />
                <p className="mb-4 text-xs font-bold tracking-[0.25em] text-paper/60 uppercase">
                  Countdown to the debut · {debut.weekday} {debut.date} ·{" "}
                  {debut.time}
                </p>
                <Countdown target={worldCup.debutKickoff} light />
                <Link
                  href="/futbol"
                  className="group mt-10 inline-flex items-center gap-2 text-sm font-bold tracking-[0.2em] text-amarillo uppercase"
                >
                  Fixtures, squad y más
                  <span className="transition-transform group-hover:translate-x-1.5">
                    →
                  </span>
                </Link>
              </div>
            </Reveal>
            <div className="flex flex-col gap-4">
              {worldCup.fixtures.map((fixture, i) => (
                <Reveal key={fixture.matchday} delay={i * 0.08}>
                  <MatchCard fixture={fixture} light />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shop */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="La Tienda"
              title="De Colombia, pa' tu casa"
              sub="Coffee from real fincas, artesanías sourced straight from the people who make them, and fan gear for the Mundial."
              href="/tienda"
              linkLabel="Toda la tienda"
            />
          </Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product, i) => (
              <Reveal key={product.slug} delay={i * 0.06}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-6 text-sm text-ink-soft">
              Free U.S. shipping on orders over $75 · Ships from Miami ·
              Artisan-direct sourcing
            </p>
          </Reveal>
        </div>
      </section>

      {/* Travel */}
      <section className="border-y border-linea bg-crema py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Viajes"
              title="¿Listo pa' la tierrita?"
              sub="Trips planned by Colombians who have actually slept in the hammock, ridden the Willys, and missed the last boat back. Tell us the trip, we build it."
              href="/viajes"
              linkLabel="Planear mi viaje"
            />
          </Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.slice(0, 6).map((destination, i) => (
              <Reveal key={destination.slug} delay={i * 0.05}>
                <DestinationCard destination={destination} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Noticias"
              title="Lo último de lo nuestro"
              sub="Fútbol, cultura, food, music, and the diaspora. Written by people who grew up with it."
              href="/noticias"
              linkLabel="Todas las notas"
            />
          </Reveal>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {articles.slice(0, 3).map((article, i) => (
              <Reveal key={article.slug} delay={i * 0.06}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Culture band */}
      <section className="border-y border-linea bg-paper py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="mx-auto max-w-4xl text-center font-serif text-3xl italic sm:text-5xl">
              «Colombia no es solo un país.
              <span className="text-rojo"> Es un sentimiento.</span>»
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-6 text-center lg:grid-cols-4">
            {[
              { big: "Nº 1", small: "in bird species on Earth" },
              { big: "4,200+", small: "orchid species, most anywhere" },
              { big: "2", small: "oceans, one country" },
              { big: "32", small: "departamentos, infinite pueblos" },
            ].map((stat, i) => (
              <Reveal key={stat.small} delay={i * 0.06}>
                <div className="border border-linea bg-crema px-4 py-8">
                  <p className="font-display text-4xl sm:text-5xl">{stat.big}</p>
                  <p className="mt-2 text-xs font-bold tracking-[0.15em] text-ink-soft uppercase">
                    {stat.small}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-amarillo py-20 sm:py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <Reveal>
            <div>
              <h2 className="display-tight font-display text-5xl uppercase sm:text-7xl">
                El Boletín
              </h2>
              <p className="mt-4 max-w-md text-base font-medium">
                One email a week: La Tricolor, new drops, travel deals, and the
                best of la cultura. Cero spam, puro contenido.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="w-full max-w-md">
            <NewsletterForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
