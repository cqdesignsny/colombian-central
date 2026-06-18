import { generateText } from "ai";

/**
 * El Paisa's live web lookup. Routes a focused query through the Vercel AI
 * Gateway to Perplexity Sonar, which has built-in web search, and returns a
 * concise plain-text answer. Used by the chat's web_search tool and the
 * autonomous desk so the agent is grounded in current facts, not just the
 * hand-maintained site knowledge.
 *
 * Reads AI_GATEWAY_API_KEY from the env (the AI SDK gateway provider picks it
 * up automatically). Fails soft: returns null on any error so callers can fall
 * back to site facts instead of breaking.
 */
const SEARCH_MODEL = "perplexity/sonar";

export async function paisaWebSearch(query: string): Promise<string | null> {
  const q = query.trim().slice(0, 300);
  if (!q) return null;
  try {
    const { text } = await generateText({
      model: SEARCH_MODEL,
      system:
        "You are a research assistant. Answer with current, factual information from the web. Be concise: a few sentences, no preamble. Always include the relevant dates. If you cannot verify something, say so plainly. Do not include citation markers like [1] or [2].",
      prompt: q,
      temperature: 0.2,
      maxOutputTokens: 500,
    });
    const clean = text.trim();
    return clean.length ? clean : null;
  } catch (err) {
    console.error("[paisa-websearch] failed:", err);
    return null;
  }
}
