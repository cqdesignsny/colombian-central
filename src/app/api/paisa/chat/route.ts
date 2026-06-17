import { streamText } from "ai";
import { PAISA_MODEL, PAISA_SYSTEM } from "@/lib/paisa";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

type ChatMessage = { role: "user" | "assistant"; content: string };

const PLAIN = { "content-type": "text/plain; charset=utf-8" };

export async function POST(req: Request) {
  // Abuse protection: per-IP limit, fails open (see src/lib/rate-limit.ts).
  const allowed = await rateLimit(req, "paisa-chat", { limit: 30, windowMinutes: 10 });
  if (!allowed) return tooManyRequests();

  // El Paisa runs on the Vercel AI Gateway. Until the key is set, answer kindly
  // instead of throwing, so the widget never looks broken.
  if (!process.env.AI_GATEWAY_API_KEY) {
    return new Response(
      "Ey, soy El Paisa. Todavia me estan terminando de conectar el cerebro. Vuelve en un ratico, parce.",
      { headers: PLAIN },
    );
  }

  let messages: ChatMessage[] = [];
  try {
    const body = await req.json();
    messages = Array.isArray(body?.messages) ? body.messages : [];
  } catch {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const clean = messages
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }))
    .slice(-12);

  if (clean.length === 0 || clean[clean.length - 1]!.role !== "user") {
    return Response.json({ error: "No message" }, { status: 400 });
  }

  try {
    const result = streamText({
      model: PAISA_MODEL,
      system: PAISA_SYSTEM,
      messages: clean,
      temperature: 0.6,
      maxOutputTokens: 700,
    });
    return result.toTextStreamResponse();
  } catch (err) {
    console.error("[paisa-chat] error:", err);
    return new Response(
      "Uy, se me fue la senal un momento. Intenta de nuevo, parce.",
      { headers: PLAIN, status: 503 },
    );
  }
}
