-- Migração Fase 5: Configuração do bucket público do Supabase Storage para fotos de perfil (avatars)
-- Criado em: 19/07/2026

-- 1. Registrar o bucket público 'avatars'
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars', 
  'avatars', 
  true, -- bucket público
  5242880, -- limite de 5MB por arquivo
  array['image/jpeg', 'image/png']
)
on conflict (id) do nothing;

-- 2. Criar políticas RLS para o bucket 'avatars'
create policy "Acesso publico de leitura no bucket avatars"
on storage.objects for select
to public
using (
  bucket_id = 'avatars'
);

create policy "Permitir insercao de avatares para usuarios autenticados"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars'
);

create policy "Permitir exclusao de avatares para usuarios autenticados"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'avatars'
);
