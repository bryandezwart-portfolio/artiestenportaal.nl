-- ============================================================
-- MIGRATIE v6 — bijlagen, tracks/split, activiteitenlog
-- Voer dit uit in Supabase → SQL Editor → New query
-- ============================================================

-- 1) Bijlagen bij inkomsten en kosten/voorschotten (bv. factuur-PDF)
alter table income_entries add column if not exists attachment_path text;
alter table adjustments add column if not exists attachment_path text;

-- 2) Per-track ISRC (tracks-tabel bestond al, alleen ISRC ontbrak)
alter table tracks add column if not exists isrc text;

drop index if exists tracks_isrc_unique;
create unique index tracks_isrc_unique
  on tracks (isrc)
  where isrc is not null;

-- 3) Activiteitenlog — wie heeft wat wanneer gedaan
create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  actor_email text,
  action text not null,
  description text not null,
  created_at timestamptz default now()
);

alter table activity_log enable row level security;

drop policy if exists "alleen admins zien activiteitenlog" on activity_log;
create policy "alleen admins zien activiteitenlog" on activity_log
  for select using (is_label_admin());

drop policy if exists "alleen admins loggen activiteit" on activity_log;
create policy "alleen admins loggen activiteit" on activity_log
  for insert with check (is_label_admin());

-- 4) Opslag-bucket voor bijlagen (privé — alleen via ondertekende links te
--    benaderen, niet publiek doorzoekbaar)
insert into storage.buckets (id, name, public)
values ('attachments', 'attachments', false)
on conflict (id) do nothing;

drop policy if exists "admins beheren bijlagen" on storage.objects;
create policy "admins beheren bijlagen" on storage.objects
  for all using (bucket_id = 'attachments' and is_label_admin())
  with check (bucket_id = 'attachments' and is_label_admin());
