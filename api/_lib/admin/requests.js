import { requireAdmin } from '../auth.js';
import { requireSupabase } from '../supabase.js';
import { bucketDailyCounts, daysAgoIso } from '../dates.js';

const PAGE_SIZE = 50;
const SPARKLINE_DAYS = 14;
const VALID_STATUSES = ['new', 'contacted', 'closed'];
const MAX_NOTE_LEN = 1000;

// Escapes the special characters PostgREST's `.ilike.` filter treats as
// wildcards/separators, so a search like "50% off" or "a,b" can't break the
// query or accidentally match everything.
function escapeIlike(value) {
  return value.replace(/[%_,()]/g, (c) => `\\${c}`);
}

export default requireAdmin(async (req, res) => {
  let supabase;
  try {
    supabase = requireSupabase();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server is not configured.' });
  }

  if (req.method === 'GET') {
    const page = Math.max(parseInt(req.query?.page, 10) || 1, 1);
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { q, status, dateFrom, dateTo, assignedTo } = req.query || {};

    let query = supabase.from('requests').select('*', { count: 'exact' });

    // Free-text search across name + email.
    if (q && typeof q === 'string' && q.trim()) {
      const safe = escapeIlike(q.trim());
      query = query.or(`name.ilike.%${safe}%,email.ilike.%${safe}%`);
    }
    if (status && VALID_STATUSES.includes(status)) {
      query = query.eq('status', status);
    }
    if (dateFrom) {
      const d = new Date(dateFrom);
      if (!Number.isNaN(d.getTime())) query = query.gte('created_at', d.toISOString());
    }
    if (dateTo) {
      const d = new Date(dateTo);
      if (!Number.isNaN(d.getTime())) {
        d.setHours(23, 59, 59, 999);
        query = query.lte('created_at', d.toISOString());
      }
    }
    if (assignedTo) {
      if (assignedTo === 'unassigned') query = query.is('assigned_to', null);
      else query = query.eq('assigned_to', assignedTo);
    }

    const [listRes, newCountRes, dailyRowsRes] = await Promise.all([
      query.order('created_at', { ascending: false }).range(from, to),
      supabase.from('requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabase
        .from('requests')
        .select('created_at')
        .gte('created_at', daysAgoIso(SPARKLINE_DAYS - 1)),
    ]);

    const firstError = [listRes, newCountRes, dailyRowsRes].find((r) => r.error);
    if (firstError) {
      console.error('Failed to load requests:', firstError.error.message);
      return res.status(500).json({ error: 'Could not load requests.' });
    }

    return res.status(200).json({
      requests: listRes.data,
      total: listRes.count || 0,
      newCount: newCountRes.count || 0,
      dailyRequests: bucketDailyCounts(dailyRowsRes.data, SPARKLINE_DAYS),
      page,
      pageSize: PAGE_SIZE,
    });
  }

  if (req.method === 'PATCH') {
    const { id, ids, status, assignedTo, note } = req.body || {};
    const targetIds = Array.isArray(ids) ? ids : id ? [id] : [];

    if (targetIds.length === 0) {
      return res.status(400).json({ error: 'A valid id (or ids) is required.' });
    }

    // Status update (existing behavior, supports bulk).
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: 'A valid status is required.' });
      }
      const { error } = await supabase.from('requests').update({ status }).in('id', targetIds);
      if (error) {
        console.error('Failed to update request status:', error.message);
        return res.status(500).json({ error: 'Could not update the request(s).' });
      }
      return res.status(200).json({ ok: true, updated: targetIds.length });
    }

    // Lead assignment (Phase 2.2). assignedTo may be an admin id or null to unassign.
    if (assignedTo !== undefined) {
      const { error } = await supabase
        .from('requests')
        .update({ assigned_to: assignedTo || null })
        .in('id', targetIds);
      if (error) {
        console.error('Failed to assign request:', error.message);
        return res.status(500).json({ error: 'Could not assign the request(s).' });
      }
      return res.status(200).json({ ok: true, updated: targetIds.length });
    }

    // Internal lead note (Phase 1.2). Notes are appended, never overwritten.
    if (note !== undefined) {
      const text = String(note || '').trim().slice(0, MAX_NOTE_LEN);
      if (!text) {
        return res.status(400).json({ error: 'Note text is required.' });
      }
      if (targetIds.length !== 1) {
        return res.status(400).json({ error: 'Notes can only be added to one request at a time.' });
      }
      const { data: current, error: fetchError } = await supabase
        .from('requests')
        .select('notes')
        .eq('id', targetIds[0])
        .single();
      if (fetchError) {
        console.error('Failed to load request for note append:', fetchError.message);
        return res.status(500).json({ error: 'Could not add the note.' });
      }
      const nextNotes = [
        ...(Array.isArray(current.notes) ? current.notes : []),
        {
          text,
          author: req.admin?.name || req.admin?.email || 'Unknown',
          at: new Date().toISOString(),
        },
      ];
      const { error: updateError } = await supabase
        .from('requests')
        .update({ notes: nextNotes })
        .eq('id', targetIds[0]);
      if (updateError) {
        console.error('Failed to save note:', updateError.message);
        return res.status(500).json({ error: 'Could not add the note.' });
      }
      return res.status(200).json({ ok: true, notes: nextNotes });
    }

    return res.status(400).json({ error: 'Nothing to update — provide status, assignedTo, or note.' });
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).json({ error: 'Method not allowed' });
});
