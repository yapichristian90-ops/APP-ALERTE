-- ============================================================================
-- ALERTE CI — Migration v19 : position toujours active, consultée à la
-- demande par un contact de confiance (recherche par numéro)
-- ----------------------------------------------------------------------------
-- Remplace le partage GPS manuel de l'écran Enlèvement : la position se met
-- à jour en continu en arrière-plan, sans jamais être poussée à personne.
-- Un contact de confiance ne peut voir cette position qu'en la recherchant
-- explicitement par numéro, et seulement s'il est enregistré comme contact
-- de confiance de ce numéro (vérifié côté serveur, jamais par la clé anon).
--
-- À exécuter UNE SEULE FOIS dans Supabase : Dashboard → SQL Editor → coller
-- → Run.
-- ============================================================================

create table if not exists public.positions_live (
  telephone   text primary key,
  lat         double precision not null,
  lng         double precision not null,
  precision   integer,
  updated_at  timestamptz not null default now()
);

alter table public.positions_live enable row level security;

-- Écriture autorisée à la clé publique (c'est le téléphone lui-même, source
-- de vérité, qui écrit sa propre position en continu — même modèle que
-- diffusions/device_tokens dans le reste de l'app).
drop policy if exists "positions_live_write" on public.positions_live;
create policy "positions_live_write" on public.positions_live
  for insert with check (true);
drop policy if exists "positions_live_update" on public.positions_live;
create policy "positions_live_update" on public.positions_live
  for update using (true);

-- AUCUNE politique de lecture pour la clé anon : la position de personne
-- n'est directement lisible par l'application. La seule façon de la
-- consulter est la fonction localiser-contact, qui vérifie d'abord que le
-- demandeur est bien un contact de confiance, avec la clé de service
-- (laquelle contourne RLS).
