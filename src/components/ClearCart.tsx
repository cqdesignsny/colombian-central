"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart";

/** Empties the cart once, on mount. Used on the post-payment success page. */
export default function ClearCart() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
