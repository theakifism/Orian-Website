import { requireAdmin } from '../auth.js';
import { requireSupabase } from '../supabase.js';
import { bucketDailyCounts, daysAgoIso } from '../dates.js';

const PAGE_SIZE = 100;
const SPARKLINE_DAYS = 14;
const TOP_N = 8;
const AGGREGATE_SAMPLE_SIZE = 5000; // cap how many raw rows we pull for Top Pages/Referrers/Country/Device

function topCounts(rows, key, limit = TOP_N) {
  const counts = new Map();
  for (const row of rows) {
    const raw = row[key];
    const value = typeof raw === 'string' && raw.trim() ? raw.trim() : key === 'referrer' ? 'Direct / none' : 'Unknown';
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// Referrers are collapsed to their hostname so "https://google.com/search?q=..."
// and "https://google.com/" count as the same traffic source.
function hostnameOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

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

  const page = Math.max(parseInt(req.query?.page, 10) || 1, 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalVisitsRes,
    uniqueVisitorsRes,
    visitsTodayRes,
    visitorsPageRes,
    dailyRowsRes,
    aggregateRowsRes,
  ] = await Promise.all([
    supabase.from('visits').select('id', { count: 'exact', head: true }),
    supabase.from('visitor_stats').select('visitor_id', { count: 'exact', head: true }),
    supabase
      .from('visits')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', startOfToday.toISOString()),
    supabase
      .from('visitor_stats')
      .select(
        'visitor_id, visit_count, distinct_ip_count, last_ip, last_country, last_city, last_device, last_browser, last_os, last_path, first_seen, last_seen'
      )
      .order('last_seen', { ascending: false })
      .range(from, to),
    supabase
      .from('visits')
      .select('created_at')
      .gte('created_at', daysAgoIso(SPARKLINE_DAYS - 1)),
    // One bounded query feeds Top Pages, Top Referrers, Country breakdown,
    // and Device breakdown — cheaper than four separate full-table scans.
    supabase
      .from('visits')
      .select('path, referrer, country, device')
      .order('created_at', { ascending: false })
      .limit(AGGREGATE_SAMPLE_SIZE),
  ]);

  const firstError = [totalVisitsRes, uniqueVisitorsRes, visitsTodayRes, visitorsPageRes, dailyRowsRes, aggregateRowsRes].find(
    (r) => r.error
  );
  if (firstError) {
    console.error('Failed to load visitor stats:', firstError.error.message);
    return res.status(500).json({ error: 'Could not load visitor data.' });
  }

  const aggregateRows = aggregateRowsRes.data || [];
  const topPages = topCounts(aggregateRows, 'path');
  const topReferrers = topCounts(
    aggregateRows.map((r) => ({ referrer: hostnameOf(r.referrer) || (r.referrer ? 'Direct / none' : 'Direct / none') })),
    'referrer'
  );
  const topCountries = topCounts(aggregateRows, 'country');
  const topDevices = topCounts(aggregateRows, 'device');

  return res.status(200).json({
    totals: {
      totalVisits: totalVisitsRes.count || 0,
      uniqueVisitors: uniqueVisitorsRes.count || 0,
      visitsToday: visitsTodayRes.count || 0,
    },
    dailyVisits: bucketDailyCounts(dailyRowsRes.data, SPARKLINE_DAYS),
    visitors: visitorsPageRes.data,
    topPages,
    topReferrers,
    topCountries,
    topDevices,
    page,
    pageSize: PAGE_SIZE,
  });
});
