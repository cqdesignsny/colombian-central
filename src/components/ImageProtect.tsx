"use client";

import { useEffect } from "react";

/**
 * Deters casual image theft site-wide: blocks right-click (context menu) and
 * drag on any <img> (the squad cutouts especially). Mounted once in the layout.
 * This is a deterrent, not DRM, screenshots/devtools always work, but it stops
 * the easy "right-click save" and "drag to desktop" grabs. Paired with CSS
 * (user-drag/user-select none) in globals.css.
 */
export default function ImageProtect() {
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "IMG" || t.closest("img"))) e.preventDefault();
    };
    const onDragStart = (e: DragEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && t.tagName === "IMG") e.preventDefault();
    };
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
    };
  }, []);
  return null;
}
