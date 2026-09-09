-- Migration 005: Single-device sessions + failed-login lockout + audit log.
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- Safe to re-run: guarded with IF NOT EXISTS / OR REPLACE.

-- ============================================================================
-- 1. Columns on admins
-- ============================================================================
-- session_version: bumped by +1 every time this admin logs in successfully
-- (or changes their password). The JWT issued at login carries the version
-- it was signed with; requireAdmin() compares that against the current DB
-- value on every request. Logging in on a second device bumps this number,
-- which instantly invalidates the first device's token on its very next
-- request -- that's the entire "only one device at a time" mechanism, no
-- separate sessions table needed.
alter table admins add column if not exists session_version int not null default 0;

-- failed_attempts / locked_until: a specific account auto-locks for 30
-- minutes after 5 consecutive wrong passwords, then unlocks itself -- see
-- note in api/admin/login.js about why this is time-limited rather than
-- permanent.
alter table admins add column if not exists failed_attempts int not null default 0;
alter table admins add column if not exists locked_until timestamptz;

-- Informational only -- lets Settings/future UI show "last signed in from
-- ...". Not required for the security logic itself.
alter table admins add column if not exists last_login_at timestamptz;
alter table admins add column if not exists last_login_ip text;
alter table admins add column if not exists last_login_device text;

-- ============================================================================
-- 2. login_events: one row per sign-in attempt (success AND failure), with
--    the IP/region/device of whoever made it. This is what the lockout
--    email alert is built from, and doubles as a forensic log if you ever
--    need to check "who tried to get in, and from where".
-- ============================================================================
create table if not exists login_events (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references admins(id) on delete set null,
  email_attempted text not null,
  success boolean not null,
  ip text,
  country text,
  region text,
  city text,
  device text,
  browser text,
  os text,
  created_at timestamptz not null default now()
);

create index if not exists login_events_admin_id_idx on login_events (admin_id, created_at desc);

alter table login_events enable row level security;

-- ============================================================================
-- 3. Retention: keep login_events from growing forever, same pattern as
--    purge_old_visits() in 002_enhancements.sql. Wired into the existing
--    weekly cleanup cron (api/cron/cleanup-logs.js).
-- ============================================================================
create or replace function purge_old_login_events(retention_days int default 90)
returns int
language plpgsql
security definer
as $$
declare
  deleted_count int;
begin
  delete from login_events
  where created_at < now() - (retention_days || ' days')::interval;
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;
