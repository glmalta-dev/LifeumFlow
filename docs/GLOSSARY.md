# Glossário de Termos — Lifeum Flow

Este glossário define a terminologia clínica e operacional utilizada no **Lifeum Flow**, estabelecendo um vocabulário comum para desenvolvedores, designers e a equipe clínica.

---

## 🏛️ Conceitos Clínicos e Administrativos

### Paciente Ativo
Paciente que está atualmente sob tratamento na clínica ou em protocolo de manutenção periódica. Pela regra de ouro do sistema: *Todo paciente ativo deve possuir um estado atual compreensível e, quando necessário, uma próxima ação definida.*

### Pendência (Task)
Uma tarefa pendente clínico-operacional vinculada a um paciente específico que precisa ser executada pela equipe. Diferencia-se de um agendamento comum por representar acompanhamentos internos (ex: cobrar exame, ligar para confirmar cirurgia, preparar guia de prótese).

### Próxima Ação
A ação subsequente obrigatória que deve ser tomada pela equipe clínica ou administrativa para que o paciente não fique esquecido. Ela é exibida no card principal do paciente.

### Ficha Clínica
O prontuário unificado do paciente que centraliza todas as informações de resumo, dados cadastrais, planejamento de tratamentos, histórico de agendamentos, evoluções clínicas, upload de arquivos exames e histórico de CRM.

---

## ⚙️ Processos e Módulos do Sistema

### Planejamento Clínico
O plano de tratamento geral do paciente organizado por especialidades odontológicas (Prótese, Implantodontia, Dentística, Ortodontia). Cada área possui um checklist de etapas clínicas sequenciais.

### Evolução Clínica
O registro obrigatório efetuado pelo profissional após cada consulta, detalhando o procedimento realizado, data, orientações pós-operatórias passadas ao paciente, intercorrências e a próxima etapa recomendada.

### Fluxo de Acompanhamento (Flows)
Uma esteira operacional que agrupa pacientes em diferentes fases do tratamento (ex: "Novo Paciente", "Aguardando Agendamento", "Pós-Operatório", "Manutenção Preventiva") para garantir que a equipe saiba exatamente qual ação tomar para cada grupo.

### CRM de Leads (Contatos)
Módulo de captação de novos pacientes (leads) que ainda não realizaram a primeira consulta. O CRM organiza os contatos em fases de prospecção ("Novo", "Contatado", "Agendado", "Arquivado") até que se tornem pacientes cadastrados.

### Captura Rápida
Menu de atalho global centralizado (botão "+" na barra de navegação inferior) que permite criar rapidamente pacientes, agendamentos, pendências ou notas sem que o usuário precise navegar até a ficha específica do paciente.

---

## 💻 Termos Técnicos do Sistema

### Persistência Híbrida (Meta JSON)
Mecanismo que embuti dados cadastrais e operacionais estendidos (que não possuem colunas correspondentes no banco de dados Supabase original) em formato JSON oculto no final do campo de texto `notes` (para pacientes/agendamentos) ou `description` (para tarefas). A string segue o formato `\n\n[META:{"field":"value"}]`.

### Bloqueio Rígido de Agenda
Algoritmo que impede agendamentos concorrentes (duplicados) para o mesmo profissional ou para a mesma cadeira/sala, considerando o horário de início, duração estimada e intervalo de limpeza entre os procedimentos.

### Hidratação Temporal
O processo de sincronização e renderização dinâmica de datas e fusos locais no cliente Next.js, evitando discrepâncias entre o HTML estático gerado no servidor e o renderizado no cliente (React Error #418).
