-- ============================================================
-- MIGRATIE v4 — contractduur (start/einddatum) per artiest
-- Voer dit uit in Supabase → SQL Editor → New query
-- ============================================================

alter table artists
  add column if not exists contract_start_date date,
  add column if not exists contract_end_date date;
