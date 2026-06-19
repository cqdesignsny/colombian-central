import type { Standing } from "@/data/futbol";
import { worldCup } from "@/data/futbol";

const flagByCode: Record<string, string> = Object.fromEntries(
  worldCup.groupTeams.map((t) => [t.code, t.flag]),
);

/** The Group K table, rendered on the (dark) fútbol page. */
export default function StandingsTable({ standings }: { standings: Standing[] }) {
  return (
    <div className="border border-paper/15 bg-paper/[0.03]">
      <table className="w-full border-collapse text-paper">
        <thead>
          <tr className="border-b border-paper/15 text-[10px] font-bold tracking-[0.18em] text-paper/50 uppercase">
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Equipo</th>
            <th className="p-3 text-center">PJ</th>
            <th className="hidden p-3 text-center sm:table-cell">G</th>
            <th className="hidden p-3 text-center sm:table-cell">E</th>
            <th className="hidden p-3 text-center sm:table-cell">P</th>
            <th className="hidden p-3 text-center sm:table-cell">GF</th>
            <th className="hidden p-3 text-center sm:table-cell">GC</th>
            <th className="p-3 text-center">DG</th>
            <th className="p-3 text-center">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((s, i) => {
            const isCol = s.code === "COL";
            const advances = i < 2;
            return (
              <tr
                key={s.code}
                className={`border-b border-paper/10 text-sm last:border-0 ${isCol ? "bg-amarillo/10" : ""}`}
              >
                <td className="p-3">
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center font-display text-base ${advances ? "bg-amarillo text-ink" : "text-paper/55"}`}
                  >
                    {i + 1}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={flagByCode[s.code]}
                      alt=""
                      className="h-4 w-6 shrink-0 border border-paper/15 object-cover"
                    />
                    <span
                      className={`font-bold tracking-wide ${isCol ? "text-amarillo" : ""}`}
                    >
                      <span className="sm:hidden">{s.code}</span>
                      <span className="hidden sm:inline">{s.name}</span>
                    </span>
                  </div>
                </td>
                <td className="p-3 text-center tabular-nums">{s.played}</td>
                <td className="hidden p-3 text-center tabular-nums sm:table-cell">
                  {s.won}
                </td>
                <td className="hidden p-3 text-center tabular-nums sm:table-cell">
                  {s.drawn}
                </td>
                <td className="hidden p-3 text-center tabular-nums sm:table-cell">
                  {s.lost}
                </td>
                <td className="hidden p-3 text-center tabular-nums sm:table-cell">
                  {s.gf}
                </td>
                <td className="hidden p-3 text-center tabular-nums sm:table-cell">
                  {s.ga}
                </td>
                <td className="p-3 text-center tabular-nums">
                  {s.gd > 0 ? `+${s.gd}` : s.gd}
                </td>
                <td className="p-3 text-center font-display text-lg tabular-nums">
                  {s.points}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="border-t border-paper/15 p-3 text-[11px] text-paper/45">
        Los dos primeros avanzan directo, más los ocho mejores terceros. La tabla
        se actualiza con cada resultado.
      </p>
    </div>
  );
}
