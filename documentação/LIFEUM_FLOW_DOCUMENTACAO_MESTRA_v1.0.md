# LIFEUM FLOW — DOCUMENTAÇÃO MESTRA CANÔNICA

**Versão:** 1.0  
**Data de consolidação:** 19/07/2026  
**Status:** Fonte normativa inicial para organização documental; não autoriza alterações de código  
**Produto:** Lifeum Flow  
**Ambiente principal de desenvolvimento:** Google Antigravity  
**Orientação primária:** Aplicação web mobile-first para gestão ativa clínico-operacional de pacientes odontológicos

---

# INSTRUÇÃO DE LEITURA OBRIGATÓRIA PARA O ANTIGRAVITY

Este arquivo é o pacote documental mestre do Lifeum Flow. Ele consolida visão de produto, decisões funcionais, regras de negócio, arquitetura desejada, estado atual auditado, riscos, bugs conhecidos, requisitos de segurança, roadmap e protocolo de execução.

## Modo obrigatório nesta etapa

**MODO DOCUMENTAÇÃO SOMENTE.**

Ao receber este arquivo, o Antigravity deve:

1. Ler o documento integralmente antes de propor qualquer ação.
2. Não alterar código, banco, migrations, RLS, configurações, rotas, componentes, dependências ou variáveis de ambiente.
3. Não executar refatoração, correção, migração ou criação de funcionalidade.
4. Não transformar automaticamente requisitos futuros em funcionalidades atuais.
5. Não presumir que uma tela existente está funcional apenas porque renderiza.
6. Não considerar LocalStorage, mocks ou dados estáticos como persistência de produção.
7. Identificar os documentos internos delimitados neste arquivo e propor como separá-los no repositório.
8. Apresentar conflitos encontrados entre esta fonte e documentos antigos antes de consolidar os arquivos finais.
9. Respeitar a hierarquia documental definida neste pacote.
10. Solicitar autorização explícita antes de iniciar qualquer fase de implementação.

## Proibições permanentes

É proibido:

- inventar requisitos;
- alterar nomenclaturas canônicas sem decisão registrada;
- substituir decisões explícitas por preferências técnicas da IA;
- utilizar telefone, paciente, profissional ou clínica genéricos quando houver dados reais vinculados;
- apresentar toast de sucesso antes de confirmar persistência real;
- usar LocalStorage silenciosamente como banco principal;
- inserir novos metadados estruturados em `notes` ou `description` no formato `[META:...]`;
- expor `service_role`, segredos ou credenciais privadas no frontend;
- desativar RLS para “fazer funcionar”;
- permitir acesso cruzado entre clínicas;
- apagar evolução clínica ou histórico de auditoria de forma destrutiva;
- executar mais de uma fase estrutural simultaneamente;
- modificar telas fora do escopo autorizado;
- remover funções existentes sem inventário, justificativa, migração e autorização;
- declarar uma funcionalidade “pronta” sem evidência reproduzível e critérios de aceite cumpridos.

---

# MAPA DOS DOCUMENTOS INTERNOS

Este arquivo deve futuramente ser separado, preservando integralmente seu conteúdo, nos seguintes documentos:

| Ordem | Arquivo sugerido | Função |
|---:|---|---|
| 00 | `00_GOVERNANCA_DOCUMENTAL.md` | Autoridade, versionamento, conflitos e protocolo |
| 01 | `01_VISAO_E_ESTRATEGIA.md` | Visão, dores, público e princípios |
| 02 | `02_ESCOPO_MVP_E_FORA_DE_ESCOPO.md` | Limites da primeira versão |
| 03 | `03_PRD_LIFEUM_FLOW.md` | Requisitos do produto por módulo |
| 04 | `04_GLOSSARIO_CANONICO.md` | Linguagem oficial e definições |
| 05 | `05_MODELO_DE_DOMINIO.md` | Entidades, relações e invariantes |
| 06 | `06_REGRAS_DE_NEGOCIO.md` | Regras normativas não negociáveis |
| 07 | `07_MAQUINAS_DE_ESTADO.md` | Estados e transições |
| 08 | `08_UX_ARQUITETURA_DA_INFORMACAO.md` | Navegação, telas e padrões de interação |
| 09 | `09_SYSTEM_DESIGN.md` | Arquitetura técnica desejada |
| 10 | `10_MODELO_DE_DADOS.md` | Modelo lógico e físico proposto |
| 11 | `11_AUTENTICACAO_RLS_E_PERMISSOES.md` | Auth, multitenancy, RBAC e RLS |
| 12 | `12_ARQUIVOS_STORAGE_LGPD_E_AUDITORIA.md` | Storage, privacidade e rastreabilidade |
| 13 | `13_ESTADO_ATUAL_LACUNAS_E_BUGS.md` | Diagnóstico factual do protótipo |
| 14 | `14_ROADMAP_E_PLANO_DE_MIGRACAO.md` | Fases e dependências |
| 15 | `15_TESTES_E_CRITERIOS_DE_ACEITE.md` | Definição objetiva de pronto |
| 16 | `16_ADRS_DECISOES_E_PENDENCIAS.md` | Decisões aprovadas, provisórias e abertas |
| 17 | `17_PROTOCOLO_DE_EXECUCAO_ANTIGRAVITY.md` | Como implementar etapa por etapa |
| 18 | `18_BRIEF_LANDING_PAGE.md` | Página pública de apresentação do produto |

---

<!-- BEGIN FILE: 00_GOVERNANCA_DOCUMENTAL.md -->

# 00 — GOVERNANÇA DOCUMENTAL

## 1. Objetivo

Estabelecer uma fonte única da verdade para o Lifeum Flow e impedir que documentos antigos, protótipos, respostas de auditoria ou código provisório sejam tratados como requisito definitivo.

## 2. Categorias documentais

### 2.1. Normativa

Define o que o produto deve ser:

- visão;
- PRD;
- glossário;
- regras;
- estados;
- permissões;
- critérios de aceite.

### 2.2. Arquitetural

Define como o produto deve ser construído:

- System Design;
- banco;
- autenticação;
- RLS;
- Storage;
- concorrência;
- cache;
- auditoria.

### 2.3. Diagnóstica

Registra o que existe hoje:

- rotas;
- telas;
- mocks;
- bugs;
- riscos;
- LocalStorage;
- integrações incompletas.

Documentos diagnósticos **não criam requisito**. Eles apenas descrevem o estado encontrado.

### 2.4. Executiva

Transforma requisitos em trabalho controlado:

- roadmap;
- épicos;
- tarefas;
- migrations;
- testes;
- rollback;
- critérios de aceite.

## 3. Hierarquia de autoridade

Em caso de conflito, prevalece a seguinte ordem:

1. Decisão explícita registrada em `16_ADRS_DECISOES_E_PENDENCIAS.md`.
2. Segurança, privacidade, integridade clínica e regras legais.
3. Regras de negócio e máquinas de estado.
4. Glossário e modelo de domínio.
5. PRD e escopo do MVP.
6. System Design e modelo de dados.
7. UX e arquitetura da informação.
8. Roadmap e backlog.
9. Estado atual auditado.
10. Código existente, mocks e protótipos.
11. Documentos antigos não consolidados.

O código atual não tem autoridade para redefinir o produto. Um remendo existente não se torna regra por existir.

## 4. Versionamento

Cada documento separado deve possuir:

- versão;
- data;
- status;
- responsável pela decisão;
- histórico de alterações;
- referências a ADRs;
- itens pendentes.

Status permitidos:

- `RASCUNHO`;
- `EM REVISÃO`;
- `APROVADO`;
- `SUPERADO`;
- `ARQUIVADO`.

## 5. Regra de mudança

Nenhuma decisão estrutural deve ser alterada diretamente no código. A sequência obrigatória é:

1. identificar a necessidade;
2. registrar a proposta;
3. analisar impacto;
4. criar ou atualizar ADR;
5. atualizar documentação normativa;
6. aprovar;
7. criar plano de implementação;
8. executar fase isolada;
9. testar;
10. registrar resultado.

## 6. Condição para início de implementação

Uma funcionalidade só pode entrar em desenvolvimento quando possuir:

- objetivo;
- ator;
- fluxo principal;
- estados;
- regras;
- dados;
- permissões;
- erros;
- critérios de aceite;
- testes;
- fase e prioridade;
- lista de arquivos permitidos;
- impactos de banco;
- rollback.

<!-- END FILE: 00_GOVERNANCA_DOCUMENTAL.md -->

---

<!-- BEGIN FILE: 01_VISAO_E_ESTRATEGIA.md -->

# 01 — VISÃO E ESTRATÉGIA

## 1. Definição do produto

O Lifeum Flow é uma ferramenta de **gestão ativa de continuidade do paciente**.

Sua função não é apenas armazenar dados. Sua função é colocar diante do profissional, de maneira clara, persistente e priorizada, tudo que ainda precisa ser feito para que nenhum paciente, tratamento, contato ou compromisso fique esquecido.

## 2. Problema central

Sistemas odontológicos tradicionais são predominantemente passivos. Eles guardam prontuário, agenda e cadastro, mas dependem de o usuário:

- lembrar que existe uma pendência;
- abrir o paciente correto;
- procurar a informação;
- interpretar o que falta;
- criar manualmente o próximo passo;
- retornar posteriormente.

O Lifeum Flow inverte esse modelo. O sistema deve identificar e apresentar:

- o que está atrasado;
- o que vence hoje;
- quem aguarda resposta;
- quem precisa ser agendado;
- quem desmarcou e não foi reagendado;
- qual tratamento está parado;
- qual etapa clínica ainda não possui próximo passo;
- qual contato comercial ainda não teve continuidade.

## 3. Proposta de valor

> Garantir que nenhum paciente permaneça sem uma próxima ação clínica ou administrativa definida, com responsável, prazo ou condição de revisão.

## 4. Dores resolvidas

- mensagens respondidas parcialmente e esquecidas;
- promessas de retorno não cumpridas;
- horários que deveriam ser verificados posteriormente;
- pacientes sem agendamento;
- desmarcações sem reagendamento;
- tratamentos paralisados entre etapas;
- exames solicitados sem cobrança;
- componentes ou materiais não providenciados;
- pós-operatórios sem acompanhamento;
- leads sem retorno;
- ausência de visão consolidada do que exige atenção;
- dependência excessiva da memória pessoal do profissional.

## 5. Público

### 5.1. Inicial

- cirurgião-dentista responsável pela clínica;
- profissionais clínicos associados;
- recepção ou equipe administrativa;
- auxiliares com permissões limitadas.

### 5.2. Arquitetura futura

O produto deve ser estruturado como **multi-clínica e multiusuário**, mesmo que a implantação inicial ocorra em uma única clínica.

## 6. Posicionamento no MVP

O Lifeum Flow será inicialmente uma **camada operacional complementar**, e não substituto integral de um prontuário odontológico completo.

Ele pode armazenar evoluções, planejamento, arquivos e informações operacionais, mas não deve expandir no MVP para:

- odontograma avançado completo;
- prescrição eletrônica ampla;
- faturamento;
- estoque;
- convênios;
- prontuário odontológico completo equivalente aos sistemas consolidados.

## 7. Princípios do produto

1. **Nenhum paciente sem próximo passo.**
2. **O sistema deve lembrar pelo usuário.**
3. **Próxima ação exige responsável e prazo ou condição de espera.**
4. **Clareza operacional antes de densidade de informação.**
5. **Mobile-first e uso com uma mão.**
6. **Dados reais, nunca placeholders em fluxos de produção.**
7. **Persistência explícita e verificável.**
8. **Segurança e isolamento desde a fundação.**
9. **Ações clínicas rastreáveis e não destrutivas.**
10. **Automação deve sugerir e apoiar, não executar ações externas sem controle.**
11. **Simplicidade operacional sem sacrificar integridade.**
12. **Cada mudança deve preservar contexto, autoria e histórico.**

## 8. Métrica norteadora

Percentual de pacientes ativos que possuem uma próxima ação válida.

Métricas complementares:

- pacientes ativos sem próxima ação;
- pendências vencidas;
- tempo médio até primeira resposta;
- tempo médio entre contato e agendamento;
- tempo médio de paralisação por etapa;
- taxa de reagendamento após cancelamento ou falta;
- taxa de conversão de lead;
- tempo até resolução de pendência;
- quantidade de ações sem responsável;
- quantidade de ações sem prazo ou revisão.

<!-- END FILE: 01_VISAO_E_ESTRATEGIA.md -->

---

<!-- BEGIN FILE: 02_ESCOPO_MVP_E_FORA_DE_ESCOPO.md -->

# 02 — ESCOPO DO MVP E FORA DE ESCOPO

## 1. Objetivo do MVP

Entregar uma aplicação segura e persistente capaz de centralizar pacientes, próximas ações, pendências, agenda, contatos, planejamento essencial, evoluções operacionais, arquivos e histórico, sem depender da memória do profissional.

## 2. Escopo obrigatório do MVP

### Fundação

- Supabase Auth real;
- sessão SSR válida;
- clínicas e membros;
- papéis e permissões;
- isolamento RLS por clínica;
- persistência real no Supabase;
- logs mínimos de auditoria;
- estados de loading, erro e vazio;
- remoção da autenticação mockada;
- proibição de sucesso falso;
- eliminação do LocalStorage como fonte primária.

### Pacientes

- cadastro rápido;
- cadastro completo;
- nome;
- celular;
- e-mail;
- nascimento;
- CPF;
- sexo;
- endereço completo;
- status;
- próxima ação;
- observações;
- busca e filtros;
- edição;
- ficha unificada;
- WhatsApp usando o telefone do paciente real.

### Operação

- tarefas e pendências;
- prioridades;
- responsáveis;
- prazos;
- condições de espera;
- tela Hoje;
- alertas;
- conclusão, reabertura, adiamento e resolução;
- histórico de eventos.

### Agenda

- criação;
- edição real;
- cancelamento;
- reagendamento;
- desfecho;
- duração;
- profissional;
- cadeira ou sala;
- intervalo de preparação e limpeza;
- bloqueio de conflitos;
- estados de comparecimento.

### CRM e contatos

- novos contatos;
- tentativa de contato;
- WhatsApp;
- origem;
- estágio;
- notas;
- data do último contato;
- avanço e retorno de estágio;
- conversão de lead em paciente;
- mobile com uma etapa por vez.

### Planejamento essencial

- plano geral;
- áreas clínicas selecionáveis;
- workflows;
- etapas;
- status;
- prazo;
- responsável;
- observação;
- vínculo com próxima ação;
- persistência no Supabase.

### Evoluções operacionais

- registro;
- profissional;
- data e hora;
- atendimento relacionado;
- procedimento;
- relato;
- conduta;
- orientação;
- próxima etapa;
- retificação com histórico.

### Arquivos

- imagens;
- PDFs;
- documentos;
- links;
- vídeos e áudios quando tecnicamente aprovados;
- Storage privado;
- título;
- categoria;
- data;
- autor;
- observação;
- vínculo opcional;
- visualização segura.

### Configurações essenciais

- nome da clínica;
- telefone administrativo;
- horários;
- recursos;
- preferências básicas;
- mensagens rápidas de WhatsApp;
- prazos de inatividade.

## 3. Fora do MVP

- WhatsApp API oficial;
- envio automático de mensagens;
- leitura de mensagens do WhatsApp;
- confirmação automática de entrega;
- integrações externas complexas;
- financeiro completo;
- faturamento;
- estoque;
- convênios;
- odontograma avançado;
- prescrições completas;
- inteligência artificial autônoma;
- gravação por voz com interpretação clínica automática;
- dashboards analíticos avançados;
- ponderação sofisticada de progresso;
- offline-first integral;
- sincronização completa de todo o banco no navegador;
- integração com Drive;
- marketplace;
- portal do paciente.

## 4. Regra de contenção de escopo

Nenhum item fora do MVP pode ser antecipado se:

- autenticação não estiver concluída;
- RLS não estiver validada;
- persistência principal não estiver no Supabase;
- pacientes não estiverem isolados por clínica;
- critérios de aceite da fase anterior não estiverem cumpridos.

<!-- END FILE: 02_ESCOPO_MVP_E_FORA_DE_ESCOPO.md -->

---

<!-- BEGIN FILE: 03_PRD_LIFEUM_FLOW.md -->

# 03 — PRD DO LIFEUM FLOW

## 1. Atores

| Ator | Responsabilidade |
|---|---|
| Proprietário | Administração global da clínica e membros |
| Administrador | Configurações, operação e relatórios permitidos |
| Dentista | Atendimento, planejamento, evolução e gestão de pacientes |
| Recepção | Cadastro, agenda, contatos e pendências administrativas |
| Auxiliar | Ações operacionais delegadas |
| Somente leitura | Consulta autorizada sem alteração |
| Sistema | Cálculos, alertas, validações e registro de eventos |

## 2. Módulo Hoje

### Objetivo

Exibir o que exige atenção imediata sem obrigar o usuário a procurar paciente por paciente.

### Seções canônicas

- Atrasados;
- Hoje;
- Aguardando resposta;
- Agendar;
- Remarcar;
- Próximas etapas;
- próximos compromissos.

### Conteúdo mínimo de um item

- paciente ou lead;
- descrição;
- tipo;
- prioridade;
- prazo ou tempo de atraso;
- responsável;
- próxima ação;
- atalhos permitidos.

### Ações

- abrir paciente;
- abrir pendência;
- concluir;
- reabrir;
- adiar;
- reagendar;
- WhatsApp;
- ligação;
- definir próxima ação.

### Critérios funcionais

- itens vencidos são calculados por data e fuso do usuário;
- tarefas concluídas não permanecem em pendências ativas;
- filtros são reproduzíveis e não dependem de dados mockados;
- cards sempre usam os dados reais da entidade vinculada;
- o sistema não deve exibir sucesso antes da persistência.

## 3. Módulo Pacientes

### Cadastro rápido

Obrigatórios:

- nome completo;
- celular válido.

Opcionais na captura rápida:

- e-mail;
- nascimento;
- CPF;
- sexo;
- observação inicial.

Após cadastro rápido, o sistema pode criar uma pendência de complementação cadastral.

### Cadastro completo

Campos:

- nome completo;
- nome social, se adotado futuramente;
- celular principal;
- telefone alternativo;
- e-mail;
- data de nascimento;
- CPF;
- sexo;
- CEP;
- logradouro;
- número;
- complemento;
- bairro;
- cidade;
- estado;
- status;
- observações;
- responsável pelo cadastro.

### Regra de sexo

Campo canônico no MVP: `sex`.

Valores permitidos:

- `female`;
- `male`;
- `intersex`;
- `not_informed`.

Rótulos visíveis:

- Feminino;
- Masculino;
- Intersexo;
- Não informado.

O campo não deve ser confundido com identidade de gênero. Caso identidade de gênero seja necessária futuramente, será um campo separado.

### CPF

- editável;
- opcional no cadastro rápido;
- validação de dígitos verificadores quando informado;
- normalização para apenas números no banco;
- formatação apenas na apresentação;
- unicidade deve ser avaliada por clínica e não deve impedir registros legítimos sem decisão explícita.

### Telefone

- normalizado para dígitos;
- armazenado em formato compatível com E.164 quando possível;
- validação adequada para números brasileiros;
- não aceitar número genérico como fallback;
- não permitir ação de WhatsApp sem telefone válido.

### Ficha do paciente

Áreas principais:

- Resumo;
- Planejamento;
- Agenda;
- Evoluções;
- Arquivos;
- Histórico.

Áreas secundárias:

- Dados cadastrais;
- Próximas ações;
- Exportação;
- configurações do paciente;
- financeiro, quando futuramente autorizado.

## 4. Módulo de ações rápidas do paciente

### Padrão

Bottom sheet expansível e contextual.

### Ações principais

- WhatsApp;
- ligar;
- resolver pendência.

### Ações secundárias

- agendar;
- reagendar;
- criar pendência;
- registrar evolução;
- anexar arquivo;
- definir próxima ação;
- alterar status;
- editar cadastro;
- abrir ficha completa.

### Regra contextual

Quando aberto a partir de um paciente, todas as ações devem herdar `patient_id`. Nenhuma ação pode usar paciente genérico.

## 5. WhatsApp

### Fluxo MVP

1. usuário toca em WhatsApp;
2. sistema identifica o paciente ou lead vinculado;
3. sistema carrega o telefone real;
4. usuário seleciona uma mensagem rápida ou texto vazio;
5. mensagem é exibida para revisão e edição;
6. sistema gera link `wa.me`;
7. WhatsApp é aberto;
8. envio permanece manual;
9. resultado pode ser registrado manualmente como evento de contato.

### Regra de telefone

O link deve ser construído exclusivamente com o telefone da entidade vinculada.

É proibido:

- número fixo;
- número de demonstração;
- telefone global;
- fallback para número mockado;
- telefone de outro paciente;
- abertura do WhatsApp se o dado for inválido.

### Normalização recomendada para Brasil

- remover caracteres não numéricos;
- se o número tiver 10 ou 11 dígitos e não possuir código do país, prefixar `55`;
- preservar código do país quando já informado corretamente;
- validar tamanho final;
- usar `encodeURIComponent` para mensagem;
- bloquear e informar erro se a normalização não produzir número válido.

## 6. Pendências e próxima ação

Uma pendência deve possuir:

- clínica;
- paciente ou lead;
- título;
- descrição;
- categoria;
- prioridade;
- status;
- responsável;
- prazo ou condição de revisão;
- canal recomendado;
- origem;
- autoria;
- timestamps.

Uma próxima ação válida possui:

- ação objetiva;
- responsável;
- data, prazo ou condição de espera;
- vínculo com paciente;
- estado.

“Aguardando” sem especificar o quê, quem e quando revisar não é uma próxima ação válida.

## 7. Agenda

Campos:

- paciente;
- data;
- hora;
- duração;
- intervalo de preparação;
- intervalo de limpeza;
- profissional;
- sala ou cadeira;
- tipo;
- procedimento;
- status;
- recorrência;
- planejamento relacionado;
- lembretes;
- observações.

### Conflito

O intervalo ocupado é:

`início` até `início + duração + intervalo posterior aplicável`.

Há conflito quando:

`novo_início < existente_fim` e `novo_fim > existente_início`.

A validação deve considerar:

- mesmo profissional;
- mesma sala ou cadeira;
- registros não cancelados;
- edição excluindo o próprio agendamento;
- ocorrências de recorrência;
- limites exatos permitidos quando um termina no momento em que outro começa.

### Desfecho

Após o horário, o agendamento deve receber um desfecho:

- compareceu;
- faltou;
- cancelou;
- reagendou.

Falta ou cancelamento sem reagendamento deve gerar ou sugerir próxima ação.

## 8. Planejamento

Estrutura:

`Plano geral → Área clínica → Workflow → Etapa`.

Áreas iniciais:

- Dentística;
- Prótese;
- Implantodontia;
- Ortodontia;
- Periodontia;
- Cirurgia;
- Endodontia;
- Preventivo;
- Pré-natal odontológico;
- outras configuráveis.

Cada etapa pode possuir:

- status;
- prazo;
- responsável;
- observação;
- dependência;
- arquivo;
- agendamento;
- evolução;
- próxima ação.

Templates:

- padrão do sistema;
- personalização por clínica;
- clonagem e versão;
- sem alterar retroativamente planos já iniciados.

## 9. Evoluções

Campos:

- paciente;
- profissional;
- data e hora;
- atendimento relacionado;
- procedimento;
- relato;
- intercorrência;
- conduta;
- orientação;
- próxima etapa;
- retorno recomendado.

Após salvar:

- criar próxima etapa;
- ou concluir explicitamente o caso/fluxo;
- ou registrar condição de espera.

Evoluções não devem ser apagadas de forma destrutiva. Alterações devem ocorrer por adendo ou retificação rastreável.

## 10. Arquivos

Aceitar conforme política técnica:

- imagem;
- PDF;
- documento;
- link;
- vídeo;
- áudio.

Metadados:

- paciente;
- título;
- categoria;
- MIME;
- tamanho;
- data;
- autor;
- observação;
- vínculo;
- path privado;
- checksum quando aplicável.

## 11. CRM

### Mobile

Uma etapa por vez, com tabs ou seletor de estágio.

### Desktop

Kanban completo pode ser utilizado.

Estágios iniciais:

- Novo;
- Contatado;
- Agendado;
- Arquivado.

O CRM também pode apresentar:

- pacientes sem movimentação;
- pendências;
- jornada;
- alertas;
- indicadores compactos.

## 12. Relatórios

Relatórios reais somente após dados estruturados e eventos confiáveis.

Indicadores prioritários:

- tempo médio de primeira resposta;
- tempo médio entre contato e agendamento;
- tempo médio para evolução após atendimento;
- pacientes sem próxima ação;
- pendências vencidas;
- tempo de paralisação;
- taxa de reagendamento;
- abandono;
- conversão;
- desempenho por responsável;
- gargalos por etapa.

Nenhum número mockado pode ser apresentado como dado real.

## 13. Exportação

A central de exportação futura deve permitir seleção de:

- dados cadastrais;
- planejamento;
- etapas concluídas;
- etapas pendentes;
- agendamentos;
- evoluções;
- arquivos;
- histórico;
- financeiro operacional, quando existir;
- anamnese, quando autorizada.

Deve possuir:

- marcar todos;
- desmarcar todos;
- multisseleção;
- formatos definidos;
- registro de auditoria;
- permissão específica;
- proteção de dados sensíveis.

<!-- END FILE: 03_PRD_LIFEUM_FLOW.md -->

---

<!-- BEGIN FILE: 04_GLOSSARIO_CANONICO.md -->

# 04 — GLOSSÁRIO CANÔNICO

| Termo | Definição canônica |
|---|---|
| Clínica | Organização proprietária dos dados e configurações |
| Unidade | Local físico pertencente a uma clínica |
| Usuário | Identidade autenticada no Supabase Auth |
| Perfil | Dados pessoais e preferências de um usuário |
| Membro da clínica | Vínculo entre usuário, clínica e papel |
| Profissional | Pessoa que presta atendimento; pode ou não possuir login |
| Papel | Conjunto de permissões organizacionais |
| Paciente | Pessoa já cadastrada para acompanhamento clínico-operacional |
| Lead | Contato ainda não convertido em paciente |
| Contato | Interação registrada por WhatsApp, ligação ou outro canal |
| Paciente ativo | Paciente em tratamento, acompanhamento ou manutenção |
| Paciente em alerta | Paciente que viola regra de continuidade ou possui risco operacional |
| Próxima ação | Próximo passo objetivo com responsável e prazo ou revisão |
| Pendência | Unidade de trabalho necessária para dar continuidade |
| Tarefa | Sinônimo técnico de pendência apenas na camada de implementação; a interface deve priorizar “Pendência” |
| Alerta | Sinal derivado de uma condição que requer atenção |
| Notificação | Comunicação apresentada ao usuário sobre evento ou alerta |
| Prioridade | Ordem relativa de atenção: baixa, média ou alta |
| Criticidade | Impacto potencial da falha; não é sinônimo de prioridade |
| Prazo | Data e hora limite de uma ação |
| Condição de espera | Motivo explícito que impede ação imediata e exige revisão |
| Responsável | Usuário ou profissional encarregado da ação |
| Agendamento | Reserva de tempo, profissional e recurso |
| Consulta | Atendimento previsto ou realizado |
| Retorno | Atendimento posterior ligado a acompanhamento |
| Reagendamento | Substituição explícita de um agendamento por outro |
| Falta | Paciente não compareceu |
| Cancelamento | Agendamento encerrado sem realização |
| Planejamento | Organização geral dos tratamentos e etapas |
| Plano | Instância de planejamento de um paciente |
| Área clínica | Especialidade ou domínio do plano |
| Workflow | Sequência configurada de etapas de uma área |
| Etapa | Unidade executável de um workflow |
| Procedimento | Ato clínico realizado ou planejado |
| Evolução | Registro clínico-operacional de um atendimento |
| Retificação | Correção rastreável que preserva registro anterior |
| Adendo | Informação adicional posterior sem apagar conteúdo original |
| Arquivo | Objeto armazenado ou referência externa vinculada |
| Anexo | Arquivo ligado a paciente, evento, evolução ou etapa |
| Evento | Registro imutável de algo relevante que ocorreu |
| Histórico | Linha do tempo derivada de eventos reais |
| Fluxo | Esteira operacional de acompanhamento |
| Estágio | Posição de uma entidade dentro de um fluxo |
| Status | Estado atual formal de uma entidade |
| Captura rápida | Entrada global para criar itens com poucos passos |
| Template de WhatsApp | Texto reutilizável com variáveis controladas |
| Tentativa de contato | Registro de que houve iniciativa de comunicação |
| WhatsApp aberto | Aplicativo aberto por deep link; não comprova envio |
| Mensagem enviada | Estado somente registrável manualmente no MVP |
| Arquivamento | Retirada do fluxo ativo sem exclusão destrutiva |
| Encerramento | Conclusão explícita do acompanhamento |
| Timeline | Apresentação cronológica de eventos reais |
| Mock | Dado ou comportamento simulado sem validade operacional |
| Fonte primária | Sistema oficial de persistência do registro |
| Cache | Cópia temporária que não substitui a fonte primária |
| Tenant | Clínica isolada dentro da arquitetura multi-clínica |
| RLS | Políticas de segurança em nível de linha no PostgreSQL/Supabase |
| RBAC | Controle de acesso baseado em papéis |
| Auditoria | Registro de autoria, acesso e alteração |
| Soft delete | Exclusão lógica preservando rastreabilidade |

<!-- END FILE: 04_GLOSSARIO_CANONICO.md -->

---

<!-- BEGIN FILE: 05_MODELO_DE_DOMINIO.md -->

# 05 — MODELO DE DOMÍNIO

## 1. Entidades centrais

```text
Clinic
 ├─ ClinicUnit
 ├─ ClinicMember ─ User/Profile
 ├─ Professional
 ├─ RoomOrChair
 ├─ Patient
 │   ├─ NextAction / Task
 │   ├─ Appointment
 │   ├─ TreatmentPlan
 │   │   ├─ TreatmentPlanArea
 │   │   │   └─ TreatmentPlanItem
 │   ├─ Evolution
 │   ├─ PatientFile
 │   ├─ ContactEvent
 │   └─ TimelineEvent
 ├─ Lead
 ├─ Flow
 │   ├─ FlowStage
 │   └─ FlowMembership
 ├─ WhatsAppTemplate
 ├─ ClinicSettings
 └─ AuditLog
```

## 2. Invariantes

1. Toda entidade operacional pertence a uma clínica.
2. Toda alteração sensível possui autoria.
3. Todo paciente ativo deve ter próxima ação válida ou condição de espera.
4. Uma próxima ação deve ter responsável.
5. Um agendamento deve ter profissional, início e duração.
6. Uma evolução deve estar vinculada a profissional.
7. Um arquivo deve possuir path privado ou URL externa validada.
8. Histórico deve derivar de eventos, não de itens mockados.
9. `clinic_id` não pode ser livremente escolhido pelo cliente.
10. Registros clínicos não podem ser apagados silenciosamente.
11. Planos iniciados preservam a versão do template usado.
12. Um profissional pode existir sem usuário autenticado.
13. Um usuário pode pertencer a mais de uma clínica.
14. O papel é definido por vínculo com a clínica, não globalmente.
15. LocalStorage não é entidade de domínio nem fonte oficial.

## 3. Separação entre usuário e profissional

- **User:** identidade que entra no sistema.
- **Profile:** informações do usuário.
- **Professional:** pessoa que atende ou é responsável por eventos clínicos.
- **ClinicMember:** vínculo que concede papel e acesso.
- **ProfessionalUser:** relação opcional entre profissional e usuário.

Isso permite registrar profissionais sem login e preservar histórico quando um membro é desativado.

<!-- END FILE: 05_MODELO_DE_DOMINIO.md -->

---

<!-- BEGIN FILE: 06_REGRAS_DE_NEGOCIO.md -->

# 06 — REGRAS DE NEGÓCIO NÃO NEGOCIÁVEIS

## Segurança e propriedade

**RN001.** Toda entidade operacional deve possuir `clinic_id`.  
**RN002.** O usuário só pode acessar clínicas das quais seja membro ativo.  
**RN003.** `clinic_id`, `created_by` e autoria clínica não podem ser falsificados pelo frontend.  
**RN004.** RLS deve permanecer ativa em todas as tabelas sensíveis.  
**RN005.** `service_role` nunca pode aparecer no cliente.  
**RN006.** Logout deve invalidar a sessão Supabase real.  
**RN007.** O cookie mockado `lifeum-flow-session` deve ser eliminado.  

## Pacientes

**RN010.** Nome completo e celular são obrigatórios no cadastro rápido.  
**RN011.** CPF, sexo e endereço devem existir no cadastro completo e ser persistidos em colunas próprias.  
**RN012.** CPF informado deve ser validado e normalizado.  
**RN013.** Telefone deve ser normalizado e validado.  
**RN014.** O WhatsApp deve usar o telefone real do paciente selecionado.  
**RN015.** É proibido usar número genérico como fallback.  
**RN016.** Sucesso de cadastro só pode ser informado após confirmação do banco.  
**RN017.** Falha de banco deve ser exibida claramente.  
**RN018.** Duplicidade deve ser analisada por telefone, CPF e nome/data, sem mesclagem automática destrutiva.  

## Continuidade

**RN020.** Paciente ativo deve possuir próxima ação ou condição de espera válida.  
**RN021.** Próxima ação exige responsável.  
**RN022.** Próxima ação exige prazo ou data de revisão.  
**RN023.** “Aguardando” sem objeto e revisão não é válido.  
**RN024.** Concluir uma pendência que encerra uma etapa deve sugerir ou exigir próximo passo.  
**RN025.** Falta ou cancelamento deve gerar pendência de reagendamento quando o caso continuar ativo.  
**RN026.** Paciente parado acima do limite configurado deve aparecer em alerta.  

## Agenda

**RN030.** É proibida sobreposição do mesmo profissional.  
**RN031.** É proibida sobreposição da mesma cadeira ou sala.  
**RN032.** Cancelados não bloqueiam horário.  
**RN033.** A edição deve ignorar o próprio registro na validação.  
**RN034.** Duração e intervalos devem ser colunas estruturadas.  
**RN035.** O erro de conflito deve identificar o recurso e o período conflitante sem expor informação indevida.  

## Planejamento

**RN040.** Planejamento deve ser persistido no Supabase.  
**RN041.** Progresso deriva das etapas reais.  
**RN042.** Templates são versionados.  
**RN043.** Alterar template não muda retroativamente um plano ativo.  
**RN044.** Etapas podem ser concluídas, reabertas, puladas, repetidas ou encerradas conforme permissão.  
**RN045.** Toda mudança relevante de etapa gera evento.  

## Evoluções

**RN050.** Evolução exige autoria profissional e timestamp do servidor.  
**RN051.** Evolução não pode ser excluída destrutivamente.  
**RN052.** Correção exige retificação ou adendo com motivo.  
**RN053.** Registro anterior deve permanecer recuperável.  
**RN054.** Recepção não pode criar ou alterar evolução clínica.  

## Arquivos

**RN060.** Arquivos clínicos ficam em bucket privado.  
**RN061.** Visualização utiliza URL assinada temporária.  
**RN062.** MIME e tamanho são validados.  
**RN063.** Metadado sem objeto físico não deve ser apresentado como upload concluído.  
**RN064.** Exclusão deve ser autorizada, auditada e tratar arquivo órfão.  

## Persistência

**RN070.** Supabase é fonte primária.  
**RN071.** LocalStorage pode ser cache ou rascunho explícito, nunca fallback silencioso.  
**RN072.** Nenhum toast de sucesso deve ser exibido em falha de persistência.  
**RN073.** `[META:...]` não deve ser usado em novos registros.  
**RN074.** Dados antigos em `[META:...]` devem ser migrados com relatório.  
**RN075.** Conflitos de versão não podem ser resolvidos silenciosamente por sobrescrita.  

## UX

**RN080.** Datas visíveis usam padrão brasileiro.  
**RN081.** Datas técnicas usam ISO.  
**RN082.** Formulários possuem labels, erros associados e foco acessível.  
**RN083.** Ações frequentes devem estar na zona de alcance mobile.  
**RN084.** Navegação e ação são categorias distintas.  
**RN085.** O CRM mobile não deve exibir quatro colunas comprimidas.  
**RN086.** Alterações não salvas devem ser protegidas contra cancelamento acidental.  

<!-- END FILE: 06_REGRAS_DE_NEGOCIO.md -->

---

<!-- BEGIN FILE: 07_MAQUINAS_DE_ESTADO.md -->

# 07 — MÁQUINAS DE ESTADO

## 1. Pendência

Estados:

- `open`;
- `in_progress`;
- `waiting`;
- `snoozed`;
- `overdue`;
- `completed`;
- `cancelled`.

Transições:

```text
open -> in_progress
open -> waiting
open -> snoozed
open -> completed
in_progress -> waiting
in_progress -> completed
waiting -> open
snoozed -> open
qualquer ativa -> overdue (derivada por prazo)
completed -> open (reabertura auditada)
ativa -> cancelled (motivo obrigatório)
```

`overdue` pode ser estado derivado, não necessariamente armazenado.

## 2. Agendamento

Estados:

- `scheduled`;
- `confirmed`;
- `completed`;
- `no_show`;
- `cancelled`;
- `rescheduled`.

Regras:

- `rescheduled` exige vínculo com novo agendamento;
- `completed` pode exigir evolução;
- `no_show` e `cancelled` sugerem próxima ação;
- histórico do agendamento anterior é preservado.

## 3. Lead

Estados:

- `new`;
- `contacted`;
- `scheduled`;
- `converted`;
- `archived`.

Conversão cria ou vincula paciente de maneira idempotente.

## 4. Paciente

Estados operacionais:

- `active`;
- `attention`;
- `waiting`;
- `inactive`;
- `archived`.

`attention` pode ser derivado por regra. Não deve apagar o estado clínico original sem modelagem.

## 5. Plano

Estados:

- `draft`;
- `active`;
- `paused`;
- `completed`;
- `cancelled`.

## 6. Etapa

Estados:

- `pending`;
- `ready`;
- `in_progress`;
- `waiting`;
- `completed`;
- `skipped`;
- `cancelled`.

## 7. Arquivo

Estados:

- `pending_upload`;
- `uploaded`;
- `processing`;
- `available`;
- `failed`;
- `archived`;
- `deleted`.

Não apresentar “enviado” antes de `uploaded` ou `available`.

## 8. Sincronização

Estados:

- `local_draft`;
- `pending_sync`;
- `syncing`;
- `synced`;
- `conflict`;
- `failed`.

O MVP online-first pode limitar o uso destes estados a rascunhos e fila de operações autorizadas.

<!-- END FILE: 07_MAQUINAS_DE_ESTADO.md -->

---

<!-- BEGIN FILE: 08_UX_ARQUITETURA_DA_INFORMACAO.md -->

# 08 — UX E ARQUITETURA DA INFORMAÇÃO

## 1. Direção

- mobile-first;
- viewport de referência 390 × 844 px;
- operação com uma mão;
- aparência premium, limpa e profissional;
- hierarquia forte;
- cores moderadas;
- alto contraste;
- urgência sem poluição visual;
- cards compactos;
- áreas de toque adequadas;
- feedback imediato e verdadeiro.

## 2. Navegação global canônica

Decisão mais recente adotada:

**Hoje | Pacientes | CRM | Mais**

O botão `+` é flutuante e não ocupa uma posição fixa da barra.

Documentos antigos que especificam `Hoje | Pacientes | + | Fluxos | Mais` ficam superados até nova ADR.

A área de Fluxos permanece funcionalmente necessária, mas deve ser acessível dentro do CRM, de Mais ou por rota contextual, conforme validação final de arquitetura da informação.

## 3. Ficha do paciente

Abas principais:

**Resumo | Planejamento | Agenda | Evoluções | Arquivos | Histórico**

Dados cadastrais ficam em ação secundária ou dentro de “Mais”, sem desaparecer da ficha.

### Resumo

- próxima ação;
- pendências;
- próximo agendamento;
- alertas;
- áreas ativas;
- tempo sem movimentação;
- três últimas movimentações.

### Navegação versus ações

Navegação permanente não deve ser escondida integralmente em bottom sheet.

A bottom sheet é reservada para ações contextuais.

## 4. Ação rápida

Bottom sheet com:

- WhatsApp;
- ligar;
- resolver pendência;
- agendar/reagendar;
- criar pendência;
- evolução;
- arquivo;
- próxima ação;
- alterar status;
- editar cadastro.

## 5. Tela Hoje

- card principal de atenção;
- categorias rápidas;
- prioridades;
- compromissos;
- filtros;
- estados vazios;
- erro de sincronização visível.

## 6. CRM

Mobile:

- tabs de estágios;
- uma etapa por vez;
- lista vertical;
- ação explícita para mudar estágio.

Desktop:

- Kanban completo;
- drag and drop opcional;
- alternativa acessível por botões.

## 7. Formulários

- campos agrupados;
- teclado apropriado;
- máscara visual;
- validação real;
- prevenção de duplo envio;
- loading no botão;
- erro por campo;
- resumo de erro;
- confirmação de saída com alterações;
- autocomplete quando seguro;
- salvamento somente após resposta real.

## 8. Estados obrigatórios por tela

- loading;
- vazio;
- sucesso;
- erro;
- sem permissão;
- offline;
- conflito;
- registro não encontrado.

## 9. Design system

### Cores semânticas

- verde: concluído;
- âmbar: atenção;
- vermelho: atraso crítico ou erro;
- azul/petróleo: ação primária;
- neutros: estrutura.

### Regras

- não usar cor como único indicador;
- não saturar interface;
- não usar transparência que prejudique leitura;
- manter consistência de raio, espaçamento e tipografia;
- fornecer foco visível;
- respeitar safe areas;
- evitar múltiplos FABs concorrentes.

<!-- END FILE: 08_UX_ARQUITETURA_DA_INFORMACAO.md -->

---

<!-- BEGIN FILE: 09_SYSTEM_DESIGN.md -->

# 09 — SYSTEM DESIGN

## 1. Direção arquitetural

- Next.js com App Router;
- Supabase Auth;
- PostgreSQL/Supabase;
- Supabase Storage;
- cliente SSR para sessão;
- RLS por clínica;
- TypeScript;
- validação compartilhada;
- serviços de domínio;
- online-first;
- cache limitado;
- observabilidade;
- migrations versionadas.

## 2. Camadas

```text
UI / Routes
  -> Application Services / Use Cases
    -> Domain Rules
      -> Repositories
        -> Supabase PostgreSQL / Storage
```

Componentes não devem chamar múltiplas tabelas diretamente sem camada de serviço quando a operação possuir regra de negócio.

## 3. Autenticação

- login por Supabase Auth;
- sessão real;
- cookies gerenciados pelo SDK SSR;
- middleware valida sessão real;
- Server Components verificam usuário e clínica ativa;
- logout via `supabase.auth.signOut`;
- recuperação de senha;
- renovação de sessão;
- tratamento de sessão expirada.

## 4. Persistência

Supabase é fonte única.

LocalStorage permitido apenas para:

- preferências não sensíveis;
- rascunho temporário explícito;
- cache com expiração;
- fila de sincronização futura autorizada.

Dados clínicos completos não devem permanecer indefinidamente no navegador.

## 5. Concorrência

Todas as tabelas mutáveis relevantes devem considerar:

- `created_at`;
- `updated_at`;
- `created_by`;
- `updated_by`;
- `version`.

Atualização otimista:

```text
UPDATE ... WHERE id = ? AND version = versão_lida
```

Falha de versão gera conflito, não sobrescrita silenciosa.

## 6. Eventos

Eventos relevantes devem ser registrados para construir Histórico:

- paciente criado;
- cadastro alterado;
- pendência criada;
- pendência concluída;
- contato;
- agendamento;
- cancelamento;
- reagendamento;
- evolução;
- retificação;
- arquivo;
- mudança de plano;
- mudança de status.

## 7. Erros

Erros devem possuir:

- código;
- mensagem ao usuário;
- contexto técnico em log;
- correlação;
- possibilidade de retry;
- ausência de dados sensíveis no log.

<!-- END FILE: 09_SYSTEM_DESIGN.md -->

---

<!-- BEGIN FILE: 10_MODELO_DE_DADOS.md -->

# 10 — MODELO DE DADOS PROPOSTO

## 1. Tabelas estruturais

### `clinics`

- `id uuid pk`;
- `name text not null`;
- `slug text unique`;
- `status text`;
- timestamps.

### `clinic_units`

- `id uuid pk`;
- `clinic_id uuid fk`;
- `name`;
- endereço;
- timezone;
- status.

### `profiles`

- `id uuid pk references auth.users`;
- nome;
- telefone;
- preferências;
- timestamps.

### `clinic_members`

- `id uuid pk`;
- `clinic_id`;
- `user_id`;
- `role`;
- `active`;
- timestamps;
- unique (`clinic_id`, `user_id`).

### `professionals`

- `id uuid pk`;
- `clinic_id`;
- `name`;
- registro profissional;
- especialidade;
- `active`;
- timestamps.

### `professional_users`

- `professional_id`;
- `user_id`;
- unique.

### `rooms_or_chairs`

- `id`;
- `clinic_id`;
- `unit_id`;
- nome;
- tipo;
- ativo.

## 2. Pacientes

### `patients`

Campos essenciais:

- `id uuid pk`;
- `clinic_id uuid not null`;
- `name text not null`;
- `birth_date date null`;
- `cpf text null`;
- `sex text null`;
- `phone_e164 text not null`;
- `phone_raw text null`;
- `alternate_phone text null`;
- `email text null`;
- endereço em colunas próprias;
- `status text not null`;
- `next_action_summary text null`;
- `next_action_due_at timestamptz null`;
- `notes text null`;
- autoria;
- timestamps;
- versionamento;
- `archived_at`.

Índices:

- (`clinic_id`, `name`);
- (`clinic_id`, `phone_e164`);
- (`clinic_id`, `cpf`);
- (`clinic_id`, `status`);
- (`clinic_id`, `next_action_due_at`).

## 3. Pendências

### `tasks`

- `id`;
- `clinic_id`;
- `patient_id` ou `lead_id`;
- `title`;
- `description`;
- `category`;
- `priority`;
- `status`;
- `responsible_member_id`;
- `due_at`;
- `waiting_reason`;
- `review_at`;
- `contact_channel`;
- origem;
- timestamps;
- versionamento.

## 4. Agenda

### `appointments`

- `id`;
- `clinic_id`;
- `patient_id`;
- `professional_id`;
- `room_or_chair_id`;
- `starts_at`;
- `duration_minutes`;
- `preparation_minutes`;
- `cleanup_minutes`;
- `type`;
- `procedure`;
- `status`;
- `recurrence_rule`;
- `rescheduled_from_id`;
- `treatment_plan_item_id`;
- lembretes;
- notas;
- autoria;
- timestamps;
- versionamento.

## 5. Planejamento

### `treatment_plans`

- paciente;
- título;
- status;
- template/version;
- datas;
- autoria.

### `treatment_plan_areas`

- plano;
- área;
- ordem;
- status;
- progresso derivado.

### `treatment_plan_items`

- área;
- título;
- descrição;
- status;
- ordem;
- responsável;
- prazo;
- dependência;
- timestamps;
- versionamento.

## 6. Evoluções

### `evolutions`

- `id`;
- `clinic_id`;
- `patient_id`;
- `professional_id`;
- `appointment_id`;
- data clínica;
- procedimento;
- descrição;
- intercorrência;
- conduta;
- orientação;
- próxima etapa;
- `supersedes_id` ou relação de retificação;
- autoria;
- timestamps;
- versionamento;
- sem delete destrutivo.

### `evolution_amendments`

Pode ser criada para adendos e retificações, preservando original e motivo.

## 7. Arquivos

### `patient_files`

- `id`;
- `clinic_id`;
- `patient_id`;
- `storage_path`;
- `external_url`;
- `kind`;
- `title`;
- `category`;
- MIME;
- tamanho;
- checksum;
- status;
- vínculo;
- autor;
- timestamps;
- arquivamento.

## 8. CRM e fluxos

- `leads`;
- `contact_events`;
- `flows`;
- `flow_stages`;
- `flow_memberships`.

## 9. Configuração e comunicação

- `clinic_settings`;
- `whatsapp_templates`;
- `notification_preferences`.

## 10. Auditoria

### `audit_logs`

- clínica;
- ator;
- ação;
- entidade;
- ID;
- antes/depois com política de minimização;
- IP quando permitido;
- user agent quando necessário;
- timestamp;
- correlation ID;
- imutável para usuários comuns.

## 11. Remoção de `[META:...]`

Campos antigos devem ser mapeados:

| Metadado antigo | Destino |
|---|---|
| address | coluna/endereço |
| duration | `appointments.duration_minutes` |
| roomOrChair | FK de recurso |
| preparationInterval | coluna numérica |
| recurrence | regra estruturada |
| treatmentStage | FK de etapa |
| reminder | tabela/JSON controlado |
| category | `tasks.category` |
| responsible | FK de membro |
| contactChannel | `tasks.contact_channel` |

<!-- END FILE: 10_MODELO_DE_DADOS.md -->

---

<!-- BEGIN FILE: 11_AUTENTICACAO_RLS_E_PERMISSOES.md -->

# 11 — AUTENTICAÇÃO, RLS E PERMISSÕES

## 1. Estado obrigatório

A aplicação deve abandonar:

- credenciais estáticas;
- cookie `lifeum-flow-session`;
- verificação de existência de cookie;
- `user-email` como identidade;
- login apenas no frontend.

## 2. Fluxo correto

1. login via Supabase Auth;
2. sessão retornada e persistida pelo SDK;
3. middleware SSR renova e valida;
4. usuário seleciona ou recebe clínica ativa;
5. permissões são derivadas de `clinic_members`;
6. queries usam JWT real;
7. RLS valida clínica e papel;
8. logout revoga sessão.

## 3. Papéis

| Ação | Proprietário | Administrador | Dentista | Recepção | Auxiliar | Leitura |
|---|---:|---:|---:|---:|---:|---:|
| Ver pacientes | Sim | Sim | Sim | Sim | Limitado | Sim |
| Editar cadastro | Sim | Sim | Sim | Sim | Limitado | Não |
| Criar agendamento | Sim | Sim | Sim | Sim | Conforme permissão | Não |
| Criar pendência | Sim | Sim | Sim | Sim | Sim | Não |
| Criar evolução | Sim | Conforme credencial | Sim | Não | Não | Não |
| Retificar evolução própria | Sim | Conforme política | Sim | Não | Não | Não |
| Ver arquivos clínicos | Sim | Conforme permissão | Sim | Limitado | Limitado | Conforme escopo |
| Exportar dados | Sim | Conforme permissão | Conforme permissão | Não por padrão | Não | Não |
| Gerenciar usuários | Sim | Sim | Não | Não | Não | Não |
| Configurar clínica | Sim | Sim | Não | Não | Não | Não |
| Excluir logicamente registros | Sim | Limitado | Limitado | Limitado | Não | Não |

A matriz final deve ser validada antes de gerar policies.

## 4. RLS

Toda policy deve verificar:

- `auth.uid()` válido;
- membro ativo;
- `clinic_id` da linha;
- permissão da operação;
- restrições clínicas adicionais.

Exemplo conceitual:

```sql
exists (
  select 1
  from clinic_members cm
  where cm.user_id = auth.uid()
    and cm.clinic_id = target.clinic_id
    and cm.active = true
)
```

Para evoluções, também validar papel clínico.

## 5. Proteções

- frontend não escolhe `created_by`;
- `clinic_id` derivado do contexto autorizado;
- audit logs sem update/delete por usuários comuns;
- arquivos com path contendo IDs mas protegidos por policy;
- service functions com `security definer` apenas quando justificadas e com `search_path` fixo;
- testes de acesso cruzado obrigatórios.

<!-- END FILE: 11_AUTENTICACAO_RLS_E_PERMISSOES.md -->

---

<!-- BEGIN FILE: 12_ARQUIVOS_STORAGE_LGPD_E_AUDITORIA.md -->

# 12 — ARQUIVOS, STORAGE, LGPD E AUDITORIA

## 1. Storage

- bucket privado;
- paths: `clinic/{clinic_id}/patient/{patient_id}/{file_id}/{filename}`;
- nomes físicos não dependem apenas do nome original;
- URL assinada;
- expiração curta;
- upload em etapas;
- rollback de metadado em falha;
- limpeza de órfãos;
- validação de MIME real;
- limite configurado;
- política de download.

## 2. LGPD

O sistema deve suportar:

- finalidade;
- minimização;
- necessidade;
- controle de acesso;
- transparência;
- correção;
- exportação;
- retenção;
- descarte;
- resposta a incidente;
- registro de compartilhamento.

Consentimento não deve ser tratado como única base legal universal. A base aplicável deve ser definida conforme finalidade e contexto assistencial.

## 3. Dados no navegador

- evitar dados clínicos persistidos indefinidamente;
- não armazenar prontuário completo em LocalStorage;
- limpar cache em logout quando adequado;
- não logar CPF, evolução ou token;
- proteger contra XSS;
- revisar dependências.

## 4. Evoluções e integridade

Diferenciar:

- edição antes de finalizar;
- adendo;
- retificação;
- correção administrativa;
- arquivamento;
- exclusão lógica.

Após finalização clínica, preservar original.

## 5. Auditoria mínima

Registrar:

- login relevante;
- acesso a ficha sensível conforme política;
- criação e alteração cadastral;
- evolução e retificação;
- exportação;
- download;
- alteração de planejamento;
- conclusão de pendência;
- mudança de status;
- exclusão lógica.

<!-- END FILE: 12_ARQUIVOS_STORAGE_LGPD_E_AUDITORIA.md -->

---

<!-- BEGIN FILE: 13_ESTADO_ATUAL_LACUNAS_E_BUGS.md -->

# 13 — ESTADO ATUAL, LACUNAS E BUGS

## 1. Natureza do protótipo atual

O estado auditado é majoritariamente um protótipo local com interface relativamente avançada e persistência incompleta.

A auditoria estática reportou aproximadamente:

- 25 rotas;
- 24 telas operacionais;
- pacientes, tarefas, agenda, CRM e evoluções com lógica local;
- planejamento em LocalStorage;
- arquivos simulados;
- relatórios mockados;
- configurações sem persistência;
- histórico parcial;
- fluxos parcialmente mockados.

Esses números devem ser revalidados diretamente no repositório antes de qualquer migração.

## 2. Falhas estruturais comprovadas

### Autenticação

- credenciais estáticas no frontend;
- cookie com valor estático;
- cookie forjável;
- sem HttpOnly;
- sem Secure;
- middleware verifica apenas existência;
- sem Supabase Auth;
- sem JWT válido;
- logout apenas local.

### Supabase

- cliente pode ficar `null` por configuração ausente;
- RLS exige usuário autenticado;
- aplicação não cria sessão;
- operações são bloqueadas;
- fallback local mascara a falha;
- seis módulos possuem código potencial de integração, não integração validada.

### Multitenancy

- sem `clinic_id`;
- sem clínicas;
- sem membros;
- sem papéis;
- sem isolamento;
- qualquer usuário autenticado poderia acessar dados globais sob policies atuais.

### Persistência

- LocalStorage guarda entidades centrais;
- sem outbox;
- sem retry robusto;
- sem idempotência;
- sem resolução de conflito;
- last-write-wins;
- sem sincronização entre dispositivos.

### Metadados

- endereço e campos operacionais em `[META:...]`;
- risco de corrupção;
- ausência de índice;
- sobrescrita;
- dificuldade de relatório.

### Arquivos

- upload binário inexistente;
- metadados fictícios;
- links falsos;
- sem Storage;
- sem signed URLs.

### Auditoria

- ausência de logs;
- sem autoria robusta;
- sem histórico real completo.

## 3. Bugs e correções funcionais obrigatórias

### BUG-001 — WhatsApp abre número genérico

**Esperado:** usar o telefone cadastrado no paciente selecionado.  
**Atual:** abre número genérico ou incorreto.  
**Correção futura:** rastrear origem, normalizar telefone real, bloquear fallback e testar todos os pontos de entrada.

### BUG-002 — Cadastro incompleto

Campos que devem constar e persistir:

- CPF;
- sexo;
- endereço completo.

Deve ser verificado se já existem visualmente, se persistem e se retornam corretamente após recarregar.

### BUG-003 — Pacientes podem não estar no Supabase

Deve ser verificado:

- configuração `.env`;
- sessão Auth;
- RLS;
- tabela;
- colunas;
- insert;
- retorno;
- tratamento de erro;
- fonte usada pela listagem;
- persistência após outro dispositivo.

Não é permitido concluir que salvou apenas porque apareceu na interface.

### BUG-004 — Edição de agendamento

A rota denominada “editar” aparenta criar, não editar registro existente.

### BUG-005 — Configurações

Toast sem persistência real.

### BUG-006 — Relatórios

Dados estáticos tratados visualmente como métricas.

### BUG-007 — Histórico

Mistura eventos locais e mockados.

### BUG-008 — Planejamento

Exclusivo no LocalStorage.

### BUG-009 — Arquivos

Upload simulado.

### BUG-010 — Paciente inexistente

Algumas rotas podem retornar tela branca ou loading permanente.

## 4. Matriz atual versus desejado

| Área | Atual | Desejado | Severidade | Fase |
|---|---|---|---|---|
| Login | mock no cliente | Supabase Auth SSR | Crítica | 0 |
| Middleware | cookie forjável | sessão real | Crítica | 0 |
| RLS | autenticado global | isolamento por clínica | Crítica | 0 |
| Usuários | inexistente | membros e papéis | Crítica | 0 |
| Pacientes | local/fallback | Supabase | Crítica | 1 |
| WhatsApp | número incorreto | telefone vinculado | Alta | 1 |
| Cadastro | campos incompletos | modelo completo | Alta | 1 |
| Agenda | criação parcial | CRUD e conflito | Alta | 1 |
| Planejamento | LocalStorage | tabelas próprias | Alta | 2/3 |
| Arquivos | mock | Storage privado | Alta | 2 |
| Evoluções | sem trilha | integridade | Alta | 2 |
| Histórico | parcial | eventos reais | Alta | 2 |
| Configurações | interface | persistência | Média | 1 |
| Relatórios | mock | dados reais | Média | 4 |
| CRM mobile | Kanban horizontal | estágio por vez | Média | 2 |

<!-- END FILE: 13_ESTADO_ATUAL_LACUNAS_E_BUGS.md -->

---

<!-- BEGIN FILE: 14_ROADMAP_E_PLANO_DE_MIGRACAO.md -->

# 14 — ROADMAP E PLANO DE MIGRAÇÃO

## Fase D0 — Consolidação documental

Objetivo:

- separar este arquivo;
- comparar documentos existentes;
- marcar obsoletos;
- registrar conflitos;
- aprovar decisões provisórias.

**Sem código.**

## Fase 0 — Fundação de segurança

- Supabase Auth;
- SSR;
- clínicas;
- membros;
- profissionais;
- papéis;
- `clinic_id`;
- RLS;
- timestamps;
- autoria;
- versionamento;
- audit log inicial;
- remoção do cookie mockado.

Critério bloqueador: testes de isolamento entre clínicas.

## Fase 1 — Pacientes e continuidade

- modelo definitivo de paciente;
- CPF;
- sexo;
- endereço;
- telefone;
- WhatsApp real;
- pacientes no Supabase;
- tarefas;
- próxima ação;
- Hoje;
- configurações essenciais.

## Fase 2 — Agenda, CRM e arquivos

- edição de agenda;
- desfechos;
- conflito;
- CRM mobile;
- contatos;
- Storage;
- arquivos;
- histórico por eventos.

## Fase 3 — Planejamento e evoluções

- planos;
- áreas;
- workflows;
- etapas;
- progresso;
- evolução;
- adendos;
- retificações;
- vínculo com próximas ações.

## Fase 4 — Relatórios e otimização

- eventos confiáveis;
- métricas reais;
- busca server-side;
- paginação;
- performance;
- observabilidade;
- acessibilidade aprofundada.

## Migração do LocalStorage

1. inventariar chaves;
2. exportar backup;
3. validar JSON;
4. identificar clínica;
5. identificar autor;
6. mapear IDs;
7. deduplicar;
8. importar por lote transacional;
9. registrar erros;
10. marcar lote;
11. conferir contagens;
12. bloquear reimportação;
13. preservar backup;
14. remover dados locais somente após confirmação.

## Migração de `[META:...]`

1. parser tolerante;
2. preservar texto livre;
3. extrair JSON válido;
4. registrar registros corrompidos;
5. mapear campos;
6. gravar colunas;
7. validar;
8. manter log;
9. retirar marcador após aprovação;
10. rollback disponível.

<!-- END FILE: 14_ROADMAP_E_PLANO_DE_MIGRACAO.md -->

---

<!-- BEGIN FILE: 15_TESTES_E_CRITERIOS_DE_ACEITE.md -->

# 15 — TESTES E CRITÉRIOS DE ACEITE

## 1. Definição de pronto

Uma função só está pronta quando:

- usa dados reais;
- persiste na fonte oficial;
- valida entrada;
- trata loading;
- trata vazio;
- trata erro;
- respeita permissão;
- respeita RLS;
- funciona em mobile;
- não apresenta mock;
- possui teste reproduzível;
- não gera erro de console;
- não gera erro de rede inesperado;
- possui rollback quando estrutural.

## 2. Paciente

- cadastrar com nome e telefone;
- cadastrar CPF, sexo e endereço;
- recarregar;
- abrir em outro dispositivo;
- confirmar mesma entidade;
- testar telefone inválido;
- testar CPF inválido;
- testar duplicidade;
- testar usuário sem permissão;
- testar acesso de outra clínica.

## 3. WhatsApp

- paciente A abre telefone A;
- paciente B abre telefone B;
- nenhum usa número genérico;
- mensagem codificada;
- telefone ausente bloqueia;
- telefone inválido bloqueia;
- DDI é tratado;
- todos os pontos de entrada usam a mesma função.

## 4. Auth e RLS

- sem sessão não acessa;
- cookie manual não concede acesso;
- sessão expirada redireciona;
- clínica A não lê B;
- recepção não altera evolução;
- dentista autorizado cria evolução;
- usuário desativado perde acesso;
- service role não está no bundle.

## 5. Persistência

- sucesso somente após banco;
- falha não mostra sucesso;
- retry controlado;
- conflito de versão é apresentado;
- LocalStorage não mascara erro;
- reload preserva;
- outro dispositivo vê.

## 6. Agenda

- conflito de profissional;
- conflito de cadeira;
- limites adjacentes;
- cancelado não bloqueia;
- edição ignora próprio ID;
- recorrência valida ocorrências;
- falta cria continuidade.

## 7. Arquivos

- upload real;
- MIME inválido;
- tamanho;
- URL expira;
- outra clínica não acessa;
- metadado não fica órfão;
- falha não mostra “enviado”.

## 8. UX

- viewport 390 × 844;
- teclado;
- safe area;
- foco;
- labels;
- mensagens;
- aria-live;
- zoom;
- reflow;
- navegação por teclado;
- saída com alterações;
- prevenção de duplo envio.

<!-- END FILE: 15_TESTES_E_CRITERIOS_DE_ACEITE.md -->

---

<!-- BEGIN FILE: 16_ADRS_DECISOES_E_PENDENCIAS.md -->

# 16 — ADRS, DECISÕES E PENDÊNCIAS

## Decisões aprovadas ou consolidadas

- foco é gestão ativa;
- mobile-first;
- planejamento é módulo central;
- WhatsApp no MVP é deep link com envio manual;
- telefone deve ser o do paciente;
- financeiro completo fora do MVP;
- offline-first completo fora do MVP;
- Supabase deve ser fonte primária;
- LocalStorage não é banco;
- histórico deve ser timeline de eventos reais;
- arquivos devem aceitar múltiplas categorias;
- CRM mobile deve evitar Kanban comprimido;
- ficha contém Resumo, Planejamento, Agenda, Evoluções, Arquivos e Histórico;
- dados cadastrais continuam disponíveis;
- bottom sheet serve a ações rápidas;
- documentação precede código.

## Decisões arquiteturais provisórias adotadas

Estas decisões orientam a documentação, mas devem ser confirmadas antes da implementação:

- arquitetura multi-clínica preparada desde o início;
- ativação inicial em uma clínica;
- Lifeum Flow como camada complementar, não prontuário completo;
- online-first com cache limitado;
- template de planejamento padrão + customização por clínica;
- navegação inferior `Hoje | Pacientes | CRM | Mais`, com `+` flutuante;
- sexo como campo separado de identidade de gênero.

## Decisões ainda abertas

- quais papéis entram na primeira implantação;
- necessidade de multiunidade no MVP;
- lista final de MIME e limites;
- política de retenção;
- logs de visualização de prontuário;
- exportação no MVP ou fase posterior;
- escopo exato das evoluções como documento clínico;
- necessidade de assinatura avançada;
- política de CPF duplicado;
- localização de Fluxos na navegação;
- tratamento de vídeo e áudio no Storage;
- integração futura com Clinicorp;
- se configurações de planejamento serão por clínica e também por profissional.

## Regra

Decisão aberta não autoriza implementação por inferência.

<!-- END FILE: 16_ADRS_DECISOES_E_PENDENCIAS.md -->

---

<!-- BEGIN FILE: 17_PROTOCOLO_DE_EXECUCAO_ANTIGRAVITY.md -->

# 17 — PROTOCOLO DE EXECUÇÃO NO ANTIGRAVITY

## 1. Primeira resposta esperada ao receber este pacote

Sem alterar código, o Antigravity deve entregar:

1. lista dos documentos existentes no repositório;
2. localização;
3. versão;
4. conteúdo sobreposto;
5. conflito;
6. documento obsoleto;
7. documento ausente;
8. proposta de estrutura `/docs`;
9. lista de decisões abertas;
10. confirmação de que nenhum código foi alterado.

## 2. Formato de fase futura

Cada pedido de implementação deve conter:

- fase;
- objetivo;
- documentos normativos;
- escopo;
- fora de escopo;
- arquivos permitidos;
- migrations permitidas;
- regras;
- critérios de aceite;
- testes;
- rollback;
- relatório final.

## 3. Restrições

Durante uma fase:

- não tocar em arquivos não autorizados;
- não instalar dependência sem justificar;
- não mudar UX fora do escopo;
- não criar coluna genérica para evitar modelagem;
- não reutilizar `notes` para dados estruturados;
- não desativar RLS;
- não substituir erro por fallback invisível;
- não manter mock em rota declarada pronta;
- não fazer “melhorias extras”.

## 4. Relatório obrigatório após implementação

- arquivos alterados;
- diff funcional;
- migrations;
- policies;
- testes executados;
- resultados;
- erros;
- pendências;
- riscos;
- rollback;
- screenshots quando UX;
- queries de verificação quando banco.

## 5. Critérios de parada

Parar e reportar, sem improvisar, quando:

- documentação conflitar;
- decisão aberta bloquear;
- migration puder apagar dado;
- RLS não puder ser validada;
- credencial necessária estiver ausente;
- teste revelar acesso cruzado;
- mudança exceder fase;
- rollback não for possível.

<!-- END FILE: 17_PROTOCOLO_DE_EXECUCAO_ANTIGRAVITY.md -->

---

<!-- BEGIN FILE: 18_BRIEF_LANDING_PAGE.md -->

# 18 — BRIEF DA LANDING PAGE

## 1. Função

A landing page é uma página pública de apresentação. Ela não substitui o PRD do aplicativo e não define banco, segurança ou regras clínicas.

## 2. Objetivo

Apresentar o Lifeum Flow como ferramenta que reduz esquecimentos, paralisações e perda de continuidade.

## 3. Público

- dentistas;
- pequenas clínicas;
- profissionais sem equipe;
- clínicas com recepção;
- equipes que usam prontuário tradicional, mas carecem de acompanhamento ativo.

## 4. Mensagem principal

> Seu prontuário guarda informações. O Lifeum Flow coloca na sua frente o que ainda precisa ser feito.

## 5. Seções

- hero;
- problema;
- como funciona;
- tela Hoje;
- próxima ação;
- planejamento;
- agenda;
- CRM;
- segurança;
- benefícios;
- FAQ;
- CTA.

## 6. CTA provisório

- solicitar demonstração;
- entrar na lista de espera;
- acessar ambiente de teste.

O CTA final depende do estágio comercial.

## 7. Restrições

- não prometer automação de WhatsApp;
- não prometer integração inexistente;
- não afirmar conformidade legal absoluta;
- não apresentar métricas falsas;
- não divulgar função mockada como disponível;
- distinguir “em desenvolvimento” de “disponível”.

<!-- END FILE: 18_BRIEF_LANDING_PAGE.md -->

---

# ANEXO A — CHECKLIST DOCUMENTAL PARA O ANTIGRAVITY

Antes de qualquer código, confirmar:

- [ ] arquivos documentais existentes foram inventariados;
- [ ] conflitos foram listados;
- [ ] documentos antigos foram marcados;
- [ ] este pacote foi separado sem perda;
- [ ] decisões provisórias foram identificadas;
- [ ] decisões abertas não foram implementadas;
- [ ] nenhum arquivo de código foi alterado;
- [ ] nenhuma migration foi executada;
- [ ] nenhuma policy foi alterada;
- [ ] nenhum segredo foi solicitado em texto público.

# ANEXO B — PRIORIDADES IMEDIATAS APÓS APROVAÇÃO DOCUMENTAL

1. autenticação real;
2. multitenancy;
3. RLS;
4. modelo de paciente;
5. persistência no Supabase;
6. correção do WhatsApp;
7. tarefas e próxima ação;
8. agenda;
9. Storage;
10. planejamento;
11. evoluções;
12. histórico;
13. CRM;
14. relatórios.

# ENCERRAMENTO

Este arquivo não é um prompt de execução. É a base normativa para organizar o projeto.

O Antigravity deve primeiro transformar este pacote em documentos separados, comparar com o repositório e devolver um relatório documental. Somente após aprovação será emitido um prompt específico para a Fase 0.
