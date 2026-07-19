create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth_key text not null,
  user_agent text,
  device_label text,
  active boolean not null default true,
  last_seen_at timestamptz not null default now(),
  last_delivery_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint push_subscriptions_endpoint_length check (char_length(endpoint) between 20 and 2048),
  constraint push_subscriptions_key_lengths check (
    char_length(p256dh) between 20 and 512
    and char_length(auth_key) between 8 and 256
  )
);

create index if not exists push_subscriptions_user_active_idx
  on public.push_subscriptions (user_id, active);
create index if not exists push_subscriptions_clinic_active_idx
  on public.push_subscriptions (clinic_id, active);

alter table public.push_subscriptions enable row level security;

revoke all on table public.push_subscriptions from anon, authenticated;
grant select, delete on table public.push_subscriptions to authenticated;

drop policy if exists push_subscriptions_owner_select on public.push_subscriptions;
create policy push_subscriptions_owner_select
  on public.push_subscriptions for select to authenticated
  using (
    user_id = (select auth.uid())
    and (select private.is_clinic_member(push_subscriptions.clinic_id))
  );

drop policy if exists push_subscriptions_owner_delete on public.push_subscriptions;
create policy push_subscriptions_owner_delete
  on public.push_subscriptions for delete to authenticated
  using (
    user_id = (select auth.uid())
    and (select private.is_clinic_member(push_subscriptions.clinic_id))
  );

comment on table public.push_subscriptions is
  'Inscricoes Web Push por dispositivo. Escritas sao feitas somente pela Edge Function com service role.';
