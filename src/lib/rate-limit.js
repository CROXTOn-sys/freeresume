// Simple in-memory rate limiter
const rateMap = new Map();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateMap) {
    if (now - data.start > 120000) rateMap.delete(key);
  }
}, 300000);

/**
 * Rate limit by IP address
 * @param {Request} request
 * @param {object} options - { limit: number, windowMs: number }
 * @returns {{ success: boolean, remaining: number }}
 */
export function rateLimit(request, { limit = 10, windowMs = 60000 } = {}) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
  const key = `${ip}:${request.url}`;
  const now = Date.now();
  const record = rateMap.get(key);

  if (!record || now - record.start > windowMs) {
    rateMap.set(key, { start: now, count: 1 });
    return { success: true, remaining: limit - 1 };
  }

  record.count++;
  if (record.count > limit) {
    return { success: false, remaining: 0 };
  }

  return { success: true, remaining: limit - record.count };
}
