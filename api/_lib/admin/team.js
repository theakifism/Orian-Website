import { requireAdmin } from '../auth.js';
import { requireSupabase } from '../supabase.js';

// Read-only list of teammates, used to populate the "Assign to" dropdown on
// the Requests table. Deliberately excludes password_hash.
export default requireAdmin(async (req, res) => {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let supabase;
  try {
    supabase = requireSupabase();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server is not configured.' });
  }

  const { data, error } = await supabase
    .from('admins')
    .select('id, name, email, role')
    .order('name', { ascending: true });

  if (error) {
    console.error('Failed to load team:', error.message);
    return res.status(500).json({ error: 'Could not load team members.' });
  }

  return res.status(200).json({ admins: data });
});
