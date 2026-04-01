create table if not exists public.push_subscriptions (
  endpoint text primary key,
  subscription jsonb not null,
  user_id text,
  user_agent text,
  timezone text,
  reminder_preferences jsonb not null default '{}'::jsonb,
  schedule_snapshot jsonb not null default '[]'::jsonb,
  schedule_updated_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.push_subscriptions
  add column if not exists user_id text;

alter table public.push_subscriptions
  add column if not exists timezone text;

alter table public.push_subscriptions
  add column if not exists reminder_preferences jsonb not null default '{}'::jsonb;

alter table public.push_subscriptions
  add column if not exists schedule_snapshot jsonb not null default '[]'::jsonb;

alter table public.push_subscriptions
  add column if not exists schedule_updated_at timestamptz;

create index if not exists push_subscriptions_active_idx
  on public.push_subscriptions (active);

create index if not exists push_subscriptions_user_idx
  on public.push_subscriptions (user_id);
