alter table public.projects add column if not exists is_public boolean not null default false;
alter table public.projects add column if not exists share_id uuid unique default gen_random_uuid();

drop policy if exists "projects_select_own" on public.projects;
create policy "projects_select_own"
  on public.projects for select
  using (auth.uid() = user_id or is_public = true);

drop policy if exists "projects_update_own" on public.projects;
create policy "projects_update_own"
  on public.projects for update
  using (auth.uid() = user_id);
