import { requireCron } from '../_lib/cron.js';
import { requireSupabase } from '../_lib/supabase.js';
import { daysAgoIso } from '../_lib/dates.js';
import { sendWeeklyDigest } from '../_lib/email.js';

// Scheduled in vercel.json to run once a week (Vercel's Hobby/free plan
// caps cron invocations at once per day, so weekly comfortably fits).
export default requireCron(async (req, res) => {
  let supabase;
  try {
    supabase = requireSupabase();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server is not configured.' });
  }

  const since = daysAgoIso(7);
  const rangeLabel = `${new Date(since).toLocaleDateString()} – ${new Date().toLocaleDateString()}`;

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
    dashboardUrl: `${process.env.SITE_URL || 'https://your-site.vercel.app'}/admin`,
  };

  const result = await sendWeeklyDigest(stats);
  if (!result.ok) {
    console.error('Weekly digest email failed:', result.reason);
    return res.status(200).json({ ok: false, reason: result.reason, stats });
  }

  return res.status(200).json({ ok: true, stats });
});
