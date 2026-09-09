import { requireCron } from '../_lib/cron.js';
import { requireSupabase } from '../_lib/supabase.js';

const RETENTION_DAYS = 90;

// Scheduled in vercel.json to run weekly. Calls the purge_old_visits() SQL
// function (see db/migrations/002_enhancements.sql) rather than doing the
// delete here, so the retention window lives in one place (the DB) and this
// endpoint stays a thin trigger.
export default requireCron(async (req, res) => {
  let supabase;
  try {
    supabase = requireSupabase();
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Server is not configured.' });
  }

  const [visitsResult, loginEventsResult] = await Promise.all([
    supabase.rpc('purge_old_visits', { retention_days: RETENTION_DAYS }),
    supabase.rpc('purge_old_login_events', { retention_days: RETENTION_DAYS }),
  ]);

  if (visitsResult.error || loginEventsResult.error) {
    console.error('Log cleanup failed:', visitsResult.error?.message || loginEventsResult.error?.message);
    return res.status(500).json({ error: 'Cleanup failed.' });
  }

  console.log(
    `Log cleanup: purged ${visitsResult.data} visit row(s) and ${loginEventsResult.data} login_events row(s) older than ${RETENTION_DAYS} days.`
  );
  return res.status(200).json({
    ok: true,
    deletedVisits: visitsResult.data,
    deletedLoginEvents: loginEventsResult.data,
    retentionDays: RETENTION_DAYS,
  });
});
