-- LEDGER database schema
-- Voer dit uit in de Supabase SQL editor (Project → SQL Editor → New query)

create table artists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id), -- gekoppeld aan het Supabase Auth account van de artiest
  name text not null,
  created_at timestamptz default now()
);

create table releases (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references artists(id) on delete cascade,
  title text not null,
  artist_split numeric not null default 50, -- percentage, overschrijfbaar per track
  created_at timestamptz default now()
);

create table tracks (
  id uuid primary key default gen_random_uuid(),
  release_id uuid references releases(id) on delete cascade,
  title text not null,
  artist_split numeric, -- null = gebruik de split van de release
  created_at timestamptz default now()
);

create table entries (
  id uuid primary key default gen_random_uuid(),
  release_id uuid references releases(id) on delete cascade,
  track_id uuid references tracks(id) on delete cascade, -- optioneel: boeking op trackniveau
  type text not null check (type in ('income', 'cost', 'advance')),
  description text,
  amount numeric not null,
  entry_date date default current_date,
  created_at timestamptz default now()
);

-- Label-beheerders: markeer jezelf (en collega's) als admin
create table label_admins (
  user_id uuid primary key references auth.users(id)
);

-- Row Level Security aanzetten
alter table artists enable row level security;
alter table releases enable row level security;
alter table tracks enable row level security;
alter table entries enable row level security;
alter table label_admins enable row level security;

-- Helper: is de ingelogde gebruiker een label-admin?
create or replace function is_label_admin()
returns boolean as $$
  select exists (select 1 from label_admins where user_id = auth.uid());
$$ language sql security definer stable;

-- Admins zien alles; artiesten zien alleen hun eigen rij
create policy "admins alles, artiest eigen profiel" on artists
  for select using (is_label_admin() or user_id = auth.uid());
create policy "alleen admins beheren artiesten" on artists
  for insert with check (is_label_admin());
create policy "alleen admins wijzigen artiesten" on artists
  for update using (is_label_admin());

create policy "admins alles, artiest eigen releases" on releases
  for select using (
    is_label_admin() or artist_id in (select id from artists where user_id = auth.uid())
  );
create policy "alleen admins beheren releases" on releases
  for insert with check (is_label_admin());
create policy "alleen admins wijzigen releases" on releases
  for update using (is_label_admin());
create policy "alleen admins verwijderen releases" on releases
  for delete using (is_label_admin());

create policy "admins alles, artiest eigen tracks" on tracks
  for select using (
    is_label_admin() or release_id in (
      select r.id from releases r join artists a on a.id = r.artist_id
      where a.user_id = auth.uid()
    )
  );
create policy "alleen admins beheren tracks" on tracks
  for all using (is_label_admin()) with check (is_label_admin());

create policy "admins alles, artiest eigen boekingen" on entries
  for select using (
    is_label_admin() or release_id in (
      select r.id from releases r join artists a on a.id = r.artist_id
      where a.user_id = auth.uid()
    )
  );
create policy "alleen admins beheren boekingen" on entries
  for all using (is_label_admin()) with check (is_label_admin());

create policy "alleen admins zien admin-lijst" on label_admins
  for select using (is_label_admin());

-- Nadat je zelf een account hebt aangemaakt via de app se login-pagina,
-- voer je dit uit (met jouw eigen user id uit auth.users) om jezelf tot label-admin te maken:
-- insert into label_admins (user_id) values ('JOUW-USER-UUID-HIER');
