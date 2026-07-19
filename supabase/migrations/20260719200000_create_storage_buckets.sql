-- Migração Fase 2: Configuração do bucket privado do Supabase Storage para exames e arquivos
-- Criado em: 19/07/2026

-- 1. Registrar o bucket privado 'patient-exams'
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'patient-exams', 
  'patient-exams', 
  false, -- bucket privado
  52428800, -- limite de 50MB por arquivo
  array['image/jpeg', 'image/png', 'application/pdf']
)
on conflict (id) do nothing;


-- 3. Criar políticas RLS para permitir acesso de leitura/escrita seguro a usuários autenticados
create policy "Acesso de leitura para usuarios autenticados no bucket patient-exams"
on storage.objects for select
to authenticated
using (
  bucket_id = 'patient-exams'
);

create policy "Permitir insercao de arquivos para usuarios autenticados no bucket patient-exams"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'patient-exams'
);

create policy "Permitir exclusao de arquivos para usuarios autenticados no bucket patient-exams"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'patient-exams'
);
