import { businessDateKey } from './dates.js';

// Pages that show a visitor is seriously looking at the service, not just landing.
const INTENT_PREFIXES = ['/services', '/use-cases', '/compliance', '/developers', '/contact'];
const SEARCH_HOSTS = [
  ['google.', 'Google'], ['bing.', 'Bing'], ['duckduckgo.', 'DuckDuckGo'], ['yahoo.', 'Yahoo'],
  ['facebook.', 'Facebook'], ['instagram.', 'Instagram'], ['linkedin.', 'LinkedIn'], ['lnkd.in', 'LinkedIn'],
  ['t.co', 'X (Twitter)'], ['twitter.', 'X (Twitter)'], ['youtube.', 'YouTube'], ['whatsapp.', 'WhatsApp'],
];

// '/Services/?a=1#x' -> '/services'. Admin pages are not part of the public funnel.
export function normalizePath(raw) {
  if (!raw || typeof raw !== 'string') return null;
  let p = raw.split('#')[0].split('?')[0].trim().toLowerCase();
  if (!p.startsWith('/')) {
    try { p = new URL(p).pathname.toLowerCase(); } catch { return null; }
  }
  p = p.replace(/\/+$/, '') || '/';
  if (p.startsWith('/admin')) return null;
  return p;
}

// Human label for where a visit came from. Own-site referrers count as Direct.
export function referrerLabel(raw, siteHost = '') {
  if (!raw || typeof raw !== 'string') return 'Direct';
  let host;
  try { host = new URL(raw).hostname.toLowerCase().replace(/^www\./, ''); } catch { return 'Direct'; }
  if (!host) return 'Direct';
  if (siteHost && (host === siteHost || host.endsWith(`.${siteHost}`))) return 'Direct';
  if (host.endsWith('.vercel.app') && siteHost.endsWith('.vercel.app')) return 'Direct';
  for (const [needle, label] of SEARCH_HOSTS) if (host.includes(needle)) return label;
  return host;
}

const pct = (num, den) => (den > 0 ? Math.round((num / den) * 1000) / 10 : 0);
const bump = (map, key, by = 1) => map.set(key, (map.get(key) || 0) + by);

/**
 * visits:   [{ visitor_id, ip, path, referrer, created_at }]
 * requests: [{ id, status, requirement_type, created_at, visitor_id, ip, source_path, source_referrer }]
 *
 * A lead is credited to the pages its visitor viewed before submitting. The
 * visitor cookie is used when the request carries one; otherwise visits from
 * the same IP in the 24 hours before the request are used as a fallback.
 */
export function buildAnalytics({ visits, requests, siteHost = '' }) {
  const byVisitor = new Map(); // visitor_id -> sorted visits
  const byIp = new Map();
  const ordered = [...visits].filter((v) => normalizePath(v.path)).sort((a, b) => a.created_at.localeCompare(b.created_at));
  for (const v of ordered) {
    if (v.visitor_id) (byVisitor.get(v.visitor_id) || byVisitor.set(v.visitor_id, []).get(v.visitor_id)).push(v);
    if (v.ip) (byIp.get(v.ip) || byIp.set(v.ip, []).get(v.ip)).push(v);
  }

  // ---- funnel ----
  let engaged = 0;
  let intent = 0;
  for (const list of byVisitor.values()) {
    if (list.length >= 2) engaged += 1;
    if (list.some((v) => INTENT_PREFIXES.some((pre) => normalizePath(v.path).startsWith(pre)))) intent += 1;
  }
  const visitorsCount = byVisitor.size;
  const leadsCount = requests.length;
  const wonCount = requests.filter((r) => r.status === 'won').length;
  const funnel = [
    { key: 'visitors', label: 'Visitors', count: visitorsCount, ofPrev: 100, ofFirst: 100 },
    { key: 'engaged', label: 'Viewed 2+ pages', count: engaged },
    { key: 'intent', label: 'Looked at services or contact', count: intent },
    { key: 'leads', label: 'Sent a request', count: leadsCount },
    { key: 'won', label: 'Won', count: wonCount },
  ].map((s, i, all) => ({
    ...s,
    ofPrev: i === 0 ? 100 : pct(s.count, all[i - 1].count),
    ofFirst: i === 0 ? 100 : pct(s.count, visitorsCount),
  }));

  // ---- which visits belong to each lead ----
  const visitsBefore = (r) => {
    const at = r.created_at;
    if (r.visitor_id && byVisitor.has(r.visitor_id)) return byVisitor.get(r.visitor_id).filter((v) => v.created_at <= at);
    if (r.ip && byIp.has(r.ip)) {
      const from = new Date(new Date(at).getTime() - 24 * 60 * 60 * 1000).toISOString();
      return byIp.get(r.ip).filter((v) => v.created_at <= at && v.created_at >= from);
    }
    return [];
  };

  // ---- pages ----
  const pageViews = new Map();
  const pageVisitors = new Map();
  for (const v of ordered) {
    const p = normalizePath(v.path);
    bump(pageViews, p);
    const set = pageVisitors.get(p) || pageVisitors.set(p, new Set()).get(p);
    set.add(v.visitor_id || v.ip || 'unknown');
  }
  const pageLeads = new Map();
  const landingLeads = new Map();
  const sourceLeads = new Map();
  for (const r of requests) {
    const seen = visitsBefore(r);
    for (const p of new Set(seen.map((v) => normalizePath(v.path)))) bump(pageLeads, p);
    const landing = normalizePath(r.source_path) || (seen[0] ? normalizePath(seen[0].path) : null);
    if (landing) bump(landingLeads, landing);
    const refRaw = r.source_referrer !== undefined && r.source_referrer !== null ? r.source_referrer : seen[0]?.referrer;
    bump(sourceLeads, referrerLabel(refRaw, siteHost));
  }
  const pages = [...pageViews.keys()]
    .map((path) => {
      const uniq = pageVisitors.get(path).size;
      const leads = pageLeads.get(path) || 0;
      return { path, views: pageViews.get(path), visitors: uniq, leads, rate: pct(leads, uniq) };
    })
    .sort((a, b) => b.leads - a.leads || b.views - a.views)
    .slice(0, 15);

  // ---- landing pages + traffic sources (first touch per visitor) ----
  const landingCount = new Map();
  const sourceCount = new Map();
  for (const list of byVisitor.values()) {
    bump(landingCount, normalizePath(list[0].path));
    bump(sourceCount, referrerLabel(list[0].referrer, siteHost));
  }
  const landing = [...landingCount.entries()]
    .map(([path, visitors]) => ({ path, visitors, leads: landingLeads.get(path) || 0, rate: pct(landingLeads.get(path) || 0, visitors) }))
    .sort((a, b) => b.visitors - a.visitors)
    .slice(0, 8);
  const sources = [...new Set([...sourceCount.keys(), ...sourceLeads.keys()])]
    .map((source) => ({ source, visitors: sourceCount.get(source) || 0, leads: sourceLeads.get(source) || 0, rate: pct(sourceLeads.get(source) || 0, sourceCount.get(source) || 0) }))
    .sort((a, b) => b.leads - a.leads || b.visitors - a.visitors)
    .slice(0, 8);

  // ---- breakdowns ----
  const byStage = {};
  const byType = new Map();
  for (const r of requests) {
    byStage[r.status] = (byStage[r.status] || 0) + 1;
    bump(byType, r.requirement_type || 'Not specified');
  }
  const types = [...byType.entries()].map(([type, count]) => ({ type, count })).sort((a, b) => b.count - a.count);

  return {
    totals: { visits: ordered.length, visitors: visitorsCount, leads: leadsCount, won: wonCount, conversion: pct(leadsCount, visitorsCount) },
    funnel, pages, landing, sources, byStage, types,
  };
}

// Visits + leads per business-timezone day, oldest first, for the chart.
export function dailySeries({ visits, requests, fromIso, toIso }) {
  const v = new Map();
  const l = new Map();
  for (const row of visits) if (normalizePath(row.path)) bump(v, businessDateKey(row.created_at)); // same filter as the totals: no admin traffic
  for (const row of requests) bump(l, businessDateKey(row.created_at));
  const out = [];
  const end = Date.parse(`${businessDateKey(toIso)}T00:00:00Z`);
  for (let t = Date.parse(`${businessDateKey(fromIso)}T00:00:00Z`); t <= end; t += 86400000) {
    const key = new Date(t).toISOString().slice(0, 10);
    out.push({ date: key, visits: v.get(key) || 0, leads: l.get(key) || 0 });
  }
  return out;
}

// '2026-09' -> { since, until, label } in the business timezone (IST, UTC+5:30).
export function monthRange(month) {
  const m = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(month || '');
  if (!m) return null;
  const OFFSET = 330 * 60 * 1000;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const since = new Date(Date.UTC(y, mo - 1, 1) - OFFSET);
  const until = new Date(Date.UTC(y, mo, 1) - OFFSET - 1);
  const label = new Date(Date.UTC(y, mo - 1, 1)).toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  return { since: since.toISOString(), until: until.toISOString(), label };
}
