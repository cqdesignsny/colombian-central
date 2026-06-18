import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import TricolorBar from "@/components/TricolorBar";
import PaisaButton from "@/components/PaisaButton";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Image
              src="/brand/Col-Central_logo-New.png"
              alt="Colombian Central"
              width={983}
              height={612}
              className="h-auto w-full max-w-sm sm:max-w-md"
            />
            <p className="mt-5 font-serif text-xl italic text-amarillo sm:text-2xl">
              {site.tagline}
            </p>
          </div>
          <div className="flex shrink-0 items-end gap-4 border-2 border-amarillo/30 p-4">
            <span className="relative h-28 w-20 shrink-0">
              <Image
                src="/brand/El-Paisa.png"
                alt="El Paisa, la mascota de Colombian Central"
                fill
                sizes="80px"
                className="object-contain object-bottom"
              />
            </span>
            <div className="pb-1">
              <p className="font-display text-lg leading-tight uppercase">
                ¿Dudas? Habla con El Paisa
              </p>
              <PaisaButton className="mt-2 inline-flex items-center gap-2 border-2 border-amarillo bg-amarillo px-4 py-2 text-xs font-bold tracking-[0.18em] text-ink uppercase transition-transform hover:-translate-y-0.5">
                Háblale →
              </PaisaButton>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <h3 className="mb-4 text-xs font-bold tracking-[0.25em] text-paper/50 uppercase">
              Explorar
            </h3>
            <ul className="space-y-2.5">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-paper/80 hover:text-amarillo"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold tracking-[0.25em] text-paper/50 uppercase">
              Guías
            </h3>
            <ul className="space-y-2.5 text-sm text-paper/80">
              <li>
                <Link href="/enviar-dinero" className="hover:text-amarillo">
                  Enviar dinero
                </Link>
              </li>
              <li>
                <Link href="/viajes/mundial" className="hover:text-amarillo">
                  Viaje al Mundial
                </Link>
              </li>
              <li>
                <Link href="/futbol/hinchada" className="hover:text-amarillo">
                  Guía de la hinchada
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold tracking-[0.25em] text-paper/50 uppercase">
              La Tienda
            </h3>
            <ul className="space-y-2.5 text-sm text-paper/80">
              <li>
                <Link href="/tienda" className="hover:text-amarillo">
                  World Cup drop
                </Link>
              </li>
              <li>
                <Link href="/tienda" className="hover:text-amarillo">
                  Café de origen
                </Link>
              </li>
              <li>
                <Link href="/tienda" className="hover:text-amarillo">
                  Artesanías
                </Link>
              </li>
              <li className="text-paper/50">
                Free U.S. shipping over $75
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold tracking-[0.25em] text-paper/50 uppercase">
              Contacto
            </h3>
            <ul className="space-y-2.5 text-sm text-paper/80">
              <li>
                <a
                  href={`mailto:${site.publicEmail}`}
                  className="hover:text-amarillo"
                >
                  {site.publicEmail}
                </a>
              </li>
              <li>
                <a href={site.socials.instagram} className="hover:text-amarillo">
                  Instagram
                </a>
              </li>
              <li>
                <a href={site.socials.tiktok} className="hover:text-amarillo">
                  TikTok
                </a>
              </li>
              <li>
                <a href={site.socials.youtube} className="hover:text-amarillo">
                  YouTube
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold tracking-[0.25em] text-paper/50 uppercase">
              La casa
            </h3>
            <p className="text-sm leading-relaxed text-paper/60">
              The home base for everything Colombian in the U.S.: news, fútbol,
              música, comida, la tienda, and travel back home. Built by and for
              la diáspora.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 pt-6 text-xs text-paper/50">
          <p>
            © 2026 {site.brand}. Hecho con orgullo por colombianos.
          </p>
          <p>
            Independent fan media. Not affiliated with FIFA or the FCF.
          </p>
        </div>
      </div>
      <TricolorBar className="h-2" />
    </footer>
  );
}
