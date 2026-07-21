-- ============================================================
-- MIGRATIE v2 — afstemmen database op de royalty-structuur
-- (Releases / Inkomsten / Artiest Afrekening, zoals in je Excel)
-- Voer dit uit in Supabase → SQL Editor → New query
-- Veilig om te draaien op een bestaande database met schema.sql
-- + migration_multi_login.sql erop.
-- ============================================================

-- 1) Releases: uitbreiden met releasedatum, distributeur, opmerkingen
--    en de percentages hernoemen naar label_percent / artist_percent
--    (percentage van het LABEL is nu leidend, net als in je Excel).
alter table releases
  add column if not exists label_percent numeric not null default 20,
  add column if not exists release_date date,
  add column if not exists distributor text,
  add column if not exists notes text;

-- Bestaande artist_split (percentage voor de artiest) omzetten naar label_percent
update releases set label_percent = 100 - artist_split
  where label_percent = 20 and artist_split is not null;

-- 2) Artiesten: contractstatus/notities (uit update12_1) zeker stellen
alter table artists
  add column if not exists contract_status text not null default 'niet_gestart',
  add column if not exists contract_notes text;

-- 3) Inkomsten per platform/betaling — vervangt de generieke 'entries'-tabel
--    voor het type 'income'. Verdeling wordt VASTGEZET op het moment van
--    de boeking (snapshot), net zoals in je Excel-sheet.
create table if not exists income_entries (
  id uuid primary key default gen_random_uuid(),
  release_id uuid references releases(id) on delete cascade not null,
  entry_date date not null default current_date,
  platform text not null default 'Overig',
  gross_amount numeric not null,
  label_percent numeric not null,
  artist_percent numeric not null,
  label_amount numeric generated always as (gross_amount * label_percent / 100) stored,
  artist_amount numeric generated always as (gross_amount * artist_percent / 100) stored,
  notes text,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- 4) Losse kosten/voorschotten blijven bestaan, maar in een eigen tabel
--    (duidelijker dan alles door elkaar in 'entries').
create table if not exists adjustments (
  id uuid primary key default gen_random_uuid(),
  release_id uuid references releases(id) on delete cascade not null,
  type text not null check (type in ('cost', 'advance')),
  entry_date date not null default current_date,
  amount numeric not null,
  description text,
  created_at timestamptz default now(),
  created_by uuid references auth.users(id)
);

-- 5) Bestaande data uit 'entries' overzetten (indien aanwezig)
insert into income_entries (release_id, entry_date, platform, gross_amount, label_percent, artist_percent, notes, created_at)
select
  e.release_id,
  coalesce(e.entry_date, current_date),
  'Overig (gemigreerd)',
  e.amount,
  r.label_percent,
  100 - r.label_percent,
  e.description,
  e.created_at
from entries e
join releases r on r.id = e.release_id
where e.type = 'income'
on conflict do nothing;

insert into adjustments (release_id, type, entry_date, amount, description, created_at)
select e.release_id, e.type, coalesce(e.entry_date, current_date), e.amount, e.description, e.created_at
from entries e
where e.type in ('cost', 'advance')
on conflict do nothing;

-- 6) RLS aanzetten + policies
alter table income_entries enable row level security;
alter table adjustments enable row level security;

drop policy if exists "admins alles, artiest eigen inkomsten" on income_entries;
create policy "admins alles, artiest eigen inkomsten" on income_entries
  for select using (
    is_label_admin() or release_id in (
      select id from releases where is_artist_member(artist_id)
    )
  );
drop policy if exists "alleen admins beheren inkomsten" on income_entries;
create policy "alleen admins beheren inkomsten" on income_entries
  for all using (is_label_admin()) with check (is_label_admin());

drop policy if exists "admins alles, artiest eigen adjustments" on adjustments;
create policy "admins alles, artiest eigen adjustments" on adjustments
  for select using (
    is_label_admin() or release_id in (
      select id from releases where is_artist_member(artist_id)
    )
  );
drop policy if exists "alleen admins beheren adjustments" on adjustments;
create policy "alleen admins beheren adjustments" on adjustments
  for all using (is_label_admin()) with check (is_label_admin());
