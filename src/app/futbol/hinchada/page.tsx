import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import { fanGearIntro, ourPicks, amazonPicks } from "@/data/fangear";
import { amazonSearch } from "@/config/partners";
import { formatPrice } from "@/lib/format";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import TricolorBar from "@/components/TricolorBar";
import AffiliateLink from "@/components/AffiliateLink";
import AffiliateDisclosure from "@/components/AffiliateDisclosure";

export const metadata: Metadata = {
  title: "Guía de la hinchada: qué ponerte para el Mundial de Colombia 2026",
  description:
    "The Colombia fan gear guide for the 2026 World Cup. Start with our own jersey, bracelets and sombrero vueltiao, then flags, scarves, face paint and more. Vístete de amarillo.",
};

export default function HinchadaPage() {
  return (
    <>
      {/* Hero (dark, matches the fútbol section) */}
      <section className="relative overflow-hidden bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-4 pt-32 pb-16 sm:px-6">
          <Reveal>
            <p className="mb-4 text-xs font-bold tracking-[0.3em] text-amarillo uppercase">
              Guías · La hinchada
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="display-tight font-display text-[clamp(2.8rem,9vw,7rem)] uppercase">
              Vístete de amarillo
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-5 max-w-2xl text-lg text-paper/80">{fanGearIntro.lede}</p>
          </Reveal>
          <Reveal delay={0.24}>
            <Link
              href="#lo-nuestro"
              className="mt-8 inline-block border-2 border-amarillo bg-amarillo px-7 py-4 text-sm font-bold tracking-[0.2em] text-ink uppercase transition-transform hover:-translate-y-0.5"
            >
              Arma tu pinta
            </Link>
          </Reveal>
        </div>
        <TricolorBar className="h-2" />
      </section>

      {/* Disclosure */}
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <Reveal>
          <AffiliateDisclosure />
        </Reveal>
      </div>

      {/* Our shop, front and center */}
      <section id="lo-nuestro" className="scroll-mt-24 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Lo nuestro primero"
              title="Hecho con corazón"
              sub="Start here. These are ours, made and shipped from Miami, full margin to keep the lights on. Authentic beats generic every time."
              href="/tienda"
              linkLabel="Ver la tienda"
            />
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ourPicks.map((pick, i) => {
              const product = products.find((p) => p.slug === pick.slug);
              if (!product) return null;
              return (
                <Reveal key={pick.slug} delay={i * 0.06}>
                  <Link
                    href={`/tienda/${product.slug}`}
                    className="group flex h-full flex-col border-2 border-ink bg-paper transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-ink)]"
                  >
                    <div className="relative aspect-square overflow-hidden border-b-2 border-ink">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="flex h-full items-center justify-center p-6 text-center"
                          style={{
                            backgroundColor: product.placeholder?.bg ?? "#003087",
                            color: product.placeholder?.fg ?? "#F7F1E3",
                          }}
                        >
                          <span className="display-tight font-display text-3xl uppercase">
                            {product.name}
                          </span>
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-amarillo px-2.5 py-1 text-[10px] font-bold tracking-[0.18em] text-ink uppercase">
                        Lo nuestro
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="display-tight font-display text-2xl uppercase">
                        {product.name}
                      </h3>
                      <p className="mt-2 flex-1 text-sm text-ink-soft">{pick.pitch}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-display text-3xl">{formatPrice(product.price)}</span>
                        <span className="text-xs font-bold tracking-[0.18em] text-azul uppercase">
                          Ver en tienda →
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Amazon long tail */}
      <section className="border-y border-linea bg-crema py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="Completa el look"
              title="Lo demás, en Amazon"
              sub="The extras we do not stock. Quick Amazon picks so the whole parche shows up loud, painted, and waving the bandera."
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {amazonPicks.map((pick, i) => (
              <Reveal key={pick.name} delay={i * 0.05}>
                <div className="flex h-full flex-col border-2 border-ink/30 bg-paper p-6">
                  <h3 className="display-tight font-display text-2xl uppercase">{pick.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-ink-soft">{pick.desc}</p>
                  <AffiliateLink
                    href={amazonSearch(pick.query)}
                    ariaLabel={`Shop ${pick.name} on Amazon`}
                    className="mt-5 inline-flex items-center gap-2 self-start border-2 border-ink bg-paper px-4 py-2.5 text-xs font-bold tracking-[0.18em] uppercase transition-transform hover:-translate-y-0.5 hover:bg-amarillo"
                  >
                    Buscar en Amazon
                    <span aria-hidden>→</span>
                  </AffiliateLink>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Shop CTA + more guides */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="border-2 border-ink bg-ink p-8 text-paper sm:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-bold tracking-[0.25em] text-amarillo uppercase">
                  La Tienda
                </p>
                <h2 className="display-tight font-display text-4xl uppercase sm:text-5xl">
                  Más que merch
                </h2>
                <p className="mt-4 max-w-md text-paper/75">
                  Café de origen, artesanías hechas a mano, y el sabor de la tierra. Todo lo nuestro,
                  en un solo lugar.
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

          <p className="mt-12 mb-4 text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">
            Más guías
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/enviar-dinero"
              className="border-2 border-ink bg-paper px-5 py-3 text-sm font-bold tracking-[0.12em] uppercase transition-transform hover:-translate-y-0.5"
            >
              Enviar dinero a Colombia →
            </Link>
            <Link
              href="/viajes/mundial"
              className="border-2 border-ink bg-paper px-5 py-3 text-sm font-bold tracking-[0.12em] uppercase transition-transform hover:-translate-y-0.5"
            >
              Viaje al Mundial →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
