import { requireAdmin } from '../auth.js';
import { requireSupabase } from '../supabase.js';
import { fetchAll } from '../paging.js';
import { buildAnalytics, dailySeries, monthRange } from '../analytics.js';
import { isMissingSchema } from '../schema-error.js';

const RANGE_DAYS = [7, 30, 90];

function siteHostFrom(req) {
  try {
    if (process.env.SITE_URL) return new URL(process.env.SITE_URL).hostname.replace(/^www\./, '');
  } catch { /* fall through */ }
  return String(req.headers.host || '').split(':')[0].replace(/^www\./, '');
}

// GET ?days=7|30|90   or   ?month=YYYY-MM
// -> funnel, page performance, landing pages, traffic sources, daily trend,
//    and the raw lead rows (for the CSV export / printable report).
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

  // Work out the window.
  let since;
  let until;
  let label;
  const month = req.query?.month ? monthRange(String(req.query.month)) : null;
  if (req.query?.month && !month) return res.status(400).json({ error: 'month must look like 2026-09.' });
  if (month) {
    ({ since, until, label } = month);
  } else {
    const days = RANGE_DAYS.includes(Number(req.query?.days)) ? Number(req.query.days) : 30;
    until = new Date().toISOString();
    since = new Date(Date.now() - days * 86400000).toISOString();
    label = `Last ${days} days`;
  }
  const windowMs = new Date(until) - new Date(since);
  const prevSince = new Date(new Date(since) - windowMs).toISOString();

  const leadCols = 'id, name, company, email, contact, requirement_type, status, created_at, ip, assigned_to';
  const sourceCols = `${leadCols}, visitor_id, source_path, source_referrer`;
  const leadQuery = (cols) => () =>
    supabase.from('requests').select(cols).gte('created_at', since).lte('created_at', until).order('created_at', { ascending: false });

  let leadsRes = await fetchAll(leadQuery(sourceCols), 5000);
  if (leadsRes.error && isMissingSchema(leadsRes.error)) leadsRes = await fetchAll(leadQuery(leadCols), 5000);

  const [visitsRes, prevLeads, prevVisits] = await Promise.all([
    fetchAll(
      () => supabase.from('visits').select('visitor_id, ip, path, referrer, created_at').gte('created_at', since).lte('created_at', until),
      20000,
    ),
    supabase.from('requests').select('id', { count: 'exact', head: true }).gte('created_at', prevSince).lt('created_at', since),
    supabase.from('visits').select('id', { count: 'exact', head: true }).gte('created_at', prevSince).lt('created_at', since).not('path', 'like', '/admin%'),
  ]);

  const firstError = leadsRes.error || visitsRes.error;
  if (firstError) {
    console.error('Failed to load analytics:', firstError.message);
    return res.status(500).json({ error: 'Could not load analytics.' });
  }

  const stats = buildAnalytics({ visits: visitsRes.rows, requests: leadsRes.rows, siteHost: siteHostFrom(req) });
  return res.status(200).json({
    range: { since, until, label },
    ...stats,
    daily: dailySeries({ visits: visitsRes.rows, requests: leadsRes.rows, fromIso: since, toIso: until }),
    previous: { leads: prevLeads.count || 0, visits: prevVisits.count || 0 },
    truncated: visitsRes.truncated || leadsRes.truncated,
    leads: leadsRes.rows,
  });
});
