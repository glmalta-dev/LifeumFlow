-- Migração Fase 3: Criação da tabela patient_planners para persistência real de planejamentos clínicos
-- Criado em: 19/07/2026

create table if not exists public.patient_planners (
  id uuid default gen_random_uuid() primary key,
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  patient_id text not null references public.patients(id) on delete cascade,
  area_id text not null,
  checklist jsonb not null default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(clinic_id, patient_id, area_id)
);

-- Habilitar RLS
alter table public.patient_planners enable row level security;

-- Criar políticas RLS baseadas em membership
create policy patient_planners_select on public.patient_planners
  for select to authenticated
  using (
    exists (
      select 1 from public.clinic_members cm
      where cm.user_id = auth.uid() and cm.clinic_id = clinic_id and cm.active = true
    )
  );

create policy patient_planners_insert on public.patient_planners
  for insert to authenticated
  with check (
    exists (
      select 1 from public.clinic_members cm
      where cm.user_id = auth.uid() and cm.clinic_id = clinic_id and cm.active = true
    )
  );

create policy patient_planners_update on public.patient_planners
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

create policy patient_planners_delete on public.patient_planners
  for delete to authenticated
  using (
    exists (
      select 1 from public.clinic_members cm
      where cm.user_id = auth.uid() and cm.clinic_id = clinic_id and cm.active = true
    )
  );
