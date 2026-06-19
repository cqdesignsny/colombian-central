import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getDb } from "@/lib/db";

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Rate limiting with two backends:
 *  - Upstash Redis (serverless, REST) when UPSTASH_REDIS_REST_URL + _TOKEN are
 *    set. This is the at-scale path: O(1) per request, keys auto-expire, no
 *    per-request Postgres writes. Add it via the Vercel Marketplace (Upstash);
 *    Vercel KV is retired.
 *  - DB-backed sliding window (Neon) as the fallback when Upstash is not
 *    configured, so the limiter always works.
 * Both fail OPEN: a backend hiccup never blocks a legitimate user.
 */

let redisClient: Redis | null | undefined;

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  redisClient = url && token ? new Redis({ url, token }) : null;
  return redisClient;
}

// One Ratelimit instance per (limit, window) combo, since limits vary per action.
const limiters = new Map<string, Ratelimit>();

function getLimiter(limit: number, windowMinutes: number): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  const key = `${limit}:${windowMinutes}`;
  let rl = limiters.get(key);
  if (!rl) {
    rl = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(limit, `${windowMinutes} m`),
      prefix: "cc-rl",
      analytics: false,
    });
    limiters.set(key, rl);
  }
  return rl;
}

/**
 * Per-IP sliding-window rate limit, keyed by client IP + action.
 * Serverless-safe (no in-memory state). Fails OPEN.
 */
export async function rateLimit(
  req: Request,
  action: string,
  opts: { limit: number; windowMinutes: number },
): Promise<boolean> {
  const ip = clientIp(req);

  const rl = getLimiter(opts.limit, opts.windowMinutes);
  if (rl) {
    try {
      const { success } = await rl.limit(`${action}:${ip}`);
      return success;
    } catch (err) {
      console.error("[rate-limit] upstash check failed, allowing through:", err);
      return true;
    }
  }

  // Fallback: DB-backed sliding window.
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
  const rl = getLimiter(opts.limit, opts.windowMinutes);
  if (rl) {
    try {
      const { success } = await rl.limit(`global:${action}`);
      return success;
    } catch (err) {
      console.error(
        "[rate-limit] upstash global check failed, allowing through:",
        err,
      );
      return true;
    }
  }

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
