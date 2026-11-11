import { requireAdmin } from '../auth.js';
import { requireSupabase } from '../supabase.js';
import { sendLeadReply } from '../email.js';
import { logAudit } from '../audit.js';
import { isMissingSchema } from '../schema-error.js';

const MAX_SUBJECT = 150;
const MAX_BODY = 5000;
const MAX_PER_HOUR = 40;

const SEND_ERRORS = {
  not_configured: 'Email is not set up yet. Add RESEND_API_KEY and RESEND_FROM_EMAIL in your environment variables.',
  quota_exceeded: 'The email sending limit has been reached. Try again later.',
  send_failed: 'The email could not be sent. Check that your sending domain is verified in Resend.',
};

// POST { id, subject, body, markContacted? } -> emails the lead from the panel.
// The recipient is always the address on the lead itself (never a free-form
// field), the sender's own address is the Reply-To, and the sent email is
// recorded on the lead as a note so the whole conversation stays in one place.
export default requireAdmin(async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let supabase;
  try {
    supabase = requireSupabase();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server is not configured.' });
  }

  const { id, subject, body, markContacted = true } = req.body || {};
  const cleanSubject = String(subject || '').replace(/[\r\n\t]+/g, ' ').trim();
  const cleanBody = String(body || '').replace(/\r\n/g, '\n').trim();
  if (!id) return res.status(400).json({ error: 'A lead id is required.' });
  if (!cleanSubject || cleanSubject.length > MAX_SUBJECT) {
    return res.status(400).json({ error: `Subject must be 1-${MAX_SUBJECT} characters.` });
  }
  if (!cleanBody || cleanBody.length > MAX_BODY) {
    return res.status(400).json({ error: `Message must be 1-${MAX_BODY} characters.` });
  }

  const { data: lead, error: leadError } = await supabase
    .from('requests')
    .select('id, name, email, status, notes')
    .eq('id', id)
    .maybeSingle();
  if (leadError) {
    console.error('Failed to load lead for reply:', leadError.message);
    return res.status(500).json({ error: 'Could not load that lead.' });
  }
  if (!lead) return res.status(404).json({ error: 'Lead not found.' });

  // Per-admin hourly cap: stops a stuck button or a compromised session from
  // sending a flood of email from your domain.
  const { data: allowed, error: rateError } = await supabase.rpc('check_rate_limit', {
    p_key: `lead-reply:${req.admin.sub}`,
    p_max: MAX_PER_HOUR,
    p_window_seconds: 3600,
  });
  if (!rateError && allowed === false) {
    return res.status(429).json({ error: 'You have sent a lot of emails this hour. Please wait a little.' });
  }

  const result = await sendLeadReply({ to: lead.email, subject: cleanSubject, body: cleanBody, replyTo: req.admin.email });
  if (!result.ok) {
    return res.status(502).json({ error: SEND_ERRORS[result.reason] || SEND_ERRORS.send_failed, reason: result.reason });
  }

  const now = new Date().toISOString();
  const notes = [
    ...(Array.isArray(lead.notes) ? lead.notes : []),
    { type: 'email', subject: cleanSubject, text: cleanBody, to: lead.email, author: req.admin.name || req.admin.email, at: now },
  ];
  const nextStatus = markContacted && lead.status === 'new' ? 'contacted' : lead.status;

  let { error: updateError } = await supabase
    .from('requests')
    .update({ notes, status: nextStatus, last_activity_at: now })
    .eq('id', lead.id);
  if (updateError && isMissingSchema(updateError)) {
    ({ error: updateError } = await supabase.from('requests').update({ notes, status: nextStatus }).eq('id', lead.id));
  }
  if (updateError) {
    // The email already went out - say so, rather than imply it failed.
    console.error('Reply sent but could not be logged:', updateError.message);
    return res.status(200).json({ ok: true, logged: false, status: lead.status, notes: lead.notes || [] });
  }

  await logAudit(supabase, req, 'lead.reply', { targetType: 'lead', targetId: lead.id, detail: `Emailed ${lead.name}: ${cleanSubject}` });
  return res.status(200).json({ ok: true, logged: true, status: nextStatus, notes });
});
