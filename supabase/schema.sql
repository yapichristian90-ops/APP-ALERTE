-- =============================================================================
-- ALERTE Côte d'Ivoire — schéma Supabase (PostgreSQL)
-- =============================================================================
-- Authentification : on réutilise Supabase Auth (email/mot de passe) mais on
-- l'expose côté app comme "numéro de téléphone + code secret" : le numéro est
-- mappé vers un email synthétique (<225XXXXXXXXXX>@compte.alerte-ci.app) et le
-- code secret devient le mot de passe Supabase Auth. Cela nous donne
-- gratuitement des mots de passe hashés en sécurité, un auth.uid() fiable et
-- des policies RLS et un Realtime natifs, sans réinventer la gestion de
-- session. Rien de tout cela n'est visible par l'utilisateur final.
-- =============================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Fonction utilitaire : l'appelant est-il un administrateur actif ?
-- Définie tôt car référencée par les policies RLS ci-dessous. Elle est créée
-- avant la table admin_roles grâce à un typage différé (le corps de la
-- fonction n'est vérifié qu'à l'exécution, pas à la création).
-- ---------------------------------------------------------------------------
create or replace function public.is_admin(uid uuid)
returns boolean
language plpgsql stable security definer as $$
begin
  return exists (
    select 1 from public.admin_roles a where a.id = uid and a.status = 'actif'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- PROFILS UTILISATEURS
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  phone text not null unique,                 -- format +225XXXXXXXXXX
  commune text not null,
  created_at timestamptz not null default now(),
  plan text not null default 'akwaba' check (plan in ('akwaba', 'premium')),
  trial_ends_at timestamptz not null default (now() + interval '30 days'),
  subscription_active_until timestamptz,
  accepted_terms_at timestamptz,
  accepted_terms_version text,
  kidnap_tracking_enabled boolean not null default false,
  last_latitude double precision,
  last_longitude double precision,
  last_location_at timestamptz
);

comment on table public.profiles is 'Un profil par utilisateur, créé automatiquement à l''inscription (voir handle_new_user).';

alter table public.profiles enable row level security;

create policy "un utilisateur voit et modifie son propre profil"
  on public.profiles for select using (auth.uid() = id);
create policy "un utilisateur met à jour son propre profil"
  on public.profiles for update using (auth.uid() = id);
create policy "les admins voient tous les profils"
  on public.profiles for select using (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- CONTACTS D'URGENCE (Alerte Violence) — jusqu'à 3 par utilisateur
-- ---------------------------------------------------------------------------
create table public.emergency_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  slot smallint not null check (slot between 1 and 3),
  label text not null default '',
  full_name text not null,
  phone text not null,
  created_at timestamptz not null default now(),
  unique (user_id, slot)
);

alter table public.emergency_contacts enable row level security;

create policy "un utilisateur gère ses propres contacts d'urgence"
  on public.emergency_contacts for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- NUMÉROS DE CONFIANCE (Alerte Enlèvement) — jusqu'à 3 par utilisateur
-- ---------------------------------------------------------------------------
create table public.trusted_numbers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  slot smallint not null check (slot between 1 and 3),
  label text not null default '',
  full_name text not null,
  phone text not null,
  created_at timestamptz not null default now(),
  unique (user_id, slot)
);

alter table public.trusted_numbers enable row level security;

create policy "un utilisateur gère ses propres numéros de confiance"
  on public.trusted_numbers for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- JETONS DE NOTIFICATION PUSH (Expo)
-- ---------------------------------------------------------------------------
create table public.push_tokens (
  user_id uuid not null references public.profiles (id) on delete cascade,
  expo_push_token text not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, expo_push_token)
);

alter table public.push_tokens enable row level security;

create policy "un utilisateur gère ses propres jetons push"
  on public.push_tokens for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- ALERTES VIOLENCE
-- ---------------------------------------------------------------------------
create table public.violence_alerts (
  id uuid primary key default gen_random_uuid(),
  victim_id uuid not null references public.profiles (id) on delete cascade,
  victim_name text not null,
  victim_phone text not null,
  triggered_by text not null check (triggered_by in ('cri', 'manuel')),
  status text not null default 'active' check (status in ('active', 'stopped', 'resolved')),
  latitude double precision,
  longitude double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.violence_alerts enable row level security;

-- La victime voit et gère ses propres alertes.
create policy "la victime gère ses propres alertes"
  on public.violence_alerts for all
  using (auth.uid() = victim_id) with check (auth.uid() = victim_id);

-- Un contact d'urgence enregistré par la victime peut voir/mettre à jour
-- (couper la sirène) une alerte qui lui est destinée.
create policy "un contact d'urgence désigné voit l'alerte qui lui est destinée"
  on public.violence_alerts for select
  using (
    exists (
      select 1 from public.emergency_contacts ec
      join public.profiles me on me.id = auth.uid()
      where ec.user_id = violence_alerts.victim_id
        and ec.phone = me.phone
    )
  );

create policy "un contact d'urgence désigné peut couper la sirène"
  on public.violence_alerts for update
  using (
    exists (
      select 1 from public.emergency_contacts ec
      join public.profiles me on me.id = auth.uid()
      where ec.user_id = violence_alerts.victim_id
        and ec.phone = me.phone
    )
  );

-- Journal : qui a coupé la sirène et quand (plusieurs contacts possibles).
create table public.violence_alert_stops (
  alert_id uuid not null references public.violence_alerts (id) on delete cascade,
  contact_id uuid not null references public.profiles (id) on delete cascade,
  stopped_at timestamptz not null default now(),
  primary key (alert_id, contact_id)
);

alter table public.violence_alert_stops enable row level security;

create policy "la victime et le contact concerné voient l'arrêt de sirène"
  on public.violence_alert_stops for select
  using (
    auth.uid() = contact_id
    or exists (select 1 from public.violence_alerts a where a.id = alert_id and a.victim_id = auth.uid())
  );

create policy "un contact enregistre lui-même l'arrêt de la sirène"
  on public.violence_alert_stops for insert
  with check (auth.uid() = contact_id);

-- ---------------------------------------------------------------------------
-- JOURNAL DES RECHERCHES ALERTE ENLÈVEMENT (transparence + sécurité)
-- ---------------------------------------------------------------------------
create table public.kidnap_search_logs (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references public.profiles (id) on delete set null,
  requester_phone text not null,
  target_phone text not null,
  authorized boolean not null,
  created_at timestamptz not null default now()
);

alter table public.kidnap_search_logs enable row level security;

create policy "un utilisateur voit qui a recherché son numéro"
  on public.kidnap_search_logs for select
  using (
    requester_id = auth.uid()
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.phone = target_phone)
  );

-- ---------------------------------------------------------------------------
-- ABONNEMENTS & PAIEMENTS MOBILE MONEY
-- ---------------------------------------------------------------------------
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan text not null check (plan in ('premium')),
  amount integer not null default 3000,
  currency text not null default 'XOF',
  provider text not null check (provider in ('orange', 'mtn', 'moov', 'wave')),
  status text not null default 'en_attente' check (status in ('en_attente', 'reussi', 'echoue')),
  external_reference text,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

alter table public.payments enable row level security;

create policy "un utilisateur voit ses propres paiements"
  on public.payments for select using (auth.uid() = user_id);
create policy "un utilisateur initie ses propres paiements"
  on public.payments for insert with check (auth.uid() = user_id);
create policy "les admins voient tous les paiements"
  on public.payments for select using (public.is_admin(auth.uid()));

-- ---------------------------------------------------------------------------
-- ADMINISTRATION — dashboard caché, jamais lié depuis l'app utilisateur
-- ---------------------------------------------------------------------------
create table public.admin_roles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  phone text not null unique,
  role text not null check (role in ('admin_principal', 'editeur')),
  permissions text[] not null default '{}',
  status text not null default 'en_attente' check (status in ('actif', 'en_attente', 'suspendu')),
  invited_by uuid references public.admin_roles (id),
  created_at timestamptz not null default now()
);

alter table public.admin_roles enable row level security;

create policy "un admin voit sa propre fiche"
  on public.admin_roles for select using (auth.uid() = id);
create policy "l'admin principal voit toute l'équipe"
  on public.admin_roles for select
  using (exists (select 1 from public.admin_roles a where a.id = auth.uid() and a.role = 'admin_principal' and a.status = 'actif'));

-- Toute écriture (invitation, validation, changement de rôle) passe par la
-- fonction Edge `admin-manage-editors`, exécutée avec la clé de service, afin
-- d'éviter les policies RLS récursives sur une table qui définit elle-même
-- les droits d'écriture.

-- ---------------------------------------------------------------------------
-- Création automatique du profil à l'inscription Supabase Auth
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer as $$
begin
  insert into public.profiles (id, first_name, last_name, phone, commune)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'commune', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Index utiles
-- ---------------------------------------------------------------------------
create index idx_emergency_contacts_phone on public.emergency_contacts (phone);
create index idx_trusted_numbers_phone on public.trusted_numbers (phone);
create index idx_violence_alerts_victim on public.violence_alerts (victim_id, status);
create index idx_payments_user on public.payments (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Realtime : permet aux contacts d'urgence de recevoir les mises à jour
-- d'alerte (déclenchement + arrêt de sirène) instantanément.
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.violence_alerts;
alter publication supabase_realtime add table public.profiles;
