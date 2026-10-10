create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  type text not null check (type in ('upgrade', 'integration', 'alternatives')),
  framework text not null,
  query text not null,
  input jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  sources jsonb not null default '[]'::jsonb,
  is_public boolean not null default false,
  share_id uuid unique default gen_random_uuid(),
  created_at timestamptz not null default now()
);

create index if not exists projects_user_id_created_at_idx
  on public.projects (user_id, created_at desc);

alter table public.projects enable row level security;

drop policy if exists "projects_select_own" on public.projects;
drop policy if exists "projects_insert_own" on public.projects;
drop policy if exists "projects_delete_own" on public.projects;
drop policy if exists "projects_update_own" on public.projects;
drop policy if exists "projects_select_public" on public.projects;

create policy "projects_select_own"
  on public.projects for select
  using (auth.uid() = user_id or is_public = true);

create policy "projects_insert_own"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "projects_update_own"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "projects_delete_own"
  on public.projects for delete
  using (auth.uid() = user_id);
