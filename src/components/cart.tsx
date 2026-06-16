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
import type { Product } from "@/data/products";
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
  add: (product: Product) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cc-cart-v1";
// Card-checkout copy turns on when Stripe is live (set NEXT_PUBLIC_STRIPE_ENABLED in Vercel).
const STRIPE_ENABLED = process.env.NEXT_PUBLIC_STRIPE_ENABLED === "true";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted carts
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const add = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === product.slug);
      if (existing) {
        return prev.map((i) =>
          i.slug === product.slug ? { ...i, qty: i.qty + 1 } : i,
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
          qty: 1,
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

type Stage = "cart" | "checkout" | "done";

function CartDrawer() {
  const { items, subtotal, isOpen, setOpen, setQty, remove, clear } = useCart();
  const [stage, setStage] = useState<Stage>("cart");
  const [orderId, setOrderId] = useState<number | null>(null);

  function close() {
    setOpen(false);
    if (stage === "done") setStage("cart");
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            aria-label="Close cart"
            className="fixed inset-0 z-50 cursor-default bg-ink/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
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
              <h2 className="font-display text-2xl tracking-wide uppercase">
                {stage === "checkout" ? "Casi listo" : stage === "done" ? "¡Gracias!" : "Tu carrito"}
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
                  Recibido. Check your inbox: confirmation is already on the
                  way, and a human follows up within a day to arrange payment
                  and shipping. Nothing is charged yet.
                </p>
                <button
                  onClick={close}
                  className="mt-2 border-2 border-ink bg-amarillo px-6 py-3 text-xs font-bold tracking-[0.2em] uppercase"
                >
                  Seguir comprando
                </button>
              </div>
            ) : stage === "checkout" ? (
              <CheckoutForm
                onBack={() => setStage("cart")}
                onDone={(id) => {
                  setOrderId(id);
                  clear();
                  setStage("done");
                }}
              />
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {items.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                      <p className="font-display text-3xl uppercase">Vacío, parce</p>
                      <p className="max-w-xs text-sm text-ink-soft">
                        Your cart is empty. The mochilas are not going to buy
                        themselves.
                      </p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-linea">
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
                                  aria-label={`Decrease ${item.name}`}
                                >
                                  −
                                </button>
                                <span className="min-w-7 text-center text-sm font-bold">
                                  {item.qty}
                                </span>
                                <button
                                  className="px-2.5 py-1 text-sm font-bold hover:bg-crema"
                                  onClick={() => setQty(item.slug, item.qty + 1)}
                                  aria-label={`Increase ${item.name}`}
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
                  )}
                </div>

                {items.length > 0 && (
                  <div className="border-t border-linea px-6 py-5">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm tracking-widest uppercase">
                        Subtotal
                      </span>
                      <span className="font-display text-2xl">
                        {formatPrice(subtotal)}
                      </span>
                    </div>
                    <p className="mb-4 text-xs text-ink-soft">
                      {STRIPE_ENABLED
                        ? "Free U.S. shipping over $75. Secure card checkout."
                        : "Free U.S. shipping over $75. We confirm payment and shipping by email; nothing is charged online yet."}
                    </p>
                    <button
                      onClick={() => setStage("checkout")}
                      className="block w-full bg-ink px-6 py-4 text-center text-sm font-bold tracking-[0.2em] text-paper uppercase transition-colors hover:bg-azul"
                    >
                      Hacer el pedido
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function CheckoutForm({
  onBack,
  onDone,
}: {
  onBack: () => void;
  onDone: (orderId: number) => void;
}) {
  const { items, subtotal } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          address,
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
      onDone(data.orderId);
    } catch {
      setStatus("error");
    }
  }

  const inputStyles =
    "w-full border-2 border-ink/20 bg-paper px-4 py-3 text-sm font-medium outline-none placeholder:text-ink/40 focus:border-azul";

  return (
    <form onSubmit={submit} className="flex flex-1 flex-col overflow-y-auto px-6 py-5">
      <button
        type="button"
        onClick={onBack}
        className="self-start text-xs font-bold tracking-[0.25em] text-ink-soft uppercase hover:text-azul"
      >
        ← Volver al carrito
      </button>

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold tracking-[0.2em] uppercase">
            Nombre
          </label>
          <input
            className={inputStyles}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre y apellido"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold tracking-[0.2em] uppercase">
            Email
          </label>
          <input
            type="email"
            className={inputStyles}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold tracking-[0.2em] uppercase">
            Dirección de envío
          </label>
          <textarea
            className={`${inputStyles} min-h-24 resize-y`}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={"Street, apt\nCity, State ZIP"}
            required
          />
        </div>
      </div>

      <div className="mt-auto pt-5">
        <div className="mb-3 flex items-center justify-between border-t border-linea pt-4">
          <span className="text-sm tracking-widest uppercase">Subtotal</span>
          <span className="font-display text-2xl">{formatPrice(subtotal)}</span>
        </div>
        <button
          type="submit"
          disabled={status === "loading" || items.length === 0}
          className="block w-full bg-ink px-6 py-4 text-center text-sm font-bold tracking-[0.2em] text-paper uppercase transition-colors hover:bg-azul disabled:opacity-60"
        >
          {status === "loading"
            ? STRIPE_ENABLED
              ? "Redirigiendo…"
              : "Enviando…"
            : STRIPE_ENABLED
              ? "Pagar con tarjeta"
              : "Confirmar pedido"}
        </button>
        {status === "error" && (
          <p className="mt-3 text-xs font-bold text-rojo">
            Something broke. Try again, or email us at{" "}
            <a className="underline" href={`mailto:${site.contactEmail}`}>
              {site.contactEmail}
            </a>
          </p>
        )}
        <p className="mt-3 text-xs text-ink-soft">
          {STRIPE_ENABLED
            ? "Secure checkout by Stripe. You will be redirected to pay by card."
            : "No payment online yet: we confirm your order and total by email within a day, then arrange payment."}
        </p>
      </div>
    </form>
  );
}
