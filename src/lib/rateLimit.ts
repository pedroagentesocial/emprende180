/**
 * Rate limiting per IP — sliding window, in memory.
 *
 * SCOPE, said plainly: this lives in the memory of ONE function instance. With
 * Fluid Compute instances are reused between requests, so it comfortably stops
 * the real case (a script hammering the form from one IP), but it is NOT a
 * global limit: an attacker spread across several regions would see their own
 * counter in each instance.
 *
 * It is the right call for launch: zero dependencies, zero latency, zero cost.
 * When the volume justifies it, the point of change is a single function —
 * `consume()` — with a shared counter behind it (Upstash Redis from the
 * Marketplace, or Vercel Runtime Cache). The rest of the code never finds out.
 */

interface Window {
  /** Timestamps of the attempts inside the window. */
  hits: number[];
  /** When the entry expires, so it can be swept. */
  expires: number;
}

const registry = new Map<string, Window>();

/** Lazy sweep: cleaned on use, with no background timers. */
function sweep(now: number) {
  if (registry.size < 500) return;
  for (const [key, w] of registry) {
    if (w.expires <= now) registry.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  /** Attempts left in the current window. */
  remaining: number;
  /** Seconds until a slot frees up. Only useful when `allowed` is false. */
  retryAfter: number;
}

/**
 * Consumes one attempt for `key`.
 *
 * @param key      Identifier of the sender (an IP, normally).
 * @param max      Attempts allowed inside the window.
 * @param windowMs Size of the window in milliseconds.
 */
export function consume(
  key: string,
  max = 5,
  windowMs = 10 * 60 * 1000,
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const entry = registry.get(key);
  const hits = (entry?.hits ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= max) {
    const oldest = hits[0]!;
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
    };
  }

  hits.push(now);
  registry.set(key, { hits, expires: now + windowMs });

  return {
    allowed: true,
    remaining: max - hits.length,
    retryAfter: 0,
  };
}

/**
 * Double-submit shield.
 *
 * The client already blocks the button while a request is in flight, but that
 * doesn't cover a double tap on a phone with a slow connection, a browser retry,
 * or someone re-sending by hand. If the same email comes back inside the window,
 * success is returned without writing anything or sending more email: the
 * operation is idempotent, not an error the user has to understand.
 */
const recent = new Map<string, number>();
const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;

export function isRecentDuplicate(email: string): boolean {
  const now = Date.now();

  if (recent.size > 500) {
    for (const [k, t] of recent) {
      if (now - t > DUPLICATE_WINDOW_MS) recent.delete(k);
    }
  }

  const seen = recent.get(email);
  if (seen !== undefined && now - seen < DUPLICATE_WINDOW_MS) return true;

  recent.set(email, now);
  return false;
}

/** Extracts the client IP, respecting Vercel's proxy headers. */
export function clientIp(request: Request, fallback?: string): string {
  const header =
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "";
  // `x-forwarded-for` can carry a chain of proxies: the first one is the client.
  const first = header.split(",")[0]?.trim();
  return first || fallback || "unknown";
}
