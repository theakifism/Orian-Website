import { requireAdmin } from '../auth.js';
import { requireSupabase } from '../supabase.js';
import { logAudit } from '../audit.js';

const BUCKET = 'documents';
// Vercel's serverless functions cap request bodies at ~4.5MB. The file
// arrives base64-encoded (~33% larger than the original) inside a JSON
// body that also carries the title/description/etc, so the SAFE original
// file size is well under 4.5MB, not equal to it. 4MB in was already
// failing for files as small as ~3.3MB (base64 alone pushes them over the
// limit) with an opaque platform-level error, not this handler's own
// message. 3MB leaves comfortable headroom.
const MAX_FILE_BYTES = 3 * 1024 * 1024; // 3MB original file size
const ALLOWED_TYPES = new Set(['application/pdf']);
const PDF_MAGIC = Buffer.from('%PDF-');

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
    // The browser-declared mimeType above is just a client-supplied label —
    // confirm the bytes actually start with a PDF header before trusting it.
    if (!buffer.subarray(0, 5).equals(PDF_MAGIC)) {
      return res.status(400).json({ error: 'That file does not look like a valid PDF.' });
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

    await logAudit(supabase, req, 'document.upload', { targetType: 'document', targetId: data.id, detail: data.title });
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
    await logAudit(supabase, req, 'document.delete', { targetType: 'document', targetId: id });
    return res.status(200).json({ ok: true });
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
});
