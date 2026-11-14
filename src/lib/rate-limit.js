import { createClient } from '@supabase/supabase-js';

// Simple in-memory rate limiter
const rateMap = new Map();
let supabaseAdmin;

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
  const key = `${ip}:${new URL(request.url).pathname}`;
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

export async function rateLimitByUser(userId, route, { limit, windowMs = 60000 }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase service credentials are required for shared rate limiting');
  }

  supabaseAdmin ||= createClient(
    supabaseUrl,
    serviceRoleKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { data, error } = await supabaseAdmin.rpc('consume_api_rate_limit', {
    p_key: `${route}:${userId}`,
    p_limit: limit,
    p_window_seconds: Math.ceil(windowMs / 1000),
  });
  if (error) throw new Error(`Shared rate limit check failed: ${error.message}`);

  const result = Array.isArray(data) ? data[0] : data;
  if (!result || typeof result.allowed !== 'boolean') {
    throw new Error('Shared rate limit returned an invalid result');
  }

  return { success: result.allowed, remaining: Number(result.remaining) || 0 };
}
