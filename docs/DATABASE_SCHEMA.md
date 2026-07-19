# Arquitetura de Banco de Dados e Esquema de Tabelas

Este documento detalha o modelo de dados físico, os índices de desempenho, as políticas de segurança de linha (RLS) e o mecanismo de persistência híbrida em lote desenvolvido para o **Lifeum Flow**.

---

## 💾 1. Modelo Físico (Supabase / PostgreSQL)

O banco de dados de produção do Lifeum Flow é baseado no Supabase. O esquema core possui as seguintes tabelas estruturadas na migração:

### Tabela: `public.patients`
Guarda as informações gerais dos pacientes cadastrados.
- `id` (text, primary key) - UUID gerado randomicamente.
- `name` (text, not null) - Nome completo do paciente.
- `birth_date` (date, not null) - Data de nascimento.
- `cpf` (text, nullable) - CPF do paciente.
- `phone` (text, not null) - Celular de contato (WhatsApp).
- `email` (text, not null, default '') - E-mail do paciente.
- `status` (text, not null) - Status clínico (`active`, `alert`, `inactive`).
- `next_action` (text, nullable) - Próxima ação definida.
- `next_action_date` (date, nullable) - Prazo para a próxima ação.
- `notes` (text, nullable) - Observações (usada também para armazenar metadados estendidos).

### Tabela: `public.appointments`
Armazena a agenda de consultas.
- `id` (text, primary key) - UUID.
- `patient_id` (text, references `patients.id` on delete cascade) - Vínculo do paciente.
- `patient_name` (text, not null) - Nome do paciente (desnormalizado para performance).
- `date` (date, not null) - Data da consulta.
- `time` (time, not null) - Horário inicial.
- `type` (text, not null) - Tipo de consulta (`consulta`, `retorno`, `cirurgia`, `planejamento`, `manutencao`).
- `status` (text, not null) - Status (`agendado`, `confirmado`, `realizado`, `cancelado`).
- `professional` (text, not null) - Profissional alocado.
- `notes` (text, nullable) - Observações e metadados estendidos.

### Tabela: `public.tasks` (Pendências)
- `id` (text, primary key)
- `patient_id` (text, references `patients.id` on delete cascade)
- `patient_name` (text, not null)
- `title` (text, not null)
- `description` (text, not null, default '') - Descrição e metadados.
- `due_date` (date, not null) - Prazo limite.
- `status` (text, not null) - `pending` ou `completed`.
- `priority` (text, not null) - `high`, `medium` ou `low`.

### Outras Tabelas Core
- `public.evolutions` (Evoluções clínicas dos procedimentos).
- `public.files` (Uploads de imagens e exames dos pacientes).
- `public.leads` (Captação de novos pacientes para o CRM).
- `public.flows` (Esteiras de acompanhamento operacional).

---

## ⚡ 2. Índices de Desempenho e Busca
Para suportar carregamento rápido em ambientes mobile com conexões instáveis, foram definidos os seguintes índices:
- `appointments_patient_date_idx` (patient_id, date, time) - Acelera listagem histórica da ficha do paciente.
- `appointments_status_date_idx` (status, date) - Otimiza filtragem diária na rota /hoje.
- `tasks_patient_status_due_idx` (patient_id, status, due_date) - Acelera as pendências ativas por paciente.
- `tasks_status_due_idx` (status, due_date) - Filtra as tarefas vencidas gerais.

---

## 🔒 3. Políticas de Segurança (Row Level Security - RLS)
Todas as tabelas do banco de dados possuem RLS ativado. O acesso anonimizado é revogado por completo:
- Apenas usuários autenticados (`authenticated`) via JWT e com sessão ativa (`auth.uid() is not null`) possuem permissões de `SELECT`, `INSERT`, `UPDATE` e `DELETE`.
- O papel `service_role` mantém privilégios totais para fins de automações e scripts do sistema.

---

## 🔄 4. Mecanismo de Persistência Híbrida (Metadados Ocultos)
Como o banco de dados Supabase remoto de produção possui restrições de migração direta e não contém colunas específicas clínico-operacionais (ex: duração estimada da consulta, cadeira/sala alocada, intervalo de preparação e limpeza), criamos um **mapeador dinâmico de metadados**:

### Estrutura da Serialização
Os dados extras são convertidos em string JSON e embutidos invisivelmente ao final das colunas de notas e descrição:
```text
Minha observação clínica original.

[META:{"duration":60,"roomOrChair":"Cadeira 01","preparationInterval":10,"recurrence":"Nenhuma"}]
```

### Comportamento do Sincronizador
1. **Gravação:** Ao salvar no cliente (que usa LocalStorage local), o `AppContext` detecta os campos estendidos, compila o objeto `META` e anexa a string correspondente na coluna de banco correta antes de chamar as APIs do Supabase.
2. **Leitura:** Ao carregar os dados, o parser verifica a existência da tag `\n\n[META:`, extrai e desserializa o JSON contido para mesclar de volta ao modelo de tipos do TypeScript.
3. **Resiliência:** Se a chave de API anon do Supabase não estiver configurada no `.env.local`, a aplicação entra em fallback de persistência total no LocalStorage do cliente de forma transparente.
