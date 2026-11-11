import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// `label` is a human-readable string ('Unique visitors') used raw as an SVG
// id below. Spaces there break the fill={`url(#...)`} reference (the space
// ends the url() token early), which was silently killing the sparkline's
// gradient fill on every multi-word label. Slugify it into a safe id.
const slugifyId = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

// Compares the sum of the most recent 7 days against the 7 days before that.
// Returns null when there isn't enough history yet to compare fairly.
function computeTrend(daily) {
  if (!daily || daily.length < 14) return null;
  const last7 = daily.slice(-7).reduce((sum, d) => sum + d.count, 0);
  const prev7 = daily.slice(-14, -7).reduce((sum, d) => sum + d.count, 0);
  if (prev7 === 0) return last7 > 0 ? { pct: 100, up: true } : null;
  const pct = Math.round(((last7 - prev7) / prev7) * 100);
  return { pct: Math.abs(pct), up: pct >= 0 };
}

const MetricCard = ({ label, value, daily, loading }) => {
  const trend = computeTrend(daily);

  return (
    <div className="bg-(--surface) border border-(--border) rounded-xl p-5 relative overflow-hidden">
      <p className="text-xs font-mono uppercase tracking-wider text-(--text-faint) mb-2">{label}</p>

      {loading ? (
        <div className="h-9 w-20 bg-(--overlay) rounded animate-pulse" />
      ) : (
        <div className="flex items-end justify-between gap-3">
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <span
              className={`flex items-center gap-1 text-xs font-semibold mb-1 ${
                trend.up ? 'text-emerald-500' : 'text-red-500'
              }`}
            >
              {trend.pct === 0 ? <Minus size={13} /> : trend.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {trend.pct}%
            </span>
          )}
        </div>
      )}

      {daily && daily.length > 0 && (
        <div className="h-10 mt-2 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={daily} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`spark-${slugifyId(label)}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00AEEF" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#00AEEF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="count"
                stroke="#00AEEF"
                strokeWidth={1.5}
                fill={`url(#spark-${slugifyId(label)})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
