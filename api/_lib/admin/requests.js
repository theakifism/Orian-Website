import { requireAdmin } from '../auth.js';
import { requireSupabase } from '../supabase.js';
import { bucketDailyCounts, daysAgoIso } from '../dates.js';
import { logAudit } from '../audit.js';
import { isMissingSchema, sendMigrationRequired } from '../schema-error.js';
import { VALID_STATUSES, TERMINAL_STATUSES, parseFollowUp } from '../leads.js';

const PAGE_SIZE = 50;
const BOARD_LIMIT = 500;
const SPARKLINE_DAYS = 14;
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
    const { q, status, dateFrom, dateTo, assignedTo, view } = req.query || {};

    // One lead (the lead panel loads this so notes and emails are always fresh).
    if (req.query?.id) {
      const { data, error } = await supabase.from('requests').select('*').eq('id', String(req.query.id)).maybeSingle();
      if (error) {
        console.error('Failed to load request:', error.message);
        return res.status(500).json({ error: 'Could not load that lead.' });
      }
      if (!data) return res.status(404).json({ error: 'Lead not found.' });
      return res.status(200).json({ request: data });
    }

    // Search + assignee filters apply to both the table and the board.
    const withSharedFilters = (query) => {
      let out = query;
      if (q && typeof q === 'string' && q.trim()) {
        const safe = escapeIlike(q.trim());
        out = out.or(`name.ilike.%${safe}%,email.ilike.%${safe}%,company.ilike.%${safe}%`);
      }
      if (assignedTo) {
        out = assignedTo === 'unassigned' ? out.is('assigned_to', null) : out.eq('assigned_to', assignedTo);
      }
      return out;
    };

    // Board: every lead on one screen (newest first, capped), grouped client-side.
    if (view === 'board') {
      const { data, error, count } = await withSharedFilters(supabase.from('requests').select('*', { count: 'exact' }))
        .order('created_at', { ascending: false })
        .limit(BOARD_LIMIT);
      if (error) {
        console.error('Failed to load board:', error.message);
        return res.status(500).json({ error: 'Could not load the lead board.' });
      }
      return res.status(200).json({ requests: data, total: count || data.length, truncated: (count || 0) > BOARD_LIMIT });
    }

    const page = Math.max(parseInt(req.query?.page, 10) || 1, 1);
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = withSharedFilters(supabase.from('requests').select('*', { count: 'exact' }));
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

    const [listRes, newCountRes, dailyRowsRes] = await Promise.all([
      query.order('created_at', { ascending: false }).range(from, to),
      supabase.from('requests').select('id', { count: 'exact', head: true }).eq('status', 'new'),
      supabase
        .from('requests')
        .select('created_at')
        .gte('created_at', daysAgoIso(SPARKLINE_DAYS - 1))
        .range(0, 19999),
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
    const { id, ids, status, assignedTo, note, followUpAt } = req.body || {};
    const targetIds = Array.isArray(ids) ? ids.slice(0, 200) : id ? [id] : [];

    if (targetIds.length === 0) {
      return res.status(400).json({ error: 'A valid id (or ids) is required.' });
    }
    const targetLabel = targetIds.length === 1 ? targetIds[0] : `${targetIds.length} leads`;
    const now = new Date().toISOString();

    // Stage change (supports bulk). Counts as activity; finishing a lead
    // (won / lost / closed) also clears any scheduled follow-up.
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: 'A valid status is required.' });
      }
      const patch = { status, last_activity_at: now };
      if (TERMINAL_STATUSES.includes(status)) patch.follow_up_at = null;

      let { error } = await supabase.from('requests').update(patch).in('id', targetIds);
      if (error && isMissingSchema(error)) {
        // Migration 008 not run yet: still change the stage the old way.
        ({ error } = await supabase.from('requests').update({ status }).in('id', targetIds));
      }
      if (error) {
        console.error('Failed to update request status:', error.message);
        return res.status(500).json({ error: 'Could not update the request(s).' });
      }
      await logAudit(supabase, req, 'lead.status', { targetType: 'lead', targetId: targetLabel, detail: `Moved to ${status}` });
      return res.status(200).json({ ok: true, updated: targetIds.length });
    }

    // Lead assignment. assignedTo may be an admin id or null to unassign.
    if (assignedTo !== undefined) {
      const { error } = await supabase
        .from('requests')
        .update({ assigned_to: assignedTo || null })
        .in('id', targetIds);
      if (error) {
        console.error('Failed to assign request:', error.message);
        return res.status(500).json({ error: 'Could not assign the request(s).' });
      }
      await logAudit(supabase, req, 'lead.assign', { targetType: 'lead', targetId: targetLabel, detail: assignedTo ? 'Assigned' : 'Unassigned' });
      return res.status(200).json({ ok: true, updated: targetIds.length });
    }

    // Follow-up date (ISO string, or null to clear).
    if (followUpAt !== undefined) {
      const parsed = parseFollowUp(followUpAt);
      if (parsed.error) return res.status(400).json({ error: parsed.error });
      const { error } = await supabase.from('requests').update({ follow_up_at: parsed.value }).in('id', targetIds);
      if (error) {
        if (isMissingSchema(error)) return sendMigrationRequired(res);
        console.error('Failed to set follow-up:', error.message);
        return res.status(500).json({ error: 'Could not set the follow-up.' });
      }
      await logAudit(supabase, req, 'lead.followup', {
        targetType: 'lead', targetId: targetLabel,
        detail: parsed.value ? `Follow-up set for ${parsed.value.slice(0, 10)}` : 'Follow-up cleared',
      });
      return res.status(200).json({ ok: true, followUpAt: parsed.value });
    }

    // Internal lead note. Notes are appended, never overwritten.
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
          at: now,
        },
      ];
      let { error: updateError } = await supabase
        .from('requests')
        .update({ notes: nextNotes, last_activity_at: now })
        .eq('id', targetIds[0]);
      if (updateError && isMissingSchema(updateError)) {
        ({ error: updateError } = await supabase.from('requests').update({ notes: nextNotes }).eq('id', targetIds[0]));
      }
      if (updateError) {
        console.error('Failed to save note:', updateError.message);
        return res.status(500).json({ error: 'Could not add the note.' });
      }
      await logAudit(supabase, req, 'lead.note', { targetType: 'lead', targetId: targetIds[0], detail: 'Added a note' });
      return res.status(200).json({ ok: true, notes: nextNotes });
    }

    return res.status(400).json({ error: 'Nothing to update — provide status, assignedTo, followUpAt, or note.' });
  }

  res.setHeader('Allow', ['GET', 'PATCH']);
  return res.status(405).json({ error: 'Method not allowed' });
});
