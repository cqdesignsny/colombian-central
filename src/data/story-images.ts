/**
 * Manual photo assignments, keyed by article/story slug.
 *
 * This is the "loop me in" hook. When the right photo for a piece exists (Cesar
 * sends it, or we source a real licensed one), drop the file in /public/images
 * and add one line here. An override set here wins over the automatic image
 * picker (see assignDistinctImages in lib/paisa-stories.ts), so it never gets
 * swapped out by the no-repeat pass.
 *
 * Workflow: El Paisa's daily auto-stories fall back to a curated per-category
 * pool. When a story deserves its own real photo, pin it here by slug. The slug
 * for an auto-story is visible in its /noticias/<slug> URL.
 *
 * Keep these real and on-topic. Never the same photo on two different pieces.
 */
export const storyImages: Record<string, string> = {
  // "el-paisa-story-slug": "/images/news/whatever.jpg",
};

/** A pinned photo for this slug, or undefined to let the auto picker choose. */
export function storyImageOverride(slug: string): string | undefined {
  return storyImages[slug];
}
