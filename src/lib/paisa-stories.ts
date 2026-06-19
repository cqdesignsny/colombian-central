import { getDb } from "@/lib/db";

/**
 * El Paisa's news desk. Full news stories the agent writes daily from live web
 * search (see /api/paisa/refresh), 1 to 3 a day across topics. Stored here and
 * rendered as the news feed on /noticias and individual story pages.
 */

export type StorySource = { title: string; url: string };

export type PaisaStory = {
  id: number;
  slug: string;
  title: string;
  dek: string | null;
  category: string;
  body: string;
  sources: StorySource[];
  image: string | null;
  importance: number;
  created_at: string;
};

/** Fallback hero image per news category when a story has none of its own. */
export function categoryImage(category: string): string {
  const c = category.toLowerCase();
  if (c.includes("fútbol") || c.includes("futbol") || c.includes("deporte"))
    return "/images/futbol-stadium.jpg";
  if (c.includes("músic") || c.includes("music")) return "/images/musica/hero.jpg";
  if (c.includes("comida") || c.includes("gastro")) return "/images/comida/hero.jpg";
  if (c.includes("cultura")) return "/images/vallenato.jpg";
  if (c.includes("viaje") || c.includes("travel")) return "/images/tayrona.jpg";
  // política, economía, mundo, general
  return "/images/news/bogota.jpg";
}

export async function getLatestStories(limit = 9): Promise<PaisaStory[]> {
  try {
    const db = getDb();
    const rows = await db`
      SELECT id, slug, title, dek, category, body, sources, image, importance, created_at
      FROM paisa_stories
      WHERE status = 'live'
      ORDER BY created_at DESC, importance ASC
      LIMIT ${limit}`;
    return rows as PaisaStory[];
  } catch {
    return [];
  }
}

export async function getStoryBySlug(slug: string): Promise<PaisaStory | null> {
  try {
    const db = getDb();
    const rows = (await db`
      SELECT id, slug, title, dek, category, body, sources, image, importance, created_at
      FROM paisa_stories
      WHERE slug = ${slug} AND status = 'live'
      LIMIT 1`) as PaisaStory[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

/** Recent story titles, so the writer does not repeat what it already covered. */
export async function recentStoryTitles(hours = 96): Promise<string[]> {
  try {
    const db = getDb();
    const rows = (await db`
      SELECT title FROM paisa_stories
      WHERE created_at > now() - make_interval(hours => ${hours})
      ORDER BY created_at DESC`) as Array<{ title: string }>;
    return rows.map((r) => r.title);
  } catch {
    return [];
  }
}

/** True if El Paisa already published a story within the window (throttle). */
export async function hasRecentStories(hours = 20): Promise<boolean> {
  try {
    const db = getDb();
    const rows = (await db`
      SELECT count(*)::int AS n FROM paisa_stories
      WHERE created_at > now() - make_interval(hours => ${hours})`) as Array<{
      n: number;
    }>;
    return (rows[0]?.n ?? 0) > 0;
  } catch {
    return false;
  }
}

export async function insertStory(s: {
  slug: string;
  title: string;
  dek?: string | null;
  category: string;
  body: string;
  sources?: StorySource[];
  image?: string | null;
  importance?: number;
}) {
  const db = getDb();
  await db`
    INSERT INTO paisa_stories (slug, title, dek, category, body, sources, image, importance)
    VALUES (
      ${s.slug}, ${s.title}, ${s.dek ?? null}, ${s.category}, ${s.body},
      ${JSON.stringify(s.sources ?? [])}, ${s.image ?? null}, ${s.importance ?? 2}
    )
    ON CONFLICT (slug) DO NOTHING`;
}

export type SiteSection = "futbol" | "musica" | "comida" | "viajes" | "colombia";

/**
 * Map a story's free-text category to a site section, so El Paisa's auto-written
 * stories flow into the right section page. "colombia" = general/política, which
 * only surfaces on /noticias.
 */
export function sectionForCategory(category: string): SiteSection {
  const c = (category || "").toLowerCase();
  if (c.includes("fútbol") || c.includes("futbol") || c.includes("deporte"))
    return "futbol";
  if (c.includes("músic") || c.includes("music")) return "musica";
  if (
    c.includes("comida") ||
    c.includes("gastro") ||
    c.includes("café") ||
    c.includes("cafe") ||
    c.includes("receta")
  )
    return "comida";
  if (c.includes("viaje") || c.includes("turismo") || c.includes("travel"))
    return "viajes";
  return "colombia";
}

/**
 * Latest live stories that belong to a given site section, newest first. Pulls a
 * recent window and filters by section (fine at this volume; add a section
 * column + index if the table grows large).
 */
export async function getSectionStories(
  section: SiteSection,
  limit = 3,
): Promise<PaisaStory[]> {
  try {
    const db = getDb();
    const rows = (await db`
      SELECT id, slug, title, dek, category, body, sources, image, importance, created_at
      FROM paisa_stories
      WHERE status = 'live'
      ORDER BY created_at DESC, importance ASC
      LIMIT 60`) as PaisaStory[];
    return rows
      .filter((r) => sectionForCategory(r.category) === section)
      .slice(0, limit);
  } catch {
    return [];
  }
}
