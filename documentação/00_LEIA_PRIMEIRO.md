# 00 — LEIA PRIMEIRO

## 1. Nome e Objetivo do Produto
O **Lifeum Flow** é uma aplicação web mobile-first de **gestão ativa de continuidade do paciente**. 
Sua finalidade é garantir que nenhum paciente ativo na clínica odontológica fique sem uma próxima ação clínica ou administrativa definida (com responsável, prazo e escopo definidos). Ele inverte a passividade de prontuários tradicionais colocando as prioridades de contato do dia diretamente diante do operador.

## 2. Documentação Normativa Canônica
Os documentos contidos nesta pasta são fontes estritas da verdade para o desenvolvimento do produto:
- `LIFEUM_FLOW_DOCUMENTACAO_MESTRA_v1.0.md` (Contém PRD, Glossário, Regras de Negócio e Roadmap)
- `PROMPT_ORQUESTRADOR_EXECUCAO_LIFEUM_FLOW_v1.0.md` (Protocolo de fases e ordem de implementação da engenharia)

Esses documentos precedem o código. É expressamente **proibido**:
1. Inventar novos requisitos que não constem na documentação.
2. Alterar decisões canônicas ou nomenclaturas sem prévio registro e acordo.

## 3. Ordem Recomendada de Leitura para o Agente
1. Este arquivo (`00_LEIA_PRIMEIRO.md`)
2. O `TAREFA_EM_ANDAMENTO.md` para entender onde a execução parou
3. O `STATUS_ATUAL.md` para visão geral do ecossistema e banco
4. O `BACKLOG.md` para as tarefas pendentes
5. O PRD e regras mapeados em `LIFEUM_FLOW_DOCUMENTACAO_MESTRA_v1.0.md` correspondentes ao escopo da tarefa atual

## 4. Regras de Conduta e Qualidade Técnico-Operacional
- **Validação de Código:** Nunca confie cegamente no status documental. Verifique sempre o código-fonte real, banco de dados (migrations) e `git status` no início de cada sessão.
- **Nenhum Sucesso Falso:** É proibido declarar uma funcionalidade como "concluída" sem testes e evidências reproduzíveis. Telas renderizando com mocks ou fallbacks locais de localStorage não contam como "pronto".
- **Atualização Obrigatória:** Ao interromper ou concluir qualquer tarefa, você deve obrigatoriamente atualizar os arquivos vivos (`STATUS_ATUAL.md`, `TAREFA_EM_ANDAMENTO.md` e `BACKLOG.md`), registrando commits e pontos exatos de interrupção.
- **Economia de Contexto:** Mantenha os relatórios e status objetivos, evitando cópia redundante de código, logs longos ou repetição do PRD. Use referências por caminhos de arquivos e IDs.
