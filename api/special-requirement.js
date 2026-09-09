import { requireSupabase } from './_lib/supabase.js';
import { getClientIp } from './_lib/ip.js';
import { sendClientThankYou, sendTeamAlert } from './_lib/email.js';
import { verifyTurnstile } from './_lib/turnstile.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = { name: 120, email: 200, contact: 40, company: 150, requirementType: 80, message: 3000 };

function validate(body) {
  const errors = {};
  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const contact = (body.contact || '').trim();
  const message = (body.message || '').trim();

  if (!name) errors.name = 'Name is required.';
  else if (name.length > MAX_LEN.name) errors.name = 'Name is too long.';

  if (!email) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(email) || email.length > MAX_LEN.email) errors.email = 'Enter a valid email.';

  if (!contact) errors.contact = 'Contact number is required.';
  else if (contact.length > MAX_LEN.contact) errors.contact = 'Contact number is too long.';

  if (!message) errors.message = 'Please describe your requirement.';
  else if (message.length > MAX_LEN.message) errors.message = 'Message is too long.';

  return { errors, clean: { name, email, contact, message } };
}

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
    return res.status(500).json({ error: 'Server is not configured. Please try again later.' });
  }

  const body = req.body || {};

  // Anti-spam: Cloudflare Turnstile. Checked before validation so bots don't
  // get free feedback about which fields to fix on the way to a real submit.
  const turnstileResult = await verifyTurnstile(body.turnstileToken, getClientIp(req));
  if (!turnstileResult.ok) {
    return res.status(400).json({ error: "We couldn't verify that submission. Please refresh and try again." });
  }

  const { errors, clean } = validate(body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Validation failed', fields: errors });
  }

  const company = (body.company || '').trim().slice(0, MAX_LEN.company) || null;
  const requirementType = (body.requirementType || '').trim().slice(0, MAX_LEN.requirementType) || null;

  const submission = {
    name: clean.name,
    email: clean.email,
    contact: clean.contact,
    company,
    requirementType,
    message: clean.message,
  };

  // Save first — the request must never be lost even if both emails fail.
  const { data: inserted, error: insertError } = await supabase
    .from('requests')
    .insert({
      name: submission.name,
      email: submission.email,
      contact: submission.contact,
      company: submission.company,
      requirement_type: submission.requirementType,
      message: submission.message,
      ip: getClientIp(req),
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('Failed to save request:', insertError.message);
    return res.status(500).json({ error: 'Could not save your request. Please try again.' });
  }

  const [clientResult, teamResult] = await Promise.all([
    sendClientThankYou(submission),
    sendTeamAlert(submission),
  ]);

  // Best-effort: record whether each email actually went out, without ever
  // failing the response over it (the request is already safely saved).
  const { error: updateError } = await supabase
    .from('requests')
    .update({
      client_email_sent: clientResult.ok,
      team_email_sent: teamResult.ok,
    })
    .eq('id', inserted.id);
  if (updateError) {
    console.error('Failed to update email status:', updateError.message);
  }

  return res.status(200).json({ ok: true });
}
