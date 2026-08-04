-- ============================================================================
-- ALERTE CI — Table des administrateurs et éditeurs
-- ----------------------------------------------------------------------------
-- À exécuter UNE SEULE FOIS dans Supabase :
--   Dashboard Supabase → SQL Editor → coller ce script → Run
-- ============================================================================

create table if not exists public.admins (
  id           bigserial primary key,
  nom          text not null,
  telephone    text not null unique,
  code         text not null,                 -- code d'accès à 6 chiffres
  role         text not null default 'editeur', -- 'super' ou 'editeur'
  permissions  jsonb not null default '[]'::jsonb,
  actif        boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table public.admins enable row level security;

-- Lecture et écriture depuis l'application (clé anon).
-- ⚠️ Voir la note de sécurité en bas de ce fichier.
drop policy if exists "admins_read" on public.admins;
create policy "admins_read" on public.admins
  for select using (true);

drop policy if exists "admins_write" on public.admins;
create policy "admins_write" on public.admins
  for insert with check (true);

drop policy if exists "admins_update" on public.admins;
create policy "admins_update" on public.admins
  for update using (true);

-- ----------------------------------------------------------------------------
-- VOTRE COMPTE ADMINISTRATEUR PRINCIPAL
-- Remplacez le numéro et le code par les vôtres AVANT d'exécuter.
-- Le numéro doit être un vrai numéro ivoirien (01, 05 ou 07 + 8 chiffres).
-- ----------------------------------------------------------------------------
insert into public.admins (nom, telephone, code, role, permissions, actif)
values (
  'Administrateur principal',
  '0700000000',        -- ⬅️ REMPLACEZ par votre numéro
  '112233',            -- ⬅️ REMPLACEZ par votre code à 6 chiffres
  'super',
  '["users","services","types","diffusions","admins"]'::jsonb,
  true
)
on conflict (telephone) do nothing;

-- ============================================================================
-- ⚠️ NOTE DE SÉCURITÉ IMPORTANTE — À LIRE
-- ----------------------------------------------------------------------------
-- Les codes d'accès sont stockés en clair et la table est lisible avec la clé
-- publique de l'application. C'est acceptable pour démarrer, mais AVANT une
-- mise en production réelle, il faut impérativement :
--
--   1. Ne PAS laisser la politique de lecture ouverte à tous.
--      Déplacer la vérification du code dans une Edge Function : l'application
--      envoie numéro + code, la fonction (qui utilise la clé service_role)
--      vérifie et renvoie uniquement le rôle et les permissions.
--
--   2. Stocker les codes hachés (bcrypt) plutôt qu'en clair.
--
--   3. Limiter le nombre de tentatives de connexion.
--
-- Tel quel, quelqu'un qui extrait la clé publique de l'APK pourrait lire cette
-- table et obtenir les codes. Demandez-moi de faire cette version sécurisée
-- quand vous approcherez de la mise en production.
-- ============================================================================
