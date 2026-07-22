-- ============================================================
-- MIGRATIE v3 — codes op releases + artiesten kunnen verwijderen
-- Voer dit uit in Supabase → SQL Editor → New query
-- ============================================================

-- 1) Industriecodes op releastniveau.
--    Let op: ISRC hoort strikt genomen bij een individuele track (opname),
--    en ISWC bij het onderliggende muziekwerk — niet bij de release als geheel.
--    Voor labels die vooral singles uitbrengen (één track per release) is één
--    veld per release voldoende. Breng je EP's/albums met meerdere tracks uit
--    die elk een eigen ISRC nodig hebben? Laat het weten, dan bouw ik een
--    aparte tracks-tabel met code per track.
alter table releases
  add column if not exists isrc text,
  add column if not exists upc text,
  add column if not exists iswc text;

-- 2) Artiesten verwijderen — deze delete-policy ontbrak nog, waardoor
--    zelfs admins geen artiest konden verwijderen. Verwijderen van een
--    artiest verwijdert automatisch (cascade) ook hun releases, inkomsten,
--    kosten/voorschotten en gekoppelde inlogs — dus onomkeerbaar, met opzet
--    alleen voor admins.
drop policy if exists "alleen admins verwijderen artiesten" on artists;
create policy "alleen admins verwijderen artiesten" on artists
  for delete using (is_label_admin());
