import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { rateLimitByUser } from './rate-limit.js';

export async function authorizeAiRequest({ route, limit }) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          },
        },
      }
    );
    const { data: { user }, error } = await supabase.auth.getUser();
    if (!user && (!error || error.name === 'AuthSessionMissingError' || error.status === 401)) {
      return { ok: false, status: 401, error: 'Authentication required' };
    }
    if (error) {
      console.error('[ai-api] authentication check failed:', error.message);
      return { ok: false, status: 503, error: 'Authentication is temporarily unavailable' };
    }
    if (!user) return { ok: false, status: 401, error: 'Authentication required' };

    const rateLimit = await rateLimitByUser(user.id, route, { limit });
    if (!rateLimit.success) {
      return { ok: false, status: 429, error: 'Too many requests. Please wait.' };
    }
    return { ok: true, user };
  } catch (error) {
    console.error('[ai-api] request authorization failed:', error);
    return { ok: false, status: 503, error: 'AI service is temporarily unavailable' };
  }
}

export async function readJsonBody(request, maxBytes) {
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return { ok: false, status: 415, error: 'Content-Type must be application/json' };
  }

  const contentLength = Number(request.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    return { ok: false, status: 413, error: 'Request body is too large' };
  }

  if (!request.body) return { ok: false, status: 400, error: 'Request body is required' };

  const reader = request.body.getReader();
  const chunks = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel();
        return { ok: false, status: 413, error: 'Request body is too large' };
      }
      chunks.push(value);
    }
  } catch (error) {
    console.error('[ai-api] request body read failed:', error);
    return { ok: false, status: 400, error: 'Unable to read request body' };
  }

  const body = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return { ok: true, data: JSON.parse(new TextDecoder().decode(body)) };
  } catch {
    return { ok: false, status: 400, error: 'Request body must be valid JSON' };
  }
}

export async function fetchWithTimeout(url, options, timeoutMs = 5000) {
  return fetch(url, { ...options, signal: AbortSignal.timeout(timeoutMs) });
}
