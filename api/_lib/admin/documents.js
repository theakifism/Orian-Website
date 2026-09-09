import { requireAdmin } from '../auth.js';
import { requireSupabase } from '../supabase.js';

const BUCKET = 'documents';
// Vercel's serverless functions cap request bodies at ~4.5MB. Since the
// file arrives as base64 (~33% larger than the original), keep the actual
// uploaded file comfortably under that after encoding.
const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4MB original file size
const ALLOWED_TYPES = new Set(['application/pdf']);

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
      .from('documents')
      .select('id, title, description, category, file_path, file_size_bytes, uploaded_at')
      .order('uploaded_at', { ascending: false });
    if (error) {
      console.error('Failed to load documents:', error.message);
      return res.status(500).json({ error: 'Could not load documents.' });
    }
    return res.status(200).json({ documents: data });
  }

  if (req.method === 'POST') {
    const { title, description, category, filename, fileDataBase64, mimeType } = req.body || {};

    const trimmedTitle = (title || '').trim();
    if (!trimmedTitle || trimmedTitle.length > 200) {
      return res.status(400).json({ error: 'Title must be 1-200 characters.' });
    }
    if (!ALLOWED_TYPES.has(mimeType)) {
      return res.status(400).json({ error: 'Only PDF files are allowed.' });
    }
    if (!fileDataBase64 || typeof fileDataBase64 !== 'string') {
      return res.status(400).json({ error: 'No file data received.' });
    }

    let buffer;
    try {
      buffer = Buffer.from(fileDataBase64, 'base64');
    } catch {
      return res.status(400).json({ error: 'Invalid file data.' });
    }
    if (buffer.length === 0 || buffer.length > MAX_FILE_BYTES) {
      return res.status(400).json({ error: `File must be under ${Math.floor(MAX_FILE_BYTES / (1024 * 1024))}MB.` });
    }

    const safeName = (filename || 'document.pdf').replace(/[^a-zA-Z0-9._-]/g, '_');
    const path = `${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, buffer, {
      contentType: 'application/pdf',
      upsert: false,
    });
    if (uploadError) {
      console.error('Failed to upload document:', uploadError.message);
      return res.status(500).json({ error: 'Could not upload the file.' });
    }

    const { data, error: insertError } = await supabase
      .from('documents')
      .insert({
        title: trimmedTitle,
        description: (description || '').trim().slice(0, 1000) || null,
        category: (category || '').trim().slice(0, 100) || null,
        file_path: path,
        file_size_bytes: buffer.length,
        uploaded_by: req.admin.sub,
      })
      .select('id, title, description, category, file_path, file_size_bytes, uploaded_at')
      .single();

    if (insertError) {
      console.error('Failed to save document metadata:', insertError.message);
      // Best-effort cleanup so we don't leave an orphaned file in storage.
      await supabase.storage.from(BUCKET).remove([path]);
      return res.status(500).json({ error: 'Could not save the document.' });
    }

    return res.status(200).json({ document: data });
  }

  if (req.method === 'DELETE') {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: 'id is required.' });

    const { data: doc, error: fetchError } = await supabase
      .from('documents')
      .select('file_path')
      .eq('id', id)
      .maybeSingle();
    if (fetchError || !doc) {
      return res.status(404).json({ error: 'Document not found.' });
    }

    await supabase.storage.from(BUCKET).remove([doc.file_path]);
    const { error: deleteError } = await supabase.from('documents').delete().eq('id', id);
    if (deleteError) {
      console.error('Failed to delete document record:', deleteError.message);
      return res.status(500).json({ error: 'Could not delete the document.' });
    }
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
});
