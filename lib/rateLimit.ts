/**
 * Best-effort sliding-window rate limiter, kept in memory.
 *
 * Each server instance counts on its own, so on serverless hosting a determined caller can spread
 * requests across instances. It still stops the common cases (a script hammering one endpoint),
 * and a global limit alongside a per-client one caps the total no matter how clients are told
 * apart. A shared store (Redis, KV) is the upgrade if this ever needs to be exact.
 */
const hits = new Map<string, number[]>();
const MAX_KEYS = 5000;

export type Limit = { ok: true } | { ok: false; retryAfter: number };

export const rateLimit = (key: string, limit: number, windowMs: number, now = Date.now()): Limit => {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return { ok: false, retryAfter: Math.max(1, Math.ceil((windowMs - (now - recent[0])) / 1000)) };
  }
  recent.push(now);
  hits.set(key, recent);

  // Bound memory: drop keys whose newest hit is outside every window we use.
  if (hits.size > MAX_KEYS) {
    for (const [k, times] of hits) if (now - times[times.length - 1] > windowMs) hits.delete(k);
    if (hits.size > MAX_KEYS) hits.clear();
  }
  return { ok: true };
};

/** The caller's address as the hosting platform reports it. */
export const clientKey = (request: Request) =>
  request.headers.get("x-real-ip") ??
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  "unknown";
