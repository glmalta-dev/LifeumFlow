# PRD — Product Requirements Document

## 1. Visão Geral do Produto
O **Lifeum Flow** é uma ferramenta de gestão ativa e acompanhamento clínico-operacional desenvolvida especificamente para clínicas odontológicas. 
Diferente de agendas tradicionais ou prontuários eletrônicos passivos, o Lifeum Flow foca em resolver a **perda de receita e a descontinuidade de tratamentos** decorrentes de pacientes esquecidos sem próxima ação definida.

### 🎯 Proposta de Valor
> "Garantir que nenhum paciente da clínica fique sem uma próxima etapa clínica ou administrativa agendada e acompanhada."

---

## 2. Problemas Clínicos e Operacionais Resolvidos
1. **Tratamentos Paralisados:** Pacientes que iniciam tratamentos complexos (como implantes ou próteses) e abandonam entre as fases clínicas por falta de contato da clínica.
2. **Conflitos de Agenda e Recurso:** Choque de horários de cirurgiões-dentistas ou indisponibilidade de cadeiras e salas clínicas específicas.
3. **Falha de Acompanhamento Pós-Operatório:** Pacientes cirúrgicos sem acompanhamento ativo de sua evolução e orientações.
4. **Vazamento no Funil de Novos Contatos (CRM):** Novos leads de prospecção que entram em contato, mas não são convertidos em consultas avaliativas.

---

## 3. Escopo Funcional (Módulos Core)

### Módulo 1: Painel "Hoje" (Central Operacional)
- Exibição de pendências urgentes e atrasadas.
- Lista de tarefas com prioridades diferenciadas por cores.
- Atalhos rápidos de contato via WhatsApp com mensagens geradas dinamicamente.
- Indicação clara da próxima ação para cada paciente em destaque.

### Módulo 2: Gestão de Pacientes & Ficha Clínica Unificada
- Cadastro básico e avançado (Nome, Telefone, E-mail, Nascimento, CPF e Endereço Completo).
- Visualização de histórico clínico, arquivos de exames, evoluções de procedimentos e agendamentos anteriores.
- Sub-módulo de planejamento odontológico dividido em especialidades com checklists dinâmicos.

### Módulo 3: Planejamento Clínico (Tratamento)
- Divisão em especialidades: Prótese, Implantodontia, Dentística e Ortodontia.
- Acompanhamento de progresso com porcentagem em tempo real calculada sobre o checklist de etapas.
- Checkboxes semânticos para controle de acessibilidade e navegação fluida por teclado.

### Módulo 4: Agenda & Validador de Conflito Rígido
- Criação e edição de agendamentos.
- Inclusão de campos clínicos: Duração da consulta, Cadeira/Sala alocada, Intervalo de limpeza e Lembretes.
- Mecanismo impeditivo de colisão de horários para o mesmo profissional ou cadeira no mesmo dia/período.

### Módulo 5: CRM de Contatos (Leads)
- Fluxo Kanban de captação estruturado em etapas: Novo, Contatado, Agendado, Arquivado.
- Registro da data de último contato e notas de prospecção.

---

## 4. Requisitos Não Funcionais
- **Mobile-First Responsivo:** Interface otimizada prioritariamente para smartphones de 390px (orientação vertical) para uso clínico em campo.
- **Segurança de Acesso:** Middleware que bloqueia todas as rotas operacionais privadas e exige autenticação ativa (`lifeum-flow-session`).
- **Persistência Híbrida Inteligente:** Armazenamento resiliente local (LocalStorage) com sincronização em lote para o Supabase sem necessidade de alterar o esquema do banco de dados remoto ativo.
- **Acessibilidade Semântica (WCAG 2.1):** Labels associadas por ID em todos os formulários e estados ARIA adequados em botões e checkboxes interativos.
