"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/config/site";
import { useCart } from "@/components/cart";
import TricolorBar from "@/components/TricolorBar";

export default function Navbar() {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40">
      <TricolorBar />
      <div className="border-b border-linea bg-paper/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="shrink-0"
            onClick={() => setMenuOpen(false)}
          >
            <Image
              src="/brand/Col-Central_logo-New.png"
              alt="Colombian Central"
              width={983}
              height={612}
              priority
              className="h-12 w-auto sm:h-16"
            />
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
            {site.nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[13px] font-bold tracking-[0.18em] uppercase transition-colors ${
                    active ? "text-rojo" : "text-ink hover:text-azul"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="relative flex items-center gap-2 border-2 border-ink bg-amarillo px-4 py-2 text-[13px] font-bold tracking-[0.18em] uppercase transition-transform hover:-translate-y-0.5"
            >
              Carrito
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-[11px] text-paper tabular-nums">
                {count}
              </span>
            </button>
            <button
              className="flex flex-col gap-1.5 p-2 lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span
                className={`block h-0.5 w-6 bg-ink transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-ink transition-opacity ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-6 bg-ink transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
              />
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-linea lg:hidden"
            >
              <div className="flex flex-col px-6 py-4">
                {site.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="border-b border-linea py-4 font-display text-2xl tracking-wide uppercase last:border-0"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
