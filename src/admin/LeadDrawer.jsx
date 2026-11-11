import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X, Mail, Phone, Building2, CalendarClock, StickyNote, Send, Globe, UserRound, MessageSquareText, Loader2 } from 'lucide-react';
import { ALL_STAGES, REPLY_TEMPLATES, fillTemplate, followUpState, formatDate, formatDay, stageMeta } from './leadMeta';
import { sendJson } from './api';

const TERMINAL = ['won', 'lost', 'closed'];

// 'YYYY-MM-DD' (IST calendar day) -> ISO at 10:00 IST.
const istMorning = (ymd) => new Date(`${ymd}T10:00:00+05:30`).toISOString();
const istToday = () => new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10);
const istPlusDays = (n) => new Date(Date.parse(`${istToday()}T00:00:00Z`) + n * 86400000).toISOString().slice(0, 10);

const hostOf = (url) => {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return 'another site'; }
};

const field = 'w-full rounded-xl border border-[var(--o-line-strong)] bg-[var(--o-surface-2)] px-3 py-2 text-sm text-[var(--o-text)] placeholder:text-[var(--o-text-3)] focus:border-[var(--o-accent)] focus:outline-none';

/**
 * Slide-over for one lead: contact details, stage / owner / follow-up controls,
 * the conversation (the original message, internal notes and emails sent from
 * here) and a composer to add a note or email the lead.
 */
const LeadDrawer = ({ leadId, initial, admins = [], admin, onClose, onChanged }) => {
  const [lead, setLead] = useState(initial?.email ? initial : null); // list rows are complete; the overview passes only an id
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [mode, setMode] = useState('note');
  const [noteText, setNoteText] = useState('');
  const [busy, setBusy] = useState('');
  const [email, setEmail] = useState({ template: '', subject: '', body: '', markContacted: true });
  const panelRef = useRef(null);

  // Always load the latest copy so notes added by teammates show up.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/requests?id=${encodeURIComponent(leadId)}`, { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('load'))))
      .then((d) => { if (!cancelled) setLead(d.request); })
      .catch(() => { if (!cancelled) setLoadError('Could not load the latest version of this lead.'); });
    return () => { cancelled = true; };
  }, [leadId]);

  // Modal behaviour: Esc closes, focus stays inside, page scroll locked, focus returns.
  useEffect(() => {
    const opener = document.activeElement;
    const node = panelRef.current;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    node?.querySelector('[data-autofocus]')?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); onClose(); return; }
      if (e.key !== 'Tab' || !node) return;
      const items = Array.from(node.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled])'));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (!node.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; opener?.focus?.(); };
  }, [onClose]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = window.setTimeout(() => setToast(''), 3500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const apply = useCallback((patch) => {
    setLead((l) => ({ ...l, ...patch }));
    onChanged?.({ id: leadId, ...patch });
  }, [leadId, onChanged]);

  const patch = async (body, optimistic, fail) => {
    const before = lead;
    setError('');
    if (optimistic) apply(optimistic);
    const r = await sendJson('/api/admin/requests', 'PATCH', { id: leadId, ...body });
    if (!r.ok) {
      setLead(before);
      onChanged?.({ id: leadId, ...Object.fromEntries(Object.keys(optimistic || {}).map((k) => [k, before[k]])) });
      setError(r.error || fail);
      return null;
    }
    return r.data;
  };

  const setStage = (status) => {
    const now = new Date().toISOString();
    const opt = { status, last_activity_at: now, ...(TERMINAL.includes(status) ? { follow_up_at: null } : {}) };
    patch({ status }, opt, 'Could not change the stage.');
  };
  const setOwner = (v) => patch({ assignedTo: v || null }, { assigned_to: v || null }, 'Could not assign this lead.');
  const setFollowUp = async (iso) => {
    const data = await patch({ followUpAt: iso }, { follow_up_at: iso }, 'Could not set the follow-up.');
    if (data) setToast(iso ? 'Follow-up scheduled' : 'Follow-up cleared');
  };

  const saveNote = async () => {
    const text = noteText.trim();
    if (!text) return;
    setBusy('note');
    setError('');
    const r = await sendJson('/api/admin/requests', 'PATCH', { id: leadId, note: text });
    setBusy('');
    if (!r.ok) { setError(r.error); return; }
    setNoteText('');
    apply({ notes: r.data.notes, last_activity_at: new Date().toISOString() });
    setToast('Note added');
  };

  const pickTemplate = (key) => {
    const t = REPLY_TEMPLATES.find((x) => x.key === key);
    if (!t) { setEmail((e) => ({ ...e, template: '' })); return; }
    setEmail((e) => ({ ...e, template: key, subject: fillTemplate(t.subject, lead, admin?.name), body: fillTemplate(t.body, lead, admin?.name) }));
  };

  const sendEmail = async () => {
    setBusy('email');
    setError('');
    const r = await sendJson('/api/admin/reply', 'POST', { id: leadId, subject: email.subject, body: email.body, markContacted: email.markContacted });
    setBusy('');
    if (!r.ok) { setError(r.error); return; }
    apply({ notes: r.data.notes, status: r.data.status, last_activity_at: new Date().toISOString() });
    setEmail({ template: '', subject: '', body: '', markContacted: true });
    setMode('note');
    setToast(r.data.logged === false ? 'Email sent (could not be logged on the lead)' : 'Email sent and logged');
  };

  const timeline = useMemo(() => {
    if (!lead) return [];
    const items = [{ kind: 'message', at: lead.created_at, text: lead.message, author: lead.name }];
    (Array.isArray(lead.notes) ? lead.notes : []).forEach((n) => items.push({ kind: n.type === 'email' ? 'email' : 'note', ...n }));
    return items.sort((a, b) => new Date(a.at) - new Date(b.at));
  }, [lead]);

  const fu = lead ? followUpState(lead) : { tone: null };
  const meta = lead ? stageMeta(lead.status) : null;
  const canSend = email.subject.trim() && email.body.trim() && busy !== 'email';

  return (
    <>
      <div className="ad-scrim" onMouseDown={onClose} />
      <aside ref={panelRef} className="ad-drawer" role="dialog" aria-modal="true" aria-label={lead ? `Lead: ${lead.name}` : 'Lead'}>
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[var(--o-line)]">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold tracking-tight truncate">{lead?.name || 'Loading…'}</h2>
            {lead && (
              <p className="text-xs text-[var(--o-text-3)] truncate">
                {lead.company ? `${lead.company} · ` : ''}Received {formatDate(lead.created_at)}
              </p>
            )}
          </div>
          <button type="button" className="o2-x shrink-0" onClick={onClose} aria-label="Close lead" data-autofocus><X size={14} /></button>
        </div>

        {!lead ? (
          <div className="flex-1 grid place-items-center text-sm text-[var(--o-text-3)]">
            {loadError || <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Loading lead…</span>}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {(error || loadError) && <p role="alert" className="mx-5 mt-4 rounded-xl bg-rose-500/10 border border-rose-500/30 px-3 py-2 text-sm text-rose-300">{error || loadError}</p>}

            {/* contact */}
            <section className="px-5 py-4 grid gap-2 text-sm">
              <a className="flex items-center gap-2.5 text-[var(--o-text)] hover:text-[var(--o-accent)] break-all" href={`mailto:${lead.email}`}><Mail size={15} className="text-[var(--o-text-3)] shrink-0" /> {lead.email}</a>
              <a className="flex items-center gap-2.5 text-[var(--o-text)] hover:text-[var(--o-accent)]" href={`tel:${lead.contact}`}><Phone size={15} className="text-[var(--o-text-3)] shrink-0" /> {lead.contact}</a>
              {lead.company && <p className="flex items-center gap-2.5"><Building2 size={15} className="text-[var(--o-text-3)] shrink-0" /> {lead.company}</p>}
              {lead.requirement_type && <p className="flex items-center gap-2.5"><MessageSquareText size={15} className="text-[var(--o-text-3)] shrink-0" /> {lead.requirement_type}</p>}
              {(lead.source_path || lead.source_referrer) && (
                <p className="flex items-center gap-2.5 text-[var(--o-text-2)]">
                  <Globe size={15} className="text-[var(--o-text-3)] shrink-0" />
                  <span className="break-all">Came in via {lead.source_referrer ? hostOf(lead.source_referrer) : 'direct'}{lead.source_path ? ` → ${lead.source_path}` : ''}</span>
                </p>
              )}
            </section>

            {/* controls */}
            <section className="px-5 pb-4 grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1 text-xs text-[var(--o-text-3)]">Stage
                <select className={field} value={lead.status} onChange={(e) => setStage(e.target.value)} style={{ borderColor: meta?.dot }}>
                  {(ALL_STAGES.some((s) => s.key === lead.status) ? ALL_STAGES : [...ALL_STAGES, { key: lead.status, label: lead.status }])
                    .filter((s) => s.key !== 'closed' || lead.status === 'closed')
                    .map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
              </label>
              <label className="grid gap-1 text-xs text-[var(--o-text-3)]">Owner
                <select className={field} value={lead.assigned_to || ''} onChange={(e) => setOwner(e.target.value)}>
                  <option value="">Unassigned</option>
                  {admins.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </label>
            </section>

            {/* follow-up */}
            <section className="mx-5 mb-4 rounded-2xl border border-[var(--o-line)] bg-[var(--o-surface-2)] p-4">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <p className="flex items-center gap-2 text-sm font-semibold"><CalendarClock size={15} className="text-[var(--o-accent)]" /> Follow-up</p>
                {lead.follow_up_at
                  ? <span className={`ad-chip ${fu.tone === 'overdue' ? 'is-overdue' : fu.tone === 'today' ? 'is-today' : ''}`}>{formatDay(lead.follow_up_at)} · {fu.label}</span>
                  : <span className="text-xs text-[var(--o-text-3)]">{TERMINAL.includes(lead.status) ? 'Not needed for a finished lead' : 'Not scheduled'}</span>}
              </div>
              {!TERMINAL.includes(lead.status) && (
                <div className="flex flex-wrap items-center gap-2">
                  {[['Tomorrow', 1], ['In 3 days', 3], ['Next week', 7]].map(([label, n]) => (
                    <button key={label} type="button" className="o2-chip" onClick={() => setFollowUp(istMorning(istPlusDays(n)))}>{label}</button>
                  ))}
                  <input type="date" aria-label="Pick a follow-up date" min={istToday()} className={`${field} !w-auto !py-1.5`}
                    value={lead.follow_up_at ? new Date(new Date(lead.follow_up_at).getTime() + 330 * 60000).toISOString().slice(0, 10) : ''}
                    onChange={(e) => e.target.value && setFollowUp(istMorning(e.target.value))} />
                  {lead.follow_up_at && <button type="button" className="o2-chip" onClick={() => setFollowUp(null)}>Clear</button>}
                </div>
              )}
            </section>

            {/* conversation */}
            <section className="px-5 pb-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--o-text-3)] mb-3">Conversation</h3>
              <ol className="grid gap-3">
                {timeline.map((item, i) => (
                  <li key={`${item.at}-${i}`} className={`rounded-2xl border px-4 py-3 text-sm ${item.kind === 'message' ? 'border-[var(--o-line-strong)] bg-[var(--o-surface-2)]' : item.kind === 'email' ? 'border-[#00AEEF]/30 bg-[#00AEEF]/[0.06]' : 'border-[var(--o-line)]'}`}>
                    <p className="flex items-center gap-1.5 text-xs text-[var(--o-text-3)] mb-1.5">
                      {item.kind === 'message' ? <UserRound size={12} /> : item.kind === 'email' ? <Mail size={12} /> : <StickyNote size={12} />}
                      <span className="font-semibold text-[var(--o-text-2)]">{item.kind === 'message' ? `${item.author} wrote` : item.kind === 'email' ? `${item.author} emailed` : `${item.author} noted`}</span>
                      · {formatDate(item.at)}
                    </p>
                    {item.kind === 'email' && <p className="font-semibold mb-1">{item.subject}</p>}
                    <p className="whitespace-pre-wrap text-[var(--o-text)] break-words">{item.text}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* composer */}
            <section className="px-5 pb-6">
              <div className="ad-seg mb-3" role="tablist" aria-label="Add to this lead">
                <button type="button" role="tab" aria-selected={mode === 'note'} className={mode === 'note' ? 'is-on' : ''} onClick={() => setMode('note')}><StickyNote size={14} /> Note</button>
                <button type="button" role="tab" aria-selected={mode === 'email'} className={mode === 'email' ? 'is-on' : ''} onClick={() => setMode('email')}><Mail size={14} /> Email reply</button>
              </div>

              {mode === 'note' ? (
                <div className="grid gap-2">
                  <textarea className={field} rows={3} maxLength={1000} placeholder="Internal note — only your team sees this" value={noteText} onChange={(e) => setNoteText(e.target.value)} />
                  <button type="button" className="o2-btn o2-btn-primary justify-self-end" style={{ height: '2.5rem' }} disabled={!noteText.trim() || busy === 'note'} onClick={saveNote}>
                    {busy === 'note' ? 'Saving…' : 'Add note'}
                  </button>
                </div>
              ) : (
                <div className="grid gap-2.5">
                  <p className="text-xs text-[var(--o-text-3)]">To <span className="text-[var(--o-text-2)]">{lead.email}</span> · replies go to <span className="text-[var(--o-text-2)]">{admin?.email}</span></p>
                  <select className={field} value={email.template} onChange={(e) => pickTemplate(e.target.value)} aria-label="Start from a template">
                    <option value="">Start from a template…</option>
                    {REPLY_TEMPLATES.map((t) => <option key={t.key} value={t.key}>{t.label}</option>)}
                  </select>
                  <input className={field} placeholder="Subject" maxLength={150} value={email.subject} onChange={(e) => setEmail((s) => ({ ...s, subject: e.target.value }))} />
                  <textarea className={field} rows={9} maxLength={5000} placeholder="Write your reply…" value={email.body} onChange={(e) => setEmail((s) => ({ ...s, body: e.target.value }))} />
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    {lead.status === 'new' ? (
                      <label className="flex items-center gap-2 text-xs text-[var(--o-text-2)]">
                        <input type="checkbox" checked={email.markContacted} onChange={(e) => setEmail((s) => ({ ...s, markContacted: e.target.checked }))} /> Move to Contacted when sent
                      </label>
                    ) : <span />}
                    <button type="button" className="o2-btn o2-btn-primary" style={{ height: '2.5rem' }} disabled={!canSend} onClick={sendEmail}>
                      <Send aria-hidden="true" /> {busy === 'email' ? 'Sending…' : 'Send email'}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        )}

        {toast && <div role="status" className="absolute left-1/2 bottom-5 -translate-x-1/2 rounded-full bg-[var(--o-surface-3)] border border-[var(--o-line-strong)] px-4 py-2 text-sm shadow-xl">{toast}</div>}
      </aside>
    </>
  );
};

export default LeadDrawer;
