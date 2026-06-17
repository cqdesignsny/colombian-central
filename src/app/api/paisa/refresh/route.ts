import { revalidatePath } from "next/cache";
import { generateText } from "ai";
import { PAISA_MODEL, SITE_KNOWLEDGE } from "@/lib/paisa";
import { hasRecentPaisaPosts, insertPaisaPost } from "@/lib/paisa-posts";

export const runtime = "nodejs";
export const maxDuration = 60;

type GenPost = {
  kind?: string;
  category?: string;
  title?: string;
  body?: string;
  link?: string;
};

/**
 * El Paisa's autonomous desk refresh. Vercel cron hits this (GET). It throttles
 * to ~daily, then has El Paisa write a few short posts grounded ONLY in the
 * site's own facts, and stores them. No web search yet (free-tier Gateway), so
 * no invented news or scores. Guarded by CRON_SECRET.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const gatewayReady =
    process.env.AI_GATEWAY_API_KEY ||
    process.env.VERCEL_OIDC_TOKEN ||
    process.env.VERCEL === "1";
  if (!gatewayReady) {
    return Response.json({ ok: false, reason: "no gateway" }, { status: 503 });
  }

  if (await hasRecentPaisaPosts(20)) {
    return Response.json({ ok: true, skipped: "recent posts exist" });
  }

  const today = new Date().toISOString().slice(0, 10);
  const system = `You are El Paisa, the Colombian mascot of Colombian Central, writing short "desk" posts for the site's El Paisa feed. Full Spanglish, paisa flavor (parce, pues, hagale, que chimba), funny but warm and accurate. Ground EVERY post ONLY in the facts below. Do NOT invent scores, breaking news, prices, dates, or anything not in the facts. Today is ${today}.

FACTS:
${SITE_KNOWLEDGE}`;

  const prompt = `Write exactly 3 short desk posts as a JSON array, nothing else. Each item:
{"kind":"preview"|"spotlight"|"note","category":"futbol"|"musica"|"comida"|"cultura","title":"<short punchy paisa title>","body":"<1-2 sentences in your voice>","link":"<an internal path from the facts like /futbol, /comida, /musica, /tienda, /viajes>"}
Make ONE a hype preview of Colombia's next World Cup group match, and the other two spotlights of real things in the facts (a dish, an artist, the tienda, a trip). Return ONLY the JSON array.`;

  let posts: GenPost[] = [];
  try {
    const { text } = await generateText({
      model: PAISA_MODEL,
      system,
      prompt,
      temperature: 0.8,
      maxOutputTokens: 900,
    });
    const a = text.indexOf("[");
    const b = text.lastIndexOf("]");
    if (a >= 0 && b > a) posts = JSON.parse(text.slice(a, b + 1));
  } catch (err) {
    console.error("[paisa-refresh] generate/parse failed:", err);
    return Response.json({ ok: false, reason: "generate failed" }, { status: 502 });
  }

  let inserted = 0;
  for (let i = 0; i < posts.length; i++) {
    const p = posts[i];
    if (!p?.title || !p?.body) continue;
    try {
      await insertPaisaPost({
        kind: String(p.kind || "note").slice(0, 20),
        category: String(p.category || "cultura").slice(0, 20),
        title: String(p.title).slice(0, 200),
        body: String(p.body).slice(0, 600),
        link: p.link ? String(p.link).slice(0, 80) : null,
        dedupeKey: `${today}-${i}-${String(p.title).slice(0, 40)}`,
      });
      inserted++;
    } catch (e) {
      console.error("[paisa-refresh] insert failed:", e);
    }
  }

  if (inserted > 0) revalidatePath("/noticias");
  return Response.json({ ok: true, inserted });
}
