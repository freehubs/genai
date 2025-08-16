-- Theme store by user (JSON document storage)
create table if not exists public.theme_stores (
  user_id uuid primary key references auth.users(id) on delete cascade,
  store jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.theme_stores enable row level security;

-- RLS: only the owner can access
create policy if not exists "select own store"
on public.theme_stores for select
using (auth.uid() = user_id);

create policy if not exists "insert own store"
on public.theme_stores for insert
with check (auth.uid() = user_id);

create policy if not exists "update own store"
on public.theme_stores for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy if not exists "delete own store"
on public.theme_stores for delete
using (auth.uid() = user_id);

create index if not exists idx_theme_stores_updated_at on public.theme_stores(updated_at desc);


