import bcrypt from 'bcryptjs';
import { requireSupabase } from '../supabase.js';
import { signAdminToken, setAdminSessionCookie } from '../auth.js';
import { verifyTurnstile } from '../turnstile.js';
import { getClientIp, getClientGeo } from '../ip.js';
import { parseUserAgent } from '../device.js';
import { sendAccountLockAlert } from '../email.js';

// Throttle by BOTH email and IP, via the shared `check_rate_limit` Postgres
// function (see db/migrations/003_security.sql). This replaces the old
// in-memory Map: Vercel runs multiple/ephemeral function instances, so a
// counter living only in one instance's memory can be trivially bypassed by
// an attacker who just keeps retrying until they land on a fresh instance.
// A row in Postgres is shared by every instance, so it can't be dodged that
// way. Checking by IP as well as by email also stops one attacker from
// spraying many different email addresses to avoid a single email's limit.
const MAX_ATTEMPTS_PER_EMAIL = 8;
const MAX_ATTEMPTS_PER_IP = 20; // looser -- a shared office/NAT IP has multiple real employees
const WINDOW_SECONDS = 10 * 60;

// A SEPARATE, tighter lockout on top of the rate limiter above: after this
// many wrong passwords in a row on ONE account, that specific account is
// locked for LOCK_MINUTES -- regardless of IP -- and the whole team gets an
// email with the attempt's IP/region/device (see db/migrations/004_account_
// security.sql, sendAccountLockAlert).
//
// This is deliberately a TIME-LIMITED lock, not a permanent one. A
// permanent "block until manually unlocked" lockout sounds stricter but is
// actually a bigger risk for a small team: an admin's work email usually
// isn't secret, so anyone who knows it could lock a real employee out of
// their own account indefinitely just by typing wrong passwords on
// purpose -- for free, with no need to actually guess anything. A 30-minute
// auto-expiring lock plus an immediate alert to the team gets you the same
// "someone is trying to break in, and we know about it" protection without
// handing attackers a zero-cost way to permanently deny a real employee
// access. If you'd rather have a manual "unlock" control in the admin
// panel too, that's a reasonable next step -- just ask.
const LOCK_THRESHOLD = 5;
const LOCK_MINUTES = 30;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, turnstileToken } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const clientIp = getClientIp(req);
  const { country, region, city } = getClientGeo(req);
  const { device, browser, os } = parseUserAgent(req.headers['user-agent'] || null);
  const deviceLabel = [device, browser, os].filter(Boolean).join(' · ') || null;
  const regionLabel = [city, region, country].filter(Boolean).join(', ') || null;

  let supabase;
  try {
    supabase = requireSupabase();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server is not configured.' });
  }

  // Verify the Turnstile challenge before doing anything else -- same
  // fail-open-if-unconfigured / fail-closed-if-configured-and-bad behavior
  // as the public Special Requirement form (see api/_lib/turnstile.js).
  const turnstileResult = await verifyTurnstile(turnstileToken, clientIp);
  if (!turnstileResult.ok) {
    return res.status(400).json({ error: 'Verification failed. Please retry the challenge.' });
  }

  // Count this attempt against both limits BEFORE checking the password,
  // so a script that never even gets a Turnstile token still gets throttled.
  const [emailAllowed, ipAllowed] = await Promise.all([
    supabase.rpc('check_rate_limit', {
      p_key: `login-email:${normalizedEmail}`,
      p_max: MAX_ATTEMPTS_PER_EMAIL,
      p_window_seconds: WINDOW_SECONDS,
    }),
    clientIp
      ? supabase.rpc('check_rate_limit', {
          p_key: `login-ip:${clientIp}`,
          p_max: MAX_ATTEMPTS_PER_IP,
          p_window_seconds: WINDOW_SECONDS,
        })
      : Promise.resolve({ data: true, error: null }),
  ]);

  if (emailAllowed.error || ipAllowed.error) {
    // If the rate-limit check itself fails (e.g. migration not run yet),
    // fail CLOSED on auth-adjacent logic rather than silently skipping it.
    console.error('Rate limit check failed:', emailAllowed.error?.message || ipAllowed.error?.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
  if (emailAllowed.data === false || ipAllowed.data === false) {
    return res.status(429).json({ error: 'Too many attempts. Try again in a few minutes.' });
  }

  const logAttempt = (adminId, success) =>
    supabase.from('login_events').insert({
      admin_id: adminId,
      email_attempted: normalizedEmail,
      success,
      ip: clientIp,
      country,
      region,
      city,
      device,
      browser,
      os,
    }).then(({ error: logError }) => {
      if (logError) console.error('Failed to record login_events row:', logError.message);
    });

  const { data: admin, error } = await supabase
    .from('admins')
    .select('id, name, email, password_hash, role, failed_attempts, locked_until, session_version')
    .eq('email', normalizedEmail)
    .maybeSingle();

  // Deliberately generic error for both "no such user" and "wrong password"
  // so the login form can't be used to discover which employee emails exist.
  const invalidMessage = { error: 'Invalid email or password.' };

  if (error) {
    console.error('Admin lookup failed:', error.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
  if (!admin) {
    await logAttempt(null, false);
    return res.status(401).json(invalidMessage);
  }

  // Already locked from a previous burst of attempts -- don't even check
  // the password, and don't restart the clock or count this as another
  // strike.
  if (admin.locked_until && new Date(admin.locked_until) > new Date()) {
    const minutesLeft = Math.max(1, Math.ceil((new Date(admin.locked_until) - new Date()) / 60000));
    await logAttempt(admin.id, false);
    return res.status(423).json({
      error: 'account_locked',
      message: `This account is temporarily locked after repeated failed attempts. Try again in about ${minutesLeft} minute(s).`,
    });
  }

  const passwordOk = await bcrypt.compare(password, admin.password_hash);

  if (!passwordOk) {
    const nextFailedAttempts = (admin.failed_attempts || 0) + 1;
    const justLocked = nextFailedAttempts >= LOCK_THRESHOLD;

    await supabase
      .from('admins')
      .update(
        justLocked
          ? { failed_attempts: 0, locked_until: new Date(Date.now() + LOCK_MINUTES * 60 * 1000).toISOString() }
          : { failed_attempts: nextFailedAttempts }
      )
      .eq('id', admin.id);

    await logAttempt(admin.id, false);

    if (justLocked) {
      sendAccountLockAlert({
        targetName: admin.name,
        targetEmail: admin.email,
        attempts: LOCK_THRESHOLD,
        lockMinutes: LOCK_MINUTES,
        ip: clientIp,
        region: regionLabel,
        device: deviceLabel,
      }).catch((err) => console.error('Failed to send account lock alert:', err.message));

      return res.status(423).json({
        error: 'account_locked',
        message: `Too many wrong passwords. This account is locked for ${LOCK_MINUTES} minutes and the team has been notified.`,
      });
    }

    return res.status(401).json(invalidMessage);
  }

  // Success: clear any lock/strike count, bump session_version (this is the
  // step that signs any other device currently logged in as this admin out
  // -- see requireAdmin() in api/_lib/auth.js), and record where/what this
  // login came from.
  const newSessionVersion = (admin.session_version || 0) + 1;
  await supabase
    .from('admins')
    .update({
      failed_attempts: 0,
      locked_until: null,
      session_version: newSessionVersion,
      last_login_at: new Date().toISOString(),
      last_login_ip: clientIp,
      last_login_device: deviceLabel,
    })
    .eq('id', admin.id);

  await logAttempt(admin.id, true);

  const token = signAdminToken(admin, newSessionVersion);
  setAdminSessionCookie(res, token);

  return res.status(200).json({
    ok: true,
    admin: { name: admin.name, email: admin.email, role: admin.role },
  });
}
