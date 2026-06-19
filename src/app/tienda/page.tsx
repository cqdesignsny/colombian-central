import type { Metadata } from "next";
import Link from "next/link";
import { shopNotes } from "@/data/products";
import SectionHeader from "@/components/SectionHeader";
import ShopGrid from "@/components/ShopGrid";
import Reveal from "@/components/Reveal";
import Stamp from "@/components/Stamp";

export const metadata: Metadata = {
  title: "La Tienda: Colombian products, artisan-direct",
  description:
    "Colombian coffee from real fincas, handwoven artesanías sourced directly from artisans, and World Cup fan gear. Ships from Miami.",
};

export default function TiendaPage() {
  return (
    <>
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="La Tienda"
              title="De Colombia, pa' tu casa"
              sub="Everything here is either made in Colombia or made for Colombians. Real artesanías at artisan-set prices, café from home, and fan gear for the Mundial, each piece chosen by hand."
            />
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mb-10 flex flex-wrap gap-3 text-xs font-bold tracking-[0.15em] uppercase">
              <span className="border border-ink/25 bg-crema px-3 py-1.5">
                {shopNotes.shipping}
              </span>
              <span className="border border-ink/25 bg-crema px-3 py-1.5">
                Artisan-direct sourcing
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <Link
              href="/futbol/hinchada"
              className="mb-10 flex items-center justify-between gap-4 border-l-4 border-amarillo bg-crema px-5 py-4 transition-colors hover:bg-amarillo/20"
            >
              <span className="text-sm font-bold tracking-[0.1em] text-ink uppercase">
                Nueva guía de la hinchada para el Mundial 2026
              </span>
              <span className="shrink-0 text-xs font-bold tracking-[0.2em] text-azul uppercase">
                Ver →
              </span>
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <ShopGrid />
          </Reveal>
        </div>
      </section>

      <section className="border-t border-linea bg-crema py-16 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-4 text-center sm:px-6 lg:flex-row lg:text-left">
          <Stamp className="h-32 w-32 shrink-0 text-ink" />
          <div>
            <h2 className="display-tight font-display text-3xl uppercase sm:text-5xl">
              Lo auténtico se nota
            </h2>
            <p className="font-reading mx-auto mt-4 max-w-2xl text-ink-soft lg:mx-0">
              {shopNotes.authenticity} Some pieces we bring back from Colombia
              ourselves. Others ship straight from the artisan families who make
              them. The rest we vet by hand before it earns a place here. That is
              the whole business model: lo nuestro, treated with respect.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
