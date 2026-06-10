type TickerProps = {
  items: string[];
  variant?: "amarillo" | "ink";
};

export default function Ticker({ items, variant = "amarillo" }: TickerProps) {
  const colors =
    variant === "amarillo"
      ? "bg-amarillo text-ink border-ink/15"
      : "bg-ink text-paper border-paper/15";

  const row = (ariaHidden: boolean) => (
    <div
      className="flex shrink-0 items-center"
      aria-hidden={ariaHidden || undefined}
    >
      {items.map((item, i) => (
        <span
          key={i}
          className="flex items-center text-[13px] font-bold tracking-[0.22em] whitespace-nowrap uppercase"
        >
          <span className="px-6">{item}</span>
          <span className="text-[9px]">◆</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`overflow-hidden border-y ${colors}`}>
      <div className="animate-marquee flex w-max py-2.5">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
