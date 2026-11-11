import { requireAdmin } from '../auth.js';
import { requireSupabase } from '../supabase.js';
import { bucketDailyCounts, daysAgoIso, businessDateKey, startOfTodayIso } from '../dates.js';
import { collectFollowUps, OPEN_STATUSES, STAGES } from '../leads.js';
import { monthRange, normalizePath } from '../analytics.js';
import { isMissingSchema } from '../schema-error.js';
import { fetchAll } from '../paging.js';

const DAYS = 14;

// GET -> everything the Overview screen shows in one round trip: pipeline
// counts, leads that need a follow-up, 14-day trends and the latest activity.
export default requireAdmin(async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  let supabase;
  try {
    supabase = requireSupabase();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server is not configured.' });
  }

  const now = new Date();
  const month = monthRange(businessDateKey(now.toISOString()).slice(0, 7));
  let migrationRequired = false;

  const statuses = [...STAGES, 'closed'];
  const countPromises = statuses.map((s) => supabase.from('requests').select('id', { count: 'exact', head: true }).eq('status', s));

  const openSelect = 'id, name, company, status, assigned_to, created_at, follow_up_at, last_activity_at';
  const openQuery = (cols) =>
    supabase.from('requests').select(cols).in('status', OPEN_STATUSES).order('created_at', { ascending: false }).limit(500);

  const [countResults, openFirst, leads14, visitsRes, wonRes, recentRes] = await Promise.all([
    Promise.all(countPromises),
    openQuery(openSelect),
    supabase.from('requests').select('created_at').gte('created_at', daysAgoIso(DAYS - 1)).range(0, 19999),
    fetchAll(() => supabase.from('visits').select('visitor_id, path, created_at').gte('created_at', daysAgoIso(DAYS - 1)), 20000),
    supabase.from('requests').select('id', { count: 'exact', head: true }).eq('status', 'won').gte('last_activity_at', month.since),
    supabase.from('audit_log').select('id, admin_name, action, detail, created_at').order('created_at', { ascending: false }).limit(8),
  ]);

  const failed = countResults.find((r) => r.error) || leads14.error || visitsRes.error;
  if (failed) {
    console.error('Failed to load overview:', (failed.error || failed).message);
    return res.status(500).json({ error: 'Could not load the overview.' });
  }

  let openRows = openFirst.data;
  if (openFirst.error) {
    if (!isMissingSchema(openFirst.error)) {
      console.error('Failed to load open leads:', openFirst.error.message);
      return res.status(500).json({ error: 'Could not load the overview.' });
    }
    migrationRequired = true; // follow-up columns do not exist yet
    const retry = await openQuery('id, name, company, status, assigned_to, created_at');
    openRows = retry.data || [];
  }

  let recent = recentRes.data || [];
  if (recentRes.error) {
    if (isMissingSchema(recentRes.error)) migrationRequired = true;
    else console.error('Failed to load recent activity:', recentRes.error.message);
    recent = [];
  }

  const counts = Object.fromEntries(statuses.map((s, i) => [s, countResults[i].count || 0]));
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  // Visits: public pages only (the admin panel's own traffic is not "visitors").
  const publicVisits = visitsRes.rows.filter((v) => normalizePath(v.path));
  const todayKey = businessDateKey(startOfTodayIso());
  const todayVisits = publicVisits.filter((v) => businessDateKey(v.created_at) === todayKey);
  const weekCut = daysAgoIso(6);
  const weekVisits = publicVisits.filter((v) => v.created_at >= weekCut);

  return res.status(200).json({
    counts,
    total,
    open: OPEN_STATUSES.reduce((sum, s) => sum + counts[s], 0),
    wonThisMonth: wonRes.error ? null : wonRes.count || 0,
    followUps: collectFollowUps(openRows, now),
    dailyLeads: bucketDailyCounts(leads14.data, DAYS),
    dailyVisits: bucketDailyCounts(publicVisits, DAYS),
    visits: {
      today: todayVisits.length,
      visitorsToday: new Set(todayVisits.map((v) => v.visitor_id)).size,
      week: weekVisits.length,
      visitorsWeek: new Set(weekVisits.map((v) => v.visitor_id)).size,
    },
    recent,
    migrationRequired,
  });
});
