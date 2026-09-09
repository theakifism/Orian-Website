import { requireSupabase } from './_lib/supabase.js';

// Public: returns the single most recent active announcement, or null.
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let supabase;
  try {
    supabase = requireSupabase();
  } catch (err) {
    console.error(err.message);
    return res.status(200).json({ announcement: null });
  }

  const { data, error } = await supabase
    .from('announcements')
    .select('id, message, emoji, created_at')
    .eq('active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Failed to load announcement:', error.message);
    return res.status(200).json({ announcement: null });
  }

  return res.status(200).json({ announcement: data || null });
}
