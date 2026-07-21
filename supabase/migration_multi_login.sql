-- Voer dit uit in de Supabase SQL Editor (nieuwe query)
-- Maakt het mogelijk om meerdere e-mailadressen (bandleden) aan één artiest te koppelen.

create table if not exists artist_users (
  artist_id uuid references artists(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  primary key (artist_id, user_id)
);

alter table artist_users enable row level security;

-- Bestaande koppelingen (het huidige, enkele e-mailadres per artiest) overzetten.
insert into artist_users (artist_id, user_id)
select id, user_id from artists where user_id is not null
on conflict do nothing;

create or replace function is_artist_member(target_artist_id uuid)
returns boolean as $$
  select exists (
    select 1 from artist_users
    where artist_id = target_artist_id and user_id = auth.uid()
  );
$$ language sql security definer stable;

drop policy if exists "admins alles, artiest eigen profiel" on artists;
create policy "admins alles, artiest eigen profiel" on artists
  for select using (is_label_admin() or is_artist_member(id));

drop policy if exists "admins alles, artiest eigen releases" on releases;
create policy "admins alles, artiest eigen releases" on releases
  for select using (is_label_admin() or is_artist_member(artist_id));

drop policy if exists "admins alles, artiest eigen tracks" on tracks;
create policy "admins alles, artiest eigen tracks" on tracks
  for select using (
    is_label_admin() or release_id in (
      select id from releases where is_artist_member(artist_id)
    )
  );

drop policy if exists "admins alles, artiest eigen boekingen" on entries;
create policy "admins alles, artiest eigen boekingen" on entries
  for select using (
    is_label_admin() or release_id in (
      select id from releases where is_artist_member(artist_id)
    )
  );

create policy "admins beheren artist_users" on artist_users
  for all using (is_label_admin()) with check (is_label_admin());

create policy "leden zien eigen koppelingen" on artist_users
  for select using (user_id = auth.uid());
