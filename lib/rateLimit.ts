interface RateLimitStore {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitStore>();

export function checkRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();

  // Periodic automatic pruning to prevent unbounded memory growth
  if (rateLimitMap.size > 1000) {
    for (const [key, store] of rateLimitMap.entries()) {
      if (now > store.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }

  const current = rateLimitMap.get(identifier);

  // Clean up expired entry
  if (!current || now > current.resetAt) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { success: true, remaining: limit - 1, resetInMs: windowMs };
  }

  if (current.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetInMs: current.resetAt - now,
    };
  }

  current.count += 1;
  return {
    success: true,
    remaining: limit - current.count,
    resetInMs: current.resetAt - now,
  };
}
