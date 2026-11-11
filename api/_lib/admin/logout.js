import { requireAdmin, clearAdminSessionCookie } from '../auth.js';
import { requireSupabase } from '../supabase.js';

// Bumps session_version (same mechanism used at login/password-change) so
// the token this device was holding is rejected by requireAdmin() on its
// very next use -- not just removed from this browser. Without this, a
// copy of the cookie taken before logout (e.g. from a shared/compromised
// machine) would keep working for up to 8 hours after the user "logged out".
export default requireAdmin(async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = requireSupabase();
    await supabase.rpc('increment_session_version', { p_admin_id: req.admin.sub }).catch(async () => {
      // Fallback if the RPC (added in db/007_hardening.sql) hasn't been run
      // yet -- a plain read-then-write still gets the job done.
      const { data } = await supabase.from('admins').select('session_version').eq('id', req.admin.sub).maybeSingle();
      await supabase
        .from('admins')
        .update({ session_version: (data?.session_version || 0) + 1 })
        .eq('id', req.admin.sub);
    });
  } catch (err) {
    // Never let a logout fail outright over this -- clearing the cookie
    // below still logs this browser out either way.
    console.error('Failed to invalidate session on logout:', err.message);
  }

  clearAdminSessionCookie(res);
  return res.status(200).json({ ok: true });
});
