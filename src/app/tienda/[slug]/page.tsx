import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, shopNotes } from "@/data/products";
import { formatPrice } from "@/lib/format";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { productLd } from "@/lib/jsonld";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.blurb,
    ...(product.image
      ? { openGraph: { images: [{ url: product.image }] } }
      : {}),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.slug !== product.slug && p.category === product.category)
    .concat(products.filter((p) => p.category !== product.category))
    .slice(0, 4);

  return (
    <>
      <JsonLd data={productLd(product)} />
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            href="/tienda"
            className="text-xs font-bold tracking-[0.25em] text-ink-soft uppercase hover:text-azul"
          >
            ← La Tienda
          </Link>
          <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="relative aspect-square overflow-hidden border border-linea">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div
                  className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center"
                  style={{
                    background: product.placeholder?.bg,
                    color: product.placeholder?.fg,
                  }}
                >
                  <span className="text-xs font-bold tracking-[0.3em] uppercase opacity-70">
                    Colombian Central
                  </span>
                  <span className="display-tight font-display text-5xl uppercase">
                    {product.name}
                  </span>
                  <span className="border px-3 py-1 text-xs font-bold tracking-[0.3em] uppercase opacity-70">
                    Hecho con orgullo
                  </span>
                </div>
              )}
              {product.badge && (
                <span className="absolute top-4 left-4 border border-ink bg-amarillo px-3 py-1 text-xs font-bold tracking-[0.15em] uppercase">
                  {product.badge}
                </span>
              )}
            </div>

            <div>
              <p className="text-xs font-bold tracking-[0.25em] text-ink-soft uppercase">
                {product.category}
              </p>
              <h1 className="display-tight mt-2 font-display text-4xl uppercase sm:text-6xl">
                {product.name}
              </h1>
              <p className="mt-4 font-display text-3xl">
                {formatPrice(product.price)}
                {product.recurring && (
                  <span className="text-lg text-ink-soft"> / mes</span>
                )}
              </p>
              <p className="font-reading mt-6 max-w-lg text-ink-soft">{product.blurb}</p>
              <ul className="mt-8 space-y-3">
                {product.details.map((detail) => (
                  <li key={detail} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 flex shrink-0 gap-0.5" aria-hidden>
                      <span className="h-2 w-3 bg-amarillo" />
                      <span className="h-2 w-1.5 bg-azul" />
                      <span className="h-2 w-1.5 bg-rojo" />
                    </span>
                    {detail}
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <AddToCartButton product={product} />
                <p className="mt-4 text-xs text-ink-soft">
                  {product.recurring
                    ? "Renews monthly, cancel anytime. Secure card checkout. Ships from Miami."
                    : `${shopNotes.shipping} Secure card checkout.`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-linea py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <h2 className="display-tight mb-8 font-display text-3xl uppercase sm:text-4xl">
              También te puede gustar
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
