import { businessDateKey } from './dates.js';

// Pipeline stages, in board order. 'closed' is the legacy "done" value from
// before the pipeline existed: still accepted, shown together with Lost.
export const STAGES = ['new', 'contacted', 'quoted', 'won', 'lost'];
export const VALID_STATUSES = [...STAGES, 'closed'];
export const OPEN_STATUSES = ['new', 'contacted', 'quoted'];
export const TERMINAL_STATUSES = ['won', 'lost', 'closed'];

// An open lead nobody has touched for this long is flagged even without a date.
export const QUIET_DAYS = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

const dayDiff = (isoA, isoB) =>
  Math.round((Date.parse(`${businessDateKey(isoA)}T00:00:00Z`) - Date.parse(`${businessDateKey(isoB)}T00:00:00Z`)) / DAY_MS);

// Why (if at all) this lead needs attention right now. Business-timezone days
// are used so "due today" flips at midnight IST, not midnight UTC.
export function followUpReason(lead, now = new Date()) {
  if (!OPEN_STATUSES.includes(lead.status)) return null;
  const nowIso = now.toISOString();

  if (lead.follow_up_at) {
    const days = dayDiff(nowIso, lead.follow_up_at); // >0 overdue, 0 today, <0 future
    if (days < 0) return null;
    return {
      kind: 'scheduled',
      overdueDays: days,
      reason: days === 0 ? 'follow-up due today' : `follow-up ${days} day${days === 1 ? '' : 's'} overdue`,
      sortKey: new Date(lead.follow_up_at).getTime(),
    };
  }

  const last = lead.last_activity_at || lead.created_at;
  const quietDays = Math.floor((now.getTime() - new Date(last).getTime()) / DAY_MS);
  if (quietDays >= QUIET_DAYS) {
    return {
      kind: 'quiet',
      overdueDays: quietDays,
      reason: `no activity for ${quietDays} days`,
      // Quiet leads sort after scheduled ones, longest-quiet first.
      sortKey: Number.MAX_SAFE_INTEGER - quietDays,
    };
  }
  return null;
}

// Open leads that are due or gone quiet, most urgent first.
export function collectFollowUps(leads, now = new Date(), limit = 25) {
  return leads
    .map((lead) => ({ lead, why: followUpReason(lead, now) }))
    .filter((x) => x.why)
    .sort((a, b) => a.why.sortKey - b.why.sortKey)
    .slice(0, limit)
    .map(({ lead, why }) => ({
      id: lead.id,
      name: lead.name,
      company: lead.company || null,
      stage: lead.status,
      assigned_to: lead.assigned_to || null,
      follow_up_at: lead.follow_up_at || null,
      kind: why.kind,
      reason: why.reason,
    }));
}

// Parses a follow-up date from the admin UI. null clears it. Returns
// { value } (ISO string or null) or { error }.
export function parseFollowUp(input) {
  if (input === null || input === '') return { value: null };
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return { error: 'That follow-up date is not valid.' };
  const maxFuture = Date.now() + 366 * DAY_MS;
  if (d.getTime() > maxFuture) return { error: 'Pick a follow-up date within the next year.' };
  return { value: d.toISOString() };
}
