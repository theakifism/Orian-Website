import { Fragment, useMemo, useState } from 'react';
import { ArrowUp, ArrowDown, Download, Search, MessageSquarePlus, ChevronDown, ChevronUp, X } from 'lucide-react';
import Skeleton from './Skeleton';
import { downloadCsv } from './csv';

const STATUS_STYLES = {
  new: 'bg-[#00AEEF]/15 text-[#00AEEF]',
  contacted: 'bg-amber-500/15 text-amber-500',
  closed: 'bg-emerald-500/15 text-emerald-500',
};

const StatusBadge = ({ status }) => (
  <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${STATUS_STYLES[status] || ''}`}>
    {status}
  </span>
);

const formatDate = (iso) => (iso ? new Date(iso).toLocaleString() : '—');

const COLUMNS = [
  { key: 'created_at', label: 'Submitted', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'contact', label: 'Contact', sortable: false },
  { key: 'requirement_type', label: 'Requirement', sortable: true },
  { key: 'message', label: 'Message', sortable: false },
  { key: 'assigned_to', label: 'Assigned', sortable: false },
  { key: 'status', label: 'Status', sortable: true },
];

const RequestsTable = ({
  requests,
  loading,
  onUpdateStatus,
  onBulkUpdateStatus,
  admins = [],
  onAssign,
  onAddNote,
  filters,
  onFiltersChange,
}) => {
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [selected, setSelected] = useState(new Set());
  const [expandedId, setExpandedId] = useState(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const sorted = useMemo(() => {
    if (!requests) return [];
    const copy = [...requests];
    copy.sort((a, b) => {
      const av = a[sortKey] ?? '';
      const bv = b[sortKey] ?? '';
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [requests, sortKey, sortDir]);

  const adminName = (id) => admins.find((a) => a.id === id)?.name || null;

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === sorted.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(sorted.map((r) => r.id)));
    }
  };

  const handleBulk = (status) => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    onBulkUpdateStatus(ids, status);
    setSelected(new Set());
  };

  const handleExport = () => {
    const rows = selected.size > 0 ? sorted.filter((r) => selected.has(r.id)) : sorted;
    downloadCsv(`requests-${new Date().toISOString().slice(0, 10)}.csv`, rows, [
      { label: 'Submitted', value: (r) => formatDate(r.created_at) },
      { label: 'Name', value: (r) => r.name },
      { label: 'Email', value: (r) => r.email },
      { label: 'Contact', value: (r) => r.contact },
      { label: 'Company', value: (r) => r.company || '' },
      { label: 'Requirement type', value: (r) => r.requirement_type || '' },
      { label: 'Message', value: (r) => r.message },
      { label: 'Status', value: (r) => r.status },
      { label: 'Assigned to', value: (r) => adminName(r.assigned_to) || 'Unassigned' },
      { label: 'IP address', value: (r) => r.ip || '' },
      {
        label: 'Notes',
        value: (r) => (Array.isArray(r.notes) ? r.notes.map((n) => `[${n.author}] ${n.text}`).join(' | ') : ''),
      },
    ]);
  };

  const setFilter = (key, value) => onFiltersChange({ ...filters, [key]: value });
  const activeFilterCount = ['status', 'dateFrom', 'dateTo', 'assignedTo'].filter((k) => filters?.[k]).length;

  const openNotes = (r) => {
    setExpandedId(expandedId === r.id ? null : r.id);
    setNoteDraft('');
  };

  const submitNote = async (id) => {
    const text = noteDraft.trim();
    if (!text) return;
    setSavingNote(true);
    await onAddNote(id, text);
    setSavingNote(false);
    setNoteDraft('');
  };

  if (loading) {
    return (
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Search + filter bar */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
            <input
              type="text"
              value={filters?.q || ''}
              onChange={(e) => setFilter('q', e.target.value)}
              placeholder="Search by name or email…"
              className="w-full bg-[var(--overlay)] border border-[var(--border)] rounded-lg pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF]"
            />
          </div>
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${
              activeFilterCount > 0
                ? 'border-[#00AEEF] text-[#00AEEF] bg-[#00AEEF]/10'
                : 'border-[var(--border)] text-[var(--text-dim)] hover:text-[var(--text)]'
            }`}
          >
            Filters{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
          </button>
        </div>

        {showFilters && (
          <div className="flex items-end gap-3 flex-wrap bg-[var(--overlay)] border border-[var(--border)] rounded-lg p-3">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-faint)] block mb-1">Status</label>
              <select
                value={filters?.status || ''}
                onChange={(e) => setFilter('status', e.target.value)}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs"
              >
                <option value="">All</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-faint)] block mb-1">From</label>
              <input
                type="date"
                value={filters?.dateFrom || ''}
                onChange={(e) => setFilter('dateFrom', e.target.value)}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-faint)] block mb-1">To</label>
              <input
                type="date"
                value={filters?.dateTo || ''}
                onChange={(e) => setFilter('dateTo', e.target.value)}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-faint)] block mb-1">Assigned to</label>
              <select
                value={filters?.assignedTo || ''}
                onChange={(e) => setFilter('assignedTo', e.target.value)}
                className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs"
              >
                <option value="">Anyone</option>
                <option value="unassigned">Unassigned</option>
                {admins.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={() => onFiltersChange({ q: filters?.q || '', status: '', dateFrom: '', dateTo: '', assignedTo: '' })}
                className="flex items-center gap-1 text-xs text-[var(--text-dim)] hover:text-red-400 transition-colors px-2 py-1.5"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <div className="text-sm text-[var(--text-dim)]">
          {selected.size > 0 ? `${selected.size} selected` : `${sorted.length} request${sorted.length === 1 ? '' : 's'}`}
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <select
              onChange={(e) => e.target.value && handleBulk(e.target.value)}
              defaultValue=""
              className="bg-[var(--overlay)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs"
            >
              <option value="" disabled>Set status…</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          )}
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--overlay)] hover:bg-[var(--border)] transition-colors"
          >
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      <div className="hidden md:block bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-[var(--surface)] z-10">
            <tr className="text-left text-[var(--text-faint)] text-xs font-mono uppercase tracking-wider border-b border-[var(--border)]">
              <th className="px-4 py-3 w-8">
                <input
                  type="checkbox"
                  checked={sorted.length > 0 && selected.size === sorted.length}
                  onChange={toggleSelectAll}
                  aria-label="Select all requests"
                />
              </th>
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-4 py-3 whitespace-nowrap">
                  {col.sortable ? (
                    <button
                      onClick={() => toggleSort(col.key)}
                      className="flex items-center gap-1 hover:text-[var(--text)] transition-colors"
                    >
                      {col.label}
                      {sortKey === col.key &&
                        (sortDir === 'asc' ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
                    </button>
                  ) : (
                    col.label
                  )}
                </th>
              ))}
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r, i) => {
              const noteCount = Array.isArray(r.notes) ? r.notes.length : 0;
              const isExpanded = expandedId === r.id;
              return (
                <Fragment key={r.id}>
                  <tr
                    className={`border-b border-[var(--border)] last:border-0 align-top ${
                      i % 2 === 1 ? 'bg-[var(--overlay)]/40' : ''
                    } hover:bg-[var(--overlay)] transition-colors`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(r.id)}
                        onChange={() => toggleSelect(r.id)}
                        aria-label={`Select request from ${r.name}`}
                      />
                    </td>
                    <td className="px-4 py-3 text-[var(--text-dim)] whitespace-nowrap">{formatDate(r.created_at)}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{r.name}</p>
                      <p className="text-xs text-[var(--text-dim)]">{r.email}</p>
                      {r.company && <p className="text-xs text-[var(--text-faint)]">{r.company}</p>}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-dim)]">{r.contact}</td>
                    <td className="px-4 py-3 text-[var(--text-dim)]">{r.requirement_type || '—'}</td>
                    <td className="px-4 py-3 max-w-xs text-[var(--text-dim)]">{r.message}</td>
                    <td className="px-4 py-3">
                      <select
                        value={r.assigned_to || ''}
                        onChange={(e) => onAssign(r.id, e.target.value || null)}
                        className="bg-[var(--overlay)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs max-w-[130px]"
                      >
                        <option value="">Unassigned</option>
                        {admins.map((a) => (
                          <option key={a.id} value={a.id}>{a.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={r.status}
                        onChange={(e) => onUpdateStatus(r.id, e.target.value)}
                        className="bg-[var(--overlay)] border border-[var(--border)] rounded-lg px-2 py-1.5 text-xs mb-1"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="closed">Closed</option>
                      </select>
                      <div><StatusBadge status={r.status} /></div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => openNotes(r)}
                        title="Internal notes"
                        className={`flex items-center gap-1 text-xs px-1.5 py-1 rounded-md transition-colors ${
                          noteCount > 0 ? 'text-[#00AEEF]' : 'text-[var(--text-faint)] hover:text-[var(--text)]'
                        }`}
                      >
                        <MessageSquarePlus size={14} />
                        {noteCount > 0 && <span className="font-semibold">{noteCount}</span>}
                        {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="bg-[var(--overlay)]/60 border-b border-[var(--border)]">
                      <td />
                      <td colSpan={COLUMNS.length + 1} className="px-4 py-4">
                        <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-faint)] mb-2">
                          Internal notes — visible to your team only
                        </p>
                        <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                          {noteCount === 0 && (
                            <p className="text-xs text-[var(--text-faint)] italic">No notes yet.</p>
                          )}
                          {(r.notes || []).map((n, idx) => (
                            <div key={idx} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2">
                              <p className="text-sm">{n.text}</p>
                              <p className="text-[10px] text-[var(--text-faint)] mt-1">
                                {n.author} · {formatDate(n.at)}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && submitNote(r.id)}
                            placeholder='e.g. "Called, no answer — retry Friday"'
                            className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF]"
                          />
                          <button
                            onClick={() => submitNote(r.id)}
                            disabled={savingNote || !noteDraft.trim()}
                            className="bg-[#00AEEF] hover:bg-[#E8A23D] text-black text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {savingNote ? 'Saving…' : 'Add note'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
            {sorted.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length + 2} className="px-4 py-10 text-center text-[var(--text-dim)]">
                  No requests match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile: stacked cards instead of a table that needed horizontal
          scrolling to read past 2-3 columns on a phone screen. */}
      <div className="md:hidden space-y-3">
        {sorted.map((r) => {
          const noteCount = Array.isArray(r.notes) ? r.notes.length : 0;
          const isExpanded = expandedId === r.id;
          return (
            <div key={r.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selected.has(r.id)}
                  onChange={() => toggleSelect(r.id)}
                  aria-label={`Select request from ${r.name}`}
                  className="mt-1.5 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{r.name}</p>
                      <p className="text-xs text-[var(--text-dim)] truncate">{r.email}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  {r.company && <p className="text-xs text-[var(--text-faint)] mt-0.5">{r.company}</p>}
                  <p className="text-[11px] text-[var(--text-faint)] mt-2">
                    {formatDate(r.created_at)} · {r.requirement_type || 'No requirement type'}
                  </p>
                  <p className="text-sm text-[var(--text-dim)] mt-2 leading-relaxed">{r.message}</p>

                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <select
                      value={r.status}
                      onChange={(e) => onUpdateStatus(r.id, e.target.value)}
                      className="bg-[var(--overlay)] border border-[var(--border)] rounded-lg px-2 py-2 text-xs flex-1 min-w-[110px]"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                    <select
                      value={r.assigned_to || ''}
                      onChange={(e) => onAssign(r.id, e.target.value || null)}
                      className="bg-[var(--overlay)] border border-[var(--border)] rounded-lg px-2 py-2 text-xs flex-1 min-w-[110px]"
                    >
                      <option value="">Unassigned</option>
                      {admins.map((a) => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => openNotes(r)}
                    className={`tap-feedback flex items-center gap-1.5 text-xs mt-3 px-2 py-1.5 -mx-2 rounded-md transition-colors ${
                      noteCount > 0 ? 'text-[#00AEEF]' : 'text-[var(--text-faint)]'
                    }`}
                  >
                    <MessageSquarePlus size={14} />
                    {noteCount > 0 ? `${noteCount} note${noteCount === 1 ? '' : 's'}` : 'Add note'}
                    {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>

                  {isExpanded && (
                    <div className="mt-2 bg-[var(--overlay)]/60 border border-[var(--border)] rounded-lg p-3">
                      <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                        {noteCount === 0 && (
                          <p className="text-xs text-[var(--text-faint)] italic">No notes yet.</p>
                        )}
                        {(r.notes || []).map((n, idx) => (
                          <div key={idx} className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2">
                            <p className="text-sm">{n.text}</p>
                            <p className="text-[10px] text-[var(--text-faint)] mt-1">
                              {n.author} · {formatDate(n.at)}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={noteDraft}
                          onChange={(e) => setNoteDraft(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && submitNote(r.id)}
                          placeholder='e.g. "Called, no answer — retry Friday"'
                          className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00AEEF]"
                        />
                        <button
                          onClick={() => submitNote(r.id)}
                          disabled={savingNote || !noteDraft.trim()}
                          className="tap-feedback bg-[#00AEEF] hover:bg-[#E8A23D] text-black text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-50 shrink-0"
                        >
                          {savingNote ? 'Saving…' : 'Add'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && (
          <div className="text-center text-[var(--text-dim)] py-10 bg-[var(--surface)] border border-[var(--border)] rounded-xl">
            No requests match these filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestsTable;
