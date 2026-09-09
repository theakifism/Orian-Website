-- Migration 002: Requests search/notes/assignment + richer visitor fingerprinting.
-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / OR REPLACE / DROP VIEW.

-- ============================================================================
-- 1. Requests: internal notes + lead assignment
-- ============================================================================
alter table requests add column if not exists notes jsonb not null default '[]'::jsonb;
alter table requests add column if not exists assigned_to uuid references admins(id) on delete set null;

create index if not exists requests_assigned_to_idx on requests (assigned_to);

-- Speeds up ILIKE name/email search from the admin Requests table.
create extension if not exists pg_trgm;
create index if not exists requests_name_email_idx on requests using gin (
  (name || ' ' || email) gin_trgm_ops
);

-- ============================================================================
-- 2. Visits: device + country fingerprinting (no third-party IP lookups —
--    country/city come from Vercel's own built-in geo headers, and
--    device/browser/OS are parsed from the User-Agent string we already
--    collect. See api/_lib/device.js and api/_lib/ip.js.)
-- ============================================================================
alter table visits add column if not exists country text;
alter table visits add column if not exists city text;
alter table visits add column if not exists device text;   -- e.g. "iPhone", "Windows PC"
alter table visits add column if not exists browser text;  -- e.g. "Chrome 128"
alter table visits add column if not exists os text;       -- e.g. "iOS 17"

create index if not exists visits_country_idx on visits (country);

-- ============================================================================
-- 3. Rebuild visitor_stats to surface full IP, device, browser, OS and
--    country for each visitor's most recent visit.
-- ============================================================================
-- Drop the existing view first to allow changes to output column schemas
drop view if exists visitor_stats cascade;

create view visitor_stats as
select
  visitor_id,
  count(*) as visit_count,
  count(distinct ip) as distinct_ip_count,
  (array_agg(ip order by created_at desc))[1] as last_ip,
  (array_agg(country order by created_at desc))[1] as last_country,
  (array_agg(city order by created_at desc))[1] as last_city,
  (array_agg(device order by created_at desc))[1] as last_device,
  (array_agg(browser order by created_at desc))[1] as last_browser,
  (array_agg(os order by created_at desc))[1] as last_os,
  (array_agg(path order by created_at desc))[1] as last_path,
  min(created_at) as first_seen,
  max(created_at) as last_seen
from visits
group by visitor_id;

-- ============================================================================
-- 4. Automated log cleanup (Phase 3.1): purge visit logs older than 90 days.
--    Supabase's free tier does not run arbitrary cron itself, so this is
--    invoked by the Vercel Cron job in api/cron/cleanup-logs.js — this
--    function is just the safe, reusable SQL it calls via RPC.
-- ============================================================================
create or replace function purge_old_visits(retention_days int default 90)
returns int
language plpgsql
security definer
as $$
declare
  deleted_count int;
begin
  delete from visits
  where created_at < now() - (retention_days || ' days')::interval;
  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;