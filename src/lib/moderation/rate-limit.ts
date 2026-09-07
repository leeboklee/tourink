type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
};

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now = Date.now()
): RateLimitResult {
  const bucket = buckets.get(key) ?? { timestamps: [] };
  const cutoff = now - windowMs;
  bucket.timestamps = bucket.timestamps.filter((t) => t > cutoff);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0] ?? now;
    buckets.set(key, bucket);
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(0, oldest + windowMs - now)
    };
  }

  bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return {
    allowed: true,
    remaining: Math.max(0, limit - bucket.timestamps.length),
    retryAfterMs: 0
  };
}

export const RATE_LIMITS = {
  post: { limit: 5, windowMs: 10 * 60 * 1000 },
  comment: { limit: 20, windowMs: 10 * 60 * 1000 },
  report: { limit: 10, windowMs: 60 * 60 * 1000 },
  mutate: { limit: 60, windowMs: 60 * 1000 }
} as const;

export function __resetRateLimitsForTests() {
  buckets.clear();
}
