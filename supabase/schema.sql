-- Enable RLS (Row Level Security)
alter table if exists public.timeline_topics enable row level security;
alter table if exists public.timeline_events enable row level security;
alter table if exists public.mind_topics enable row level security;
alter table if exists public.mind_cards enable row level security;

-- Timeline Topics Table
create table if not exists public.timeline_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Timeline Events Table
create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.timeline_topics(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  time text not null,
  title text not null,
  description text,
  tags text[],
  source text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Mind Topics Table
create table if not exists public.mind_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Mind Cards Table
create table if not exists public.mind_cards (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.mind_topics(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  definition text,
  key_points text[],
  examples text[],
  conclusion text,
  tags text[],
  source text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS Policies for Timeline Topics
create policy "Users can view own timeline topics"
  on public.timeline_topics for select
  using (auth.uid() = user_id);

create policy "Users can insert own timeline topics"
  on public.timeline_topics for insert
  with check (auth.uid() = user_id);

create policy "Users can update own timeline topics"
  on public.timeline_topics for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own timeline topics"
  on public.timeline_topics for delete
  using (auth.uid() = user_id);

-- RLS Policies for Timeline Events
create policy "Users can view own timeline events"
  on public.timeline_events for select
  using (auth.uid() = user_id);

create policy "Users can insert own timeline events"
  on public.timeline_events for insert
  with check (auth.uid() = user_id);

create policy "Users can update own timeline events"
  on public.timeline_events for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own timeline events"
  on public.timeline_events for delete
  using (auth.uid() = user_id);

-- RLS Policies for Mind Topics
create policy "Users can view own mind topics"
  on public.mind_topics for select
  using (auth.uid() = user_id);

create policy "Users can insert own mind topics"
  on public.mind_topics for insert
  with check (auth.uid() = user_id);

create policy "Users can update own mind topics"
  on public.mind_topics for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own mind topics"
  on public.mind_topics for delete
  using (auth.uid() = user_id);

-- RLS Policies for Mind Cards
create policy "Users can view own mind cards"
  on public.mind_cards for select
  using (auth.uid() = user_id);

create policy "Users can insert own mind cards"
  on public.mind_cards for insert
  with check (auth.uid() = user_id);

create policy "Users can update own mind cards"
  on public.mind_cards for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own mind cards"
  on public.mind_cards for delete
  using (auth.uid() = user_id);

-- Indexes for better performance
create index if not exists timeline_topics_user_id_idx on public.timeline_topics(user_id);
create index if not exists timeline_events_topic_id_idx on public.timeline_events(topic_id);
create index if not exists timeline_events_user_id_idx on public.timeline_events(user_id);
create index if not exists timeline_events_time_idx on public.timeline_events(time);
create index if not exists mind_topics_user_id_idx on public.mind_topics(user_id);
create index if not exists mind_cards_topic_id_idx on public.mind_cards(topic_id);
create index if not exists mind_cards_user_id_idx on public.mind_cards(user_id);

-- Functions for updating timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updating timestamps
drop trigger if exists handle_timeline_topics_updated_at on public.timeline_topics;
create trigger handle_timeline_topics_updated_at
  before update on public.timeline_topics
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_timeline_events_updated_at on public.timeline_events;
create trigger handle_timeline_events_updated_at
  before update on public.timeline_events
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_mind_topics_updated_at on public.mind_topics;
create trigger handle_mind_topics_updated_at
  before update on public.mind_topics
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_mind_cards_updated_at on public.mind_cards;
create trigger handle_mind_cards_updated_at
  before update on public.mind_cards
  for each row execute procedure public.handle_updated_at();
