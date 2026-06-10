"use client";

import { useState } from "react";
import { products, type Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const categories: Array<"Todos" | Product["category"]> = [
  "Todos",
  "Fútbol",
  "Café & Cocina",
  "Artesanías",
  "Lifestyle",
];

export default function ShopGrid() {
  const [active, setActive] = useState<(typeof categories)[number]>("Todos");
  const visible =
    active === "Todos" ? products : products.filter((p) => p.category === active);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActive(category)}
            className={`border-2 px-4 py-2 text-xs font-bold tracking-[0.18em] uppercase transition-colors ${
              active === category
                ? "border-ink bg-ink text-paper"
                : "border-ink/25 bg-paper text-ink hover:border-ink"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
