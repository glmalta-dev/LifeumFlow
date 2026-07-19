# PROMPT ORQUESTRADOR DE EXECUÇÃO — LIFEUM FLOW

**Versão:** 1.0  
**Data:** 19/07/2026  
**Documento normativo obrigatório:** `LIFEUM_FLOW_DOCUMENTACAO_MESTRA_v1.0.md`  
**Ambiente de execução:** Google Antigravity  
**Objetivo deste prompt:** Orquestrar a correção, migração e evolução do Lifeum Flow em fases seguras, testáveis, reversíveis e documentalmente controladas.

---

# 1. PAPEL DO AGENTE ORQUESTRADOR

Atue como **orquestrador técnico principal** do Lifeum Flow, coordenando agentes especializados em:

1. arquitetura de software;
2. Supabase/PostgreSQL;
3. autenticação e segurança;
4. Row Level Security;
5. backend e serviços de domínio;
6. frontend Next.js/TypeScript;
7. UX mobile-first e acessibilidade;
8. migração de dados;
9. QA, testes automatizados e E2E;
10. observabilidade;
11. documentação técnica.

Você é responsável por:

- decompor o trabalho;
- delegar análises;
- impedir alterações concorrentes incompatíveis;
- controlar dependências;
- proteger dados existentes;
- validar critérios de entrada e saída;
- bloquear avanço quando houver risco;
- produzir relatório consolidado ao final de cada fase.

Nenhum agente subordinado pode alterar código, banco ou documentação fora do escopo autorizado pelo orquestrador.

---

# 2. FONTES DE VERDADE

Leia integralmente, antes de qualquer alteração:

1. `LIFEUM_FLOW_DOCUMENTACAO_MESTRA_v1.0.md`;
2. documentos existentes no repositório;
3. migrations Supabase;
4. código-fonte atual;
5. arquivos de configuração;
6. testes;
7. histórico Git disponível;
8. esquema real do banco acessível;
9. políticas RLS atuais;
10. configuração real do Supabase e ambientes.

## Hierarquia obrigatória

Em caso de conflito, siga:

1. ADR ou decisão explicitamente aprovada;
2. segurança, privacidade e integridade clínica;
3. regras de negócio e máquinas de estado;
4. glossário e modelo de domínio;
5. PRD e escopo do MVP;
6. System Design;
7. UX;
8. roadmap;
9. diagnóstico do estado atual;
10. código existente;
11. documentos antigos.

O código atual não redefine os requisitos.

---

# 3. ESCOPO AUTORIZADO POR ESTE PROMPT

A autorização inicial deste prompt cobre:

- **Etapa E0 — Preflight e baseline**
- **Fase 0 — Fundação de segurança, dados e autenticação**

Este prompt **não autoriza automaticamente** a execução das fases funcionais posteriores.

Após concluir a Fase 0, interrompa, apresente o relatório e aguarde autorização expressa para a Fase 1.

Não execute de forma antecipada:

- redesign geral;
- planejamento clínico completo;
- upload de arquivos;
- relatórios;
- CRM avançado;
- automações;
- IA;
- voz;
- financeiro;
- integrações externas.

---

# 4. PRINCÍPIO DE ORDEM TÉCNICA

Não começar apenas pelo frontend.

Não começar apenas “adicionando as chaves do Supabase”.

Não começar corrigindo isoladamente o botão de WhatsApp.

Não começar criando novas telas.

A ordem correta é:

1. compreender e preservar o estado atual;
2. criar baseline reproduzível;
3. definir e preparar o modelo de identidade e propriedade dos dados;
4. implementar autenticação real;
5. implementar multitenancy;
6. implementar RLS segura;
7. preparar o modelo de dados definitivo;
8. testar isolamento e persistência;
9. migrar módulos funcionais gradualmente;
10. corrigir bugs funcionais sobre a fundação validada.

Banco, autenticação, multitenancy e RLS são uma única fundação interdependente. Não tratá-los como tarefas isoladas.

---

# 5. REGRAS NÃO NEGOCIÁVEIS

É proibido:

- apagar banco ou resetar produção;
- executar migration destrutiva sem backup e rollback;
- expor segredos;
- colocar `service_role` no frontend;
- desativar RLS;
- criar policy universal permissiva;
- usar `auth.uid() is not null` como único isolamento;
- continuar usando o cookie mockado;
- manter credenciais fixas no cliente;
- mostrar sucesso antes do commit;
- usar LocalStorage como fallback silencioso;
- criar novos `[META:...]`;
- alterar observações clínicas para acomodar dados estruturados;
- alterar interface fora do escopo;
- manter telefone genérico em qualquer fluxo;
- criar dados fictícios para fazer testes passarem;
- remover dados existentes sem inventário e migração;
- mudar IDs sem mapa de equivalência;
- realizar “melhorias extras” não solicitadas;
- avançar de fase com testes críticos falhando.

---

# 6. ESTRUTURA DE AGENTES

## Agente A — Auditor do repositório

Responsável por:

- estrutura;
- dependências;
- rotas;
- contextos;
- serviços;
- mocks;
- LocalStorage;
- build;
- lint;
- testes;
- dívida técnica;
- mapa de arquivos.

Somente leitura na Etapa E0.

## Agente B — Arquiteto de dados

Responsável por:

- esquema atual;
- migrations;
- constraints;
- índices;
- ownership;
- modelo futuro;
- migração;
- rollback;
- integridade.

## Agente C — Segurança, Auth e RLS

Responsável por:

- Supabase Auth;
- SSR;
- cookies;
- middleware;
- memberships;
- RBAC;
- policies;
- testes de isolamento.

## Agente D — Backend e domínio

Responsável por:

- serviços;
- validações;
- transações;
- erros;
- autoria;
- versionamento;
- contratos tipados.

## Agente E — Frontend

Responsável por:

- integração com serviços;
- estados de loading;
- erros;
- remoção de mocks autorizada;
- preservação do design existente;
- responsividade.

## Agente F — Migração

Responsável por:

- LocalStorage;
- `[META:...]`;
- deduplicação;
- relatórios;
- idempotência;
- verificação pós-migração.

## Agente G — QA

Responsável por:

- testes unitários;
- integração;
- E2E;
- segurança;
- regressão;
- evidências;
- screenshots;
- console;
- rede.

## Agente H — Documentação

Responsável por:

- ADRs;
- changelog;
- matriz de rastreabilidade;
- atualização do estado atual;
- relatório da fase.

---

# 7. ETAPA E0 — PREFLIGHT E BASELINE

## Objetivo

Estabelecer um estado conhecido e reversível antes de qualquer alteração.

## Ações obrigatórias

### 7.1. Proteção

- identificar branch atual;
- verificar alterações não commitadas;
- criar branch de trabalho isolada;
- registrar commit/base SHA;
- não sobrescrever trabalho do usuário;
- criar plano de rollback;
- identificar ambiente de produção, homologação e desenvolvimento;
- não operar em produção sem autorização explícita.

### 7.2. Documentação

- ler a documentação mestre;
- inventariar `/docs`;
- identificar conflitos e documentos superados;
- criar matriz requisito → arquivo atual → lacuna;
- registrar decisões abertas que bloqueiam implementação.

### 7.3. Código

Executar e registrar:

- instalação;
- build;
- lint;
- typecheck;
- testes existentes;
- inicialização local;
- rotas;
- erros de console;
- erros de rede.

Não corrigir ainda, salvo ajuste mínimo indispensável para executar a baseline e explicitamente documentado.

### 7.4. Banco e Supabase

Sem alterar:

- listar projeto/ambiente;
- confirmar migrations;
- extrair esquema;
- listar tabelas;
- listar colunas;
- listar constraints;
- listar índices;
- listar triggers;
- listar functions;
- listar policies;
- listar buckets;
- verificar Auth;
- verificar usuários de teste;
- verificar variáveis sem revelar valores;
- identificar divergência entre migrations e banco real.

### 7.5. Persistência local

Inventariar:

- chaves de LocalStorage;
- estruturas;
- volumes;
- IDs;
- dados mockados;
- código de fallback;
- código de sincronização;
- `[META:...]`;
- possíveis dados reais no navegador.

Não apagar nada.

### 7.6. Baseline visual

Em viewport 390 × 844:

- screenshots das telas críticas;
- login;
- Hoje;
- pacientes;
- cadastro;
- ficha;
- agenda;
- planejamento;
- WhatsApp;
- console e rede.

## Entregáveis da E0

1. relatório de baseline;
2. árvore relevante do repositório;
3. matriz de riscos;
4. esquema atual;
5. mapa de autenticação;
6. mapa de persistência;
7. inventário de LocalStorage;
8. inventário de mocks;
9. testes atuais e resultados;
10. plano detalhado da Fase 0;
11. rollback;
12. lista de bloqueios.

## Gate E0

Não iniciar Fase 0 se houver:

- produção não identificada;
- ausência de backup possível;
- dados reais sem estratégia de preservação;
- repositório inconsistente;
- documentação conflitante em decisão bloqueadora;
- falta de acesso necessário ao Supabase;
- migrations divergentes sem explicação;
- risco de perda irreversível.

Se não houver bloqueio, iniciar Fase 0.

---

# 8. FASE 0 — FUNDAÇÃO

## Objetivo

Criar uma base segura, autenticada, multi-clínica, persistente e testável, sem ainda implementar módulos avançados.

## Ordem obrigatória

### 0.1. ADRs e plano de migração

Antes do código, registrar ADRs para:

- modelo multi-clínica;
- usuário x profissional;
- clínica ativa;
- papéis iniciais;
- estratégia de backfill;
- Supabase SSR;
- RLS;
- tratamento de dados existentes;
- LocalStorage;
- versionamento;
- rollback.

Se uma decisão aberta for indispensável, interromper e solicitar decisão.

### 0.2. Modelo estrutural

Criar migrations versionadas e reversíveis para, no mínimo:

- `clinics`;
- `profiles`;
- `clinic_members`;
- `professionals`;
- relação usuário-profissional quando necessária;
- campos de autoria e timestamps;
- `clinic_id` nas entidades centrais;
- constraints;
- índices.

Não excluir tabelas atuais nesta etapa.

### 0.3. Estratégia de backfill

Para registros existentes:

- identificar clínica proprietária;
- criar clínica inicial controlada;
- associar dados;
- registrar lote de migração;
- preservar IDs quando possível;
- não atribuir autoria falsa sem marcador de migração;
- gerar relatório antes/depois;
- validar contagens;
- permitir rollback.

### 0.4. Supabase Auth real

Implementar:

- login real;
- logout real;
- renovação;
- recuperação de senha;
- cliente browser;
- cliente server;
- middleware SSR;
- proteção de rotas;
- sessão expirada;
- redirecionamentos.

Remover ou neutralizar:

- credenciais estáticas;
- cookie `lifeum-flow-session`;
- `user-email` como identidade;
- bypass por cookie manual.

### 0.5. Clínica ativa

Implementar de forma mínima e segura:

- vínculo do usuário;
- seleção ou resolução de clínica;
- recusa quando não houver membership;
- contexto tipado;
- nenhuma escolha arbitrária de `clinic_id` pelo cliente.

### 0.6. Papéis e permissões

Implementar estrutura para:

- owner;
- admin;
- dentist;
- reception;
- assistant;
- read_only.

Não ampliar permissões por conveniência.

### 0.7. RLS

Criar policies explícitas por tabela e operação.

Validar:

- membership ativa;
- `clinic_id`;
- papel;
- propriedade quando aplicável;
- bloqueio de acesso cruzado;
- proteção de autoria;
- proteção de logs.

Proibido usar policy global apenas com `auth.uid() is not null`.

### 0.8. Persistência e erro

Na fundação:

- definir Supabase como fonte primária;
- impedir fallback silencioso;
- distinguir erro de rede, permissão e validação;
- não mostrar sucesso falso;
- preparar contratos tipados;
- padronizar respostas de serviço.

### 0.9. Auditoria mínima

Criar mecanismo mínimo para registrar:

- login relevante;
- criação;
- alteração;
- mudança de status;
- ator;
- clínica;
- entidade;
- timestamp;
- correlação.

Sem armazenar conteúdo clínico integral desnecessariamente no log.

### 0.10. Testes

Obrigatórios:

- cookie forjado não autentica;
- sem sessão não acessa;
- sessão válida acessa;
- logout revoga;
- clínica A não lê B;
- clínica A não grava B;
- usuário desativado perde acesso;
- recepção não altera evolução;
- dentist autorizado opera;
- `service_role` não está no bundle;
- migrations aplicam do zero;
- migrations aplicam sobre esquema atual;
- rollback documentado.

## Saída da Fase 0

A Fase 0 só termina quando:

- autenticação mockada foi removida;
- sessão real funciona;
- dados possuem clínica;
- RLS foi testada;
- acesso cruzado falha;
- nenhuma tabela sensível está pública;
- build, lint e typecheck passam;
- testes críticos passam;
- migrations estão versionadas;
- relatório de backfill foi gerado;
- rollback foi validado ou documentado;
- documentação foi atualizada.

## Parada obrigatória

Após concluir a Fase 0:

1. não iniciar Fase 1;
2. entregar relatório;
3. listar arquivos;
4. listar migrations;
5. listar policies;
6. apresentar resultados dos testes;
7. apresentar riscos residuais;
8. solicitar autorização.

---

# 9. FASES POSTERIORES — PLANO DE ORQUESTRAÇÃO

Estas fases devem ser planejadas agora, mas não executadas sem autorização.

## Fase 1 — Pacientes, persistência e bugs críticos

Ordem:

1. modelo definitivo de paciente;
2. CPF;
3. sexo;
4. endereço;
5. telefone;
6. persistência real;
7. listagem server-side;
8. edição;
9. duplicidade;
10. WhatsApp usando telefone real;
11. próxima ação;
12. configurações essenciais.

Bugs obrigatórios:

- número genérico do WhatsApp;
- paciente que não salva no Supabase;
- sucesso falso;
- dados que somem após reload;
- endereço/CPF/sexo não persistidos.

## Fase 2 — Pendências, Hoje e agenda

- estados de pendência;
- responsável;
- prazo/espera;
- próxima ação;
- Hoje;
- edição real de agendamento;
- conflito;
- cancelamento;
- falta;
- reagendamento;
- continuidade.

## Fase 3 — Arquivos, histórico e evoluções

- Storage privado;
- upload real;
- signed URLs;
- eventos;
- timeline;
- autoria;
- adendo;
- retificação;
- auditoria clínica.

## Fase 4 — Planejamento

- templates;
- áreas;
- workflows;
- etapas;
- dependências;
- progresso;
- geração de próxima ação;
- migração do LocalStorage.

## Fase 5 — CRM, fluxos e comunicação

- CRM mobile;
- contatos;
- templates;
- registro de tentativa;
- conversão;
- fluxos reais;
- inatividade.

## Fase 6 — Relatórios, UX e otimização

- métricas reais;
- relatórios;
- paginação;
- busca;
- performance;
- observabilidade;
- acessibilidade;
- UX final.

---

# 10. PROTOCOLO DE CADA FASE

Antes de executar qualquer fase posterior, gerar:

1. objetivo;
2. escopo;
3. fora de escopo;
4. requisitos;
5. arquivos permitidos;
6. migrations permitidas;
7. dependências;
8. riscos;
9. testes;
10. rollback;
11. critérios de aceite.

Após executar:

1. resumo;
2. arquivos alterados;
3. migrations;
4. policies;
5. testes;
6. evidências;
7. screenshots;
8. erros;
9. riscos;
10. pendências;
11. rollback;
12. recomendação de próximo gate.

---

# 11. FORMATO DE STATUS DO ORQUESTRADOR

Use sempre:

## Fase atual
## Objetivo
## Agentes envolvidos
## Alterações autorizadas
## Descobertas
## Riscos
## Trabalho executado
## Testes
## Evidências
## Bloqueios
## Próxima decisão necessária

Não responder apenas “concluído”.

---

# 12. COMANDO DE PARTIDA

Execute agora:

1. leia integralmente `LIFEUM_FLOW_DOCUMENTACAO_MESTRA_v1.0.md`;
2. execute a Etapa E0;
3. produza seus entregáveis;
4. avalie o Gate E0;
5. se não houver bloqueio, execute a Fase 0 na ordem definida;
6. não avance para a Fase 1;
7. apresente relatório completo;
8. não oculte falhas;
9. não solicite credenciais em texto aberto;
10. não altere produção sem autorização explícita.

A prioridade não é “fazer as telas funcionarem visualmente”. A prioridade é criar uma fundação em que as telas existentes possam operar com autenticação real, dados persistentes, isolamento por clínica, RLS validada e erros visíveis.

Comece.
