import { revalidatePath } from "next/cache";
import { generateText } from "ai";
import { PAISA_MODEL } from "@/lib/paisa";
import {
  categoryImage,
  hasRecentStories,
  insertStory,
  recentStoryTitles,
} from "@/lib/paisa-stories";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * El Paisa's autonomous NEWS desk. The daily Vercel cron hits this (GET). It
 * throttles to ~once a day, searches the live web for current Colombia news
 * across topics (futbol, the elections/politics, economy, culture, music), then
 * has El Paisa write 1 to 3 distinct, factual stories grounded ONLY in that
 * search (neutral on politics, no fabrication), stores them in paisa_stories,
 * and revalidates /noticias. Guarded by CRON_SECRET. Pass ?force=1 to bypass the
 * daily throttle (used to seed / catch up).
 */

type GenStory = {
  slug?: string;
  title?: string;
  dek?: string;
  category?: string;
  body?: string;
  importance?: number;
  sources?: Array<{ title?: string; url?: string }>;
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export async function GET(req: Request) {
  // Fail closed: no secret configured means no access (never run paid AI + publish unauthenticated).
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

  const force = new URL(req.url).searchParams.get("force") === "1";
  if (!force && (await hasRecentStories(20))) {
    return Response.json({ ok: true, skipped: "already published today" });
  }

  const today = new Date().toISOString().slice(0, 10);

  // 1) Live web search for current Colombia news across topics (with sources).
  let news: string | null = null;
  try {
    const res = await generateText({
      model: "perplexity/sonar",
      system:
        "You are a Colombian news researcher. Report only current, factual, verifiable news with dates and a source URL for each item. Be neutral and non-partisan, especially on politics.",
      prompt: `Today is ${today}. This is a morning news recap, so list the most important Colombia news from the LAST 24 HOURS (what happened yesterday and overnight), across DIFFERENT topics: the Colombia national team (La Tricolor) at the 2026 FIFA World Cup, the current national elections and politics, the economy, culture/music/entertainment, Colombian food and restaurants (in Colombia and the US diaspora), and travel and tourism in Colombia. Give 6 to 8 distinct, recent stories spanning these topics. For EACH: a clear factual headline, a 2-3 sentence summary, the topic, the date, and two source URLs from different outlets. Strictly factual, neutral on politics. Include dates.`,
      temperature: 0.2,
      maxOutputTokens: 1200,
    });
    news = res.text?.trim() || null;
  } catch (err) {
    console.error("[paisa-news] search failed:", err);
  }
  if (!news) {
    return Response.json({ ok: false, reason: "no news from search" }, { status: 502 });
  }

  const avoid = await recentStoryTitles(96);

  // 2) El Paisa writes 1 to 3 distinct stories, grounded only in the search.
  const system = `You are El Paisa, the Colombian news editor for Colombian Central (colombiancentral.com), writing the daily news for the diaspora in the US. Today is ${today}.
Write like a real news desk: clear, factual and concise, with a light touch of Colombian warmth, in English (an occasional Spanish phrase is fine, but this is news, not a comedy bit). NEVER use em-dashes. No emojis.
Ground EVERY story ONLY in the VERIFIED NEWS provided. Do NOT invent facts, quotes, numbers, names or dates. If a detail is not in the news, leave it out.
On politics and the elections: report neutrally and factually. State what happened, who and when. Do NOT take sides, endorse anyone, or editorialize. Headlines and facts only.`;

  const prompt = `VERIFIED NEWS (web search, ${today}):
${news}

Already covered recently, do NOT repeat: ${avoid.length ? avoid.join(" | ") : "nothing yet"}.

Pick the 2 to 5 MOST newsworthy stories, each a DISTINCT subject, and spread them across the site's sections so every section gets fresh coverage over time: fútbol (La Tricolor), música, comida (food and restaurants), viajes (travel and tourism), plus the big general and política headlines. Never two about the same match. Use fewer on a genuinely slow day. Return ONLY a JSON array, nothing else. Each item:
{"title":"<factual headline>","dek":"<one-sentence standfirst>","category":"<Fútbol|Música|Comida|Viajes|Política|Economía|Cultura|Mundo>","body":"<3 to 4 short paragraphs separated by \\n\\n>","importance":<1 huge,2 notable,3 minor>,"sources":[{"title":"<source 1>","url":"<https url>"},{"title":"<source 2>","url":"<https url>"}]}
Every story MUST include at least 2 distinct, reputable source URLs from different outlets.`;

  let stories: GenStory[] = [];
  try {
    const { text } = await generateText({
      model: PAISA_MODEL,
      system,
      prompt,
      temperature: 0.5,
      maxOutputTokens: 3200,
    });
    const a = text.indexOf("[");
    const b = text.lastIndexOf("]");
    if (a >= 0 && b > a) stories = JSON.parse(text.slice(a, b + 1));
  } catch (err) {
    console.error("[paisa-news] generate/parse failed:", err);
    return Response.json({ ok: false, reason: "generate failed" }, { status: 502 });
  }

  let inserted = 0;
  const seen = new Set<string>();
  for (const s of stories.slice(0, 5)) {
    if (!s?.title || !s?.body) continue;
    let slug = slugify(s.slug || s.title);
    if (!slug) continue;
    if (seen.has(slug)) slug = `${slug}-${seen.size}`;
    seen.add(slug);
    const category = String(s.category || "Mundo").slice(0, 30);
    const sources = Array.isArray(s.sources)
      ? s.sources
          .filter((x) => x?.url && /^https:\/\//i.test(String(x.url).trim()))
          .map((x) => ({
            title: String(x.title || x.url).slice(0, 160),
            url: String(x.url).trim().slice(0, 400),
          }))
          .slice(0, 4)
      : [];
    try {
      await insertStory({
        slug,
        title: String(s.title).slice(0, 200),
        dek: s.dek ? String(s.dek).slice(0, 300) : null,
        category,
        body: String(s.body).slice(0, 6000),
        sources,
        image: categoryImage(category),
        importance: Math.min(3, Math.max(1, Number(s.importance) || 2)),
      });
      inserted++;
    } catch (e) {
      console.error("[paisa-news] insert failed:", e);
    }
  }

  if (inserted > 0) {
    for (const p of ["/noticias", "/futbol", "/musica", "/comida", "/viajes"]) {
      revalidatePath(p);
    }
  }
  return Response.json({ ok: true, inserted });
}
