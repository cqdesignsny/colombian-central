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
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cc-cart-v1";

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

  const count = useMemo(() => items.reduce((n, i) => n + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((n, i) => n + i.qty * i.price, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, count, subtotal, isOpen, setOpen, add, remove, setQty }),
    [items, count, subtotal, isOpen, add, remove, setQty],
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

function orderMailto(items: CartItem[], subtotal: number) {
  const lines = items.map(
    (i) => `${i.qty} x ${i.name} (${formatPrice(i.price)} each)`,
  );
  const body = [
    "Hola Colombian Central,",
    "",
    "I want to order:",
    ...lines,
    "",
    `Subtotal: ${formatPrice(subtotal)}`,
    "",
    "Ship to:",
    "Name:",
    "Address:",
    "",
    "Gracias!",
  ].join("\n");
  return `mailto:${site.contactEmail}?subject=${encodeURIComponent(
    "Order request: Colombian Central",
  )}&body=${encodeURIComponent(body)}`;
}

function CartDrawer() {
  const { items, subtotal, isOpen, setOpen, setQty, remove } = useCart();

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
            onClick={() => setOpen(false)}
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
                Tu carrito
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-sm font-bold tracking-widest uppercase underline-offset-4 hover:underline"
              >
                Cerrar
              </button>
            </div>

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
                  Free U.S. shipping over $75. Checkout is in beta: orders go
                  out by email and we confirm within a day.
                </p>
                <a
                  href={orderMailto(items, subtotal)}
                  className="block w-full bg-ink px-6 py-4 text-center text-sm font-bold tracking-[0.2em] text-paper uppercase transition-colors hover:bg-azul"
                >
                  Order by email
                </a>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
