import { revalidatePath } from "next/cache";
import { generateText } from "ai";
import { worldCup } from "@/data/futbol";
import { getStoredResults, upsertMatchResult } from "@/lib/match-results";

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

  for (const f of worldCup.fixtures) {
    if (new Date(f.kickoff).getTime() > now) continue; // not played yet
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
