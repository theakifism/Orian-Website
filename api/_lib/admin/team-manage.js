import { requireAdmin } from '../auth.js';
import { requireSupabase } from '../supabase.js';
import { logAudit } from '../audit.js';

const VALID_ROLES = ['employee', 'superadmin'];

// GET  -> full team list with role/lock/last-login info (any signed-in admin
//   can see this — same as team.js's existing "Assign to" list, just richer).
// PATCH body { id, action: 'unlock' } -> clears a locked account. superadmin only.
// PATCH body { id, role } -> changes a teammate's role. superadmin only.
// Both mutating actions require the CALLER's own role to be 'superadmin' —
// checked fresh from the DB via req.admin (requireAdmin always reads that
// live, never trusts the JWT's copy — see api/_lib/auth.js).
export default requireAdmin(async (req, res) => {
  let supabase;
  try {
    supabase = requireSupabase();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server is not configured.' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('admins')
      .select('id, name, email, role, locked_until, failed_attempts, last_login_at, last_login_ip, last_login_device, created_at')
      .order('name', { ascending: true });
    if (error) {
      console.error('Failed to load team:', error.message);
      return res.status(500).json({ error: 'Could not load team members.' });
    }
    return res.status(200).json({ admins: data, isSuperadmin: req.admin.role === 'superadmin' });
  }

  if (req.method === 'PATCH') {
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({ error: 'Only a superadmin can manage the team.' });
    }

    const { id, action, role } = req.body || {};
    if (!id) return res.status(400).json({ error: 'id is required.' });

    if (action === 'unlock') {
      const { error } = await supabase
        .from('admins')
        .update({ locked_until: null, failed_attempts: 0 })
        .eq('id', id);
      if (error) {
        console.error('Failed to unlock admin:', error.message);
        return res.status(500).json({ error: 'Could not unlock that account.' });
      }
      await logAudit(supabase, req, 'team.unlock', { targetType: 'admin', targetId: id, detail: 'Unlocked an account' });
      return res.status(200).json({ ok: true });
    }

    if (role !== undefined) {
      if (!VALID_ROLES.includes(role)) {
        return res.status(400).json({ error: 'Invalid role.' });
      }
      // Don't let the last superadmin demote themselves (or be demoted) —
      // that would permanently lock the team out of team management with
      // no way back in short of a direct database edit.
      if (role !== 'superadmin') {
        const { count, error: countErr } = await supabase
          .from('admins')
          .select('id', { count: 'exact', head: true })
          .eq('role', 'superadmin');
        if (countErr) {
          console.error('Failed to check superadmin count:', countErr.message);
          return res.status(500).json({ error: 'Could not update that role.' });
        }
        const { data: target } = await supabase.from('admins').select('role').eq('id', id).maybeSingle();
        if (target?.role === 'superadmin' && (count || 0) <= 1) {
          return res.status(400).json({ error: 'At least one superadmin is required — promote someone else first.' });
        }
      }

      const { error } = await supabase.from('admins').update({ role }).eq('id', id);
      if (error) {
        console.error('Failed to update role:', error.message);
        return res.status(500).json({ error: 'Could not update that role.' });
      }
      await logAudit(supabase, req, 'team.role', { targetType: 'admin', targetId: id, detail: `Role set to ${role}` });
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'Provide action: "unlock" or a role to set.' });
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).json({ error: 'Method not allowed' });
});
