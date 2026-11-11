import { requireSupabase } from './_lib/supabase.js';
import { getClientIp } from './_lib/ip.js';
import { sendClientThankYou, sendTeamAlert } from './_lib/email.js';
import { verifyTurnstile } from './_lib/turnstile.js';
import { parse as parseCookie } from 'cookie';
import { findBlock, logSpamEvent } from './_lib/blocklist.js';
import { isMissingSchema } from './_lib/schema-error.js';

const VISITOR_COOKIE = 'orian_visitor_id';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_LEN = { name: 120, email: 200, contact: 40, company: 150, location: 150, requirementType: 80, message: 3000 };

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
  const clientIp = getClientIp(req);

  // Blocklist (managed in the admin panel -> System). A blocked sender gets the
  // same "success" answer as everyone else so a bot learns nothing, but nothing
  // is saved and no email goes out. The attempt is logged for the team to review.
  const blocked = await findBlock(supabase, { ip: clientIp, email: body.email });
  if (blocked) {
    await logSpamEvent(supabase, { reason: 'blocked', ip: clientIp, email: body.email, detail: `${blocked.kind}: ${blocked.value}` });
    return res.status(200).json({ ok: true });
  }

  // Anti-spam: Cloudflare Turnstile. Checked before validation so bots don't
  // get free feedback about which fields to fix on the way to a real submit.
  const turnstileResult = await verifyTurnstile(body.turnstileToken, clientIp);
  if (!turnstileResult.ok) {
    await logSpamEvent(supabase, { reason: 'turnstile', ip: clientIp, email: body.email, detail: 'Verification failed' });
    return res.status(400).json({ error: "We couldn't verify that submission. Please refresh and try again." });
  }

  const { errors, clean } = validate(body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Validation failed', fields: errors });
  }

  const company = (body.company || '').trim().slice(0, MAX_LEN.company) || null;
  const location = (body.location || '').trim().slice(0, MAX_LEN.location) || null;
  const requirementType = (body.requirementType || '').trim().slice(0, MAX_LEN.requirementType) || null;

  const submission = {
    name: clean.name,
    email: clean.email,
    contact: clean.contact,
    company,
    location,
    requirementType,
    message: clean.message,
  };

  // Save first — the request must never be lost even if both emails fail.
  // NOTE: `location` is included in the email notifications below but is
  // intentionally left out of this insert — the `requests` table doesn't
  // have a `location` column yet. Add one (e.g. `alter table requests add
  // column location text;`) and add `location: submission.location` to
  // this insert to start persisting it.
  const baseRow = {
    name: submission.name,
    email: submission.email,
    contact: submission.contact,
    company: submission.company,
    requirement_type: submission.requirementType,
    message: submission.message,
    ip: clientIp,
  };

  // Where did this lead come from? The visitor cookie links the request to that
  // person's first page view (landing page + referrer) for the admin's funnel
  // and page-performance reports.
  const cookies = req.headers.cookie ? parseCookie(req.headers.cookie) : {};
  const visitorId = cookies[VISITOR_COOKIE] ? String(cookies[VISITOR_COOKIE]).slice(0, 64) : null;
  let source = {};
  if (visitorId) {
    const { data: first } = await supabase
      .from('visits')
      .select('path, referrer')
      .eq('visitor_id', visitorId)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    source = { visitor_id: visitorId, source_path: first?.path || null, source_referrer: first?.referrer || null };
  }

  let { data: inserted, error: insertError } = await supabase
    .from('requests')
    .insert({ ...baseRow, ...source })
    .select('id')
    .single();

  // If the source-tracking columns are not there yet (migration 008 not run),
  // save the request without them rather than lose it.
  if (insertError && isMissingSchema(insertError)) {
    ({ data: inserted, error: insertError } = await supabase.from('requests').insert(baseRow).select('id').single());
  }

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
