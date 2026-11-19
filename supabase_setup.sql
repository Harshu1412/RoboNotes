-- ════════════════════════════════════════════════════════════════
--  ROBONOTES — Supabase setup
--  Run this entire file in:
--  Supabase Dashboard → SQL Editor → New query → Paste → Run
-- ════════════════════════════════════════════════════════════════

-- ── 1. Enable UUID extension ──────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── 2. Resources table ────────────────────────────────────────
create table if not exists resources (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  subject     text,
  url         text,
  file_name   text,
  kind        text not null default 'FILE',
  icon        text default '▤',
  color       text default 'mint',
  created_at  timestamptz default now()
);

-- ── 3. Papers table ───────────────────────────────────────────
create table if not exists papers (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  subject     text,
  url         text,
  file_name   text,
  kind        text not null default 'PAPER',
  icon        text default '◎',
  color       text default 'mint',
  created_at  timestamptz default now()
);

-- ── 5. Row Level Security — public read and anon writes ───────
--  (All writes go through the anon key on the client, which is
--   fine for a private class tool. Tighten this if you go public.)
alter table resources enable row level security;
alter table papers     enable row level security;

grant usage on schema public to anon;
grant select, insert, delete on table
  public.resources, public.papers to anon;

-- Allow anyone to SELECT
drop policy if exists "Public read resources" on resources;
drop policy if exists "Public read papers" on papers;
create policy "Public read resources" on resources for select using (true);
create policy "Public read papers"    on papers      for select using (true);

-- Allow anon to INSERT / DELETE (admin password check is done client-side)
drop policy if exists "Anon insert resources" on resources;
drop policy if exists "Anon delete resources" on resources;
drop policy if exists "Anon insert papers" on papers;
drop policy if exists "Anon delete papers" on papers;
create policy "Anon insert resources" on resources for insert with check (true);
create policy "Anon delete resources" on resources for delete using (true);

create policy "Anon insert papers"    on papers      for insert with check (true);
create policy "Anon delete papers"    on papers      for delete using (true);

-- Allow uploads only to the app's two public buckets.
drop policy if exists "Anon upload class materials" on storage.objects;
create policy "Anon upload class materials" on storage.objects
  for insert to anon
  with check (bucket_id in ('resources', 'papers'));

-- ════════════════════════════════════════════════════════════════
--  STORAGE BUCKETS
--  After running SQL, also do this in the Dashboard:
--  Storage → New bucket → name it exactly as below → Public bucket ✓
--
--   Bucket name: resources
--   Bucket name: papers
-- ════════════════════════════════════════════════════════════════
