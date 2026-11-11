import { requireAdmin } from '../auth.js';
import { requireSupabase } from '../supabase.js';
import { isMissingSchema, sendMigrationRequired } from '../schema-error.js';

const PAGE_SIZE = 40;
const GROUPS = ['lead', 'announcement', 'document', 'team', 'account', 'security', 'system'];

// GET ?page=&group=&adminId= -> the admin activity log, newest first.
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

  const page = Math.max(parseInt(req.query?.page, 10) || 1, 1);
  const from = (page - 1) * PAGE_SIZE;
  const { group, adminId } = req.query || {};

  let query = supabase
    .from('audit_log')
    .select('id, admin_id, admin_name, action, target_type, target_id, detail, ip, created_at', { count: 'exact' });
  if (group && GROUPS.includes(group)) query = query.like('action', `${group}.%`);
  if (adminId) query = adminId === 'system' ? query.is('admin_id', null) : query.eq('admin_id', adminId);

  const { data, error, count } = await query.order('created_at', { ascending: false }).range(from, from + PAGE_SIZE - 1);
  if (error) {
    if (isMissingSchema(error)) return sendMigrationRequired(res);
    console.error('Failed to load activity log:', error.message);
    return res.status(500).json({ error: 'Could not load the activity log.' });
  }
  return res.status(200).json({ entries: data, total: count || 0, page, pageSize: PAGE_SIZE });
});
