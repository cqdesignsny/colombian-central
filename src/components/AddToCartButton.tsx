"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/components/cart";

export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  // A monthly subscription is bought once, so no quantity stepper for the box.
  const allowQty = !product.recurring;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
      {allowQty && (
        <div className="flex items-stretch border-2 border-ink">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Disminuir cantidad"
            className="px-4 text-xl font-bold transition-colors hover:bg-crema disabled:opacity-30"
          >
            −
          </button>
          <span
            className="flex min-w-12 items-center justify-center font-display text-xl tabular-nums"
            aria-live="polite"
          >
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            aria-label="Aumentar cantidad"
            className="px-4 text-xl font-bold transition-colors hover:bg-crema"
          >
            +
          </button>
        </div>
      )}
      <button
        onClick={() => add(product, allowQty ? qty : 1)}
        className="w-full border-2 border-ink bg-amarillo px-8 py-4 text-sm font-bold tracking-[0.25em] uppercase shadow-[4px_4px_0_0_var(--color-ink)] transition-transform hover:-translate-y-0.5 sm:w-auto"
      >
        Añadir al carrito
      </button>
    </div>
  );
}
