// Turns a flat list of { created_at } rows into a fixed-length daily series
// (oldest first), filling in zero for days with no rows, so charts always
// get a consistent number of points regardless of activity.
export function bucketDailyCounts(rows, days) {
  const counts = new Map();
  for (const row of rows) {
    const day = row.created_at.slice(0, 10); // 'YYYY-MM-DD'
    counts.set(day, (counts.get(day) || 0) + 1);
  }

  const series = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(cursor);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    series.push({ date: key, count: counts.get(key) || 0 });
  }
  return series;
}

export function daysAgoIso(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}
