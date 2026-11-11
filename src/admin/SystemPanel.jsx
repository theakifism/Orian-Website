import { useState } from 'react';
import { HeartPulse, Ban, Activity, LogIn, CheckCircle2, XCircle, TriangleAlert, Info, RefreshCw, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, Empty, MigrationNotice, Segmented, Spinner } from './ui';
import { sendJson, useApi } from './api';
import { ACTION_GROUPS, actionLabel } from './activityLabels';
import { formatDate, timeAgo } from './leadMeta';

const STATUS = {
  ok: { icon: CheckCircle2, cls: 'text-emerald-400', label: 'Working' },
  warn: { icon: TriangleAlert, cls: 'text-pink-400', label: 'Needs attention' },
  fail: { icon: XCircle, cls: 'text-rose-400', label: 'Broken' },
  info: { icon: Info, cls: 'text-[var(--o-text-3)]', label: 'Info' },
};

const field = 'h-10 rounded-full border border-[var(--o-line-strong)] bg-[var(--o-surface)] px-4 text-sm placeholder:text-[var(--o-text-3)] focus:border-[var(--o-accent)] focus:outline-none';

// ---------- site health ----------
const Health = () => {
  const { data, loading, error, reload } = useApi('/api/admin/health');
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {data ? (
          <p className="text-sm text-[var(--o-text-2)]">
            {data.summary.fail > 0 ? <b className="text-rose-400">{data.summary.fail} broken</b> : null}
            {data.summary.fail > 0 && data.summary.warn > 0 ? ' · ' : ''}
            {data.summary.warn > 0 ? <b className="text-pink-400">{data.summary.warn} need attention</b> : null}
            {data.summary.fail + data.summary.warn === 0 ? <b className="text-emerald-400">Everything is working</b> : null}
            <span className="text-[var(--o-text-3)]"> · checked {timeAgo(data.checkedAt)}</span>
          </p>
        ) : <span />}
        <button type="button" className="o2-chip" onClick={reload} disabled={loading}><RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Re-check</button>
      </div>
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      {loading && !data ? <Spinner label="Running checks…" /> : data && (
        <Card className="divide-y divide-[var(--o-line)]">
          {data.checks.map((c) => {
            const S = STATUS[c.status] || STATUS.info;
            return (
              <div key={c.id} className="flex gap-3 px-5 py-4">
                <S.icon size={18} className={`${S.cls} shrink-0 mt-0.5`} aria-label={S.label} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{c.label}</p>
                  <p className="text-sm text-[var(--o-text-2)]">{c.detail}</p>
                  {c.hint && <p className="text-xs text-[var(--o-text-3)] mt-1">{c.hint}</p>}
                </div>
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
};

// ---------- blocklist + rejected submissions ----------
const Blocklist = () => {
  const { data, loading, error, reload, migration } = useApi('/api/admin/security');
  const [form, setForm] = useState({ kind: 'ip', value: '', reason: '' });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);

  const add = async (body) => {
    setBusy(true);
    setMsg('');
    const r = await sendJson('/api/admin/security', 'POST', body);
    setBusy(false);
    if (!r.ok) { setMsg(r.error); return; }
    setForm((f) => ({ ...f, value: '', reason: '' }));
    reload();
  };
  const remove = async (id) => {
    if (!window.confirm('Remove this from the blocklist?')) return;
    const r = await sendJson('/api/admin/security', 'DELETE', { id });
    if (!r.ok) setMsg(r.error); else reload();
  };

  if (loading && !data) return <Spinner />;
  return (
    <div className="grid gap-5">
      {migration && <MigrationNotice />}
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      {data && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-5"><p className="text-xs text-[var(--o-text-3)]">Failed bot checks, last 24h</p><p className="text-3xl font-semibold tracking-tight">{data.last24h.turnstile}</p></Card>
            <Card className="p-5"><p className="text-xs text-[var(--o-text-3)]">Blocked senders stopped, last 24h</p><p className="text-3xl font-semibold tracking-tight">{data.last24h.blocked}</p></Card>
          </div>

          <Card className="p-5 sm:p-6">
            <h2 className="text-sm font-semibold mb-1">Block a sender</h2>
            <p className="text-xs text-[var(--o-text-3)] mb-4">Blocked senders get the normal “thank you” on the contact form, but nothing is saved or emailed. Blocked IPs also cannot use the AI chat.</p>
            <form className="flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); add(form); }}>
              <select aria-label="What to block" value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} className={field}>
                <option value="ip">IP address</option><option value="email">Email address</option><option value="domain">Email domain</option>
              </select>
              <input aria-label="Value to block" required value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className={`${field} flex-1 min-w-[12rem]`}
                placeholder={form.kind === 'ip' ? '203.0.113.7' : form.kind === 'email' ? 'someone@spam.com' : 'spam-mail.com'} />
              <input aria-label="Reason (optional)" value={form.reason} maxLength={200} onChange={(e) => setForm({ ...form, reason: e.target.value })} className={`${field} sm:w-56`} placeholder="Reason (optional)" />
              <button type="submit" className="o2-btn o2-btn-primary" style={{ height: '2.5rem' }} disabled={busy}><Ban aria-hidden="true" /> Block</button>
            </form>
            {msg && <p role="alert" className="text-sm text-rose-300 mt-3">{msg}</p>}
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="text-sm font-semibold mb-3">Blocklist ({data.entries.length})</h2>
            {data.entries.length === 0 ? <Empty>Nobody is blocked.</Empty> : (
              <ul className="divide-y divide-[var(--o-line)]">
                {data.entries.map((e) => (
                  <li key={e.id} className="flex items-center gap-3 py-2.5 text-sm">
                    <span className="ad-chip">{e.kind}</span>
                    <span className="flex-1 min-w-0 break-all">{e.value}{e.reason && <span className="text-[var(--o-text-3)]"> · {e.reason}</span>}</span>
                    <span className="text-xs text-[var(--o-text-3)] hidden sm:block">{timeAgo(e.created_at)}</span>
                    <button type="button" onClick={() => remove(e.id)} aria-label={`Unblock ${e.value}`} className="text-[var(--o-text-3)] hover:text-rose-400"><Trash2 size={14} /></button>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card className="p-5 sm:p-6">
            <h2 className="text-sm font-semibold mb-3">Recently rejected submissions</h2>
            {data.events.length === 0 ? <Empty>No rejected submissions.</Empty> : (
              <ul className="divide-y divide-[var(--o-line)]">
                {data.events.map((e) => {
                  const already = e.ip && data.entries.some((b) => b.kind === 'ip' && b.value === e.ip);
                  return (
                    <li key={e.id} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
                      <span className={`ad-chip ${e.reason === 'turnstile' ? 'is-overdue' : ''}`}>{e.reason === 'turnstile' ? 'Bot check failed' : 'Blocked'}</span>
                      <span className="flex-1 min-w-0 break-all text-[var(--o-text-2)]">{e.ip || 'unknown IP'}{e.email ? ` · ${e.email}` : ''}</span>
                      <span className="text-xs text-[var(--o-text-3)]">{timeAgo(e.created_at)}</span>
                      {e.ip && !already && e.ip !== data.yourIp && (
                        <button type="button" className="o2-chip" onClick={() => add({ kind: 'ip', value: e.ip, reason: 'Rejected submission' })}>Block this IP</button>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
};

// ---------- activity log ----------
const ActivityLog = () => {
  const [group, setGroup] = useState('');
  const [page, setPage] = useState(1);
  const qs = new URLSearchParams({ page: String(page), ...(group ? { group } : {}) });
  const { data, loading, error, migration } = useApi(`/api/admin/activity?${qs}`);
  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <div className="grid gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <select aria-label="Filter activity" value={group} onChange={(e) => { setGroup(e.target.value); setPage(1); }} className={field}>
          {ACTION_GROUPS.map((g) => <option key={g.key} value={g.key}>{g.label}</option>)}
        </select>
        {data && <span className="text-xs text-[var(--o-text-3)]">{data.total} entr{data.total === 1 ? 'y' : 'ies'}</span>}
      </div>
      {migration && <MigrationNotice />}
      {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      {loading && !data ? <Spinner /> : data && (
        <Card className="p-2 sm:p-3">
          {data.entries.length === 0 ? <Empty>Nothing logged yet. Actions your team takes will appear here.</Empty> : (
            <ul className="divide-y divide-[var(--o-line)]">
              {data.entries.map((e) => (
                <li key={e.id} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-3 py-3 text-sm">
                  <span className="sm:w-36 shrink-0 font-semibold">{e.admin_name || 'System'}</span>
                  <span className="flex-1 min-w-0">
                    <span className="text-[var(--o-text)]">{actionLabel(e.action)}</span>
                    {e.detail && <span className="text-[var(--o-text-3)] break-words"> · {e.detail}</span>}
                  </span>
                  <span className="text-xs text-[var(--o-text-3)] whitespace-nowrap" title={e.ip || ''}>{formatDate(e.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
      {data && pages > 1 && (
        <div className="flex items-center justify-center gap-3 text-sm">
          <button type="button" className="o2-chip" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}><ChevronLeft size={13} /> Newer</button>
          <span className="text-[var(--o-text-3)]">Page {page} of {pages}</span>
          <button type="button" className="o2-chip" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Older <ChevronRight size={13} /></button>
        </div>
      )}
    </div>
  );
};

// ---------- sign-ins ----------
const SignIns = () => {
  const { data, loading, error } = useApi('/api/admin/security');
  if (loading && !data) return <Spinner />;
  if (error) return <p role="alert" className="text-sm text-rose-300">{error}</p>;
  const rows = data?.loginEvents || [];
  return (
    <Card className="p-2 sm:p-3">
      {rows.length === 0 ? <Empty>No sign-in attempts recorded.</Empty> : (
        <ul className="divide-y divide-[var(--o-line)]">
          {rows.map((e) => (
            <li key={e.id} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-3 py-3 text-sm">
              <span className={`ad-chip w-fit ${e.success ? '' : 'is-overdue'}`}>{e.success ? 'Signed in' : 'Failed'}</span>
              <span className="flex-1 min-w-0 break-all">{e.email_attempted}
                <span className="text-[var(--o-text-3)]"> · {[e.city, e.country].filter(Boolean).join(', ') || e.ip || 'unknown location'}{e.device ? ` · ${e.device}` : ''}{e.browser ? ` · ${e.browser}` : ''}</span>
              </span>
              <span className="text-xs text-[var(--o-text-3)] whitespace-nowrap">{formatDate(e.created_at)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

const SystemPanel = () => {
  const [view, setView] = useState('health');
  return (
    <div className="grid gap-5">
      <Segmented
        label="System view" value={view} onChange={setView}
        options={[
          { key: 'health', label: 'Site health', icon: HeartPulse },
          { key: 'blocklist', label: 'Spam & blocklist', icon: Ban },
          { key: 'activity', label: 'Activity log', icon: Activity },
          { key: 'signins', label: 'Sign-ins', icon: LogIn },
        ]}
      />
      {view === 'health' && <Health />}
      {view === 'blocklist' && <Blocklist />}
      {view === 'activity' && <ActivityLog />}
      {view === 'signins' && <SignIns />}
    </div>
  );
};

export default SystemPanel;
