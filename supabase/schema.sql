-- Game On! — Supabase schema for v1 (favorites + RLS)
-- Paste this into the SQL editor in your Supabase project.

create extension if not exists "pgcrypto";

create table if not exists public.favorite_teams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  league text not null,
  team_id text not null,
  team_name text not null,
  team_abbreviation text,
  team_logo_url text,
  created_at timestamptz not null default now(),
  unique (user_id, league, team_id)
);

create index if not exists favorite_teams_user_idx on public.favorite_teams (user_id);

alter table public.favorite_teams enable row level security;

drop policy if exists "favorites: select own" on public.favorite_teams;
create policy "favorites: select own"
  on public.favorite_teams
  for select
  using (auth.uid() = user_id);

drop policy if exists "favorites: insert own" on public.favorite_teams;
create policy "favorites: insert own"
  on public.favorite_teams
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "favorites: delete own" on public.favorite_teams;
create policy "favorites: delete own"
  on public.favorite_teams
  for delete
  using (auth.uid() = user_id);
