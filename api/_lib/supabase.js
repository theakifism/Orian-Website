import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Server-only client. SUPABASE_SERVICE_ROLE_KEY must NEVER be prefixed with
// VITE_ or referenced from src/ — that would bundle it into the public
// browser JS. It is only ever read here, inside /api (Vercel serverless).
export const supabase =
  url && serviceKey
    ? createClient(url, serviceKey, {
        auth: { persistSession: false },
      })
    : null;

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    );
  }
  return supabase;
}
