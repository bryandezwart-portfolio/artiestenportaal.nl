# Ledger

Royalty-overzicht voor label en artiesten. Label ziet alles, elke artiest ziet na
inloggen alleen zijn/haar eigen releases en splits (afgedwongen op databaseniveau
met Supabase Row Level Security, niet alleen in de UI).

## Snelste weg naar live (ca. 15 minuten)

### 1. Supabase project
1. Ga naar [supabase.com](https://supabase.com) → nieuw project (gratis tier is genoeg om te starten).
2. Ga naar **SQL Editor** → plak de inhoud van `supabase/schema.sql` → run.
3. Ga naar **Project Settings → API** → kopieer de `Project URL` en `anon public key`.

### 2. Lokaal draaien
```bash
npm install
cp .env.local.example .env.local
# vul .env.local met je Supabase URL + anon key
npm run dev
```

### 3. Eerste label-account maken
1. Maak in Supabase (**Authentication → Users → Add user**) een account aan voor jezelf.
2. Kopieer je user-UUID.
3. Voer in de SQL Editor uit:
   ```sql
   insert into label_admins (user_id) values ('jouw-user-uuid');
   ```
4. Log in op `/login` — je komt nu in `/dashboard` terecht.

### 4. Artiest-accounts
1. Maak een account aan via **Authentication → Users → Add user** met het e-mailadres van de artiest.
2. Voeg de artiest toe aan de `artists`-tabel, gekoppeld aan diens `user_id`:
   ```sql
   insert into artists (user_id, name) values ('artiest-user-uuid', 'Naam Artiest');
   ```
3. Voeg releases toe gekoppeld aan `artist_id`.
4. De artiest logt in op `/login` en komt automatisch in `/artist` terecht — met alleen
   zijn/haar eigen data, dankzij de RLS-policies in `schema.sql`.

### 5. Deployen naar Vercel
1. Zet dit project in een GitHub-repo.
2. Ga naar [vercel.com/new](https://vercel.com/new) → importeer de repo.
3. Voeg de environment variables toe (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Deploy. Klaar.

## Wat nog ontbreekt (bewust simpel gehouden om snel live te zijn)

- Formulieren om releases/boekingen toe te voegen via de UI (nu via Supabase's
  tabel-editor of SQL — werkt prima om snel te starten, kost een paar uur werk om
  in de app zelf te bouwen).
- Split per track (databaseschema ondersteunt dit al via `tracks.artist_split`,
  UI moet nog gebouwd worden).
- Wachtwoord-reset/uitnodigingsflow voor artiesten (nu handmatig via Supabase).

Zeg het als je wil dat ik een van deze uitbreid.
