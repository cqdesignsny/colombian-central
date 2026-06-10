"use client";

import { useEffect, useState } from "react";

type Parts = { d: number; h: number; m: number; s: number } | null;

function diff(target: string): Parts {
  const ms = new Date(target).getTime() - Date.now();
  if (ms <= 0) return null;
  return {
    d: Math.floor(ms / 86_400_000),
    h: Math.floor((ms % 86_400_000) / 3_600_000),
    m: Math.floor((ms % 3_600_000) / 60_000),
    s: Math.floor((ms % 60_000) / 1000),
  };
}

export default function Countdown({
  target,
  doneLabel = "¡En juego!",
  light = false,
}: {
  target: string;
  doneLabel?: string;
  light?: boolean;
}) {
  const [parts, setParts] = useState<Parts>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setParts(diff(target));
    const id = setInterval(() => setParts(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const cellText = light ? "text-paper" : "text-ink";
  const labelText = light ? "text-paper/60" : "text-ink-soft";
  const border = light ? "border-paper/20" : "border-ink/15";

  if (mounted && parts === null) {
    return (
      <p className={`font-display text-5xl uppercase sm:text-6xl ${cellText}`}>
        {doneLabel}
      </p>
    );
  }

  const cells: { value: number; label: string }[] = [
    { value: parts?.d ?? 0, label: "días" },
    { value: parts?.h ?? 0, label: "horas" },
    { value: parts?.m ?? 0, label: "min" },
    { value: parts?.s ?? 0, label: "seg" },
  ];

  return (
    <div className="flex items-stretch gap-3 sm:gap-4" suppressHydrationWarning>
      {cells.map((cell) => (
        <div
          key={cell.label}
          className={`flex min-w-18 flex-col items-center border px-3 py-3 sm:min-w-24 sm:px-5 sm:py-4 ${border}`}
        >
          <span
            className={`font-display text-4xl tabular-nums sm:text-6xl ${cellText}`}
            suppressHydrationWarning
          >
            {String(cell.value).padStart(2, "0")}
          </span>
          <span
            className={`mt-1 text-[11px] font-bold tracking-[0.25em] uppercase ${labelText}`}
          >
            {cell.label}
          </span>
        </div>
      ))}
    </div>
  );
}
