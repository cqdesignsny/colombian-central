/** The flag, in its real proportions: half amarillo, quarter azul, quarter rojo. */
export default function TricolorBar({
  className = "h-1.5",
}: {
  className?: string;
}) {
  return (
    <div className={`flex w-full ${className}`} aria-hidden>
      <div className="flex-[2] bg-amarillo" />
      <div className="flex-1 bg-azul" />
      <div className="flex-1 bg-rojo" />
    </div>
  );
}
