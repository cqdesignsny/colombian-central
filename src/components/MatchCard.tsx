import type { Fixture } from "@/data/futbol";
import { formatKickoff } from "@/lib/format";

export default function MatchCard({
  fixture,
  light = false,
}: {
  fixture: Fixture;
  light?: boolean;
}) {
  const k = formatKickoff(fixture.kickoff);
  const home = fixture.colombiaHome;
  const frame = light
    ? "border-paper/15 bg-paper/5 text-paper"
    : "border-linea bg-paper text-ink";
  const subtle = light ? "text-paper/60" : "text-ink-soft";
  const result = fixture.result;

  // Outcome from Colombia's point of view.
  const outcome = result
    ? result.colombia > result.opponent
      ? { label: "Victoria", cls: "bg-amarillo text-ink" }
      : result.colombia === result.opponent
        ? { label: "Empate", cls: "border border-current" }
        : { label: "Derrota", cls: "bg-rojo text-paper" }
    : null;

  const colGoals = result ? fixture.goals?.filter((g) => g.team === "COL") ?? [] : [];
  const oppGoals = result ? fixture.goals?.filter((g) => g.team === "OPP") ?? [] : [];
  const goalLine = (gs: typeof colGoals) =>
    gs.map((g) => `${g.name} ${g.minute}`).join(", ");

  return (
    <div className={`relative border p-6 ${frame}`}>
      <div className="absolute top-0 bottom-0 left-0 flex w-1.5 flex-col" aria-hidden>
        <div className="flex-[2] bg-amarillo" />
        <div className="flex-1 bg-azul" />
        <div className="flex-1 bg-rojo" />
      </div>
      <div className="pl-3">
        <div className="flex items-center justify-between gap-2">
          <p className={`text-[11px] font-bold tracking-[0.25em] uppercase ${subtle}`}>
            Matchday {fixture.matchday} · Grupo K
          </p>
          {result ? (
            <span className="border border-current px-2 py-0.5 text-[10px] font-bold tracking-[0.2em] uppercase">
              {result.status}
            </span>
          ) : (
            <span className="border border-current px-2 py-0.5 text-[10px] font-bold tracking-[0.2em] uppercase">
              {fixture.tv}
            </span>
          )}
        </div>

        {result ? (
          <>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="display-tight font-display text-3xl text-amarillo uppercase sm:text-4xl">
                COL
              </span>
              <span className="font-display text-4xl tabular-nums sm:text-5xl">
                {result.colombia}
              </span>
              <span className={`font-display text-2xl ${subtle}`}>-</span>
              <span className="font-display text-4xl tabular-nums sm:text-5xl">
                {result.opponent}
              </span>
              <span className="display-tight font-display text-3xl uppercase sm:text-4xl">
                {fixture.opponentCode}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {outcome && (
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold tracking-[0.2em] uppercase ${outcome.cls}`}
                >
                  {outcome.label}
                </span>
              )}
              <span className={`text-sm ${subtle}`}>
                {k.date} · {fixture.city}
              </span>
            </div>
            {(colGoals.length > 0 || oppGoals.length > 0) && (
              <dl className={`mt-3 space-y-1 text-sm ${subtle}`}>
                {colGoals.length > 0 && (
                  <div className="flex gap-2">
                    <dt className="font-bold text-amarillo">COL</dt>
                    <dd>{goalLine(colGoals)}</dd>
                  </div>
                )}
                {oppGoals.length > 0 && (
                  <div className="flex gap-2">
                    <dt className="font-bold">{fixture.opponentCode}</dt>
                    <dd>{goalLine(oppGoals)}</dd>
                  </div>
                )}
              </dl>
            )}
          </>
        ) : (
          <>
            <p className="display-tight mt-3 font-display text-3xl uppercase sm:text-4xl">
              {home ? (
                <>
                  <span className="text-amarillo">Colombia</span>
                  <span className={subtle}> vs </span>
                  {fixture.opponent}
                </>
              ) : (
                <>
                  {fixture.opponent}
                  <span className={subtle}> vs </span>
                  <span className="text-amarillo">Colombia</span>
                </>
              )}
            </p>
            <p className="mt-3 text-sm font-bold tracking-wide uppercase">
              {k.weekday}, {k.date} · {k.time}
            </p>
            <p className={`mt-1 text-sm ${subtle}`}>
              {fixture.venue} · {fixture.city}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
