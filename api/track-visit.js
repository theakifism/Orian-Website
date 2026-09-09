import { nanoid } from 'nanoid';
import { parse as parseCookie, serialize as serializeCookie } from 'cookie';
import { requireSupabase } from './_lib/supabase.js';
import { getClientIp, getClientGeo } from './_lib/ip.js';
import { parseUserAgent } from './_lib/device.js';

const VISITOR_COOKIE = 'orian_visitor_id';
const VISITOR_COOKIE_DAYS = 365;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let supabase;
  try {
    supabase = requireSupabase();
  } catch (err) {
    console.error(err.message);
    // Tracking is best-effort and must never break the page for a visitor.
    return res.status(204).end();
  }

  const cookies = req.headers.cookie ? parseCookie(req.headers.cookie) : {};
  let visitorId = cookies[VISITOR_COOKIE];
  if (!visitorId) {
    visitorId = nanoid();
    res.setHeader(
      'Set-Cookie',
      serializeCookie(VISITOR_COOKIE, visitorId, {
        httpOnly: false, // harmless anonymous id; not a session credential
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        path: '/',
        maxAge: VISITOR_COOKIE_DAYS * 24 * 60 * 60,
      })
    );
  }

  // Best-effort abuse guard: a script hammering this public, unauthenticated
  // endpoint can't be blocked by a login-style "wrong password" check, but it
  // can still flood the visits table and burn through Supabase's free-tier
  // row limits. 60 inserts/minute per IP comfortably covers a real person
  // browsing multiple pages while still capping a scripted flood. Uses the
  // same shared `check_rate_limit` function as admin login (see
  // db/migrations/003_security.sql). Fails open on error -- a rate-limit
  // hiccup should never be the reason a real visit goes untracked.
  const clientIp = getClientIp(req);
  if (clientIp) {
    const { data: allowed, error: rateLimitError } = await supabase.rpc('check_rate_limit', {
      p_key: `visit-ip:${clientIp}`,
      p_max: 60,
      p_window_seconds: 60,
    });
    if (!rateLimitError && allowed === false) {
      return res.status(204).end();
    }
  }

  const { path, referrer } = req.body || {};
  const userAgent = req.headers['user-agent'] || null;
  const { device, browser, os } = parseUserAgent(userAgent);
  const { country, city } = getClientGeo(req);

  const { error } = await supabase.from('visits').insert({
    visitor_id: visitorId,
    ip: clientIp,
    user_agent: userAgent,
    path: typeof path === 'string' ? path.slice(0, 300) : null,
    referrer: typeof referrer === 'string' ? referrer.slice(0, 300) : null,
    country,
    city,
    device,
    browser,
    os,
  });

  if (error) {
    console.error('Failed to log visit:', error.message);
  }

  return res.status(204).end();
}
