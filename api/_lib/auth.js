import jwt from 'jsonwebtoken';
import { parse as parseCookie, serialize as serializeCookie } from 'cookie';
import { requireSupabase } from './supabase.js';

const COOKIE_NAME = 'orian_admin_session';
const SESSION_HOURS = 8;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      'JWT_SECRET is missing or too short. Set a long random value in your environment variables.'
    );
  }
  return secret;
}

// Issues a signed, short-lived session token for a logged-in admin.
// `sessionVersion` MUST be the admins.session_version value at the moment
// this token is issued -- see requireAdmin() below for why.
export function signAdminToken(admin, sessionVersion) {
  return jwt.sign(
    { sub: admin.id, email: admin.email, name: admin.name, role: admin.role, sv: sessionVersion },
    getSecret(),
    { expiresIn: `${SESSION_HOURS}h` }
  );
}

export function verifyAdminToken(token) {
  return jwt.verify(token, getSecret());
}

// httpOnly + Secure + SameSite=strict: not readable by JS, not sent
// cross-site. This is what makes the admin panel resistant to XSS/CSRF
// token theft compared to storing a session token in localStorage.
export function setAdminSessionCookie(res, token) {
  res.setHeader(
    'Set-Cookie',
    serializeCookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_HOURS * 60 * 60,
    })
  );
}

export function clearAdminSessionCookie(res) {
  res.setHeader(
    'Set-Cookie',
    serializeCookie(COOKIE_NAME, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    })
  );
}

function getTokenFromRequest(req) {
  const raw = req.headers.cookie;
  if (!raw) return null;
  const cookies = parseCookie(raw);
  return cookies[COOKIE_NAME] || null;
}

// Wrap any /api/admin/* handler with this. It verifies the session cookie
// AND, on every request, checks the token's session version against the
// database -- that DB check is what enforces "only one device at a time":
// logging in elsewhere bumps admins.session_version, so this device's
// still-otherwise-valid token starts failing here on its very next request.
// It also catches an account being locked mid-session (e.g. a teammate
// manually locks it) and an admin account that's been deleted.
export function requireAdmin(handler) {
  return async (req, res) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    let payload;
    try {
      payload = verifyAdminToken(token);
    } catch {
      return res.status(401).json({ error: 'Session expired or invalid' });
    }

    let supabase;
    try {
      supabase = requireSupabase();
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Server is not configured.' });
    }

    const { data: admin, error } = await supabase
      .from('admins')
      .select('id, name, email, role, session_version, locked_until')
      .eq('id', payload.sub)
      .maybeSingle();

    if (error) {
      console.error('Session check failed:', error.message);
      return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
    if (!admin) {
      clearAdminSessionCookie(res);
      return res.status(401).json({ error: 'Not authenticated' });
    }
    if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
      clearAdminSessionCookie(res);
      return res.status(423).json({ error: 'account_locked', message: 'This account is temporarily locked.' });
    }
    if (payload.sv !== admin.session_version) {
      clearAdminSessionCookie(res);
      return res.status(401).json({
        error: 'session_superseded',
        message: 'You were signed out because this account signed in on another device.',
      });
    }

    // Use fresh DB values (not the JWT's, which can go stale for up to 8h)
    // for name/role, so a role change or rename takes effect immediately.
    req.admin = { sub: admin.id, email: admin.email, name: admin.name, role: admin.role };
    return handler(req, res);
  };
}
