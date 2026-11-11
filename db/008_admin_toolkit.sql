-- Run once in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / OR REPLACE.
-- Adds what the new admin panel needs: lead pipeline stages + follow-ups,
-- lead source tracking, the activity log, the blocklist and spam-event log.

-- ---------- Lead pipeline ----------
alter table requests add column if not exists follow_up_at timestamptz;
alter table requests add column if not exists last_activity_at timestamptz not null default now();
alter table requests add column if not exists visitor_id text;        -- orian_visitor_id cookie at submit time
alter table requests add column if not exists source_path text;       -- first page that visitor opened
alter table requests add column if not exists source_referrer text;   -- where they came from

create index if not exists requests_follow_up_idx on requests (follow_up_at) where follow_up_at is not null;
create index if not exists requests_visitor_idx on requests (visitor_id);
create index if not exists requests_last_activity_idx on requests (last_activity_at);

-- Stages: new -> contacted -> quoted -> won / lost. 'closed' is the old
-- two-stage "done" value; it stays valid so existing rows keep working (the
-- board shows it with Lost). NOT VALID = existing rows are not re-checked.
alter table requests drop constraint if exists requests_status_check;
alter table requests add constraint requests_status_check
  check (status in ('new', 'contacted', 'quoted', 'won', 'lost', 'closed')) not valid;

-- ---------- Activity log ----------
create table if not exists audit_log (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references admins(id) on delete set null,
  admin_name text,                -- kept so the log still reads well after an account is deleted
  action text not null,           -- e.g. 'lead.status', 'announcement.create', 'blocklist.add'
  target_type text,
  target_id text,
  detail text,
  ip text,
  created_at timestamptz not null default now()
);
create index if not exists audit_log_created_idx on audit_log (created_at desc);
create index if not exists audit_log_admin_idx on audit_log (admin_id, created_at desc);
alter table audit_log enable row level security;

-- ---------- Blocklist + rejected submissions ----------
create table if not exists blocked_entries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('ip', 'email', 'domain')),
  value text not null,
  reason text,
  created_by uuid references admins(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (kind, value)
);
alter table blocked_entries enable row level security;

create table if not exists spam_events (
  id uuid primary key default gen_random_uuid(),
  reason text not null,           -- 'turnstile' | 'blocked'
  ip text,
  email text,
  detail text,
  created_at timestamptz not null default now()
);
create index if not exists spam_events_created_idx on spam_events (created_at desc);
alter table spam_events enable row level security;

-- ---------- Retention ----------
create or replace function purge_old_ops_logs(retention_days int default 180)
returns int
language plpgsql
security definer
as $$
declare
  a int;
  s int;
begin
  delete from audit_log where created_at < now() - (retention_days || ' days')::interval;
  get diagnostics a = row_count;
  delete from spam_events where created_at < now() - (retention_days || ' days')::interval;
  get diagnostics s = row_count;
  return a + s;
end;
$$;
revoke all on function purge_old_ops_logs(int) from public;
