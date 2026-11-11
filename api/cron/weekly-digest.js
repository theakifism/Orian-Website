import { requireCron } from '../_lib/cron.js';
import { requireSupabase } from '../_lib/supabase.js';
import { daysAgoIso, businessDateKey } from '../_lib/dates.js';
import { sendWeeklyDigest, sendFollowUpReminder } from '../_lib/email.js';
import { collectFollowUps, OPEN_STATUSES } from '../_lib/leads.js';
import { isMissingSchema } from '../_lib/schema-error.js';
import { logAudit } from '../_lib/audit.js';

// Scheduled daily in vercel.json (still one cron job, so it fits Vercel's free
// plan). Every day it emails the team a reminder if any lead needs a
// follow-up. On Mondays it sends the weekly digest instead, which includes
// the same follow-up list. (The file keeps its old name so the cron path in
// vercel.json and any monitoring you set up stays valid.)
export default requireCron(async (req, res) => {
  let supabase;
  try {
    supabase = requireSupabase();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server is not configured.' });
  }

  const dashboardUrl = `${process.env.SITE_URL || 'https://your-site.vercel.app'}/admin`;
  const now = new Date();

  // ---- leads that need attention ----
  const cols = 'id, name, company, status, assigned_to, created_at, follow_up_at, last_activity_at';
  let openRes = await supabase.from('requests').select(cols).in('status', OPEN_STATUSES).limit(500);
  if (openRes.error && isMissingSchema(openRes.error)) {
    openRes = await supabase.from('requests').select('id, name, company, status, assigned_to, created_at').in('status', OPEN_STATUSES).limit(500);
  }
  if (openRes.error) {
    console.error('Failed to load open leads for reminders:', openRes.error.message);
    return res.status(500).json({ error: 'Could not load leads.' });
  }
  const followUps = collectFollowUps(openRes.data || [], now).map((f) => ({
    ...f,
    stage: f.stage,
  }));

  const isMonday = new Date(`${businessDateKey(now.toISOString())}T00:00:00Z`).getUTCDay() === 1;

  // ---- not Monday: a short reminder, only when there is something to do ----
  if (!isMonday) {
    if (followUps.length === 0) {
      await logAudit(supabase, null, 'system.daily-run', { detail: 'No follow-ups due, no email sent' });
      return res.status(200).json({ ok: true, sent: false, followUps: 0 });
    }
    const result = await sendFollowUpReminder({ items: followUps, dashboardUrl });
    await logAudit(supabase, null, 'system.daily-run', {
      detail: result.ok ? `Reminder sent for ${followUps.length} lead(s)` : `Reminder not sent (${result.reason})`,
    });
    return res.status(200).json({ ok: result.ok, sent: result.ok, reason: result.reason, followUps: followUps.length });
  }

  // ---- Monday: weekly digest ----
  const since = daysAgoIso(7);
  const rangeLabel = `${new Date(since).toLocaleDateString()} – ${now.toLocaleDateString()}`;

  const [leadsRes, statusRes, visitsRes, uniqueVisitorsRes] = await Promise.all([
    supabase.from('requests').select('id', { count: 'exact', head: true }).gte('created_at', since),
    supabase.from('requests').select('status').gte('created_at', since),
    supabase.from('visits').select('path').gte('created_at', since).limit(5000),
    supabase.from('visits').select('visitor_id').gte('created_at', since).limit(5000),
  ]);

  const firstError = [leadsRes, statusRes, visitsRes, uniqueVisitorsRes].find((r) => r.error);
  if (firstError) {
    console.error('Failed to gather weekly digest stats:', firstError.error.message);
    return res.status(500).json({ error: 'Could not gather digest data.' });
  }

  const leadsByStatus = {};
  for (const row of statusRes.data || []) {
    leadsByStatus[row.status] = (leadsByStatus[row.status] || 0) + 1;
  }

  const pageCounts = new Map();
  for (const row of visitsRes.data || []) {
    const p = row.path || 'Unknown';
    pageCounts.set(p, (pageCounts.get(p) || 0) + 1);
  }
  const topPages = Array.from(pageCounts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const uniqueVisitors = new Set((uniqueVisitorsRes.data || []).map((r) => r.visitor_id)).size;

  const stats = {
    rangeLabel,
    newLeads: leadsRes.count || 0,
    leadsByStatus,
    totalVisits: (visitsRes.data || []).length,
    uniqueVisitors,
    topPages,
    followUps,
    dashboardUrl,
  };

  const result = await sendWeeklyDigest(stats);
  await logAudit(supabase, null, 'system.daily-run', {
    detail: result.ok ? 'Weekly digest sent' : `Weekly digest not sent (${result.reason})`,
  });
  if (!result.ok) {
    console.error('Weekly digest email failed:', result.reason);
    return res.status(200).json({ ok: false, reason: result.reason, stats });
  }

  return res.status(200).json({ ok: true, stats });
});
