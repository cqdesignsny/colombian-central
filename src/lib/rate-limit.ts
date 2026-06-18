import { getDb } from "@/lib/db";

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * DB-backed sliding-window rate limit, keyed by client IP + action.
 * Serverless-safe (no in-memory state). Fails OPEN: a DB hiccup never blocks
 * a legitimate user. Good enough for current scale; swap for Upstash/Vercel
 * KV if volume grows.
 */
export async function rateLimit(
  req: Request,
  action: string,
  opts: { limit: number; windowMinutes: number },
): Promise<boolean> {
  const ip = clientIp(req);
  const db = getDb();
  try {
    const rows = (await db`
      SELECT count(*)::int AS n FROM request_log
      WHERE ip = ${ip} AND action = ${action}
        AND created_at > now() - make_interval(mins => ${opts.windowMinutes})
    `) as Array<{ n: number }>;

    if ((rows[0]?.n ?? 0) >= opts.limit) return false;

    await db`INSERT INTO request_log (ip, action) VALUES (${ip}, ${action})`;
    return true;
  } catch (err) {
    console.error("[rate-limit] check failed, allowing through:", err);
    return true;
  }
}

/**
 * Global (all-IP) sliding-window limit for an action. A cost circuit breaker:
 * caps how often an expensive action (a paid web search) can run site-wide in a
 * window, no matter who triggers it. Fails OPEN like the per-IP limiter.
 */
export async function globalRateLimit(
  action: string,
  opts: { limit: number; windowMinutes: number },
): Promise<boolean> {
  const db = getDb();
  try {
    const rows = (await db`
      SELECT count(*)::int AS n FROM request_log
      WHERE action = ${action}
        AND created_at > now() - make_interval(mins => ${opts.windowMinutes})
    `) as Array<{ n: number }>;

    if ((rows[0]?.n ?? 0) >= opts.limit) return false;

    await db`INSERT INTO request_log (ip, action) VALUES ('global', ${action})`;
    return true;
  } catch (err) {
    console.error("[rate-limit] global check failed, allowing through:", err);
    return true;
  }
}

const TOO_MANY = {
  ok: false as const,
  error: "Demasiados intentos. Espera un momento e intenta de nuevo.",
};

export function tooManyRequests() {
  return Response.json(TOO_MANY, { status: 429 });
}

/** A filled honeypot field means a bot. Returns true if the request looks like spam. */
export function isHoneypotTripped(value: unknown) {
  return typeof value === "string" && value.trim().length > 0;
}
