import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import Stamp from "@/components/Stamp";

export const metadata: Metadata = {
  title: "Nosotros: why Colombian Central exists",
  description:
    "Colombian Central is the home base for everything Colombian, and the first site in the Central network.",
};

const pillars = [
  {
    title: "Informar",
    color: "bg-amarillo text-ink",
    text: "Noticias on La Tricolor, la cultura, and the diaspora, written with context instead of clickbait.",
  },
  {
    title: "Conectar",
    color: "bg-azul text-paper",
    text: "A tienda that pays artisans their price and puts the finca's name on the bag. Direct, fair, traceable.",
  },
  {
    title: "Regresar",
    color: "bg-rojo text-paper",
    text: "Travel planned by people who know the country from inside: family trips, first trips, and Mundial road trips.",
  },
];

export default function NosotrosPage() {
  return (
    <>
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <Reveal>
              <div>
                <SectionHeader
                  eyebrow="Nosotros"
                  title="De aquí y de allá"
                />
                <div className="space-y-5 text-[17px] leading-relaxed text-ink-soft">
                  <p>
                    Colombian Central started with a simple frustration:
                    everything Colombian lived in fifty different places. The
                    fútbol news in one app, the good coffee in some random
                    market, the travel tips in a group chat, the artesanías in
                    a suitcase whenever someone flew back.
                  </p>
                  <p>
                    So we built the place we wished existed. One site where you
                    can follow La Tricolor, buy the things that taste and feel
                    like home, plan the trip back, and read about la cultura
                    written by people who actually live it.
                  </p>
                  <p>
                    If you are Colombian, this is your home base. If you love
                    someone Colombian, this is where you finally understand the
                    bandeja paisa portions. And if you are just curious, bienvenido:
                    curiosity is how everyone falls for Colombia.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative border border-linea bg-crema p-10 sm:p-14">
                <Stamp className="absolute -top-7 -right-7 h-28 w-28 text-ink" />
                <Image
                  src="/brand/Col-Central_logo-New.png"
                  alt="Colombian Central logo"
                  width={983}
                  height={612}
                  className="mx-auto h-auto w-full max-w-md"
                />
                <p className="mt-6 text-center font-serif text-2xl italic">
                  {site.tagline}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-y border-linea bg-crema py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-5 md:grid-cols-3">
            {pillars.map((pillar, i) => (
              <Reveal key={pillar.title} delay={i * 0.07}>
                <div className="h-full border border-ink/15 bg-paper">
                  <p
                    className={`px-5 py-3 font-display text-2xl uppercase ${pillar.color}`}
                  >
                    {pillar.title}
                  </p>
                  <p className="p-5 text-sm leading-relaxed text-ink-soft">
                    {pillar.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionHeader
              eyebrow="La visión"
              title="Primero Colombia. Después, el continente."
              sub="Colombian Central is the first site in the Central network. The engine is built so that every country can get its own home base: same care, new flag."
            />
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                name: "Colombian Central",
                status: "Live",
                live: true,
                note: "News, fútbol, tienda, viajes. You are here.",
              },
              {
                name: "Mexican Central",
                status: "On the roadmap",
                live: false,
                note: "Same engine, swapped config: México gets its own central.",
              },
              {
                name: "Argentinian Central",
                status: "On the roadmap",
                live: false,
                note: "And after that, wherever the diáspora calls home.",
              },
            ].map((item, i) => (
              <Reveal key={item.name} delay={i * 0.07}>
                <div
                  className={`h-full border p-6 ${
                    item.live
                      ? "border-ink bg-ink text-paper"
                      : "border-dashed border-ink/30 bg-paper"
                  }`}
                >
                  <p
                    className={`text-[11px] font-bold tracking-[0.25em] uppercase ${
                      item.live ? "text-amarillo" : "text-ink-soft"
                    }`}
                  >
                    {item.status}
                  </p>
                  <p className="display-tight mt-2 font-display text-3xl uppercase">
                    {item.name}
                  </p>
                  <p
                    className={`mt-3 text-sm ${item.live ? "text-paper/70" : "text-ink-soft"}`}
                  >
                    {item.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="mt-14 flex flex-col items-start gap-5 border border-linea bg-crema p-8 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="display-tight font-display text-3xl uppercase">
                  Hablemos
                </h2>
                <p className="mt-2 max-w-md text-sm text-ink-soft">
                  Partnerships, artisans who want to sell here, writers,
                  travel ideas, or just to say qué más pues.
                </p>
              </div>
              <a
                href={`mailto:${site.contactEmail}`}
                className="border-2 border-ink bg-amarillo px-7 py-4 text-sm font-bold tracking-[0.2em] uppercase transition-transform hover:-translate-y-0.5"
              >
                {site.contactEmail}
              </a>
            </div>
          </Reveal>
          <p className="mt-10 text-xs text-ink-soft">
            Looking for the tienda or the travel desk?{" "}
            <Link href="/tienda" className="font-bold text-azul hover:underline">
              La Tienda
            </Link>{" "}
            ·{" "}
            <Link href="/viajes" className="font-bold text-azul hover:underline">
              Viajes
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
