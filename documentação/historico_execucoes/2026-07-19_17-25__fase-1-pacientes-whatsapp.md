# Registro de execução

- **Data e hora:** 19/07/2026 14:10 (Local)
- **Agente ou modelo:** Antigravity / Gemini
- **Tarefa:** `TASK-PAT-001` — Fase 1: Pacientes, Persistência e WhatsApp Dinâmico
- **Status final:** VALIDADO
- **Branch:** `feature/fase-0-fundacao`
- **Commit inicial:** `65c891b`
- **Commit final:** `65c891b` (Alterações de código prontas localmente e testadas no build)

## Objetivo
Migrar o cadastro de Pacientes de fallbacks de metadados em `notes` (localStorage) para colunas de dados físicas estruturadas reais no Supabase (CPF, Sexo, CEP, Logradouro, Número, Complemento, Bairro, Cidade, Estado). Corrigir o BUG-001 de botões e links de WhatsApp acionando números mockados fictícios, tornando-os dinâmicos e devidamente higienizados com base nos telefones reais dos prontuários.

## Alterações realizadas
- Criada e enviada para o banco remoto no Supabase a migration `20260719180000_update_patients_columns.sql` que adiciona as colunas de Sexo e Endereço físico em `public.patients` e efetua o backfill dos metadados legado no banco.
- Atualizado a tipagem `Patient` em `types/index.ts` com a nova propriedade `sex`.
- Atualizado o `AppContext.tsx` mapeando o `PatientDbRow` com os novos campos e refatorando os mappers `mapPatientFromDb` e `mapPatientToDb` para persistirem em colunas físicas nativas no Supabase (eliminando a tag `[META:...]` e a codificação JSON).
- Atualizado o formulário de cadastro de novos pacientes (`novo/page.tsx`) e a página de edição de dados cadastrais (`dados-cadastrais/page.tsx`) para incluir e salvar de forma real a propriedade de sexo e endereço completos em colunas físicas.
- Corrigida a lógica dos links wa.me de WhatsApp em `/contatos`, `/pacientes/[patientId]/resumo` e `/hoje` para extrair de forma dinâmica o celular real do paciente, higienizar caracteres especiais e concatenar o prefixo `55`.

## Arquivos modificados
- `src/types/index.ts`
- `src/context/AppContext.tsx`
- `src/app/pacientes/novo/page.tsx`
- `src/app/pacientes/[patientId]/dados-cadastrais/page.tsx`
- `src/app/contatos/page.tsx`
- `src/app/pacientes/[patientId]/resumo/page.tsx`
- `src/app/hoje/page.tsx`
- `supabase/migrations/20260719180000_update_patients_columns.sql`

## Testes e resultados
- **Build de Produção:** Comando `npm run build` executado com 100% de sucesso.
- **Migration Push:** Comando `npx supabase db push` rodado pelo usuário com sucesso, alterando as tabelas e fazendo o backfill na nuvem do Supabase.

## Pendências ou bloqueios
- Nenhum bloqueio.

## Próximo passo recomendado
- Avançar para a `TASK-AGE-002` (Fase 2: CRUD de Agendamento real no banco, checagem rígida de conflitos por cadeira/sala/profissional e recorrência).
