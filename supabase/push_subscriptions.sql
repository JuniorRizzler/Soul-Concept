create table if not exists public.push_subscriptions (
  endpoint text primary key,
  subscription jsonb not null,
  user_agent text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists push_subscriptions_active_idx
  on public.push_subscriptions (active);
