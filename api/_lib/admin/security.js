import { requireAdmin } from '../auth.js';
import { requireSupabase } from '../supabase.js';
import { getClientIp } from '../ip.js';
import { logAudit } from '../audit.js';
import { normalizeBlockValue } from '../blocklist.js';
import { isMissingSchema } from '../schema-error.js';

const MAX_ENTRIES = 1000;

// GET    -> blocklist, recent rejected submissions, recent sign-in attempts
// POST   { kind, value, reason? }  -> block an IP / email / domain
// DELETE { id }                    -> unblock
export default requireAdmin(async (req, res) => {
  let supabase;
  try {
    supabase = requireSupabase();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server is not configured.' });
  }

  if (req.method === 'GET') {
    const dayAgo = new Date(Date.now() - 86400000).toISOString();
    const [entriesRes, eventsRes, recentCountRes, loginRes] = await Promise.all([
      supabase.from('blocked_entries').select('id, kind, value, reason, created_at').order('created_at', { ascending: false }).limit(MAX_ENTRIES),
      supabase.from('spam_events').select('id, reason, ip, email, detail, created_at').order('created_at', { ascending: false }).limit(40),
      supabase.from('spam_events').select('reason').gte('created_at', dayAgo).limit(5000),
      supabase
        .from('login_events')
        .select('id, email_attempted, success, ip, city, country, device, browser, created_at')
        .order('created_at', { ascending: false })
        .limit(30),
    ]);

    // Blocklist / spam tables come from migration 008; sign-in history is older.
    const migrationRequired = [entriesRes, eventsRes, recentCountRes].some((r) => r.error && isMissingSchema(r.error));
    const hardError = [entriesRes, eventsRes, recentCountRes, loginRes].find((r) => r.error && !isMissingSchema(r.error));
    if (hardError) {
      console.error('Failed to load security data:', hardError.error.message);
      return res.status(500).json({ error: 'Could not load security data.' });
    }

    const last24h = { turnstile: 0, blocked: 0 };
    for (const row of recentCountRes.data || []) if (row.reason in last24h) last24h[row.reason] += 1;

    return res.status(200).json({
      entries: entriesRes.data || [],
      events: eventsRes.data || [],
      last24h,
      loginEvents: loginRes.data || [],
      yourIp: getClientIp(req),
      migrationRequired,
    });
  }

  if (req.method === 'POST') {
    const { kind, reason } = req.body || {};
    const { value, error: valueError } = normalizeBlockValue(kind, req.body?.value);
    if (valueError) return res.status(400).json({ error: valueError });
    if (kind === 'ip' && value === getClientIp(req)) {
      return res.status(400).json({ error: 'That is your own IP address. Blocking it would stop you testing the contact form.' });
    }

    const { count } = await supabase.from('blocked_entries').select('id', { count: 'exact', head: true });
    if ((count || 0) >= MAX_ENTRIES) return res.status(400).json({ error: 'The blocklist is full. Remove some entries first.' });

    const { data, error } = await supabase
      .from('blocked_entries')
      .insert({ kind, value, reason: String(reason || '').trim().slice(0, 200) || null, created_by: req.admin.sub })
      .select('id, kind, value, reason, created_at')
      .single();
    if (error) {
      if (error.code === '23505') return res.status(409).json({ error: 'That is already on the blocklist.' });
      if (isMissingSchema(error)) return res.status(503).json({ error: 'migration_required', message: 'Run db/008_admin_toolkit.sql in Supabase first.' });
      console.error('Failed to add block:', error.message);
      return res.status(500).json({ error: 'Could not add that to the blocklist.' });
    }
    await logAudit(supabase, req, 'security.block', { targetType: kind, targetId: value, detail: `Blocked ${kind} ${value}` });
    return res.status(200).json({ entry: data });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: 'id is required.' });
    const { data: existing } = await supabase.from('blocked_entries').select('kind, value').eq('id', id).maybeSingle();
    const { error } = await supabase.from('blocked_entries').delete().eq('id', id);
    if (error) {
      console.error('Failed to remove block:', error.message);
      return res.status(500).json({ error: 'Could not remove that entry.' });
    }
    await logAudit(supabase, req, 'security.unblock', {
      targetType: existing?.kind, targetId: existing?.value, detail: existing ? `Unblocked ${existing.kind} ${existing.value}` : 'Unblocked an entry',
    });
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
});
