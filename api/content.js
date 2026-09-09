import { requireSupabase } from './_lib/supabase.js';

// Public: returns every editable content override as a flat { key: value }
// map. The frontend merges this over its own hardcoded defaults, so a
// missing key (nothing set yet, or this table doesn't exist) never breaks
// the site - it just means the hardcoded default text is shown.
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
    return res.status(200).json({ content: {} });
  }

  const { data, error } = await supabase.from('site_content').select('content_key, content_value');
  if (error) {
    console.error('Failed to load site content:', error.message);
    return res.status(200).json({ content: {} });
  }

  const content = {};
  for (const row of data) {
    content[row.content_key] = row.content_value;
  }
  return res.status(200).json({ content });
}
