import { getDb } from "@/lib/db";
import { storyImageOverride } from "@/data/story-images";

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

/**
 * Curated, on-topic image pools per news bucket. The no-repeat picker
 * (assignDistinctImages) draws from these so a feed never shows the same photo
 * twice. Real, licensed assets only. The thinner pools (fútbol, the city bucket)
 * are the ones to grow first when new real photos come in; pin a specific photo
 * to a story by slug in data/story-images.ts.
 */
const IMAGE_POOLS = {
  futbol: [
    "/images/news/futbol-debut.jpg",
    "/images/news/futbol-watch-party.jpg",
    "/images/futbol-stadium.jpg",
    "/images/news/futbol-fans.jpg",
    "/images/news/futbol-watch-street.jpg",
  ],
  musica: [
    "/images/news/karol-g.jpg",
    "/images/news/silvestre-dangond.jpg",
    "/images/musica/vallenato.jpg",
    "/images/musica/cumbia.jpg",
    "/images/musica/urbano.jpg",
  ],
  comida: [
    "/images/news/arepa-food-halls.jpg",
    "/images/news/el-cielo.jpg",
    "/images/comida/sancocho.jpg",
    "/images/comida/ajiaco.jpg",
    "/images/comida/bandeja-paisa.jpg",
    "/images/comida/patacones.jpg",
    "/images/cafe-finca.jpg",
  ],
  viajes: [
    "/images/tayrona.jpg",
    "/images/news/mejor-epoca.jpg",
    "/images/cocora.jpg",
    "/images/guatape.jpg",
    "/images/hero-cartagena.jpg",
    "/images/san-andres.jpg",
    "/images/destinations/cali.jpg",
    "/images/destinations/nuqui.jpg",
  ],
  cultura: ["/images/vallenato.jpg", "/images/musica/cumbia.jpg", "/images/guatape.jpg"],
  // política, economía, mundo, general: Colombian cityscapes
  colombia: ["/images/news/bogota.jpg", "/images/medellin.jpg", "/images/hero-cartagena.jpg"],
} as const;

type PoolKey = keyof typeof IMAGE_POOLS;

function poolKey(category: string): PoolKey {
  const c = (category || "").toLowerCase();
  if (c.includes("fútbol") || c.includes("futbol") || c.includes("deporte")) return "futbol";
  if (c.includes("músic") || c.includes("music")) return "musica";
  if (
    c.includes("comida") ||
    c.includes("gastro") ||
    c.includes("café") ||
    c.includes("cafe") ||
    c.includes("receta")
  )
    return "comida";
  if (c.includes("viaje") || c.includes("turismo") || c.includes("travel")) return "viajes";
  if (c.includes("cultura")) return "cultura";
  return "colombia";
}

/** The full pool of on-topic photos for a category. */
export function categoryImages(category: string): readonly string[] {
  return IMAGE_POOLS[poolKey(category)];
}

/** Fallback hero image per news category when a story has none of its own. */
export function categoryImage(category: string): string {
  return categoryImages(category)[0];
}

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** An item the image picker can assign a photo to (story or article shaped). */
export type ImageItem = {
  slug: string;
  category: string;
  image?: string | null;
  /** True when image is a hand-picked real photo that must not be swapped out. */
  imagePinned?: boolean;
};

/**
 * The "never the same photo twice" rule. Walks a feed in order and guarantees
 * every item gets a distinct image:
 *  1. A slug pinned in data/story-images.ts always wins.
 *  2. A hand-picked real photo (imagePinned) keeps its image if still free.
 *  3. Everything else (the auto-stories, which carry a category fallback) draws
 *     the first unused photo from its category pool, offset by a slug hash so the
 *     choice is stable across renders.
 * Pass `reserved` to also avoid photos already used elsewhere on the page.
 */
export function assignDistinctImages<T extends ImageItem>(
  items: T[],
  reserved?: Iterable<string>,
): T[] {
  const used = new Set<string>(reserved ?? []);
  const out = new Array<T>(items.length);
  const deferred: number[] = [];

  items.forEach((it, i) => {
    const override = storyImageOverride(it.slug);
    if (override) {
      out[i] = { ...it, image: override } as T;
      used.add(override);
      return;
    }
    if (it.imagePinned && it.image && !used.has(it.image)) {
      out[i] = it;
      used.add(it.image);
      return;
    }
    deferred.push(i);
  });

  for (const i of deferred) {
    const it = items[i];
    const pool = categoryImages(it.category);
    let chosen = it.image && !used.has(it.image) ? it.image : "";
    if (!chosen) {
      const start = hashString(it.slug) % pool.length;
      for (let k = 0; k < pool.length; k++) {
        const cand = pool[(start + k) % pool.length];
        if (!used.has(cand)) {
          chosen = cand;
          break;
        }
      }
    }
    // Pool exhausted (more items in this bucket than photos): accept a repeat.
    if (!chosen) chosen = it.image || pool[0];
    out[i] = { ...it, image: chosen } as T;
    used.add(chosen);
  }

  return out;
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

/** The full library of live stories, newest first. Powers the Hemeroteca. */
export async function getArchiveStories(limit = 400): Promise<PaisaStory[]> {
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
