-- Migration 007: role enforcement + closing the anon/authenticated exposure
-- on internal views and functions. Run once in the Supabase SQL Editor.
-- Safe to re-run.
--
-- Context: the app only ever talks to Supabase with the service_role key
-- (server-side), which bypasses RLS and schema grants entirely, and the
-- site never ships a Supabase anon key to the browser — so the real-world
-- exposure this closes is narrow. It's still worth closing: PostgREST
-- grants anon/authenticated SELECT on public views and EXECUTE on public
-- functions by default, and neither role should be able to touch these
-- even if a key were ever exposed some other way.

-- ============================================================================
-- 1. Formalize admin roles: 'employee' | 'superadmin'. Matches the role
--    comment already on the admins table. Existing rows are already
--    'employee' by default, so this is safe to add without a backfill.
--    'superadmin' can unlock accounts and change roles (see
--    api/_lib/admin/team-manage.js); 'employee' cannot.
-- ============================================================================
alter table admins drop constraint if exists admins_role_check;
alter table admins add constraint admins_role_check check (role in ('employee', 'superadmin'));

-- ============================================================================
-- 2. rate_limits had no RLS at all (every other table does). service_role
--    still bypasses this, so nothing about check_rate_limit()'s own
--    behavior changes -- this only blocks the anon/authenticated roles.
-- ============================================================================
alter table rate_limits enable row level security;

-- ============================================================================
-- 3. Revoke the default anon/authenticated grants on the internal view and
--    SECURITY DEFINER functions. `revoke ... from public` covers both roles
--    (they inherit from PUBLIC in Postgres) in one statement.
-- ============================================================================
revoke all on visitor_stats from public;
revoke all on function check_rate_limit(text, int, int) from public;
revoke all on function purge_old_visits(int) from public;
revoke all on function purge_old_login_events(int) from public;

-- ============================================================================
-- 4. Atomic session invalidation for logout (api/_lib/admin/logout.js).
--    Previously logout only cleared the browser's cookie -- the token
--    itself stayed valid (up to 8h) if a copy existed anywhere else.
-- ============================================================================
create or replace function increment_session_version(p_admin_id uuid)
returns void
language sql
security definer
as $$
  update admins set session_version = session_version + 1 where id = p_admin_id;
$$;

revoke all on function increment_session_version(uuid) from public;
