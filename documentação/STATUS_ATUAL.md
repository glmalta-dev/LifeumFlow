# STATUS ATUAL

- **Ultima atualizacao:** 19/07/2026 18:50 (America/Sao_Paulo)
- **Fase atual:** Hardening e fechamento funcional do MVP
- **Branch:** `main`
- **Supabase:** `jcteqdvkviodempumgqp`

## Implementado e validado nesta rodada

- ESLint sem erros ou avisos.
- TypeScript (`tsc --noEmit`) sem erros.
- Build de producao Next.js concluido.
- Supabase mantido como unica fonte de dados clinicos; removidos mocks e fallback em localStorage.
- RLS multitenant corrigida com policies qualificadas e helper privado.
- Storage `patient-exams` isolado pelo primeiro segmento `{clinicId}` e por membership ativa.
- Teste transacional de isolamento: zero linhas e zero objetos de outra clinica ficaram visiveis; rollback executado.
- Captura rapida exige paciente real e nao usa mais `pat-1`.
- Telefone centralizado e validado para WhatsApp e `tel:` sem numero ficticio.
- CRUD de modelos de WhatsApp disponivel em `/mais/configuracoes`.
- Pendencias ganharam estados operacionais e atualizacao persistida.
- Agenda ganhou desfecho manual: compareceu, faltou, cancelou ou reagendou.
- Evolucoes ganharam campos estruturados de intercorrencia, conduta e orientacao.
- Schema de planejamento hierarquico criado (`plan_workflows` e `plan_steps`).
- Historico local e remoto das migrations sincronizado; `db push --dry-run` informou banco atualizado.

## Implementado, aguardando validacao manual autenticada

- Login invalido, logout, recarga de sessao e expiracao/invalidez do token pela UI real.
- CRUD vertical completo com dados reais para paciente, pendencia, agenda, evolucao, arquivo e planejamento.
- Upload, URL assinada e exclusao de arquivo pelo usuario autenticado.
- Responsividade visual em aparelho real de aproximadamente 390 px.
- Pipeline GitHub Actions e deploy publico da Hostinger apos o push desta rodada.

## Pendencias remanescentes

- Habilitar `Leaked Password Protection` nas configuracoes do Supabase Auth; e configuracao de painel/plano e nao migration SQL.
- Integrar a UI atual de checklist de planejamento diretamente ao novo modelo `plan_workflows`/`plan_steps`.
- Implementar versionamento de edicao de evolucoes usando `evolution_revisions`; novas evolucoes ja sao persistidas, mas edicao versionada ainda nao possui interface.
- Completar metadados e exclusao de arquivos na interface.
- Completar filtros avancados da lista de pacientes e alternancia cards/lista da tela Hoje.

## Evidencias

- `npm.cmd run lint`: sucesso.
- `npx.cmd tsc --noEmit`: sucesso.
- `npm.cmd run build`: sucesso, 16 paginas estaticas e rotas dinamicas geradas.
- Advisors de seguranca: somente `auth_leaked_password_protection` permanece.
- Teste RLS SQL transacional: `unauthorized_rows_visible = 0`.
- Teste Storage SQL transacional: `unauthorized_storage_objects_visible = 0`.
- `npx.cmd supabase db push --linked --dry-run --yes`: `Remote database is up to date`.
