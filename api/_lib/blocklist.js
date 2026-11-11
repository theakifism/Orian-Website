// Blocklist helpers shared by the public form endpoints and the admin panel.
//
// Three kinds of entry: an exact IP, an exact email address, or a whole email
// domain (e.g. "spam-mail.com"). Everything is stored lowercase.

export const BLOCK_KINDS = ['ip', 'email', 'domain'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOMAIN_RE = /^(?=.{3,253}$)([a-z0-9-]+\.)+[a-z]{2,}$/;
const IP_RE = /^[0-9a-f:.]{3,45}$/;

export const emailDomain = (email) => String(email || '').split('@')[1]?.toLowerCase() || '';

// Returns { value } with the cleaned value, or { error } when it isn't valid for that kind.
export function normalizeBlockValue(kind, raw) {
  const value = String(raw || '').trim().toLowerCase();
  if (!BLOCK_KINDS.includes(kind)) return { error: 'Choose IP, email or domain.' };
  if (!value) return { error: 'Enter a value to block.' };
  if (kind === 'ip' && !IP_RE.test(value)) return { error: 'That does not look like an IP address.' };
  if (kind === 'email' && !EMAIL_RE.test(value)) return { error: 'That does not look like an email address.' };
  if (kind === 'domain') {
    const d = value.replace(/^@/, '');
    if (!DOMAIN_RE.test(d)) return { error: 'Enter a domain like example.com.' };
    return { value: d };
  }
  return { value };
}

// Is this IP / email blocked? Returns the matching entry or null. Fails open
// (returns null) on a database error so a hiccup never blocks real customers.
export async function findBlock(supabase, { ip, email }) {
  const lowerEmail = String(email || '').trim().toLowerCase();
  const values = [ip, lowerEmail, emailDomain(lowerEmail)].filter(Boolean);
  if (values.length === 0) return null;

  const { data, error } = await supabase.from('blocked_entries').select('kind, value, reason').in('value', values);
  if (error) {
    console.error('Blocklist lookup failed:', error.message);
    return null;
  }
  return (data || []).find(
    (row) =>
      (row.kind === 'ip' && row.value === ip) ||
      (row.kind === 'email' && row.value === lowerEmail) ||
      (row.kind === 'domain' && row.value === emailDomain(lowerEmail)),
  ) || null;
}

// Best-effort record of a rejected public submission.
export async function logSpamEvent(supabase, { reason, ip, email, detail }) {
  try {
    const { error } = await supabase.from('spam_events').insert({
      reason,
      ip: ip || null,
      email: email ? String(email).slice(0, 200) : null,
      detail: detail ? String(detail).slice(0, 300) : null,
    });
    if (error) console.error('Spam event write failed:', error.message);
  } catch (err) {
    console.error('Spam event write failed:', err.message || err);
  }
}
