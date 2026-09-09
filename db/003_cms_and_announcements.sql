-- Run once in the Supabase SQL Editor. Safe to re-run.

-- Generic key/value content store — lets the admin edit specific pieces of
-- site text without a code deploy. Any key not present here falls back to
-- the hardcoded default in the component itself, so this never breaks the
-- site even if a key is missing.
create table if not exists site_content (
  content_key text primary key,
  content_value text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references admins(id) on delete set null
);

-- Announcement banner (festival greetings, downtime notices, etc). Only
-- one is meant to be shown at a time - the public endpoint returns the
-- most recently created row where active = true.
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  emoji text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  created_by uuid references admins(id) on delete set null
);

create index if not exists announcements_active_idx on announcements (active, created_at desc);

-- Uploaded documents (compliance PDFs, DLT rule updates, etc) that clients
-- can download from the public site.
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text,
  file_path text not null,       -- path inside the 'documents' storage bucket
  file_size_bytes integer,
  uploaded_at timestamptz not null default now(),
  uploaded_by uuid references admins(id) on delete set null
);

create index if not exists documents_uploaded_at_idx on documents (uploaded_at desc);

alter table site_content enable row level security;
alter table announcements enable row level security;
alter table documents enable row level security;

-- Public storage bucket for document downloads. Public because these are
-- meant to be openly downloadable by any client, not authenticated users.
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;
