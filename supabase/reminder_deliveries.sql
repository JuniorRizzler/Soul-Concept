create table if not exists public.reminder_deliveries (
  delivery_key text primary key,
  endpoint text not null,
  user_id text,
  kind text not null,
  send_at timestamptz not null,
  status text not null default 'pending',
  title text,
  created_at timestamptz not null default now(),
  delivered_at timestamptz
);

create index if not exists reminder_deliveries_send_at_idx
  on public.reminder_deliveries (send_at desc);

create index if not exists reminder_deliveries_endpoint_idx
  on public.reminder_deliveries (endpoint);
