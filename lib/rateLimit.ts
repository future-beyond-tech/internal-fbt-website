type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

type GlobalRateLimitStore = {
  store: Map<string, RateLimitEntry>;
  lastCleanupAt: number;
};

const globalForRateLimit = globalThis as typeof globalThis & {
  __fbtRateLimit?: GlobalRateLimitStore;
};

const RATE_LIMIT_STATE =
  globalForRateLimit.__fbtRateLimit ??
  (globalForRateLimit.__fbtRateLimit = {
    store: new Map<string, RateLimitEntry>(),
    lastCleanupAt: 0,
  });

function cleanupExpiredEntries(now: number) {
  for (const [key, entry] of RATE_LIMIT_STATE.store.entries()) {
    if (entry.resetAt <= now) {
      RATE_LIMIT_STATE.store.delete(key);
    }
  }

  RATE_LIMIT_STATE.lastCleanupAt = now;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  return "unknown";
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();

  if (now - RATE_LIMIT_STATE.lastCleanupAt > windowMs) {
    cleanupExpiredEntries(now);
  }

  const existing = RATE_LIMIT_STATE.store.get(key);
  if (!existing || existing.resetAt <= now) {
    RATE_LIMIT_STATE.store.set(key, { count: 1, resetAt: now + windowMs });
    return {
      allowed: true,
      remaining: Math.max(limit - 1, 0),
      retryAfterSeconds: 0,
    };
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000)
      ),
    };
  }

  existing.count += 1;

  return {
    allowed: true,
    remaining: Math.max(limit - existing.count, 0),
    retryAfterSeconds: 0,
  };
}
