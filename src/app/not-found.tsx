import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-display text-8xl text-rojo sm:text-9xl">404</p>
      <h1 className="display-tight mt-4 font-display text-4xl uppercase sm:text-6xl">
        Te perdiste, parce
      </h1>
      <p className="mt-4 max-w-md text-ink-soft">
        This page took a wrong turn somewhere around Honda. Happens to
        everyone. Go back home and grab a tinto.
      </p>
      <Link
        href="/"
        className="mt-8 border-2 border-ink bg-amarillo px-7 py-4 text-sm font-bold tracking-[0.2em] uppercase transition-transform hover:-translate-y-0.5"
      >
        Volver al inicio
      </Link>
    </section>
  );
}
