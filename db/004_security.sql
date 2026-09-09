-- Migration 004: Shared, atomic rate limiting.
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- Safe to re-run: guarded with IF NOT EXISTS / OR REPLACE.
--
-- Why this exists: the admin login throttle previously lived in a plain
-- JS Map inside api/admin/login.js. That works on a single long-running
-- server, but Vercel serverless functions are ephemeral and often run as
-- multiple parallel instances — an attacker can simply keep hitting the
-- endpoint and land on a fresh instance with a reset counter. Moving the
-- counter into Postgres means every instance shares the same state.
--
-- One row per rate-limited "key" (e.g. "login-email:x@y.com" or
-- "visit-ip:1.2.3.4") — NOT one row per attempt — so this table stays tiny
-- forever and needs no cleanup job.

create table if not exists rate_limits (
  key text primary key,
  count int not null default 0,
  window_start timestamptz not null default now()
);

-- Atomically increments the counter for `p_key` and reports whether the
-- caller is still within `p_max` attempts inside the trailing
-- `p_window_seconds`. Doing the increment-and-check as one SQL statement
-- (not read-then-write from JS) is what makes this safe under concurrent
-- requests hitting the same key at the same time.
create or replace function check_rate_limit(p_key text, p_max int, p_window_seconds int)
returns boolean
language plpgsql
security definer
as $$
declare
  current_count int;
begin
  insert into rate_limits (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do update
    set count = case
          when rate_limits.window_start < now() - (p_window_seconds || ' seconds')::interval
            then 1
          else rate_limits.count + 1
        end,
        window_start = case
          when rate_limits.window_start < now() - (p_window_seconds || ' seconds')::interval
            then now()
          else rate_limits.window_start
        end
  returning count into current_count;

  return current_count <= p_max;
end;
$$;
