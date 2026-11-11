import { getClientIp } from './ip.js';

// Writes one row to the admin activity log. Best-effort by design: a logging
// problem (or the migration not having been run yet) must never fail the
// action the admin was actually trying to do.
export async function logAudit(supabase, req, action, { targetType = null, targetId = null, detail = null } = {}) {
  try {
    const { error } = await supabase.from('audit_log').insert({
      admin_id: req?.admin?.sub || null,
      admin_name: req?.admin?.name || (req?.admin ? req.admin.email : 'system'),
      action,
      target_type: targetType,
      target_id: targetId ? String(targetId) : null,
      detail: detail ? String(detail).slice(0, 500) : null,
      ip: req ? getClientIp(req) : null,
    });
    if (error) console.error('Audit log write failed:', error.message);
  } catch (err) {
    console.error('Audit log write failed:', err.message || err);
  }
}
