-- Lifeum Flow MVP: isolamento multitenant, Storage por clinica e schema operacional.
-- Esta migration corrige policies anteriores em que clinic_id era comparada consigo mesma.

create schema if not exists private;
revoke all on schema private from public, anon;

create or replace function private.is_clinic_member(
  target_clinic_id uuid,
  allowed_roles text[] default null
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.clinic_members as membership
    where membership.user_id = (select auth.uid())
      and membership.clinic_id = target_clinic_id
      and membership.active = true
      and (allowed_roles is null or membership.role = any(allowed_roles))
  );
$$;

revoke all on function private.is_clinic_member(uuid, text[]) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.is_clinic_member(uuid, text[]) to authenticated;

create index if not exists clinic_members_user_clinic_active_idx
  on public.clinic_members (user_id, clinic_id) where active = true;

-- Remove policies defeituosas e recria uma policy por operacao.
do $$
declare
  protected_table text;
  policy_record record;
begin
  foreach protected_table in array array[
    'patients', 'appointments', 'tasks', 'evolutions', 'files', 'leads',
    'flows', 'patient_planners', 'message_templates'
  ] loop
    for policy_record in
      select policyname from pg_policies
      where schemaname = 'public' and tablename = protected_table
    loop
      execute format('drop policy if exists %I on public.%I', policy_record.policyname, protected_table);
    end loop;

    execute format(
      'create policy %I on public.%I for select to authenticated using ((select private.is_clinic_member(%I.clinic_id)))',
      protected_table || '_tenant_select', protected_table, protected_table
    );
    execute format(
      'create policy %I on public.%I for insert to authenticated with check ((select private.is_clinic_member(%I.clinic_id, array[''owner'',''admin'',''dentist'',''reception''])))',
      protected_table || '_tenant_insert', protected_table, protected_table
    );
    execute format(
      'create policy %I on public.%I for update to authenticated using ((select private.is_clinic_member(%I.clinic_id, array[''owner'',''admin'',''dentist'',''reception'']))) with check ((select private.is_clinic_member(%I.clinic_id, array[''owner'',''admin'',''dentist'',''reception''])))',
      protected_table || '_tenant_update', protected_table, protected_table, protected_table
    );
    execute format(
      'create policy %I on public.%I for delete to authenticated using ((select private.is_clinic_member(%I.clinic_id, array[''owner'',''admin''])))',
      protected_table || '_tenant_delete', protected_table, protected_table
    );

    execute format('create index if not exists %I on public.%I (clinic_id)', protected_table || '_clinic_id_idx', protected_table);
  end loop;
end $$;

drop policy if exists clinics_member_select on public.clinics;
create policy clinics_member_select on public.clinics
  for select to authenticated
  using ((select private.is_clinic_member(clinics.id)));

drop policy if exists clinic_members_isolation on public.clinic_members;
drop policy if exists clinic_members_admin_write on public.clinic_members;
create policy clinic_members_tenant_select on public.clinic_members
  for select to authenticated
  using ((select private.is_clinic_member(clinic_members.clinic_id)));
create policy clinic_members_tenant_insert on public.clinic_members
  for insert to authenticated
  with check ((select private.is_clinic_member(clinic_members.clinic_id, array['owner','admin'])));
create policy clinic_members_tenant_update on public.clinic_members
  for update to authenticated
  using ((select private.is_clinic_member(clinic_members.clinic_id, array['owner','admin'])))
  with check ((select private.is_clinic_member(clinic_members.clinic_id, array['owner','admin'])));
create policy clinic_members_tenant_delete on public.clinic_members
  for delete to authenticated
  using ((select private.is_clinic_member(clinic_members.clinic_id, array['owner','admin'])));

drop policy if exists professionals_select on public.professionals;
drop policy if exists professionals_write on public.professionals;
create policy professionals_tenant_select on public.professionals
  for select to authenticated
  using ((select private.is_clinic_member(professionals.clinic_id)));
create policy professionals_tenant_write on public.professionals
  for all to authenticated
  using ((select private.is_clinic_member(professionals.clinic_id, array['owner','admin'])))
  with check ((select private.is_clinic_member(professionals.clinic_id, array['owner','admin'])));

-- Storage: o primeiro segmento do caminho deve ser uma clinica do usuario.
drop policy if exists "Acesso de leitura para usuarios autenticados no bucket patient-exams" on storage.objects;
drop policy if exists "Permitir insercao de arquivos para usuarios autenticados no bucket patient-exams" on storage.objects;
drop policy if exists "Permitir exclusao de arquivos para usuarios autenticados no bucket patient-exams" on storage.objects;

create policy patient_exams_tenant_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'patient-exams'
    and (select private.is_clinic_member(((storage.foldername(name))[1])::uuid))
  );
create policy patient_exams_tenant_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'patient-exams'
    and array_length(storage.foldername(name), 1) >= 3
    and (select private.is_clinic_member(((storage.foldername(name))[1])::uuid, array['owner','admin','dentist','reception']))
  );
create policy patient_exams_tenant_update on storage.objects
  for update to authenticated
  using (
    bucket_id = 'patient-exams'
    and (select private.is_clinic_member(((storage.foldername(name))[1])::uuid, array['owner','admin','dentist','reception']))
  )
  with check (
    bucket_id = 'patient-exams'
    and (select private.is_clinic_member(((storage.foldername(name))[1])::uuid, array['owner','admin','dentist','reception']))
  );
create policy patient_exams_tenant_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'patient-exams'
    and (select private.is_clinic_member(((storage.foldername(name))[1])::uuid, array['owner','admin']))
  );

-- Campos operacionais do MVP.
alter table public.tasks add column if not exists task_type text not null default 'contact';
alter table public.tasks add column if not exists responsible text;
alter table public.tasks add column if not exists due_time time;
alter table public.tasks add column if not exists origin text;
alter table public.tasks add column if not exists waiting_condition text;
alter table public.tasks add column if not exists next_action text;
alter table public.tasks add column if not exists completed_at timestamptz;
alter table public.tasks add column if not exists outcome text;

alter table public.appointments add column if not exists outcome text;
alter table public.appointments add column if not exists task_id text references public.tasks(id) on delete set null;
alter table public.appointments add column if not exists planner_id uuid references public.patient_planners(id) on delete set null;

alter table public.evolutions add column if not exists appointment_id text references public.appointments(id) on delete set null;
alter table public.evolutions add column if not exists complication text;
alter table public.evolutions add column if not exists conduct text;
alter table public.evolutions add column if not exists guidance text;
alter table public.evolutions add column if not exists change_reason text;

create table if not exists public.evolution_revisions (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  evolution_id text not null references public.evolutions(id) on delete cascade,
  previous_data jsonb not null,
  current_data jsonb not null,
  change_reason text not null,
  changed_by uuid not null default auth.uid(),
  changed_at timestamptz not null default now()
);
alter table public.evolution_revisions enable row level security;
create index if not exists evolution_revisions_clinic_evolution_idx on public.evolution_revisions (clinic_id, evolution_id);
create policy evolution_revisions_tenant_select on public.evolution_revisions
  for select to authenticated using ((select private.is_clinic_member(evolution_revisions.clinic_id)));
create policy evolution_revisions_tenant_insert on public.evolution_revisions
  for insert to authenticated with check ((select private.is_clinic_member(evolution_revisions.clinic_id, array['owner','admin','dentist'])));

alter table public.files add column if not exists title text;
alter table public.files add column if not exists category text not null default 'outros';
alter table public.files add column if not exists notes text;
alter table public.files add column if not exists external_url text;
alter table public.files add column if not exists appointment_id text references public.appointments(id) on delete set null;
alter table public.files add column if not exists planner_id uuid references public.patient_planners(id) on delete set null;
alter table public.files add column if not exists evolution_id text references public.evolutions(id) on delete set null;

create table if not exists public.plan_workflows (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  patient_id text not null references public.patients(id) on delete cascade,
  area_id text not null,
  name text not null,
  status text not null default 'active' check (status in ('active','paused','completed','cancelled')),
  responsible text,
  description text,
  start_date date,
  next_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.plan_steps (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  workflow_id uuid not null references public.plan_workflows(id) on delete cascade,
  title text not null,
  status text not null default 'pending' check (status in ('pending','in_progress','completed','skipped','cancelled')),
  due_date date,
  notes text,
  responsible text,
  sort_order integer not null default 0,
  task_id text references public.tasks(id) on delete set null,
  depends_on uuid references public.plan_steps(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.plan_workflows enable row level security;
alter table public.plan_steps enable row level security;
create index if not exists plan_workflows_clinic_patient_idx on public.plan_workflows (clinic_id, patient_id);
create index if not exists plan_steps_clinic_workflow_order_idx on public.plan_steps (clinic_id, workflow_id, sort_order);

create policy plan_workflows_tenant_select on public.plan_workflows for select to authenticated
  using ((select private.is_clinic_member(plan_workflows.clinic_id)));
create policy plan_workflows_tenant_write on public.plan_workflows for all to authenticated
  using ((select private.is_clinic_member(plan_workflows.clinic_id, array['owner','admin','dentist','reception'])))
  with check ((select private.is_clinic_member(plan_workflows.clinic_id, array['owner','admin','dentist','reception'])));
create policy plan_steps_tenant_select on public.plan_steps for select to authenticated
  using ((select private.is_clinic_member(plan_steps.clinic_id)));
create policy plan_steps_tenant_write on public.plan_steps for all to authenticated
  using ((select private.is_clinic_member(plan_steps.clinic_id, array['owner','admin','dentist','reception'])))
  with check ((select private.is_clinic_member(plan_steps.clinic_id, array['owner','admin','dentist','reception'])));

alter table public.message_templates add column if not exists sort_order integer not null default 0;
alter table public.message_templates add column if not exists updated_at timestamptz not null default now();

grant select, insert, update, delete on public.patient_planners, public.message_templates,
  public.evolution_revisions, public.plan_workflows, public.plan_steps to authenticated;

insert into public.message_templates (clinic_id, title, body_text, is_active, sort_order)
select '00000000-0000-0000-0000-000000000000', seed.title, seed.body, true, seed.position
from (values
  ('Solicitar dados', 'Ola {primeiro_nome}, poderia nos enviar os dados necessarios para continuarmos seu atendimento?', 30),
  ('Reagendar', 'Ola {primeiro_nome}, precisamos reagendar seu horario. Qual data e periodo funcionam melhor para voce?', 60),
  ('Mensagem livre', 'Ola {primeiro_nome}, ', 90)
) as seed(title, body, position)
where not exists (
  select 1 from public.message_templates current_template
  where current_template.clinic_id = '00000000-0000-0000-0000-000000000000'
    and current_template.title = seed.title
);
