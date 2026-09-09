import { requireAdmin } from '../auth.js';
import { requireSupabase } from '../supabase.js';

// Every editable field the admin UI shows, with a fallback label and the
// default text baked into the corresponding component. Adding a new
// editable field to the site means: add a row here, and read it via
// useSiteContent() in the component (falling back to its current hardcoded
// text) - no other wiring needed.
const KNOWN_FIELDS = [
  { key: 'hero_headline', label: 'Hero headline', default: 'Launch your first campaign in minutes with Orian' },
  {
    key: 'hero_subheadline',
    label: 'Hero subheadline',
    default:
      'Bulk SMS, Voice Call Blasting, DLT assistance, and WhatsApp Business API built by telecom veterans with 15+ years in the industry — connected to 1,200+ operators across 180 countries.',
  },
  { key: 'contact_phone_1', label: 'Contact phone 1', default: '+91 95525 56786' },
  { key: 'contact_phone_2', label: 'Contact phone 2', default: '+91 95525 01029' },
  { key: 'contact_phone_3', label: 'Contact phone 3', default: '+91 98500 87786' },
  { key: 'contact_email_1', label: 'Contact email 1', default: 'orianteleservices@gmail.com' },
  { key: 'contact_email_2', label: 'Contact email 2', default: 'support@orian.in' },
  { key: 'contact_address', label: 'Office address line', default: 'Orian HQ • Nagpur, India' },
];

export default requireAdmin(async (req, res) => {
  let supabase;
  try {
    supabase = requireSupabase();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server is not configured.' });
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase.from('site_content').select('content_key, content_value');
    if (error) {
      console.error('Failed to load site content:', error.message);
      return res.status(500).json({ error: 'Could not load content.' });
    }
    const overrides = Object.fromEntries(data.map((row) => [row.content_key, row.content_value]));
    const fields = KNOWN_FIELDS.map((f) => ({
      ...f,
      value: overrides[f.key] ?? f.default,
      isOverridden: f.key in overrides,
    }));
    return res.status(200).json({ fields });
  }

  if (req.method === 'PUT') {
    const { key, value } = req.body || {};
    const known = KNOWN_FIELDS.find((f) => f.key === key);
    if (!known) {
      return res.status(400).json({ error: 'Unknown content key.' });
    }
    if (typeof value !== 'string' || value.length === 0 || value.length > 2000) {
      return res.status(400).json({ error: 'Value must be 1-2000 characters.' });
    }
    const { error } = await supabase
      .from('site_content')
      .upsert({ content_key: key, content_value: value, updated_by: req.admin.sub, updated_at: new Date().toISOString() });
    if (error) {
      console.error('Failed to save content:', error.message);
      return res.status(500).json({ error: 'Could not save content.' });
    }
    return res.status(200).json({ ok: true });
  }

  if (req.method === 'DELETE') {
    // Revert a field back to its hardcoded default by removing the override.
    const { key } = req.body || {};
    if (!KNOWN_FIELDS.find((f) => f.key === key)) {
      return res.status(400).json({ error: 'Unknown content key.' });
    }
    const { error } = await supabase.from('site_content').delete().eq('content_key', key);
    if (error) {
      console.error('Failed to reset content:', error.message);
      return res.status(500).json({ error: 'Could not reset content.' });
    }
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
});
