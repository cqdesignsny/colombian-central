import { getDb } from "@/lib/db";

/**
 * El Paisa's desk: short posts the agent generates on a schedule and the site
 * reads back. v1 is grounded in the site's own facts (no live web search yet),
 * so El Paisa cannot fabricate news. Upgrades to live news/scores once the AI
 * Gateway has paid credits (web search). See el-paisa-agent memory + HANDOFF.
 */

export type PaisaPost = {
  id: number;
  kind: string;
  category: string;
  title: string;
  body: string;
  link: string | null;
  created_at: string;
};

export async function getLatestPaisaPosts(limit = 6): Promise<PaisaPost[]> {
  try {
    const db = getDb();
    const rows = await db`
      SELECT id, kind, category, title, body, link, created_at
      FROM paisa_posts
      WHERE status = 'live'
      ORDER BY created_at DESC
      LIMIT ${limit}`;
    return rows as PaisaPost[];
  } catch {
    return [];
  }
}

/** True if El Paisa has posted within the window (used to throttle to ~daily). */
export async function hasRecentPaisaPosts(hours = 20): Promise<boolean> {
  try {
    const db = getDb();
    const rows = (await db`
      SELECT count(*)::int AS n FROM paisa_posts
      WHERE created_at > now() - make_interval(hours => ${hours})`) as Array<{
      n: number;
    }>;
    return (rows[0]?.n ?? 0) > 0;
  } catch {
    return false;
  }
}

export async function insertPaisaPost(p: {
  kind: string;
  category: string;
  title: string;
  body: string;
  link?: string | null;
  dedupeKey: string;
}) {
  const db = getDb();
  await db`
    INSERT INTO paisa_posts (kind, category, title, body, link, dedupe_key)
    VALUES (${p.kind}, ${p.category}, ${p.title}, ${p.body}, ${p.link ?? null}, ${p.dedupeKey})
    ON CONFLICT (dedupe_key) DO NOTHING`;
}
