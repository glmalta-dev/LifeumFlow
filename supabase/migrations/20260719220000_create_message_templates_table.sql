-- Migração Fase 4: Criação da tabela message_templates para modelos de mensagens de WhatsApp
-- Criado em: 19/07/2026

create table if not exists public.message_templates (
  id uuid default gen_random_uuid() primary key,
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  title text not null,
  body_text text not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar RLS
alter table public.message_templates enable row level security;

-- Criar políticas RLS baseadas em membership
create policy message_templates_select on public.message_templates
  for select to authenticated
  using (
    exists (
      select 1 from public.clinic_members cm
      where cm.user_id = auth.uid() and cm.clinic_id = clinic_id and cm.active = true
    )
  );

create policy message_templates_insert on public.message_templates
  for insert to authenticated
  with check (
    exists (
      select 1 from public.clinic_members cm
      where cm.user_id = auth.uid() and cm.clinic_id = clinic_id and cm.active = true
    )
  );

create policy message_templates_update on public.message_templates
  for update to authenticated
  using (
    exists (
      select 1 from public.clinic_members cm
      where cm.user_id = auth.uid() and cm.clinic_id = clinic_id and cm.active = true
    )
  )
  with check (
    exists (
      select 1 from public.clinic_members cm
      where cm.user_id = auth.uid() and cm.clinic_id = clinic_id and cm.active = true
    )
  );

create policy message_templates_delete on public.message_templates
  for delete to authenticated
  using (
    exists (
      select 1 from public.clinic_members cm
      where cm.user_id = auth.uid() and cm.clinic_id = clinic_id and cm.active = true
    )
  );
