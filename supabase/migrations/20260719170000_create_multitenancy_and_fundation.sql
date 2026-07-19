-- Migração Fase 0: Fundação de segurança, autenticação e multitenancy
-- Criado em: 19/07/2026

-- 1. Criação das tabelas estruturais
create table if not exists public.clinics (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  slug text not null unique check (length(trim(slug)) > 0),
  status text not null default 'active' check (status in ('active', 'suspended', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  phone text,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clinic_members (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'dentist', 'reception', 'assistant', 'read_only')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint clinic_members_unique_membership unique (clinic_id, user_id)
);

create table if not exists public.professionals (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid not null references public.clinics(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  register_number text,
  specialty text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.professional_users (
  id uuid primary key default gen_random_uuid(),
  professional_id uuid not null references public.professionals(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  constraint professional_users_unique_link unique (professional_id, user_id)
);

-- 2. Habilitar RLS nas novas tabelas
alter table public.clinics enable row level security;
alter table public.profiles enable row level security;
alter table public.clinic_members enable row level security;
alter table public.professionals enable row level security;
alter table public.professional_users enable row level security;

-- 3. Criação da clínica padrão inicial para o backfill
insert into public.clinics (id, name, slug, status)
values ('00000000-0000-0000-0000-000000000000', 'Clinica Padrao', 'clinica-padrao', 'active')
on conflict (id) do nothing;

-- 4. Adicionar coluna clinic_id nas tabelas operacionais existentes
alter table public.patients add column if not exists clinic_id uuid references public.clinics(id) on delete cascade;
alter table public.appointments add column if not exists clinic_id uuid references public.clinics(id) on delete cascade;
alter table public.tasks add column if not exists clinic_id uuid references public.clinics(id) on delete cascade;
alter table public.evolutions add column if not exists clinic_id uuid references public.clinics(id) on delete cascade;
alter table public.files add column if not exists clinic_id uuid references public.clinics(id) on delete cascade;
alter table public.leads add column if not exists clinic_id uuid references public.clinics(id) on delete cascade;
alter table public.flows add column if not exists clinic_id uuid references public.clinics(id) on delete cascade;

-- 5. Executar o Backfill de registros órfãos antigos para a clínica padrão
update public.patients set clinic_id = '00000000-0000-0000-0000-000000000000' where clinic_id is null;
update public.appointments set clinic_id = '00000000-0000-0000-0000-000000000000' where clinic_id is null;
update public.tasks set clinic_id = '00000000-0000-0000-0000-000000000000' where clinic_id is null;
update public.evolutions set clinic_id = '00000000-0000-0000-0000-000000000000' where clinic_id is null;
update public.files set clinic_id = '00000000-0000-0000-0000-000000000000' where clinic_id is null;
update public.leads set clinic_id = '00000000-0000-0000-0000-000000000000' where clinic_id is null;
update public.flows set clinic_id = '00000000-0000-0000-0000-000000000000' where clinic_id is null;

-- 6. Forçar NOT NULL na coluna clinic_id nas tabelas operacionais
alter table public.patients alter column clinic_id set not null;
alter table public.appointments alter column clinic_id set not null;
alter table public.tasks alter column clinic_id set not null;
alter table public.evolutions alter column clinic_id set not null;
alter table public.files alter column clinic_id set not null;
alter table public.leads alter column clinic_id set not null;
alter table public.flows alter column clinic_id set not null;

-- 7. Remoção das políticas RLS antigas gerais baseadas puramente em auth.uid() is not null
do $$
declare
  t_name text;
begin
  foreach t_name in array array['patients','appointments','tasks','evolutions','files','leads','flows']
  loop
    execute format('drop policy if exists %I on public.%I', t_name || '_authenticated_select', t_name);
    execute format('drop policy if exists %I on public.%I', t_name || '_authenticated_insert', t_name);
    execute format('drop policy if exists %I on public.%I', t_name || '_authenticated_update', t_name);
    execute format('drop policy if exists %I on public.%I', t_name || '_authenticated_delete', t_name);
  end loop;
end $$;

-- 8. Criação das novas políticas RLS robustas baseadas em membership de clínica ativa (Multitenancy)
-- O usuário autenticado só pode operar em linhas cuja clinic_id corresponda a uma clínica da qual ele é membro ativo.

-- 8.1. Clinics: Usuários podem ler clínicas que pertencem
create policy clinics_member_select on public.clinics
  for select to authenticated
  using (
    exists (
      select 1 from public.clinic_members cm
      where cm.user_id = auth.uid() and cm.clinic_id = id and cm.active = true
    )
  );

-- 8.2. Profiles: Usuários podem gerenciar seu próprio perfil
create policy profiles_self_access on public.profiles
  for all to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 8.3. Clinic Members: Acesso ao cadastro de membros da clínica
create policy clinic_members_isolation on public.clinic_members
  for select to authenticated
  using (
    exists (
      select 1 from public.clinic_members cm
      where cm.user_id = auth.uid() and cm.clinic_id = clinic_id and cm.active = true
    )
  );

-- Apenas owners e admins podem modificar membros
create policy clinic_members_admin_write on public.clinic_members
  for all to authenticated
  using (
    exists (
      select 1 from public.clinic_members cm
      where cm.user_id = auth.uid() 
        and cm.clinic_id = clinic_id 
        and cm.active = true 
        and cm.role in ('owner', 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.clinic_members cm
      where cm.user_id = auth.uid() 
        and cm.clinic_id = clinic_id 
        and cm.active = true 
        and cm.role in ('owner', 'admin')
    )
  );

-- 8.4. Professionals & Professional Users
create policy professionals_select on public.professionals
  for select to authenticated
  using (
    exists (
      select 1 from public.clinic_members cm
      where cm.user_id = auth.uid() and cm.clinic_id = clinic_id and cm.active = true
    )
  );

create policy professionals_write on public.professionals
  for all to authenticated
  using (
    exists (
      select 1 from public.clinic_members cm
      where cm.user_id = auth.uid() 
        and cm.clinic_id = clinic_id 
        and cm.active = true 
        and cm.role in ('owner', 'admin')
    )
  )
  with check (
    exists (
      select 1 from public.clinic_members cm
      where cm.user_id = auth.uid() 
        and cm.clinic_id = clinic_id 
        and cm.active = true 
        and cm.role in ('owner', 'admin')
    )
  );

-- 8.5. Políticas Isoladas de Clínica para tabelas operacionais (patients, appointments, tasks, evolutions, files, leads, flows)
do $$
declare
  tbl text;
begin
  foreach tbl in array array['patients','appointments','tasks','evolutions','files','leads','flows']
  loop
    -- Leitura geral para membros ativos
    execute format('
      create policy %I on public.%I
      for select to authenticated
      using (
        exists (
          select 1 from public.clinic_members cm
          where cm.user_id = auth.uid() and cm.clinic_id = clinic_id and cm.active = true
        )
      )
    ', tbl || '_clinic_select', tbl);

    -- Escrita geral para membros ativos com papel apropriado (owners, admins, dentists, reception)
    execute format('
      create policy %I on public.%I
      for all to authenticated
      using (
        exists (
          select 1 from public.clinic_members cm
          where cm.user_id = auth.uid() 
            and cm.clinic_id = clinic_id 
            and cm.active = true 
            and cm.role in (''owner'', ''admin'', ''dentist'', ''reception'')
        )
      )
      with check (
        exists (
          select 1 from public.clinic_members cm
          where cm.user_id = auth.uid() 
            and cm.clinic_id = clinic_id 
            and cm.active = true 
            and cm.role in (''owner'', ''admin'', ''dentist'', ''reception'')
        )
      )
    ', tbl || '_clinic_write', tbl);
  end loop;
end $$;

-- 9. Trigger para criar perfil e associar à clínica padrão automaticamente ao cadastrar usuário no Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  -- Cria o perfil
  insert into public.profiles (id, name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Administrador Clinico'), new.phone);

  -- Associa à clínica padrão
  insert into public.clinic_members (clinic_id, user_id, role, active)
  values ('00000000-0000-0000-0000-000000000000', new.id, 'owner', true)
  on conflict (clinic_id, user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
