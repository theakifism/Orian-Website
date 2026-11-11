// Shared lead-pipeline vocabulary for the admin panel: stages, colours, date
// helpers and the reply templates. Stage keys must match api/_lib/leads.js.

export const STAGES = [
  { key: 'new', label: 'New', dot: '#00AEEF', badge: 'bg-[#00AEEF]/15 text-[#00AEEF]' },
  { key: 'contacted', label: 'Contacted', dot: '#A78BFA', badge: 'bg-violet-500/15 text-violet-400' },
  { key: 'quoted', label: 'Quoted', dot: '#F472B6', badge: 'bg-pink-500/15 text-pink-400' },
  { key: 'won', label: 'Won', dot: '#3DDC97', badge: 'bg-emerald-500/15 text-emerald-400' },
  { key: 'lost', label: 'Lost', dot: '#7C838F', badge: 'bg-slate-500/15 text-slate-400' },
];

const CLOSED = { key: 'closed', label: 'Closed', dot: '#7C838F', badge: 'bg-slate-500/15 text-slate-400' };

// Every value a lead can have (the old "closed" is kept so existing rows still show).
export const ALL_STAGES = [...STAGES, CLOSED];
export const OPEN_STAGES = ['new', 'contacted', 'quoted'];

export const stageMeta = (key) => ALL_STAGES.find((s) => s.key === key) || STAGES[0];
// The old "closed" status sits in the Lost column of the board.
export const boardColumn = (status) => (status === 'closed' ? 'lost' : status);

export const formatDate = (iso) => (iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—');
export const formatDay = (iso) => (iso ? new Date(iso).toLocaleDateString('en-IN', { dateStyle: 'medium' }) : '—');

export function timeAgo(iso) {
  if (!iso) return '';
  const s = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return formatDay(iso);
}

const dayKey = (d) => new Date(d.getTime() + 330 * 60000).toISOString().slice(0, 10); // IST calendar day

// How a lead's follow-up date reads on a card: { tone: 'overdue' | 'today' | 'upcoming' | null, label }
export function followUpState(lead, now = new Date()) {
  if (!lead.follow_up_at) return { tone: null, label: '' };
  const due = new Date(lead.follow_up_at);
  const diff = Math.round((Date.parse(`${dayKey(now)}T00:00:00Z`) - Date.parse(`${dayKey(due)}T00:00:00Z`)) / 86400000);
  if (diff > 0) return { tone: 'overdue', label: `${diff}d overdue` };
  if (diff === 0) return { tone: 'today', label: 'Follow up today' };
  return { tone: 'upcoming', label: `Follow up ${due.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}` };
}

// Changes made in the drawer are kept as timestamped patches and laid over
// whatever list is on screen. A patch only applies to data fetched BEFORE it was
// made, so a later refresh (which already contains the change, or a teammate's
// newer one) is never overwritten by a stale local copy.
export function mergePatch(lead, patch, fetchedAt = 0) {
  if (!patch || !(patch.__ts > fetchedAt)) return lead;
  const { __ts, ...rest } = patch; // eslint-disable-line no-unused-vars
  return { ...lead, ...rest };
}

export const initials = (name = '') =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';

// ---------- reply templates ----------
// Placeholders: {name} {requirement} {sender}. Everything is editable in the
// composer before sending.
export const REPLY_TEMPLATES = [
  {
    key: 'first',
    label: 'First reply',
    subject: 'Re: your requirement - Orian Teleservices',
    body:
      "Hi {name},\n\nThanks for getting in touch with Orian Teleservices. I've read your requirement{requirement} and would like to understand a little more so we can recommend the right setup.\n\n1. Roughly how many messages do you plan to send each month?\n2. Is your DLT registration (entity, sender ID and templates) already done?\n3. What is a good time for a short call?\n\nRegards,\n{sender}\nOrian Teleservices",
  },
  {
    key: 'quote',
    label: 'Quote follow-up',
    subject: 'Following up on our proposal - Orian Teleservices',
    body:
      "Hi {name},\n\nI wanted to follow up on the proposal we shared. Happy to walk you through it on a quick call, or adjust it to fit your volumes and timelines.\n\nIs there anything you would like me to clarify?\n\nRegards,\n{sender}\nOrian Teleservices",
  },
  {
    key: 'details',
    label: 'Need more details',
    subject: 'A few details to prepare your quote - Orian Teleservices',
    body:
      "Hi {name},\n\nThank you for your interest. To prepare an accurate quote I need a few details:\n\n- Type of messages (OTP, transactional, promotional)\n- Expected monthly volume\n- Your company name and website\n\nReply to this email with these and I will get back to you quickly.\n\nRegards,\n{sender}\nOrian Teleservices",
  },
  {
    key: 'decline',
    label: 'Not a fit',
    subject: 'Your enquiry - Orian Teleservices',
    body:
      "Hi {name},\n\nThank you for reaching out to Orian Teleservices. After reviewing your requirement{requirement}, it is not something we can support well at the moment, and I would rather tell you that now than waste your time.\n\nIf your needs change, we would be glad to hear from you again.\n\nRegards,\n{sender}\nOrian Teleservices",
  },
];

export function fillTemplate(text, lead, sender) {
  return text
    .replaceAll('{name}', (lead.name || '').split(' ')[0] || 'there')
    .replaceAll('{requirement}', lead.requirement_type ? ` about ${lead.requirement_type}` : '')
    .replaceAll('{sender}', sender || 'The Orian team');
}
