-- ============================================================
-- MIGRATIE v5 — eigen (leesbare) artiestcode
-- Voer dit uit in Supabase → SQL Editor → New query
-- ============================================================

-- Los van de automatische technische UUID die elke artiest al heeft,
-- kun je hiermee zelf een korte, herkenbare code toekennen (bv. "ART-001").
-- Optioneel: mag leeg blijven. Wel uniek als 'm wél invult, zodat er geen
-- verwarring ontstaat tussen twee artiesten met dezelfde code.
alter table artists
  add column if not exists artist_code text;

drop index if exists artists_artist_code_unique;
create unique index artists_artist_code_unique
  on artists (artist_code)
  where artist_code is not null;
