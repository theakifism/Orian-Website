import { requireSupabase } from './_lib/supabase.js';

const BUCKET = 'documents';

// Public: lists downloadable documents with their public storage URL.
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
    return res.status(200).json({ documents: [] });
  }

  const { data, error } = await supabase
    .from('documents')
    .select('id, title, description, category, file_path, file_size_bytes, uploaded_at')
    .order('uploaded_at', { ascending: false });

  if (error) {
    console.error('Failed to load documents:', error.message);
    return res.status(200).json({ documents: [] });
  }

  const documents = data.map((doc) => ({
    id: doc.id,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    sizeBytes: doc.file_size_bytes,
    uploadedAt: doc.uploaded_at,
    url: supabase.storage.from(BUCKET).getPublicUrl(doc.file_path).data.publicUrl,
  }));

  return res.status(200).json({ documents });
}
