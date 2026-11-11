import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Kanban, Table2, Search, GripVertical, CalendarClock, RefreshCw } from 'lucide-react';
import RequestsTable from './RequestsTable';
import MetricCard from './MetricCard';
import { Card, Empty, Segmented, Spinner } from './ui';
import { sendJson } from './api';
import { STAGES, boardColumn, followUpState, initials, mergePatch, timeAgo } from './leadMeta';

const TERMINAL = ['won', 'lost', 'closed'];

// ---------- one card on the board ----------
const LeadCard = ({ lead, adminName, dragging, onOpen, onDragStart, onDragEnd, onMove }) => {
  const fu = followUpState(lead);
  return (
    <div
      className={`ad-card${dragging ? ' is-dragging' : ''}`}
      draggable
      onDragStart={(e) => { e.dataTransfer.setData('text/plain', lead.id); e.dataTransfer.effectAllowed = 'move'; onDragStart(lead.id); }}
      onDragEnd={onDragEnd}
    >
      <button type="button" onClick={() => onOpen(lead)} className="text-left grid gap-1.5 bg-transparent border-0 p-0 text-inherit cursor-pointer" aria-label={`Open lead ${lead.name}`}>
        <span className="flex items-start gap-1.5">
          <GripVertical size={14} className="mt-0.5 shrink-0 text-[var(--o-text-3)]" aria-hidden="true" />
          <span className="min-w-0">
            <span className="block text-sm font-semibold truncate">{lead.name}</span>
            {lead.company && <span className="block text-xs text-[var(--o-text-3)] truncate">{lead.company}</span>}
          </span>
        </span>
        <span className="text-xs text-[var(--o-text-2)] line-clamp-2 break-words">{lead.message}</span>
      </button>
      <div className="flex flex-wrap items-center gap-1.5">
        {lead.requirement_type && <span className="ad-chip">{lead.requirement_type}</span>}
        {fu.tone && (
          <span className={`ad-chip ${fu.tone === 'overdue' ? 'is-overdue' : fu.tone === 'today' ? 'is-today' : ''}`}>
            <CalendarClock size={11} aria-hidden="true" /> {fu.label}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-[var(--o-text-3)]">{timeAgo(lead.created_at)}</span>
        <div className="flex items-center gap-1.5">
          {lead.assigned_to && (
            <span title={adminName(lead.assigned_to) || 'Assigned'} className="grid place-items-center w-6 h-6 rounded-full bg-[var(--o-surface-3)] border border-[var(--o-line-strong)] text-[10px] font-bold">
              {initials(adminName(lead.assigned_to) || '')}
            </span>
          )}
          {/* Keyboard / phone friendly alternative to dragging */}
          <select
            aria-label={`Move ${lead.name} to another stage`}
            value=""
            onChange={(e) => e.target.value && onMove(lead.id, e.target.value)}
            className="h-6 max-w-[5.5rem] rounded-full border border-[var(--o-line-strong)] bg-transparent px-1.5 text-[11px] text-[var(--o-text-2)]"
          >
            <option value="">Move…</option>
            {STAGES.filter((s) => s.key !== boardColumn(lead.status)).map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
};

const Board = ({ admins, onOpen, onLeadsChanged, patches }) => {
  const [q, setQ] = useState('');
  const [owner, setOwner] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [dragId, setDragId] = useState(null);
  const [overCol, setOverCol] = useState(null);
  const seq = useRef(0);

  const load = useCallback(async () => {
    const mine = ++seq.current;
    setLoading(true);
    setError('');
    const params = new URLSearchParams({ view: 'board' });
    if (q.trim()) params.set('q', q.trim());
    if (owner) params.set('assignedTo', owner);
    try {
      const res = await fetch(`/api/admin/requests?${params}`, { credentials: 'same-origin' });
      const json = await res.json().catch(() => ({}));
      if (mine !== seq.current) return;
      if (!res.ok) throw new Error(json.error || 'Could not load the lead board.');
      setData({ ...json, __fetchedAt: Date.now() });
    } catch (err) {
      if (mine === seq.current) setError(err.message || 'Could not load the lead board.');
    } finally {
      if (mine === seq.current) setLoading(false);
    }
  }, [q, owner]);

  // Debounced so typing in the search box does not fire a request per key.
  useEffect(() => {
    const t = window.setTimeout(load, 250);
    return () => window.clearTimeout(t);
  }, [load]);

  // Changes made in the drawer / elsewhere are merged straight into the board.
  const leads = useMemo(
    () => (data?.requests || []).map((l) => mergePatch(l, patches[l.id], data.__fetchedAt)),
    [data, patches],
  );
  const adminName = (id) => admins.find((a) => a.id === id)?.name || null;

  const byColumn = useMemo(() => {
    const cols = Object.fromEntries(STAGES.map((s) => [s.key, []]));
    leads.forEach((l) => (cols[boardColumn(l.status)] || cols.new).push(l));
    return cols;
  }, [leads]);

  const move = async (id, status) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead || boardColumn(lead.status) === status) return;
    const before = data;
    const now = new Date().toISOString();
    setData((d) => ({ ...d, requests: d.requests.map((l) => (l.id === id ? { ...l, status, last_activity_at: now, ...(TERMINAL.includes(status) ? { follow_up_at: null } : {}) } : l)) }));
    const r = await sendJson('/api/admin/requests', 'PATCH', { id, status });
    if (!r.ok) { setData(before); setError(r.error || 'Could not move that lead.'); return; }
    onLeadsChanged();
  };

  const drop = (status) => (e) => {
    e.preventDefault();
    setOverCol(null);
    const id = e.dataTransfer.getData('text/plain') || dragId;
    setDragId(null);
    if (id) move(id, status);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[12rem] max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--o-text-3)]" aria-hidden="true" />
          <input
            type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email or company"
            aria-label="Search leads"
            className="w-full h-10 rounded-full border border-[var(--o-line-strong)] bg-[var(--o-surface)] pl-9 pr-4 text-sm placeholder:text-[var(--o-text-3)] focus:border-[var(--o-accent)] focus:outline-none"
          />
        </div>
        <select value={owner} onChange={(e) => setOwner(e.target.value)} aria-label="Filter by owner"
          className="h-10 rounded-full border border-[var(--o-line-strong)] bg-[var(--o-surface)] px-4 text-sm">
          <option value="">Everyone&apos;s leads</option>
          <option value="unassigned">Unassigned</option>
          {admins.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        <button type="button" className="o2-chip" onClick={load} aria-label="Refresh board"><RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh</button>
        <span className="text-xs text-[var(--o-text-3)] ml-auto hidden sm:block">Drag cards between columns, or use “Move…”</span>
      </div>

      {error && <p role="alert" className="text-sm text-rose-300 mb-3">{error}</p>}
      {!data && loading ? <Spinner label="Loading leads…" /> : (
        <>
          <div className="ad-board" aria-busy={loading}>
            {STAGES.map((s) => (
              <section
                key={s.key}
                aria-label={`${s.label} leads`}
                className={`ad-col${overCol === s.key ? ' is-over' : ''}`}
                onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (overCol !== s.key) setOverCol(s.key); }}
                onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOverCol(null); }}
                onDrop={drop(s.key)}
              >
                <header className="ad-col-head">
                  <span className="flex items-center gap-2"><i style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, display: 'inline-block' }} />{s.label}</span>
                  <span className="text-xs text-[var(--o-text-3)]">{byColumn[s.key].length}</span>
                </header>
                <div className="ad-col-list">
                  {byColumn[s.key].map((l) => (
                    <LeadCard key={l.id} lead={l} adminName={adminName} dragging={dragId === l.id}
                      onOpen={onOpen} onDragStart={setDragId} onDragEnd={() => { setDragId(null); setOverCol(null); }} onMove={move} />
                  ))}
                  {byColumn[s.key].length === 0 && <p className="text-xs text-[var(--o-text-3)] text-center py-6">{overCol === s.key ? 'Drop here' : 'Nothing here'}</p>}
                </div>
              </section>
            ))}
          </div>
          {data?.truncated && <p className="text-xs text-[var(--o-text-3)] mt-2">Showing the newest {data.requests.length} of {data.total} leads. Use search or the table view to find older ones.</p>}
          {data && data.requests.length === 0 && !loading && <Empty>No leads match.</Empty>}
        </>
      )}
    </div>
  );
};

/**
 * Leads: a kanban board of the pipeline (default) or the full sortable table.
 * Both open the same lead drawer.
 */
const LeadsPanel = ({
  requestData, loadingRequests, admins, filters, onFiltersChange, requestPage, onPageChange, requestPageSize,
  onUpdateStatus, onBulkUpdateStatus, onAssign, onAddNote, onOpenLead, onLeadsChanged, patches,
}) => {
  const [view, setView] = useState('board');

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricCard label="Total leads" value={requestData?.total ?? 0} daily={requestData?.dailyRequests} loading={loadingRequests && !requestData} />
        <MetricCard label="New, not yet contacted" value={requestData?.newCount ?? 0} loading={loadingRequests && !requestData} />
        <MetricCard label="Last 14 days" value={requestData?.dailyRequests?.reduce((s, d) => s + d.count, 0) ?? 0} daily={requestData?.dailyRequests} loading={loadingRequests && !requestData} />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
        <Segmented
          label="Lead view" value={view} onChange={setView}
          options={[{ key: 'board', label: 'Board', icon: Kanban }, { key: 'table', label: 'Table', icon: Table2 }]}
        />
      </div>

      {view === 'board' ? (
        <Board admins={admins} onOpen={onOpenLead} patches={patches} onLeadsChanged={onLeadsChanged} />
      ) : (
        <Card className="p-0 overflow-hidden">
          <RequestsTable
            requests={requestData?.requests?.map((l) => mergePatch(l, patches[l.id], requestData.__fetchedAt))}
            loading={loadingRequests}
            onUpdateStatus={onUpdateStatus}
            onBulkUpdateStatus={onBulkUpdateStatus}
            admins={admins}
            onAssign={onAssign}
            onAddNote={onAddNote}
            onOpenLead={onOpenLead}
            filters={filters}
            onFiltersChange={onFiltersChange}
            page={requestData?.page || requestPage}
            total={requestData?.total || 0}
            pageSize={requestData?.pageSize || requestPageSize}
            onPageChange={onPageChange}
          />
        </Card>
      )}
    </div>
  );
};

export default LeadsPanel;
