-- ============================================================================
-- ALERTE CI — Migration v18 : authentification Firebase, abonnement Akwaba,
-- administration sécurisée
-- ----------------------------------------------------------------------------
-- À exécuter UNE SEULE FOIS dans Supabase : Dashboard → SQL Editor → coller
-- ce script en entier → Run. Il est écrit pour être rejouable sans risque
-- (if not exists / add column if not exists partout) et ne supprime aucune
-- donnée existante.
-- ============================================================================

-- ── Table des profils citoyens ──────────────────────────────────────────────
-- (créée ici si elle n'existe pas encore ; sinon seules les colonnes
-- manquantes sont ajoutées, sans toucher aux données déjà présentes)
create table if not exists public.profiles (
  telephone           text primary key,
  nom                 text,
  email               text,
  commune             text,
  statut              text not null default 'actif',
  created_at          timestamptz not null default now()
);
alter table public.profiles add column if not exists auth_uid          text;
alter table public.profiles add column if not exists forfait           text not null default 'akwaba_essai';
alter table public.profiles add column if not exists essai_fin         timestamptz;
alter table public.profiles add column if not exists premium_expire    timestamptz;
alter table public.profiles add column if not exists bloque            boolean not null default false;
alter table public.profiles add column if not exists session_id        text;
alter table public.profiles add column if not exists derniere_connexion timestamptz;
-- La colonne "id" (uuid, liée à l'ancienne auth Supabase) n'est plus la clé
-- utilisée par l'application : elle peut rester si elle existe déjà, mais
-- n'est plus obligatoire. On retire la contrainte NOT NULL si elle bloquait
-- les nouvelles inscriptions (qui n'écrivent plus dans "id").
do $$ begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='id') then
    execute 'alter table public.profiles alter column id drop not null';
  end if;
exception when others then null;
end $$;

alter table public.profiles enable row level security;
drop policy if exists "profiles_read" on public.profiles;
create policy "profiles_read" on public.profiles for select using (true);
drop policy if exists "profiles_write" on public.profiles;
create policy "profiles_write" on public.profiles for insert with check (true);
drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles for update using (true);

-- ── Table des institutions ──────────────────────────────────────────────────
create table if not exists public.institutions (
  id            bigserial primary key,
  nom           text,
  commune       text,
  responsable   text,
  telephone     text unique,
  email         text,
  statut        text not null default 'en_attente',
  type_service_id bigint,
  created_at    timestamptz not null default now()
);
alter table public.institutions add column if not exists auth_uid           text;
alter table public.institutions add column if not exists type_service       text;
alter table public.institutions add column if not exists session_id         text;
alter table public.institutions add column if not exists derniere_connexion timestamptz;
alter table public.institutions add column if not exists valide_le          timestamptz;

alter table public.institutions enable row level security;
drop policy if exists "institutions_read" on public.institutions;
create policy "institutions_read" on public.institutions for select using (true);
drop policy if exists "institutions_write" on public.institutions;
create policy "institutions_write" on public.institutions for insert with check (true);
drop policy if exists "institutions_update" on public.institutions;
create policy "institutions_update" on public.institutions for update using (true);

-- ── Forfaits : bascule sur le modèle Akwaba (essai 30 j) + Premium annuel
--    3 000 FCFA, qui remplace les anciens tarifs 10 000/1 000 FCFA. ─────────
insert into public.forfaits (slug, nom, prix, duree_jours, actif) values
  ('akwaba_essai',    'Essai Akwaba',    0,    30,  true),
  ('premium_annuel',  'Premium annuel',  3000, 365, true)
on conflict (slug) do update set prix = excluded.prix, duree_jours = excluded.duree_jours, actif = true;
-- Anciens forfaits désactivés (conservés pour l'historique, plus proposés).
update public.forfaits set actif = false where slug in ('gratuit','premium','premium_mensuel');

-- ── Historique des bonus premium offerts par un administrateur ─────────────
create table if not exists public.bonus_premium (
  id            bigserial primary key,
  telephone     text not null,
  jours_offerts integer not null,
  motif         text,
  offert_par    text,
  created_at    timestamptz not null default now()
);
alter table public.bonus_premium enable row level security;
drop policy if exists "bonus_no_direct_access" on public.bonus_premium;
-- Aucun accès direct par la clé publique : uniquement via l'Edge Function
-- admin-api, qui utilise la clé de service (laquelle contourne RLS).

-- ── Rate limiting générique (utilisé par l'Edge Function admin-api) ────────
create table if not exists public.rate_limits (
  cle           text primary key,
  compte        integer not null default 0,
  fenetre_debut timestamptz not null default now()
);
alter table public.rate_limits enable row level security;
-- Aucune politique = aucun accès par la clé publique (seule la clé de
-- service, utilisée par l'Edge Function, peut lire/écrire cette table).

-- ── Sécurisation de la table admins (code d'accès haché) ────────────────────
alter table public.admins add column if not exists salt      text;
alter table public.admins add column if not exists code_hash text;
-- Fermeture de la lecture publique : les codes ne doivent plus être lisibles
-- avec la clé anon. Toute vérification passe désormais par l'Edge Function
-- admin-api (clé de service). Si votre app utilisait encore une lecture
-- directe de cette table ailleurs, elle cessera de fonctionner : c'est
-- volontaire et recherché.
drop policy if exists "admins_read" on public.admins;
drop policy if exists "admins_write" on public.admins;
drop policy if exists "admins_update" on public.admins;
-- Aucune politique recréée : la table n'est plus accessible qu'via la clé
-- de service (Edge Function).

-- ============================================================================
-- Fin de la migration. Rappel : la fonction admin-api doit être déployée
-- (voir supabase-edge-function/admin-api/index.ts) pour que l'écran
-- Administration de l'application continue de fonctionner.
-- ============================================================================
