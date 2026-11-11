// True when a Supabase error means "this table/column does not exist" - i.e.
// db/008_admin_toolkit.sql has not been run yet. Lets the new features degrade
// gracefully (and the public form keep working) instead of failing with a 500.
export function isMissingSchema(error) {
  if (!error) return false;
  const code = String(error.code || '');
  return (
    ['42P01', '42703', 'PGRST204', 'PGRST205'].includes(code) ||
    /does not exist|schema cache|could not find/i.test(error.message || '')
  );
}

export const MIGRATION_MESSAGE =
  'The database needs one update for this feature. Run db/008_admin_toolkit.sql in the Supabase SQL editor, then refresh.';

// Sends the standard "run the migration" response used by the admin endpoints.
export function sendMigrationRequired(res) {
  return res.status(503).json({ error: 'migration_required', message: MIGRATION_MESSAGE });
}
