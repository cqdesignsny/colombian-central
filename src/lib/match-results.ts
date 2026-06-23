import { getDb } from "@/lib/db";
import {
  worldCup,
  otherGroupMatches,
  computeStandings,
  type Fixture,
  type Goal,
  type PlayedResult,
  type Standing,
} from "@/data/futbol";

/**
 * Auto-updated match results. The scores cron (/api/cron/scores) writes a row
 * per matchday only when two web sources agree; here we read them back and
 * overlay them onto the static fixtures so /futbol shows live results without
 * any hand-editing. Fails soft to the static data if the DB is unavailable.
 */
export type StoredResult = {
  matchday: number;
  colombia: number;
  opponent: number;
  status: "FT" | "HT";
  goals: Goal[];
};

export async function getStoredResults(): Promise<Map<number, StoredResult>> {
  const map = new Map<number, StoredResult>();
  try {
    const db = getDb();
    const rows = (await db`
      SELECT matchday, colombia, opponent, status, goals FROM match_results
    `) as Array<{
      matchday: number;
      colombia: number;
      opponent: number;
      status: string;
      goals: unknown;
    }>;
    for (const r of rows) {
      map.set(r.matchday, {
        matchday: r.matchday,
        colombia: r.colombia,
        opponent: r.opponent,
        status: r.status === "HT" ? "HT" : "FT",
        goals: Array.isArray(r.goals) ? (r.goals as Goal[]) : [],
      });
    }
  } catch {
    // fall back to static data
  }
  return map;
}

/** The static fixtures with any DB results overlaid (DB wins; static is fallback). */
export async function getFixturesWithResults(): Promise<Fixture[]> {
  const results = await getStoredResults();
  return worldCup.fixtures.map((f) => {
    const r = results.get(f.matchday);
    if (!r) return f;
    return {
      ...f,
      result: { colombia: r.colombia, opponent: r.opponent, status: r.status },
      goals: r.goals.length ? r.goals : f.goals,
    };
  });
}

export async function upsertMatchResult(r: {
  matchday: number;
  colombia: number;
  opponent: number;
  status: string;
  goals?: Goal[];
  source?: string;
}) {
  const db = getDb();
  await db`
    INSERT INTO match_results (matchday, colombia, opponent, status, goals, source, updated_at)
    VALUES (${r.matchday}, ${r.colombia}, ${r.opponent}, ${r.status},
            ${JSON.stringify(r.goals ?? [])}, ${r.source ?? null}, now())
    ON CONFLICT (matchday) DO UPDATE SET
      colombia = EXCLUDED.colombia,
      opponent = EXCLUDED.opponent,
      status = EXCLUDED.status,
      goals = EXCLUDED.goals,
      source = EXCLUDED.source,
      updated_at = now()`;
}

export type StoredGroupResult = {
  matchday: number;
  homeCode: string;
  awayCode: string;
  home: number;
  away: number;
  status: "FT" | "HT";
};

/**
 * DB-stored results for the Group K matches Colombia is NOT in (auto-updated by
 * the scores cron). Keyed by matchday. Fails soft to an empty map, so the static
 * otherGroupMatches stays the source of truth if the DB is unavailable.
 */
export async function getStoredGroupResults(): Promise<
  Map<number, StoredGroupResult>
> {
  const map = new Map<number, StoredGroupResult>();
  try {
    const db = getDb();
    const rows = (await db`
      SELECT matchday, home_code, away_code, home_goals, away_goals, status
      FROM group_match_results
    `) as Array<{
      matchday: number;
      home_code: string;
      away_code: string;
      home_goals: number;
      away_goals: number;
      status: string;
    }>;
    for (const r of rows) {
      map.set(r.matchday, {
        matchday: r.matchday,
        homeCode: r.home_code,
        awayCode: r.away_code,
        home: r.home_goals,
        away: r.away_goals,
        status: r.status === "HT" ? "HT" : "FT",
      });
    }
  } catch {
    // fall back to the static otherGroupMatches
  }
  return map;
}

export async function upsertGroupMatchResult(r: {
  matchday: number;
  homeCode: string;
  awayCode: string;
  home: number;
  away: number;
  status: string;
  source?: string;
}) {
  const db = getDb();
  await db`
    INSERT INTO group_match_results
      (matchday, home_code, away_code, home_goals, away_goals, status, source, updated_at)
    VALUES (${r.matchday}, ${r.homeCode}, ${r.awayCode}, ${r.home}, ${r.away},
            ${r.status}, ${r.source ?? null}, now())
    ON CONFLICT (matchday) DO UPDATE SET
      home_code = EXCLUDED.home_code,
      away_code = EXCLUDED.away_code,
      home_goals = EXCLUDED.home_goals,
      away_goals = EXCLUDED.away_goals,
      status = EXCLUDED.status,
      source = EXCLUDED.source,
      updated_at = now()`;
}

/**
 * The live Group K table. Both Colombia's results AND the three non-Colombia
 * matches now come from the DB overlay (auto-updated by the scores cron with
 * two-source agreement). The static data in futbol.ts is the fallback when the
 * DB has no confirmed result yet. A DB group result is only used when its team
 * codes match the fixture, so a stale row can never corrupt the table.
 */
export async function getGroupStandings(): Promise<Standing[]> {
  const [fixtures, groupResults] = await Promise.all([
    getFixturesWithResults(),
    getStoredGroupResults(),
  ]);
  const played: PlayedResult[] = [];
  for (const f of fixtures) {
    if (f.result) {
      played.push({
        aCode: "COL",
        aGoals: f.result.colombia,
        bCode: f.opponentCode,
        bGoals: f.result.opponent,
      });
    }
  }
  for (const m of otherGroupMatches) {
    const dbr = groupResults.get(m.matchday);
    if (dbr && dbr.homeCode === m.homeCode && dbr.awayCode === m.awayCode) {
      played.push({
        aCode: m.homeCode,
        aGoals: dbr.home,
        bCode: m.awayCode,
        bGoals: dbr.away,
      });
    } else if (m.result) {
      played.push({
        aCode: m.homeCode,
        aGoals: m.result.home,
        bCode: m.awayCode,
        bGoals: m.result.away,
      });
    }
  }
  return computeStandings(played);
}
