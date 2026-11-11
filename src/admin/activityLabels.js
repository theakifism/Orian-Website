// Plain-English names for the action codes written to the activity log
// (api/_lib/audit.js). Unknown codes fall back to the raw code.
export const ACTION_LABELS = {
  'lead.status': 'Changed a lead’s stage',
  'lead.assign': 'Assigned a lead',
  'lead.note': 'Added a note',
  'lead.followup': 'Updated a follow-up',
  'lead.reply': 'Emailed a lead',
  'announcement.create': 'Published an announcement',
  'announcement.toggle': 'Switched an announcement on/off',
  'announcement.delete': 'Deleted an announcement',
  'document.upload': 'Uploaded a document',
  'document.delete': 'Deleted a document',
  'team.unlock': 'Unlocked an account',
  'team.role': 'Changed a role',
  'account.password': 'Changed their password',
  'security.block': 'Added to the blocklist',
  'security.unblock': 'Removed from the blocklist',
  'system.daily-run': 'Daily job ran',
};

export const actionLabel = (code) => ACTION_LABELS[code] || code;

export const ACTION_GROUPS = [
  { key: '', label: 'Everything' },
  { key: 'lead', label: 'Leads' },
  { key: 'announcement', label: 'Announcements' },
  { key: 'document', label: 'Documents' },
  { key: 'team', label: 'Team' },
  { key: 'account', label: 'Accounts' },
  { key: 'security', label: 'Security' },
  { key: 'system', label: 'System' },
];
