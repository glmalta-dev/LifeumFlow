-- Migração Fase 1: Colunas físicas de dados cadastrais e sexo na tabela patients
-- Criado em: 19/07/2026

-- 1. Adicionar colunas físicas de endereço e sexo na tabela patients
alter table public.patients add column if not exists sex text default 'not_informed' check (sex in ('female', 'male', 'intersex', 'not_informed'));
alter table public.patients add column if not exists cep text;
alter table public.patients add column if not exists street text;
alter table public.patients add column if not exists number text;
alter table public.patients add column if not exists complement text;
alter table public.patients add column if not exists neighborhood text;
alter table public.patients add column if not exists city text;
alter table public.patients add column if not exists state text;

-- 2. Procedure de Migração e Backfill dos metadados [META:...] contidos na coluna notes para as colunas físicas
do $$
declare
  r record;
  meta_json jsonb;
  meta_start int;
  meta_str text;
  clean_notes text;
begin
  for r in select id, notes from public.patients loop
    if r.notes like '%\n\n[META:%]' then
      -- Extrai a string JSON do metadado
      meta_start := position('\n\n[META:' in r.notes);
      meta_str := substring(r.notes from meta_start + 8 for length(r.notes) - meta_start - 8);
      clean_notes := substring(r.notes from 1 for meta_start - 1);
      
      begin
        meta_json := meta_str::jsonb;
        
        -- Atualiza a linha com os valores estruturados do JSON
        update public.patients
        set 
          cep = coalesce(meta_json->>'postalCode', cep),
          street = coalesce(meta_json->>'address', street),
          number = coalesce(meta_json->>'addressNumber', number),
          complement = coalesce(meta_json->>'addressComplement', complement),
          neighborhood = coalesce(meta_json->>'neighborhood', neighborhood),
          city = coalesce(meta_json->>'city', city),
          state = coalesce(meta_json->>'state', state),
          notes = clean_notes
        where id = r.id;
      exception when others then
        raise warning 'Falha ao converter metadados do paciente %: %', r.id, sqlerrm;
      end;
    end if;
  end loop;
end $$;
