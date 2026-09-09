import bcrypt from 'bcryptjs';
import { requireAdmin, signAdminToken, setAdminSessionCookie } from '../auth.js';
import { requireSupabase } from '../supabase.js';

const MIN_LENGTH = 10;

export default requireAdmin(async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new password are required.' });
  }
  if (String(newPassword).length < MIN_LENGTH) {
    return res.status(400).json({ error: `New password must be at least ${MIN_LENGTH} characters.` });
  }
  if (newPassword === currentPassword) {
    return res.status(400).json({ error: 'New password must be different from your current password.' });
  }

  let supabase;
  try {
    supabase = requireSupabase();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server is not configured.' });
  }

  const { data: admin, error } = await supabase
    .from('admins')
    .select('id, password_hash, session_version')
    .eq('id', req.admin.sub)
    .single();

  if (error || !admin) {
    console.error('Failed to load admin for password change:', error?.message);
    return res.status(500).json({ error: 'Could not verify your account.' });
  }

  const currentOk = await bcrypt.compare(currentPassword, admin.password_hash);
  if (!currentOk) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }

  // Bumping session_version here -- same mechanism used at login -- signs
  // out any other device signed in as this admin the moment a password is
  // changed (e.g. because that other device was the one that got
  // compromised). We immediately reissue a fresh token below with the new
  // version so THIS device, the one making the change, stays logged in.
  const password_hash = await bcrypt.hash(newPassword, 12);
  const newSessionVersion = (admin.session_version || 0) + 1;

  const { error: updateError } = await supabase
    .from('admins')
    .update({ password_hash, session_version: newSessionVersion })
    .eq('id', admin.id);

  if (updateError) {
    console.error('Failed to update password:', updateError.message);
    return res.status(500).json({ error: 'Could not update your password.' });
  }

  const token = signAdminToken({ id: req.admin.sub, email: req.admin.email, name: req.admin.name, role: req.admin.role }, newSessionVersion);
  setAdminSessionCookie(res, token);

  return res.status(200).json({ ok: true });
});
