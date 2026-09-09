-- Run this once in the Supabase SQL Editor (Project -> SQL Editor -> New query).
-- Safe to re-run: every statement is guarded with IF NOT EXISTS.

create extension if not exists pgcrypto;

-- Every page load from the public site logs one row here.
create table if not exists visits (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,        -- random id stored in a first-party cookie
  ip text,                         -- best-effort client IP (see api/_lib/ip.js)
  user_agent text,
  path text,
  referrer text,
  created_at timestamptz not null default now()
);

create index if not exists visits_visitor_id_idx on visits (visitor_id);
create index if not exists visits_created_at_idx on visits (created_at desc);

-- Special Requirement form submissions.
create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  contact text not null,
  company text,
  requirement_type text,
  message text not null,
  status text not null default 'new',   -- new | contacted | closed
  client_email_sent boolean not null default false,
  team_email_sent boolean not null default false,
  ip text,
  created_at timestamptz not null default now()
);

create index if not exists requests_created_at_idx on requests (created_at desc);
create index if not exists requests_status_idx on requests (status);

-- Employee accounts for the admin panel. No public signup — see scripts/create-admin.js.
create table if not exists admins (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'employee',  -- employee | superadmin
  created_at timestamptz not null default now()
);

-- One row per unique visitor_id, with their visit count and most recent IP.
-- The admin panel's Visitors table reads from this directly instead of
-- pulling every raw visit row and aggregating in JavaScript.
create or replace view visitor_stats as
select
  visitor_id,
  count(*) as visit_count,
  count(distinct ip) as distinct_ip_count,
  (array_agg(ip order by created_at desc))[1] as last_ip,
  min(created_at) as first_seen,
  max(created_at) as last_seen
from visits
group by visitor_id;

-- Row Level Security: lock every table down by default. The backend talks to
-- Supabase using the service_role key, which bypasses RLS entirely, so the
-- public/anon key (if it were ever used) cannot read or write anything here.
alter table visits enable row level security;
alter table requests enable row level security;
alter table admins enable row level security;
