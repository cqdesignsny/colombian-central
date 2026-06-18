/** Rotating circular stamp, like the seal on a coffee bag. */
export default function Stamp({
  className = "",
  text = "CON MUCHO ORGULLO · DESDE 2026 · ",
}: {
  className?: string;
  text?: string;
}) {
  return (
    <div className={`pointer-events-none select-none ${className}`} aria-hidden>
      <svg
        viewBox="0 0 120 120"
        className="animate-spin-slow h-full w-full"
        fill="currentColor"
      >
        <defs>
          <path
            id="stamp-circle"
            d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
          />
        </defs>
        <text className="font-sans text-[10.5px] font-bold tracking-[0.22em]">
          <textPath href="#stamp-circle">{text}</textPath>
        </text>
        <circle cx="60" cy="60" r="29" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text
          x="60"
          y="60"
          textAnchor="middle"
          dominantBaseline="central"
          className="font-display text-[26px]"
        >
          CC
        </text>
      </svg>
    </div>
  );
}
