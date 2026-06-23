import { revalidatePath } from "next/cache";
import { generateText } from "ai";
import { worldCup, otherGroupMatches } from "@/data/futbol";
import {
  getStoredResults,
  upsertMatchResult,
  getStoredGroupResults,
  upsertGroupMatchResult,
} from "@/lib/match-results";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * Auto-updating World Cup scores. Vercel cron hits this (GET). For each fixture
 * that has kicked off and is not yet confirmed, it asks TWO web sources for the
 * final score and only publishes when they AGREE on the scoreline and that the
 * match is final. On disagreement it holds (never publishes a guess). Confirmed
 * matches are skipped on later runs. Guarded by CRON_SECRET (fail closed).
 */
type Score = { colombia: number; opponent: number; status: string } | null;

function parseScore(text: string): Score {
  try {
    const a = text.indexOf("{");
    const b = text.lastIndexOf("}");
    if (a < 0 || b <= a) return null;
    const o = JSON.parse(text.slice(a, b + 1));
    const colombia = Number(o.colombia);
    const opponent = Number(o.opponent);
    if (!Number.isInteger(colombia) || !Number.isInteger(opponent)) return null;
    if (colombia < 0 || opponent < 0 || colombia > 30 || opponent > 30) return null;
    return { colombia, opponent, status: String(o.status ?? "").toUpperCase() };
  } catch {
    return null;
  }
}

async function fetchScore(
  model: string,
  opponent: string,
  date: string,
): Promise<Score> {
  try {
    const { text } = await generateText({
      model,
      system:
        "You report only verified, finished sports results. If the match is not finished or you cannot verify it, use status UPCOMING. Output ONLY compact JSON, no prose.",
      prompt: `Final score of Colombia vs ${opponent} at the FIFA World Cup 2026 (kickoff ${date})? Reply ONLY as JSON: {"colombia": <Colombia goals>, "opponent": <${opponent} goals>, "status": "FT" or "UPCOMING"}. If not finished or unverifiable, use "UPCOMING".`,
      temperature: 0.1,
      maxOutputTokens: 200,
    });
    return parseScore(text);
  } catch (err) {
    console.error("[scores] fetch failed", model, err);
    return null;
  }
}

// Generic version for the Group K matches Colombia is not in (home vs away).
type PairScore = { a: number; b: number; status: string } | null;

function parsePairScore(text: string): PairScore {
  try {
    const i = text.indexOf("{");
    const j = text.lastIndexOf("}");
    if (i < 0 || j <= i) return null;
    const o = JSON.parse(text.slice(i, j + 1));
    const a = Number(o.a);
    const b = Number(o.b);
    if (!Number.isInteger(a) || !Number.isInteger(b)) return null;
    if (a < 0 || b < 0 || a > 30 || b > 30) return null;
    return { a, b, status: String(o.status ?? "").toUpperCase() };
  } catch {
    return null;
  }
}

async function fetchPairScore(
  model: string,
  teamA: string,
  teamB: string,
  date: string,
): Promise<PairScore> {
  try {
    const { text } = await generateText({
      model,
      system:
        "You report only verified, finished sports results. If the match is not finished or you cannot verify it, use status UPCOMING. Output ONLY compact JSON, no prose.",
      prompt: `Final score of ${teamA} vs ${teamB} at the FIFA World Cup 2026 (kickoff ${date})? Reply ONLY as JSON: {"a": <${teamA} goals>, "b": <${teamB} goals>, "status": "FT" or "UPCOMING"}. If not finished or unverifiable, use "UPCOMING".`,
      temperature: 0.1,
      maxOutputTokens: 200,
    });
    return parsePairScore(text);
  } catch (err) {
    console.error("[scores] group fetch failed", model, err);
    return null;
  }
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401 });
  }
  const gatewayReady =
    process.env.AI_GATEWAY_API_KEY ||
    process.env.VERCEL_OIDC_TOKEN ||
    process.env.VERCEL === "1";
  if (!gatewayReady) {
    return Response.json({ ok: false, reason: "no gateway" }, { status: 503 });
  }

  const now = Date.now();
  const stored = await getStoredResults();
  const checked: string[] = [];
  let updated = 0;
  let failed = 0;

  // Only spend AI calls on a Colombia match that has actually FINISHED and is
  // still recent. A match is over ~2h15m after kickoff; we stop retrying ~26h
  // out so a match that never confirms can't burn credits forever. Matches that
  // haven't ended, are already confirmed, or are stale do zero AI calls.
  const FINISHED_AFTER_MS = 2.25 * 60 * 60 * 1000;
  const GIVE_UP_AFTER_MS = 26 * 60 * 60 * 1000;

  for (const f of worldCup.fixtures) {
    const kickoff = new Date(f.kickoff).getTime();
    if (now < kickoff + FINISHED_AFTER_MS) continue; // not over yet (or not started)
    if (now > kickoff + GIVE_UP_AFTER_MS) continue; // too old, stop checking
    if (stored.get(f.matchday)?.status === "FT") continue; // already confirmed
    checked.push(f.opponent);

    const date = f.kickoff.slice(0, 10);
    const [a, b] = await Promise.all([
      fetchScore("perplexity/sonar", f.opponent, date),
      fetchScore("perplexity/sonar-pro", f.opponent, date),
    ]);

    const agree =
      a &&
      b &&
      a.status === "FT" &&
      b.status === "FT" &&
      a.colombia === b.colombia &&
      a.opponent === b.opponent;

    if (agree) {
      try {
        await upsertMatchResult({
          matchday: f.matchday,
          colombia: a.colombia,
          opponent: a.opponent,
          status: "FT",
          source: "two-source agreement (perplexity sonar + sonar-pro)",
        });
        updated++;
      } catch (e) {
        failed++;
        console.error("[scores] upsert failed", f.matchday, e);
      }
    }
  }

  // The non-Colombia Group K matches (e.g. Portugal vs Uzbekistan). The standings
  // table depends on these too, so we keep them current the same way: same post-
  // match window, same two-source agreement, separate group_match_results table.
  const teamName = new Map(worldCup.groupTeams.map((t) => [t.code, t.name]));
  const storedGroup = await getStoredGroupResults();
  for (const m of otherGroupMatches) {
    const kickoff = new Date(m.kickoff).getTime();
    if (now < kickoff + FINISHED_AFTER_MS) continue; // not over yet
    if (now > kickoff + GIVE_UP_AFTER_MS) continue; // too old, stop checking
    if (storedGroup.get(m.matchday)?.status === "FT") continue; // confirmed
    checked.push(`${m.homeCode}-${m.awayCode}`);

    const home = teamName.get(m.homeCode) ?? m.homeCode;
    const away = teamName.get(m.awayCode) ?? m.awayCode;
    const date = m.kickoff.slice(0, 10);
    const [a, b] = await Promise.all([
      fetchPairScore("perplexity/sonar", home, away, date),
      fetchPairScore("perplexity/sonar-pro", home, away, date),
    ]);

    const agree =
      a &&
      b &&
      a.status === "FT" &&
      b.status === "FT" &&
      a.a === b.a &&
      a.b === b.b;

    if (agree) {
      try {
        await upsertGroupMatchResult({
          matchday: m.matchday,
          homeCode: m.homeCode,
          awayCode: m.awayCode,
          home: a.a,
          away: a.b,
          status: "FT",
          source: "two-source agreement (perplexity sonar + sonar-pro)",
        });
        updated++;
      } catch (e) {
        failed++;
        console.error("[scores] group upsert failed", m.matchday, e);
      }
    }
  }

  if (updated > 0) {
    revalidatePath("/futbol");
    revalidatePath("/");
  }
  // Surface persistence failures so a broken DB shows as a failed cron run.
  if (failed > 0) {
    return Response.json({ ok: false, checked, updated, failed }, { status: 500 });
  }
  return Response.json({ ok: true, checked, updated });
}
