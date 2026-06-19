import {
  articlesForSection,
  type Article,
  type ArticleSection,
} from "@/data/articles";
import {
  getSectionStories,
  categoryImage,
  type PaisaStory,
} from "@/lib/paisa-stories";

function articleCategoryFor(
  section: ArticleSection,
  dbCategory: string,
): Article["category"] {
  const c = (dbCategory || "").toLowerCase();
  if (c.includes("café") || c.includes("cafe")) return "Café";
  if (c.includes("gastro") || c.includes("comida") || c.includes("receta"))
    return "Gastronomía";
  switch (section) {
    case "futbol":
      return "Fútbol";
    case "musica":
      return "Música";
    case "comida":
      return "Gastronomía";
    case "viajes":
      return "Viajes";
    default:
      return "Fútbol";
  }
}

/** created_at can come back as a string or a Date depending on the driver. */
function toDateStr(value: unknown): string {
  const d = new Date(value as string | number | Date);
  return isNaN(d.getTime())
    ? new Date().toISOString().slice(0, 10)
    : d.toISOString().slice(0, 10);
}

/** Shape a DB story like a hand-written Article so it renders in the same card. */
function storyToArticle(s: PaisaStory, section: ArticleSection): Article {
  const words = s.body.split(/\s+/).filter(Boolean).length;
  return {
    slug: s.slug,
    title: s.title,
    category: articleCategoryFor(section, s.category),
    section,
    excerpt: s.dek || s.body.replace(/\s+/g, " ").trim().slice(0, 160),
    date: toDateStr(s.created_at),
    readTime: `${Math.max(2, Math.round(words / 200))} min`,
    image: s.image || categoryImage(s.category),
    body: s.body.split(/\n+/).filter((p) => p.trim().length > 0),
    sources: (s.sources || [])
      .filter((x) => /^https:\/\//i.test(x.url))
      .map((x) => ({ title: x.title, url: x.url })),
  };
}

/**
 * News for a section: El Paisa's auto-generated stories from the DB (newest
 * first) merged with the hand-written evergreen seeds, deduped by slug. The DB
 * feed is what makes content scale, the daily engine writes section-tagged
 * stories and they flow straight into the section pages. Falls back to the
 * seeds when the DB is empty (local dev, fresh deploy, or a slow news day).
 */
export async function getSectionNews(
  section: ArticleSection,
  limit = 3,
): Promise<Article[]> {
  const stories = await getSectionStories(section, limit + 3);
  const fromDb = stories.map((s) => storyToArticle(s, section));
  const seen = new Set(fromDb.map((a) => a.slug));
  const merged = [...fromDb];
  for (const a of articlesForSection(section, 6)) {
    if (!seen.has(a.slug)) {
      merged.push(a);
      seen.add(a.slug);
    }
  }
  merged.sort((a, b) => b.date.localeCompare(a.date));
  return merged.slice(0, limit);
}
