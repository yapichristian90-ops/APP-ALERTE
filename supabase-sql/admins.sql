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
-- ✅ MISE À JOUR v18 — Les 3 points ci-dessous sont maintenant traités.
-- ----------------------------------------------------------------------------
-- Exécutez ENSUITE le script supabase-sql/migration_v18_akwaba_firebase.sql :
-- il ferme la lecture publique de cette table, ajoute les colonnes salt /
-- code_hash, et déploie (via supabase-edge-function/admin-api) une Edge
-- Function qui vérifie le code administrateur côté serveur (haché, jamais en
-- clair) avec limitation du nombre de tentatives. La première connexion
-- réussie migre automatiquement le code encore en clair inséré ci-dessus vers
-- sa version hachée — vous n'avez rien à faire de plus qu'exécuter la
-- migration et déployer la fonction.
-- ============================================================================
