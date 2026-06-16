/**
 * FTC affiliate disclosure. Required wherever we run affiliate or referral
 * links. Two looks: `inline` (a quiet line of fine print) and the default
 * boxed note for the top of a money page. `dark` for the ink-background pages.
 */
export default function AffiliateDisclosure({
  variant = "box",
  dark = false,
  className = "",
}: {
  variant?: "box" | "inline";
  dark?: boolean;
  className?: string;
}) {
  const copy =
    "Some links on this page are affiliate or referral links. If you sign up or buy through them, Colombian Central may earn a commission, at no extra cost to you. We only point you to services we would send our own familia to. Gracias por el apoyo.";

  if (variant === "inline") {
    return (
      <p
        className={`text-xs ${dark ? "text-paper/50" : "text-ink-soft/80"} ${className}`}
      >
        {copy}
      </p>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 border-l-4 border-amarillo ${
        dark ? "bg-paper/5 text-paper/70" : "bg-crema text-ink-soft"
      } px-4 py-3 ${className}`}
    >
      <span
        className="mt-0.5 text-[10px] font-bold tracking-[0.2em] text-azul uppercase"
        aria-hidden
      >
        Aviso
      </span>
      <p className="text-xs leading-relaxed">{copy}</p>
    </div>
  );
}
