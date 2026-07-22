# Artiestenportaal.nl

Royalty-dashboard voor je label. Jij (label-admin) ziet en beheert alles;
elke artiest logt in en ziet automatisch alleen zijn/haar eigen releases,
inkomsten en verdiensten — afgedwongen op databaseniveau met Supabase Row
Level Security, niet alleen in de UI.

## Wat is er veranderd in deze versie

- **Database afgestemd op je Excel-sheet**: releases hebben nu een
  releasedatum, distributeur en `label_percent`; inkomsten worden per
  platform geboekt (`income_entries`) met de verdeling **vastgezet op het
  moment van boeken** — precies zoals in je Excel. Kosten/voorschotten staan
  in een eigen tabel (`adjustments`).
- **Uitgebreid admin-dashboard**: overzicht met statistieken en top-artiesten,
  releases beheren (aanmaken + bewerken), inkomsten boeken per platform,
  **CSV-import** voor bulk-inkomsten, en een **Afrekening**-pagina (artiest +
  periode kiezen → printbaar/PDF overzicht, net als je Excel-tabblad
  "Artiest Afrekening").
- **Artiestendashboard vernieuwd**: totaalbedrag bovenaan, per release
  uitklapbaar naar een detail per platform (Spotify, Apple Music, etc.).
- **Bugfixes**: de ontbrekende `lib/supabase/admin.ts` (nodig om artiesten
  per e-mail uit te nodigen), ontbrekende Tailwind-kleuren/animaties, de
  navigatiebalk die nergens werd geladen, en een ontbrekende knop om nieuwe
  artiesten aan te maken.

## Snelste weg naar live

### 1. Supabase — database bijwerken

Ga naar je Supabase-project → **SQL Editor** → New query, en voer de
volgende bestanden **in deze volgorde** uit (sla een bestand over als je het
al eerder hebt gedraaid):

1. `supabase/schema.sql` — alleen nodig bij een gloednieuw project
2. `supabase/migration_multi_login.sql` — meerdere logins per artiest
3. `supabase/migration_v2_royalties.sql` — **nieuw**: royalty-structuur,
   per-platform inkomsten, kosten/voorschotten

De migratie is veilig om te draaien op je bestaande database — hij zet
bestaande releases en boekingen automatisch om naar de nieuwe structuur.

### 2. Environment variables

```bash
cp .env.local.example .env.local
```

Vul in:
- `NEXT_PUBLIC_SUPABASE_URL` en `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Project
  Settings → API (had je al)
- `SUPABASE_SERVICE_ROLE_KEY` — **nieuw vereist**, zelfde pagina, het
  `service_role secret`. Nodig om artiesten per e-mail uit te nodigen. Zet
  deze ook in Vercel als environment variable — **nooit** met een
  `NEXT_PUBLIC_`-prefix, want dan is hij niet meer geheim.

### 3. Lokaal draaien

```bash
npm install
npm run dev
```

### 4. Jezelf tot label-admin maken (indien nog niet gedaan)

In Supabase SQL Editor:
```sql
insert into label_admins (user_id) values ('jouw-user-uuid');
```

### 5. Deployen naar Vercel

1. Push deze map naar je GitHub-repo (overschrijf de bestaande code).
2. Vercel → Project → Settings → Environment Variables: zet alle drie de
   variabelen (inclusief de nieuwe `SUPABASE_SERVICE_ROLE_KEY`).
3. Redeploy.

## Hoe het werkt

- **Releases** (`/dashboard/releases`) — voeg een release toe met artiest,
  titel, releasedatum, label-percentage en distributeur.
- **Inkomsten boeken** — open een release → "Inkomsten boeken": datum,
  platform, brutobedrag. De verdeling van dat moment wordt vastgelegd bij de
  boeking, dus latere aanpassing van het releasepercentage werkt niet met
  terugwerkende kracht.
- **CSV-import** (`/dashboard/income`) — exporteer het tabblad "Inkomsten"
  uit je Excel als CSV en upload of plak het. Rijen worden gematcht op
  titel (+ artiest). Bestaat de release nog niet, maak die dan eerst aan.
- **Afrekening** (`/dashboard/afrekening`) — kies artiest + periode voor een
  printbaar overzicht, met totalen en detail per betaling.
- **Artiesten beheren** (`/dashboard/artists`) — nieuwe artiest aanmaken
  (met optionele uitnodigingsmail), contractstatus bijhouden, extra logins
  koppelen (bv. bandleden).

## Nieuwste update — 7 extra functies

- **Zoeken**: live zoekbalk op Releases, Inkomsten en Artiesten (artiest, titel, jaar, datum, ISRC/UPC/ISWC/code).
- **Inkomstengrafiek**: staafdiagram per maand op het admin-overzicht.
- **CSV-export**: knop bij Releases, Inkomsten, Artiesten en Afrekening.
- **Releaseherinneringen**: widget op het dashboard (binnen 30 dagen) + dagelijkse e-mail
  via een Vercel Cron-job wanneer een release binnen 7 dagen gepland staat. Vereist twee
  extra env vars: `RESEND_API_KEY` en `CRON_SECRET` (zie `.env.local.example`). Zonder
  deze vars blijft de rest van de site gewoon werken, alleen de mail wordt overgeslagen.
- **Bijlagen**: upload/download-knop per boeking (factuur-PDF's etc.), opgeslagen in een
  privé Supabase Storage-bucket (`attachments`).
- **Activiteitenlog**: nieuwe pagina `/dashboard/activiteit` — wie heeft wat gewijzigd.
- **Bulkacties**: selecteer meerdere artiesten om in één keer de contractstatus te wijzigen
  of te exporteren.
- **Tracks & split per track**: onder een release kun je losse tracks toevoegen met een
  eigen ISRC en (optioneel) een afwijkende artiestverdeling — handig bij features/samenwerkingen.
  Let op: inkomsten worden nog steeds op releaseniveau geboekt, niet per track.

Draai voor deze update `supabase/migration_v6_features.sql` in de SQL Editor.

## Wat nog bewust simpel is gehouden

- CSV-import verwacht een titel-match met een bestaande release — er is nog
  geen automatische "nieuwe release aanmaken tijdens import"-flow.
- Geen automatische periodieke e-mail met afrekeningen (nu handmatig via de
  Afrekening-pagina + printen/PDF).
- Split per track (in plaats van per release) staat nog niet in de UI.

Zeg het als je wil dat ik een van deze uitbreid.
