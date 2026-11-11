import { useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Download, Printer, ChartColumn, Users, FileText, TrendingUp, TrendingDown } from 'lucide-react';
import VisitorsPanel from './VisitorsPanel';
import { Card, Empty, Segmented, Spinner } from './ui';
import { useApi } from './api';
import { downloadCsv } from './csv';
import { formatDate, stageMeta } from './leadMeta';

const RANGES = [{ key: '7', label: '7 days' }, { key: '30', label: '30 days' }, { key: '90', label: '90 days' }];
const nowMonth = () => new Date(Date.now() + 330 * 60000).toISOString().slice(0, 7);

const Delta = ({ now, before }) => {
  if (before === undefined || before === null) return null;
  if (before === 0) return now > 0 ? <span className="text-xs text-emerald-400">new this period</span> : null;
  const pct = Math.round(((now - before) / before) * 100);
  if (pct === 0) return <span className="text-xs text-[var(--o-text-3)]">same as before</span>;
  const up = pct > 0;
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
      {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {Math.abs(pct)}% vs previous period
    </span>
  );
};

const Stat = ({ label, value, children }) => (
  <div>
    <p className="text-xs font-mono uppercase tracking-wider text-[var(--o-text-3)] mb-1">{label}</p>
    <p className="text-3xl font-semibold tracking-tight">{value}</p>
    {children}
  </div>
);

const Funnel = ({ steps }) => (
  <ol className="grid gap-3">
    {steps.map((s, i) => (
      <li key={s.key}>
        <div className="flex items-baseline justify-between gap-3 text-sm mb-1.5">
          <span className="font-semibold">{s.label}</span>
          <span className="text-[var(--o-text-2)]">
            {s.count.toLocaleString('en-IN')}
            {i > 0 && <span className="text-xs text-[var(--o-text-3)]"> · {s.ofPrev}% of previous</span>}
          </span>
        </div>
        <div className="h-2.5 rounded-full bg-[var(--o-surface-3)] overflow-hidden">
          <div className="ad-bar h-full rounded-full bg-[var(--o-accent)]" style={{ width: `${Math.max(Math.min(s.ofFirst, 100), s.count > 0 ? 2 : 0)}%`, opacity: 1 - i * 0.14 }} />
        </div>
      </li>
    ))}
  </ol>
);

const DataTable = ({ columns, rows, empty }) => (
  rows.length === 0 ? <Empty>{empty}</Empty> : (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-[var(--o-text-3)]">
            {columns.map((c) => <th key={c.label} className={`px-1 py-2 font-medium ${c.right ? 'text-right' : ''}`}>{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-[var(--o-line)]">
              {columns.map((c) => <td key={c.label} className={`px-1 py-2 ${c.right ? 'text-right tabular-nums' : 'break-all'}`}>{c.value(r)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
);

const pageCols = [
  { label: 'Page', value: (r) => r.path },
  { label: 'Views', right: true, value: (r) => r.views },
  { label: 'Visitors', right: true, value: (r) => r.visitors },
  { label: 'Leads', right: true, value: (r) => r.leads },
  { label: 'Conversion', right: true, value: (r) => `${r.rate}%` },
];
const landingCols = [
  { label: 'Landing page', value: (r) => r.path },
  { label: 'Visitors', right: true, value: (r) => r.visitors },
  { label: 'Leads', right: true, value: (r) => r.leads },
  { label: 'Conversion', right: true, value: (r) => `${r.rate}%` },
];
const sourceCols = [
  { label: 'Source', value: (r) => r.source },
  { label: 'Visitors', right: true, value: (r) => r.visitors },
  { label: 'Leads', right: true, value: (r) => r.leads },
  { label: 'Conversion', right: true, value: (r) => `${r.rate}%` },
];

const TrendChart = ({ data }) => (
  <div className="h-56 -ml-2">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="ad-visits" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00AEEF" stopOpacity={0.4} /><stop offset="100%" stopColor="#00AEEF" stopOpacity={0} /></linearGradient>
          <linearGradient id="ad-leads" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3DDC97" stopOpacity={0.45} /><stop offset="100%" stopColor="#3DDC97" stopOpacity={0} /></linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
        <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} tick={{ fill: '#7C838F', fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={24} />
        <YAxis yAxisId="v" allowDecimals={false} tick={{ fill: '#7C838F', fontSize: 11 }} axisLine={false} tickLine={false} width={34} />
        <YAxis yAxisId="l" orientation="right" allowDecimals={false} hide />
        <Tooltip contentStyle={{ background: '#15181D', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 12, fontSize: 12 }} labelStyle={{ color: '#B5BAC4' }} />
        <Area yAxisId="v" type="monotone" dataKey="visits" name="Page views" stroke="#00AEEF" strokeWidth={2} fill="url(#ad-visits)" isAnimationActive={false} />
        <Area yAxisId="l" type="monotone" dataKey="leads" name="Leads" stroke="#3DDC97" strokeWidth={2} fill="url(#ad-leads)" isAnimationActive={false} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

const leadColumns = [
  { label: 'Received', value: (r) => formatDate(r.created_at) },
  { label: 'Name', value: (r) => r.name },
  { label: 'Company', value: (r) => r.company || '' },
  { label: 'Email', value: (r) => r.email },
  { label: 'Phone', value: (r) => r.contact },
  { label: 'Requirement', value: (r) => r.requirement_type || '' },
  { label: 'Stage', value: (r) => stageMeta(r.status).label },
  { label: 'Landing page', value: (r) => r.source_path || '' },
  { label: 'Came from', value: (r) => r.source_referrer || '' },
];

// ---------- report ----------
const Report = () => {
  const [month, setMonth] = useState(nowMonth());
  const url = useMemo(() => `/api/admin/analytics?month=${month}`, [month]);
  const { data, loading, error } = useApi(url, { enabled: /^\d{4}-\d{2}$/.test(month) });

  return (
    <div>
      <div className="ad-noprint flex flex-wrap items-center gap-3 mb-4">
        <label className="flex items-center gap-2 text-sm text-[var(--o-text-2)]">Month
          <input type="month" value={month} max={nowMonth()} onChange={(e) => e.target.value && setMonth(e.target.value)}
            className="h-10 rounded-full border border-[var(--o-line-strong)] bg-[var(--o-surface)] px-4 text-sm" />
        </label>
        <div className="flex gap-2 ml-auto">
          <button type="button" className="o2-btn o2-btn-ghost" style={{ height: '2.5rem' }} disabled={!data || data.leads.length === 0}
            onClick={() => downloadCsv(`orian-leads-${month}.csv`, data.leads, leadColumns)}>
            <Download aria-hidden="true" /> Leads CSV
          </button>
          <button type="button" className="o2-btn o2-btn-primary" style={{ height: '2.5rem' }} disabled={!data} onClick={() => window.print()}>
            <Printer aria-hidden="true" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      {loading && !data ? <Spinner label="Building the report…" /> : data && (
        <Card className="ad-report p-6 sm:p-8">
          <header className="mb-6">
            <p className="o2-eyebrow"><i /> Monthly report</p>
            <h2 className="text-2xl font-semibold tracking-tight mt-2">Orian Teleservices · {data.range.label}</h2>
            <p className="text-xs text-[var(--o-text-3)] mt-1">Generated {formatDate(new Date().toISOString())}</p>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <Stat label="Visitors" value={data.totals.visitors.toLocaleString('en-IN')} />
            <Stat label="Page views" value={data.totals.visits.toLocaleString('en-IN')}><Delta now={data.totals.visits} before={data.previous.visits} /></Stat>
            <Stat label="Leads" value={data.totals.leads}><Delta now={data.totals.leads} before={data.previous.leads} /></Stat>
            <Stat label="Won" value={data.totals.won}><span className="text-xs text-[var(--o-text-3)]">{data.totals.conversion}% visitor-to-lead</span></Stat>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <section><h3 className="text-sm font-semibold mb-3">Funnel</h3><Funnel steps={data.funnel} /></section>
            <section>
              <h3 className="text-sm font-semibold mb-3">Leads by stage</h3>
              <DataTable empty="No leads this month." rows={Object.entries(data.byStage).map(([k, v]) => ({ k, v }))}
                columns={[{ label: 'Stage', value: (r) => stageMeta(r.k).label }, { label: 'Leads', right: true, value: (r) => r.v }]} />
              <h3 className="text-sm font-semibold mt-6 mb-3">Leads by requirement</h3>
              <DataTable empty="No leads this month." rows={data.types} columns={[{ label: 'Requirement', value: (r) => r.type }, { label: 'Leads', right: true, value: (r) => r.count }]} />
            </section>
          </div>

          <section className="mb-8"><h3 className="text-sm font-semibold mb-3">Top pages</h3><DataTable empty="No page views recorded." rows={data.pages.slice(0, 8)} columns={pageCols} /></section>
          <section className="mb-8"><h3 className="text-sm font-semibold mb-3">Where visitors came from</h3><DataTable empty="No traffic recorded." rows={data.sources} columns={sourceCols} /></section>

          <section>
            <h3 className="text-sm font-semibold mb-3">Leads this month ({data.leads.length})</h3>
            <DataTable empty="No leads this month." rows={data.leads.slice(0, 200)}
              columns={[leadColumns[0], leadColumns[1], leadColumns[2], leadColumns[5], leadColumns[6]]} />
            {data.leads.length > 200 && <p className="text-xs text-[var(--o-text-3)] mt-2">First 200 shown. The CSV has all {data.leads.length}.</p>}
          </section>
          {data.truncated && <p className="text-xs text-[var(--o-text-3)] mt-6">Very high traffic: visitor figures are based on the first 20,000 page views of the period.</p>}
        </Card>
      )}
    </div>
  );
};

// ---------- funnel & pages ----------
const Insights = () => {
  const [days, setDays] = useState('30');
  const { data, loading, error } = useApi(`/api/admin/analytics?days=${days}`);

  return (
    <div className="grid gap-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Segmented label="Time range" value={days} onChange={setDays} options={RANGES} />
        {data && <span className="text-xs text-[var(--o-text-3)]">{data.totals.visitors.toLocaleString('en-IN')} visitors · {data.totals.leads} leads · {data.totals.conversion}% convert</span>}
      </div>

      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      {loading && !data ? <Spinner label="Crunching the numbers…" /> : data && (
        <>
          {data.truncated && <p className="text-xs text-[var(--o-text-3)]">Very high traffic: based on the first 20,000 page views of this period.</p>}
          <div className="grid lg:grid-cols-5 gap-5">
            <Card className="lg:col-span-2 p-5 sm:p-6"><h2 className="text-sm font-semibold mb-4">Conversion funnel</h2><Funnel steps={data.funnel} /></Card>
            <Card className="lg:col-span-3 p-5 sm:p-6"><h2 className="text-sm font-semibold mb-2">Page views and leads per day</h2><TrendChart data={data.daily} /></Card>
          </div>
          <Card className="p-5 sm:p-6">
            <h2 className="text-sm font-semibold mb-1">Page performance</h2>
            <p className="text-xs text-[var(--o-text-3)] mb-3">A lead is credited to every page its visitor viewed before sending the request. Conversion is leads ÷ visitors for that page.</p>
            <DataTable empty="No page views in this period." rows={data.pages} columns={pageCols} />
          </Card>
          <div className="grid lg:grid-cols-2 gap-5">
            <Card className="p-5 sm:p-6"><h2 className="text-sm font-semibold mb-3">Landing pages</h2><DataTable empty="No traffic yet." rows={data.landing} columns={landingCols} /></Card>
            <Card className="p-5 sm:p-6"><h2 className="text-sm font-semibold mb-3">Traffic sources</h2><DataTable empty="No traffic yet." rows={data.sources} columns={sourceCols} /></Card>
          </div>
        </>
      )}
    </div>
  );
};

const AnalyticsPanel = ({ visitorData, loadingVisitors, visitorPage, onVisitorPageChange }) => {
  const [view, setView] = useState('insights');
  return (
    <div className="grid gap-5">
      <div className="ad-noprint">
        <Segmented
          label="Analytics view" value={view} onChange={setView}
          options={[
            { key: 'insights', label: 'Funnel & pages', icon: ChartColumn },
            { key: 'visitors', label: 'Visitors', icon: Users },
            { key: 'report', label: 'Monthly report', icon: FileText },
          ]}
        />
      </div>
      {view === 'insights' && <Insights />}
      {view === 'visitors' && <VisitorsPanel visitorData={visitorData} loading={loadingVisitors} page={visitorPage} onPageChange={onVisitorPageChange} />}
      {view === 'report' && <Report />}
    </div>
  );
};

export default AnalyticsPanel;
