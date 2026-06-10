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
          <span className="border border-current px-2 py-0.5 text-[10px] font-bold tracking-[0.2em] uppercase">
            {fixture.tv}
          </span>
        </div>
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
      </div>
    </div>
  );
}
