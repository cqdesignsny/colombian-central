import Link from "next/link";
import { site } from "@/config/site";
import TricolorBar from "@/components/TricolorBar";

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <p className="display-tight font-display text-[clamp(2.5rem,9vw,7rem)] uppercase leading-none text-paper/95">
          Colombian Central
        </p>
        <p className="mt-3 font-serif text-xl italic text-amarillo sm:text-2xl">
          {site.tagline}
        </p>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
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
                  href={`mailto:${site.contactEmail}`}
                  className="hover:text-amarillo"
                >
                  {site.contactEmail}
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
              La red Central
            </h3>
            <p className="text-sm leading-relaxed text-paper/60">
              Colombian Central is the first of many. Mexican Central,
              Argentinian Central and more are on the roadmap. One home base
              per country, built with the same cariño.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 pt-6 text-xs text-paper/50">
          <p>
            © 2026 {site.brand}. Hecho con orgullo by la diáspora.
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
