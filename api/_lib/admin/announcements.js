import { requireAdmin } from '../auth.js';
import { requireSupabase } from '../supabase.js';

const MAX_MESSAGE_LEN = 200;

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
      .from('announcements')
      .select('id, message, emoji, active, created_at')
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) {
      console.error('Failed to load announcements:', error.message);
      return res.status(500).json({ error: 'Could not load announcements.' });
    }
    return res.status(200).json({ announcements: data });
  }

  if (req.method === 'POST') {
    const { message, emoji } = req.body || {};
    const trimmed = (message || '').trim();
    if (!trimmed || trimmed.length > MAX_MESSAGE_LEN) {
      return res.status(400).json({ error: `Message must be 1-${MAX_MESSAGE_LEN} characters.` });
    }
    // Only one announcement is ever shown at a time - deactivate the rest
    // so the admin doesn't have to remember to turn old ones off.
    await supabase.from('announcements').update({ active: false }).eq('active', true);
    const { data, error } = await supabase
      .from('announcements')
      .insert({
        message: trimmed,
        emoji: (emoji || '').trim().slice(0, 8) || null,
        active: true,
        created_by: req.admin.sub,
      })
      .select('id, message, emoji, active, created_at')
      .single();
    if (error) {
      console.error('Failed to create announcement:', error.message);
      return res.status(500).json({ error: 'Could not create announcement.' });
    }
    return res.status(200).json({ announcement: data });
  }

  if (req.method === 'PATCH') {
    const { id, active } = req.body || {};
    if (!id || typeof active !== 'boolean') {
      return res.status(400).json({ error: 'id and active (boolean) are required.' });
    }
    const { error } = await supabase.from('announcements').update({ active }).eq('id', id);
    if (error) {
      console.error('Failed to update announcement:', error.message);
      return res.status(500).json({ error: 'Could not update announcement.' });
    }
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: 'id is required.' });
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete announcement:', error.message);
      return res.status(500).json({ error: 'Could not delete announcement.' });
    }
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
});
