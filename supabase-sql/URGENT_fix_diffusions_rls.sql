-- ============================================================================
-- ALERTE CI — Correctif URGENT : les alertes ne partent plus (erreur 401)
-- ----------------------------------------------------------------------------
-- Diagnostic exact renvoyé par l'app : « new row violates row-level security
-- policy for table "diffusions" (code 401) ». La table diffusions a une
-- politique de LECTURE qui fonctionne (le diagnostic « Réception des
-- alertes » est vert) mais aucune politique D'ÉCRITURE valide : l'app ne
-- peut donc plus envoyer d'alerte à personne. C'est indépendant de tout ce
-- qui a été livré dans la mise à jour v18 (cette table n'a pas été touchée) —
-- probablement une politique RLS supprimée ou jamais créée pour l'écriture.
--
-- À exécuter UNE SEULE FOIS : Dashboard Supabase → SQL Editor → coller → Run.
-- ============================================================================

alter table public.diffusions enable row level security;

drop policy if exists "diffusions_read" on public.diffusions;
create policy "diffusions_read" on public.diffusions
  for select using (true);

drop policy if exists "diffusions_insert" on public.diffusions;
create policy "diffusions_insert" on public.diffusions
  for insert with check (true);

-- Par précaution, même chose pour device_tokens (nécessaire pour que les
-- notifications sirène atteignent bien le téléphone des contacts).
alter table public.device_tokens enable row level security;

drop policy if exists "device_tokens_read" on public.device_tokens;
create policy "device_tokens_read" on public.device_tokens
  for select using (true);

drop policy if exists "device_tokens_insert" on public.device_tokens;
create policy "device_tokens_insert" on public.device_tokens
  for insert with check (true);

drop policy if exists "device_tokens_update" on public.device_tokens;
create policy "device_tokens_update" on public.device_tokens
  for update using (true);
