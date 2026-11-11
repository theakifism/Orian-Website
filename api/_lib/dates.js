// The business is in India (IST, UTC+5:30) — see CONTACT.address in
// src/seo/siteConfig.js. All "today" / daily-bucket boundaries below use
// this offset rather than the server's own clock, because Vercel functions
// run in UTC: without this, "Visits today" rolls over at 5:30am IST
// instead of midnight, and a visit just after midnight IST gets bucketed
// into the previous day. Change this one constant if the business ever
// operates out of a different timezone.
const BUSINESS_TZ_OFFSET_MINUTES = 330; // UTC+5:30

const shiftToBusinessTz = (date) => new Date(date.getTime() + BUSINESS_TZ_OFFSET_MINUTES * 60 * 1000);
const shiftFromBusinessTz = (date) => new Date(date.getTime() - BUSINESS_TZ_OFFSET_MINUTES * 60 * 1000);

// 'YYYY-MM-DD' business-timezone calendar date for a stored (UTC) timestamp.
export function businessDateKey(isoString) {
  return shiftToBusinessTz(new Date(isoString)).toISOString().slice(0, 10);
}

// Turns a flat list of { created_at } rows into a fixed-length daily series
// (oldest first), filling in zero for days with no rows, so charts always
// get a consistent number of points regardless of activity. Buckets by the
// business's own calendar day, not UTC.
export function bucketDailyCounts(rows, days) {
  const counts = new Map();
  for (const row of rows) {
    const day = businessDateKey(row.created_at);
    counts.set(day, (counts.get(day) || 0) + 1);
  }

  const series = [];
  const cursor = shiftToBusinessTz(new Date());
  cursor.setUTCHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(cursor);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    series.push({ date: key, count: counts.get(key) || 0 });
  }
  return series;
}

// Absolute (UTC) cutoff `days` ago, used as a query's lower bound — widened
// by one extra day so a business-timezone bucket at the edge of the range
// always has its full day of data available to bucketDailyCounts above.
export function daysAgoIso(days) {
  const d = new Date();
  d.setDate(d.getDate() - days - 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

// Start of "today" in the business's own timezone, as a UTC ISO instant —
// use this instead of `new Date().setHours(0,0,0,0)` for any "today" query
// (e.g. "visits today"), since the server itself runs in UTC.
export function startOfTodayIso() {
  const startOfDayInBusinessTz = shiftToBusinessTz(new Date());
  startOfDayInBusinessTz.setUTCHours(0, 0, 0, 0);
  return shiftFromBusinessTz(startOfDayInBusinessTz).toISOString();
}
