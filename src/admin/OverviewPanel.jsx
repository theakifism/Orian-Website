import { CalendarClock, ArrowRight, Inbox } from 'lucide-react';
import AIInsights from './AIInsights';
import MetricCard from './MetricCard';
import { Card, Empty, MigrationNotice, Spinner } from './ui';
import { useApi } from './api';
import { STAGES, stageMeta, timeAgo } from './leadMeta';
import { actionLabel } from './activityLabels';

const Pipeline = ({ counts, onOpen }) => {
  const total = STAGES.reduce((sum, s) => sum + (s.key === 'lost' ? counts.lost + counts.closed : counts[s.key]), 0);
  const value = (s) => (s.key === 'lost' ? counts.lost + counts.closed : counts[s.key]);
  return (
    <Card className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-sm font-semibold">Pipeline</h2>
        <button type="button" onClick={onOpen} className="flex items-center gap-1 text-xs text-[var(--o-accent)] hover:underline">
          Open board <ArrowRight size={12} aria-hidden="true" />
        </button>
      </div>
      {total === 0 ? <Empty>No leads yet.</Empty> : (
        <>
          <div className="flex h-3 rounded-full overflow-hidden bg-[var(--o-surface-3)]" role="img" aria-label={STAGES.map((s) => `${s.label}: ${value(s)}`).join(', ')}>
            {STAGES.map((s) => value(s) > 0 && <span key={s.key} style={{ width: `${(value(s) / total) * 100}%`, background: s.dot }} />)}
          </div>
          <ul className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
            {STAGES.map((s) => (
              <li key={s.key}>
                <p className="flex items-center gap-1.5 text-xs text-[var(--o-text-3)]"><i style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />{s.label}</p>
                <p className="text-2xl font-semibold tracking-tight">{value(s)}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
};

const FollowUps = ({ items, onOpenLead, onGoLeads }) => (
  <Card className="p-5 sm:p-6">
    <div className="flex items-center justify-between gap-2 mb-3">
      <h2 className="flex items-center gap-2 text-sm font-semibold"><CalendarClock size={15} className="text-[var(--o-accent)]" /> Needs a follow-up</h2>
      {items.length > 0 && <span className="ad-chip is-overdue">{items.length}</span>}
    </div>
    {items.length === 0 ? (
      <Empty>You are all caught up. Nothing is due or going quiet.</Empty>
    ) : (
      <ul className="grid gap-2">
        {items.slice(0, 8).map((f) => (
          <li key={f.id}>
            <button type="button" onClick={() => onOpenLead({ id: f.id })} className="w-full text-left flex items-center gap-3 rounded-2xl border border-[var(--o-line)] bg-[var(--o-surface-2)] px-3.5 py-2.5 hover:border-[var(--o-line-strong)] transition-colors">
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold truncate">{f.name}{f.company ? <span className="font-normal text-[var(--o-text-3)]"> · {f.company}</span> : null}</span>
                <span className={`block text-xs ${f.kind === 'scheduled' ? 'text-rose-300' : 'text-[var(--o-text-3)]'}`}>{f.reason}</span>
              </span>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${stageMeta(f.stage).badge}`}>{stageMeta(f.stage).label}</span>
            </button>
          </li>
        ))}
      </ul>
    )}
    {items.length > 8 && (
      <button type="button" onClick={onGoLeads} className="mt-3 text-xs text-[var(--o-accent)] hover:underline">See all {items.length} on the board</button>
    )}
  </Card>
);

const OverviewPanel = ({ onOpenLead, onGoTab }) => {
  const { data, loading, error, migration } = useApi('/api/admin/overview');

  if (loading && !data) return <Spinner label="Loading your overview…" />;
  if (error) return <p role="alert" className="text-sm text-rose-300">{error}</p>;
  if (!data) return migration ? <MigrationNotice message={typeof migration === 'string' ? migration : undefined} /> : null;

  const sum = (rows) => rows.reduce((s, d) => s + d.count, 0);

  return (
    <div className="grid gap-5">
      {migration && <MigrationNotice />}
      <AIInsights />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="New leads (14 days)" value={sum(data.dailyLeads)} daily={data.dailyLeads} />
        <MetricCard label="Visitors (7 days)" value={data.visits.visitorsWeek} daily={data.dailyVisits} />
        <MetricCard label="Open leads" value={data.open} />
        <MetricCard label="Won this month" value={data.wonThisMonth ?? '—'} />
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 grid gap-5 content-start">
          <Pipeline counts={data.counts} onOpen={() => onGoTab('leads')} />
          <Card className="p-5 sm:p-6">
            <h2 className="text-sm font-semibold mb-3">Today</h2>
            <dl className="grid grid-cols-3 gap-4 text-sm">
              <div><dt className="text-xs text-[var(--o-text-3)]">Page views</dt><dd className="text-xl font-semibold">{data.visits.today}</dd></div>
              <div><dt className="text-xs text-[var(--o-text-3)]">Visitors</dt><dd className="text-xl font-semibold">{data.visits.visitorsToday}</dd></div>
              <div><dt className="text-xs text-[var(--o-text-3)]">New leads waiting</dt><dd className="text-xl font-semibold">{data.counts.new}</dd></div>
            </dl>
          </Card>
        </div>
        <div className="lg:col-span-2 grid gap-5 content-start">
          <FollowUps items={data.followUps} onOpenLead={onOpenLead} onGoLeads={() => onGoTab('leads')} />
          <Card className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h2 className="text-sm font-semibold">Recent activity</h2>
              <button type="button" onClick={() => onGoTab('system')} className="text-xs text-[var(--o-accent)] hover:underline">Full log</button>
            </div>
            {data.recent.length === 0 ? <Empty>Team actions will appear here.</Empty> : (
              <ul className="grid gap-2.5">
                {data.recent.map((e) => (
                  <li key={e.id} className="text-sm flex gap-2.5">
                    <Inbox size={14} className="mt-1 shrink-0 text-[var(--o-text-3)]" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="font-semibold">{e.admin_name || 'System'}</span>{' '}
                      <span className="text-[var(--o-text-2)]">{actionLabel(e.action).toLowerCase()}</span>
                      <span className="block text-xs text-[var(--o-text-3)]">{timeAgo(e.created_at)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OverviewPanel;
