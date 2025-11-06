import { Redis } from '@upstash/redis';

// Use placeholder values for build/test if not configured
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL?.startsWith('https')
  ? process.env.UPSTASH_REDIS_REST_URL
  : 'https://placeholder.upstash.io';
const REDIS_TOKEN = (process.env.UPSTASH_REDIS_REST_TOKEN?.length ?? 0) > 10
  ? process.env.UPSTASH_REDIS_REST_TOKEN
  : 'placeholder_token_for_build';

export const redis = new Redis({
  url: REDIS_URL,
  token: REDIS_TOKEN,
});

// Rate limiting helper
export async function rateLimit(
  identifier: string,
  limit: number = 10,
  window: number = 60
): Promise<{ success: boolean; remaining: number; reset: number }> {
  const key = `rate_limit:${identifier}`;
  const now = Date.now();
  const windowStart = now - window * 1000;

  // Remove old entries
  await redis.zremrangebyscore(key, 0, windowStart);

  // Count current requests
  const count = await redis.zcard(key);

  if (count >= limit) {
    const oldest = await redis.zrange(key, 0, 0, { withScores: true });
    const resetTime = oldest[0]
      ? Math.ceil((Number(oldest[1]) + window * 1000 - now) / 1000)
      : window;

    return {
      success: false,
      remaining: 0,
      reset: resetTime,
    };
  }

  // Add current request
  await redis.zadd(key, { score: now, member: `${now}:${Math.random()}` });
  await redis.expire(key, window);

  return {
    success: true,
    remaining: limit - count - 1,
    reset: window,
  };
}

// Cache helpers
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    return data as T | null;
  },

  async set(key: string, value: unknown, ttl: number = 3600): Promise<void> {
    await redis.set(key, value, { ex: ttl });
  },

  async del(key: string): Promise<void> {
    await redis.del(key);
  },

  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result === 1;
  },
};
