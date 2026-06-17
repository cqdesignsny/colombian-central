"use client";

/**
 * Opens the El Paisa chat from anywhere on the site by firing a window event
 * that ElPaisaChat listens for. Keeps server components free of client logic.
 */
export default function PaisaButton({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("paisa:open"))}
      className={className}
    >
      {children}
    </button>
  );
}
