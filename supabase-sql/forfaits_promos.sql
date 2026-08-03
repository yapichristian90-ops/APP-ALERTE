-- ============================================================================
-- ALERTE CI — Forfaits, abonnements et promotions
-- ----------------------------------------------------------------------------
-- À exécuter UNE SEULE FOIS dans Supabase (SQL Editor → coller → Run).
-- Permet de gérer depuis le dashboard : les forfaits (prix, durée), les codes
-- promo, les bonus premium et la liste des abonnés.
-- ============================================================================

-- ── Table des forfaits ──────────────────────────────────────────────────────
create table if not exists public.forfaits (
  id           bigserial primary key,
  slug         text not null unique,            -- 'gratuit', 'premium', ...
  nom          text not null,
  prix         integer not null default 0,      -- en FCFA
  duree_jours  integer not null default 0,      -- 0 = illimité / sans durée
  description  text,
  actif        boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table public.forfaits enable row level security;
drop policy if exists "forfaits_read" on public.forfaits;
create policy "forfaits_read" on public.forfaits for select using (true);
drop policy if exists "forfaits_write" on public.forfaits;
create policy "forfaits_write" on public.forfaits for insert with check (true);
drop policy if exists "forfaits_update" on public.forfaits;
create policy "forfaits_update" on public.forfaits for update using (true);

-- Forfaits de base (ne réécrit pas s'ils existent déjà)
insert into public.forfaits (slug, nom, prix, duree_jours, actif) values
  ('gratuit', 'Gratuit', 0, 0, true),
  ('premium', 'Premium annuel', 10000, 365, true),
  ('premium_mensuel', 'Premium mensuel', 1000, 30, true)
on conflict (slug) do nothing;

-- ── Colonne d'expiration du premium sur les profils ─────────────────────────
alter table public.profiles add column if not exists premium_expire timestamptz;

-- ── Table des promotions ────────────────────────────────────────────────────
create table if not exists public.promos (
  id           bigserial primary key,
  code         text not null unique,
  reduction    integer not null default 0,      -- pourcentage (0-100)
  duree_jours  integer not null default 0,      -- durée offerte par la promo
  actif        boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table public.promos enable row level security;
drop policy if exists "promos_read" on public.promos;
create policy "promos_read" on public.promos for select using (true);
drop policy if exists "promos_write" on public.promos;
create policy "promos_write" on public.promos for insert with check (true);
drop policy if exists "promos_update" on public.promos;
create policy "promos_update" on public.promos for update using (true);

-- ----------------------------------------------------------------------------
-- NOTE : comme les autres tables, l'accès se fait avec la clé publique. Pour la
-- mise en production réelle (paiement, activation premium), la vérification
-- devra passer par une Edge Function côté serveur. Voir la note du fichier
-- admins.sql et le point « paiement premium » que nous intégrerons avec le vrai
-- lien de paiement.
-- ----------------------------------------------------------------------------
