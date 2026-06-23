"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { products, type Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { site } from "@/config/site";
import Honeypot from "@/components/Honeypot";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image?: string;
  placeholderBg?: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  add: (product: Product, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cc-cart-v1";
// Card-checkout copy turns on when Stripe is live (set NEXT_PUBLIC_STRIPE_ENABLED in Vercel).
const STRIPE_ENABLED = process.env.NEXT_PUBLIC_STRIPE_ENABLED === "true";
// Free U.S. shipping threshold (matches shopNotes.shipping). Drives the progress bar.
const FREE_SHIP = 75;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(
            parsed.filter(
              (i) =>
                i &&
                typeof i.slug === "string" &&
                typeof i.qty === "number" &&
                i.qty > 0,
            ),
          );
        }
      }
    } catch {
      // ignore corrupted carts
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage full or blocked; ignore
    }
  }, [items, hydrated]);

  const add = useCallback((product: Product, qty: number = 1) => {
    const amount = Math.max(1, Math.floor(qty));
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === product.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === product.slug ? { ...i, qty: i.qty + amount } : i,
        );
      }
      return [
        ...prev,
        {
          slug: product.slug,
          name: product.name,
          price: product.price,
          image: product.image,
          placeholderBg: product.placeholder?.bg,
          qty: amount,
        },
      ];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.slug !== slug)
        : prev.map((i) => (i.slug === slug ? { ...i, qty } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((n, i) => n + i.qty * i.price, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, count, subtotal, isOpen, setOpen, add, remove, setQty, clear }),
    [items, count, subtotal, isOpen, add, remove, setQty, clear],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

type Stage = "cart" | "done";

function CartDrawer() {
  const { items, subtotal, isOpen, setOpen, setQty, remove, clear, add } = useCart();
  const [stage, setStage] = useState<Stage>("cart");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  function close() {
    setOpen(false);
    if (stage === "done") setStage("cart");
  }

  // Escape closes the drawer (expected dialog behavior for keyboard users).
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, stage]);

  const remaining = Math.max(0, FREE_SHIP - subtotal);
  const pct = subtotal === 0 ? 0 : Math.min(100, (subtotal / FREE_SHIP) * 100);
  const crossSell = useMemo(
    () =>
      [...products]
        .sort((a, b) => a.price - b.price)
        .filter((p) => !items.some((i) => i.slug === p.slug))
        .slice(0, 2),
    [items],
  );

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    if (!email || items.length === 0) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          website,
          items: items.map((i) => ({ slug: i.slug, qty: i.qty })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error ?? "failed");
      if (data.url) {
        // Stripe is live: hand off to the hosted checkout page.
        window.location.href = data.url;
        return;
      }
      setOrderId(data.orderId);
      clear();
      setStage("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            aria-label="Cerrar carrito"
            tabIndex={-1}
            className="fixed inset-0 z-50 cursor-default bg-ink/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="fixed top-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-paper shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="flex h-1.5 shrink-0">
              <div className="flex-[2] bg-amarillo" />
              <div className="flex-1 bg-azul" />
              <div className="flex-1 bg-rojo" />
            </div>
            <div className="flex items-center justify-between border-b border-linea px-6 py-4">
              <h2
                id="cart-title"
                className="font-display text-2xl tracking-wide uppercase"
              >
                {stage === "done" ? "¡Gracias!" : "Tu carrito"}
              </h2>
              <button
                onClick={close}
                className="text-sm font-bold tracking-widest uppercase underline-offset-4 hover:underline"
              >
                Cerrar
              </button>
            </div>

            {stage === "done" ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <p className="font-display text-5xl uppercase">
                  Pedido <span className="text-rojo">#{orderId}</span>
                </p>
                <p className="text-sm text-ink-soft">
                  Recibido. Te confirmamos por email muy pronto. Gracias por el apoyo.
                </p>
                <button
                  onClick={close}
                  className="mt-2 border-2 border-ink bg-amarillo px-6 py-3 text-xs font-bold tracking-[0.2em] uppercase"
                >
                  Seguir comprando
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
                      <p className="font-display text-3xl uppercase">Vacío, parce</p>
                      <p className="max-w-xs text-sm text-ink-soft">
                        Your cart is empty. The mochilas are not going to buy themselves.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Free-shipping progress bar */}
                      <div className="border-b border-linea px-6 py-4">
                        {remaining > 0 ? (
                          <p className="text-xs font-bold tracking-[0.1em] text-ink uppercase">
                            Añade <span className="text-rojo">{formatPrice(remaining)}</span> y el
                            envío va gratis
                          </p>
                        ) : (
                          <p className="text-xs font-bold tracking-[0.1em] text-azul uppercase">
                            ✓ ¡Te ganaste el envío gratis!
                          </p>
                        )}
                        <div className="mt-2 h-2 w-full border border-linea bg-crema">
                          <div
                            className="h-full bg-amarillo transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      {/* Items */}
                      <ul className="divide-y divide-linea px-6">
                        {items.map((item) => (
                          <li key={item.slug} className="flex gap-4 py-4">
                            <div
                              className="relative h-20 w-20 shrink-0 overflow-hidden border border-linea"
                              style={{ background: item.placeholderBg ?? "#EFE5CD" }}
                            >
                              {item.image && (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="80px"
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div className="flex flex-1 flex-col">
                              <div className="flex items-start justify-between gap-2">
                                <p className="text-sm font-bold">{item.name}</p>
                                <p className="text-sm font-bold">
                                  {formatPrice(item.price * item.qty)}
                                </p>
                              </div>
                              <div className="mt-auto flex items-center gap-3">
                                <div className="flex items-center border border-ink/20">
                                  <button
                                    className="px-2.5 py-1 text-sm font-bold hover:bg-crema"
                                    onClick={() => setQty(item.slug, item.qty - 1)}
                                    aria-label={`Disminuir cantidad de ${item.name}`}
                                  >
                                    −
                                  </button>
                                  <span className="min-w-7 text-center text-sm font-bold">
                                    {item.qty}
                                  </span>
                                  <button
                                    className="px-2.5 py-1 text-sm font-bold hover:bg-crema"
                                    onClick={() => setQty(item.slug, item.qty + 1)}
                                    aria-label={`Aumentar cantidad de ${item.name}`}
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  onClick={() => remove(item.slug)}
                                  className="text-xs tracking-widest text-ink-soft uppercase underline-offset-4 hover:underline"
                                >
                                  Quitar
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>

                      {/* Cross-sell */}
                      {crossSell.length > 0 && (
                        <div className="border-t border-linea px-6 py-4">
                          <p className="mb-3 text-[11px] font-bold tracking-[0.2em] text-ink-soft uppercase">
                            Añade y completa el parche
                          </p>
                          <div className="space-y-2.5">
                            {crossSell.map((p) => (
                              <div key={p.slug} className="flex items-center gap-3">
                                <div
                                  className="relative h-11 w-11 shrink-0 overflow-hidden border border-linea"
                                  style={{ background: p.placeholder?.bg ?? "#EFE5CD" }}
                                >
                                  {p.image && (
                                    <Image
                                      src={p.image}
                                      alt={p.name}
                                      fill
                                      sizes="44px"
                                      className="object-cover"
                                    />
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs font-bold">{p.name}</p>
                                  <p className="text-xs text-ink-soft">{formatPrice(p.price)}</p>
                                </div>
                                <button
                                  onClick={() => add(p)}
                                  className="shrink-0 border border-ink px-3 py-1.5 text-[11px] font-bold tracking-[0.1em] uppercase transition-colors hover:bg-amarillo"
                                >
                                  Añadir
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {items.length > 0 && (
                  <form onSubmit={pay} className="border-t border-linea px-6 py-5">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm tracking-widest uppercase">Subtotal</span>
                      <span className="font-display text-2xl">{formatPrice(subtotal)}</span>
                    </div>
                    <Honeypot value={website} onChange={setWebsite} />
                    <label
                      htmlFor="cart-email"
                      className="mb-1.5 block text-[11px] font-bold tracking-[0.2em] text-ink-soft uppercase"
                    >
                      Email para tu recibo
                    </label>
                    <input
                      id="cart-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      className="mb-3 w-full border-2 border-ink/20 bg-paper px-4 py-3 text-sm font-medium outline-none placeholder:text-ink/40 focus:border-azul"
                    />
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="block w-full bg-ink px-6 py-4 text-center text-sm font-bold tracking-[0.2em] text-paper uppercase transition-colors hover:bg-azul disabled:opacity-60"
                    >
                      {status === "loading"
                        ? "Un momento…"
                        : STRIPE_ENABLED
                          ? "Pagar con tarjeta"
                          : "Hacer el pedido"}
                    </button>
                    {status === "error" && (
                      <p className="mt-3 text-xs font-bold text-rojo">
                        Algo falló. Intenta de nuevo o escríbenos a {site.contactEmail}.
                      </p>
                    )}
                    <p className="mt-3 text-center text-[11px] text-ink-soft">
                      {STRIPE_ENABLED
                        ? "Pago seguro con Stripe · Envío desde Miami · Devoluciones fáciles"
                        : "Confirmamos por email en un día · Envío desde Miami"}
                    </p>
                  </form>
                )}
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
