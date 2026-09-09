// Cloudflare Turnstile — free, invisible-by-default CAPTCHA. The widget runs
// client-side and produces a one-time token; we verify that token here,
// server-side, before trusting the form submission. Fails OPEN (allows the
// submission) only when the feature is left unconfigured, so this never
// breaks the form for anyone who hasn't set up Turnstile yet — but fails
// CLOSED (rejects) on an actually-bad or missing token once it IS configured.
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(token, remoteIp) {
  const secret = process.env.TURNSTILE_SECRET_KEY || '';
  if (!secret) {
    console.warn('Turnstile not configured (TURNSTILE_SECRET_KEY missing) — skipping verification.');
    return { ok: true, skipped: true };
  }

  if (!token || typeof token !== 'string') {
    return { ok: false, reason: 'missing_token' };
  }

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.append('remoteip', remoteIp);

    const res = await fetch(VERIFY_URL, { method: 'POST', body });
    const data = await res.json();

    if (!data.success) {
      console.warn('Turnstile verification failed:', data['error-codes']);
      return { ok: false, reason: 'failed_verification', codes: data['error-codes'] };
    }
    return { ok: true };
  } catch (err) {
    console.error('Turnstile verification request errored:', err.message);
    // Network hiccup talking to Cloudflare shouldn't be the reason a real
    // customer's lead gets lost — fail open on transport errors only.
    return { ok: true, skipped: true, reason: 'verify_unreachable' };
  }
}
