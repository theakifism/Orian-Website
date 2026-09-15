import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Download, Globe2, Smartphone, FileText, Link2 } from 'lucide-react';
import Skeleton from './Skeleton';
import MetricCard from './MetricCard';
import { downloadCsv } from './csv';

// Converts a 2-letter ISO country code (what Vercel's geo headers send) into
// its flag emoji — pure Unicode math, no lookup table or external service.
function countryFlag(code) {
  if (!code || code.length !== 2) return '🌐';
  const base = 0x1f1e6;
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => base + (c.charCodeAt(0) - 65))
  );
}

const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : '—');

const BreakdownList = ({ icon: Icon, title, items, renderLabel, total }) => (
  <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
    <div className="flex items-center gap-2 mb-4">
      <Icon size={15} className="text-[#00AEEF]" />
      <h3 className="text-sm font-semibold">{title}</h3>
    </div>
    <div className="space-y-2.5">
      {(!items || items.length === 0) && (
        <p className="text-xs text-[var(--text-faint)]">No data yet.</p>
      )}
      {items?.map((item) => {
        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
        return (
          <div key={item.value}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="truncate max-w-[70%]">{renderLabel ? renderLabel(item.value) : item.value}</span>
              <span className="text-[var(--text-dim)] font-mono">{item.count}</span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--overlay)] overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00AEEF] to-purple-500 rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const VisitorsPanel = ({ visitorData, loading }) => {
  const totalForPct = useMemo(
    () => (visitorData?.topPages || []).reduce((s, p) => s + p.count, 0),
    [visitorData]
  );

  const handleExport = () => {
    if (!visitorData?.visitors) return;
    downloadCsv(`visitors-${new Date().toISOString().slice(0, 10)}.csv`, visitorData.visitors, [
      { label: 'Visitor ID', value: (v) => v.visitor_id },
      { label: 'IP address', value: (v) => v.last_ip || '' },
      { label: 'Country', value: (v) => v.last_country || '' },
      { label: 'City', value: (v) => v.last_city || '' },
      { label: 'Device', value: (v) => v.last_device || '' },
      { label: 'Browser', value: (v) => v.last_browser || '' },
      { label: 'OS', value: (v) => v.last_os || '' },
      { label: 'Last page', value: (v) => v.last_path || '' },
      { label: 'Total visits', value: (v) => v.visit_count },
      { label: 'Distinct IPs', value: (v) => v.distinct_ip_count },
      { label: 'First seen', value: (v) => formatDate(v.first_seen) },
      { label: 'Last seen', value: (v) => formatDate(v.last_seen) },
    ]);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricCard
          label="Unique visitors"
          value={visitorData?.totals.uniqueVisitors ?? 0}
          daily={visitorData?.dailyVisits}
          loading={loading}
        />
        <MetricCard
          label="Total visits"
          value={visitorData?.totals.totalVisits ?? 0}
          daily={visitorData?.dailyVisits}
          loading={loading}
        />
        <MetricCard label="Visits today" value={visitorData?.totals.visitsToday ?? 0} loading={loading} />
      </div>

      {/* Big visitor traffic graph — the main "show me the trend" view */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 mb-6">
        <h3 className="text-sm font-semibold mb-4">Visitor traffic (last 14 days)</h3>
        {loading ? (
          <Skeleton className="h-56 w-full" />
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorData?.dailyVisits || []} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="visitor-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00AEEF" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#00AEEF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: 'var(--text-faint)' }}
                  tickFormatter={(d) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-faint)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                  labelFormatter={(d) => new Date(d).toLocaleDateString()}
                />
                <Area type="monotone" dataKey="count" name="Visits" stroke="#00AEEF" strokeWidth={2} fill="url(#visitor-area)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top pages / referrers / country / device breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <BreakdownList icon={FileText} title="Top pages" items={visitorData?.topPages} total={totalForPct} />
        <BreakdownList icon={Link2} title="Top traffic sources" items={visitorData?.topReferrers} total={totalForPct} />
        <BreakdownList
          icon={Globe2}
          title="Visitors by country"
          items={visitorData?.topCountries}
          total={totalForPct}
          renderLabel={(code) => `${countryFlag(code)}  ${code === 'Unknown' ? 'Unknown' : code}`}
        />
        <BreakdownList icon={Smartphone} title="Visitors by device" items={visitorData?.topDevices} total={totalForPct} />
      </div>

      {/* Full visitor detail table — IP, device, country, all in full */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Visitor detail</h3>
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--overlay)] hover:bg-[var(--border)] transition-colors"
        >
          <Download size={13} /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[var(--text-faint)] text-xs font-mono uppercase tracking-wider border-b border-[var(--border)]">
                  <th className="px-4 py-3">Visitor</th>
                  <th className="px-4 py-3">IP address</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">Visits</th>
                  <th className="px-4 py-3">First seen</th>
                  <th className="px-4 py-3">Last seen</th>
                </tr>
              </thead>
              <tbody>
                {visitorData?.visitors.map((v) => (
                  <tr key={v.visitor_id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--overlay)] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-[var(--text-dim)]">{v.visitor_id.slice(0, 10)}…</td>
                    <td className="px-4 py-3 font-mono">{v.last_ip || '—'}</td>
                    <td className="px-4 py-3">
                      <span className="mr-1">{countryFlag(v.last_country)}</span>
                      {v.last_city ? `${v.last_city}, ` : ''}
                      {v.last_country || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-dim)]">
                      <p>{v.last_device || 'Unknown'}</p>
                      <p className="text-[10px] text-[var(--text-faint)]">
                        {[v.last_browser, v.last_os].filter(Boolean).join(' · ') || '—'}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-semibold">{v.visit_count}</td>
                    <td className="px-4 py-3 text-[var(--text-dim)]">{formatDate(v.first_seen)}</td>
                    <td className="px-4 py-3 text-[var(--text-dim)]">{formatDate(v.last_seen)}</td>
                  </tr>
                ))}
                {visitorData && visitorData.visitors.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[var(--text-dim)]">
                      No visits recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards instead of a 7-column table that needed horizontal
              scrolling to read past "Visitor" and "IP address". */}
          <div className="md:hidden space-y-3">
            {visitorData?.visitors.map((v) => (
              <div key={v.visitor_id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-[var(--text-dim)]">{v.visitor_id.slice(0, 14)}…</p>
                    <p className="text-sm mt-1">
                      <span className="mr-1">{countryFlag(v.last_country)}</span>
                      {v.last_city ? `${v.last_city}, ` : ''}
                      {v.last_country || 'Unknown'}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-sm">{v.visit_count}</p>
                    <p className="text-[10px] text-[var(--text-faint)]">visits</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--border)] grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-[var(--text-dim)]">
                  <p><span className="text-[var(--text-faint)]">IP:</span> <span className="font-mono">{v.last_ip || '—'}</span></p>
                  <p><span className="text-[var(--text-faint)]">Device:</span> {v.last_device || 'Unknown'}</p>
                  <p className="col-span-2">
                    <span className="text-[var(--text-faint)]">Browser/OS:</span>{' '}
                    {[v.last_browser, v.last_os].filter(Boolean).join(' · ') || '—'}
                  </p>
                  <p><span className="text-[var(--text-faint)]">First seen:</span> {formatDate(v.first_seen)}</p>
                  <p><span className="text-[var(--text-faint)]">Last seen:</span> {formatDate(v.last_seen)}</p>
                </div>
              </div>
            ))}
            {visitorData && visitorData.visitors.length === 0 && (
              <div className="text-center text-[var(--text-dim)] py-8 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
                No visits recorded yet.
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default VisitorsPanel;
