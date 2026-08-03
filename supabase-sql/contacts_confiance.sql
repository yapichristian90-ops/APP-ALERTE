-- ============================================================================
-- ALERTE CI — Table des contacts (urgence / confiance) liés au compte
-- ----------------------------------------------------------------------------
-- Permet aux contacts d'urgence (violence) et de confiance (enlèvement) de
-- suivre le COMPTE de l'utilisateur : ils restent présents après une
-- réinstallation, un changement de téléphone, ou une nouvelle version testée.
--
-- À exécuter UNE SEULE FOIS dans Supabase :
--   Dashboard Supabase → SQL Editor → coller ce script → Run
-- ============================================================================

create table if not exists public.contacts_confiance (
  telephone   text primary key,           -- numéro de l'utilisateur (10 chiffres)
  violence    jsonb not null default '[]'::jsonb,   -- contacts d'urgence (alerte violence)
  enlevement  jsonb not null default '[]'::jsonb,   -- contacts de confiance (enlèvement)
  updated_at  timestamptz not null default now()
);

alter table public.contacts_confiance enable row level security;

-- Lecture/écriture depuis l'application (clé anon).
drop policy if exists "cts_read" on public.contacts_confiance;
create policy "cts_read" on public.contacts_confiance
  for select using (true);

drop policy if exists "cts_insert" on public.contacts_confiance;
create policy "cts_insert" on public.contacts_confiance
  for insert with check (true);

drop policy if exists "cts_update" on public.contacts_confiance;
create policy "cts_update" on public.contacts_confiance
  for update using (true);

-- ----------------------------------------------------------------------------
-- NOTE DE SÉCURITÉ
-- Comme le reste de l'app, l'accès se fait avec la clé publique (anon). Les
-- numéros des contacts sont donc lisibles/écrivables par quiconque possède
-- cette clé. C'est cohérent avec le modèle actuel de l'application (les tables
-- diffusions, device_tokens, etc. fonctionnent de la même façon).
-- Si vous souhaitez un jour restreindre l'accès (chaque utilisateur ne voit que
-- SES contacts), il faudra passer par une authentification Supabase liée au
-- numéro. Demandez-le moi le moment venu.
-- ----------------------------------------------------------------------------
