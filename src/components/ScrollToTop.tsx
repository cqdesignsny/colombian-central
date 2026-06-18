"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Forces the window to the top on every route change, so clicking any link or
 * button lands you at the top of the new page. Skips when the URL has a hash so
 * in-page anchor jumps (e.g. /viajes#cartagena) still work.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}
