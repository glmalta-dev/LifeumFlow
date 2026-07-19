-- Migração Fase 2: Colunas físicas na tabela appointments para detalhes de consultas
-- Criado em: 19/07/2026

-- 1. Adicionar colunas de duração, sala/cadeira, preparação e recorrência
alter table public.appointments add column if not exists duration integer default 30;
alter table public.appointments add column if not exists room_or_chair text;
alter table public.appointments add column if not exists preparation_interval integer default 10;
alter table public.appointments add column if not exists recurrence text default 'Nenhuma';
alter table public.appointments add column if not exists treatment_stage text;
alter table public.appointments add column if not exists reminder text;

-- 2. Procedure de Backfill dos metadados [META:...] contidos na coluna notes de appointments para as novas colunas físicas
do $$
declare
  r record;
  meta_json jsonb;
  meta_start int;
  meta_str text;
  clean_notes text;
begin
  for r in select id, notes from public.appointments loop
    if r.notes like '%\n\n[META:%]' then
      meta_start := position('\n\n[META:' in r.notes);
      meta_str := substring(r.notes from meta_start + 8 for length(r.notes) - meta_start - 8);
      clean_notes := substring(r.notes from 1 for meta_start - 1);
      
      begin
        meta_json := meta_str::jsonb;
        
        update public.appointments
        set 
          duration = coalesce((meta_json->>'duration')::integer, duration),
          room_or_chair = coalesce(meta_json->>'roomOrChair', room_or_chair),
          preparation_interval = coalesce((meta_json->>'preparationInterval')::integer, preparation_interval),
          recurrence = coalesce(meta_json->>'recurrence', recurrence),
          treatment_stage = coalesce(meta_json->>'treatmentStage', treatment_stage),
          reminder = coalesce(meta_json->>'reminder', reminder),
          notes = clean_notes
        where id = r.id;
      exception when others then
        raise warning 'Falha ao converter metadados do agendamento %: %', r.id, sqlerrm;
      end;
    end if;
  end loop;
end $$;
