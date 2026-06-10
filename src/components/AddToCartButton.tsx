"use client";

import type { Product } from "@/data/products";
import { useCart } from "@/components/cart";

export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  return (
    <button
      onClick={() => add(product)}
      className="w-full border-2 border-ink bg-amarillo px-8 py-4 text-sm font-bold tracking-[0.25em] uppercase transition-transform hover:-translate-y-0.5 sm:w-auto"
    >
      Add to cart
    </button>
  );
}
