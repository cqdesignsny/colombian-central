"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/products";
import { useCart } from "@/components/cart";
import { formatPrice } from "@/lib/format";

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <div className="group flex flex-col border border-linea bg-paper transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0_0_var(--color-ink)]">
      <Link
        href={`/tienda/${product.slug}`}
        className="relative block aspect-square overflow-hidden"
      >
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center"
            style={{
              background: product.placeholder?.bg,
              color: product.placeholder?.fg,
            }}
          >
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">
              Colombian Central
            </span>
            <span className="display-tight font-display text-3xl uppercase">
              {product.name}
            </span>
            <span className="border px-2 py-0.5 text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">
              Hecho con orgullo
            </span>
          </div>
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 border border-ink bg-amarillo px-2.5 py-1 text-[11px] font-bold tracking-[0.15em] uppercase">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1 border-t border-linea p-4">
        <p className="text-[11px] font-bold tracking-[0.22em] text-ink-soft uppercase">
          {product.category}
        </p>
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/tienda/${product.slug}`}
            className="font-bold leading-snug hover:text-azul"
          >
            {product.name}
          </Link>
          <p className="font-display text-xl">{formatPrice(product.price)}</p>
        </div>
        <button
          onClick={() => add(product)}
          className="mt-3 w-full border-2 border-ink bg-paper px-4 py-2.5 text-xs font-bold tracking-[0.2em] uppercase transition-colors hover:bg-ink hover:text-paper"
        >
          Add to cart
        </button>
      </div>
    </div>
  );
}
