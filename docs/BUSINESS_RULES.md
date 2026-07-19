# Regras de Negócio Não Negociáveis — Lifeum Flow

Este documento consolida as regras de negócio imperativas do **Lifeum Flow**, as quais devem ser aplicadas estritamente em todas as implementações futuras e revisões de código.

---

## 🔒 1. Segurança e Controle de Acesso
- **RN01 (Middleware de Bloqueio):** Todas as rotas internas clínico-operacionais (ex: `/hoje`, `/pacientes`, `/fluxos`, `/mais`) devem ser protegidas pelo middleware. Apenas a rota `/login`, assets públicos e APIs estritamente públicas são isentos do bloqueio.
- **RN02 (Autenticação Obrigatória):** Para que um usuário acesse rotas privadas, o cookie `lifeum-flow-session` deve estar ativo e preenchido. Caso contrário, o middleware redirecionará imediatamente para a rota `/login`.
- **RN03 (Sessão Segura):** Ao efetuar Logout na página [/mais](file:///d:/SISTEMAS/Lifeum%20Flow/Lifeum%20Flow%20Dev/src/app/mais/page.tsx), o cookie `lifeum-flow-session` deve ser expirado explicitamente no navegador.

---

## 📅 2. Gestão de Agenda e Conflitos Clínicos
- **RN04 (Bloqueio Rígido de Colisão):** O sistema deve impedir de forma rígida a criação ou atualização de agendamentos que sobreponham horários na mesma data para:
  - O **mesmo profissional responsável**
  - A **mesma cadeira ou sala de atendimento**
- **RN05 (Cálculo de Período Clínico):** O período ocupado por um agendamento é calculado pela soma:
  $$\text{Período Ocupado} = \text{Horário de Início} + \text{Duração Estimada} + \text{Intervalo de Limpeza}$$
- **RN06 (Notificação de Conflito):** Em caso de colisão detectada, o salvamento deve ser interrompido e uma mensagem de erro explícita deve ser apresentada ao usuário no formulário, indicando qual paciente e profissional já ocupam aquele período.

---

## 📋 3. Integridade e Tratamento de Dados do Paciente
- **RN07 (Fidelidade do Cadastro):** Todo paciente cadastrado deve possuir pelo menos: Nome Completo e Celular (WhatsApp) válidos.
- **RN08 (Edição do CPF):** O CPF do paciente deve ser editável a qualquer momento e estar disponível tanto no cadastro inicial quanto na aba de dados cadastrais da ficha clínica.
- **RN09 (Dinamicidade do Planejamento):** A listagem geral de planejamentos clínicos de um paciente deve calcular e exibir a porcentagem de conclusão em tempo real, baseada diretamente no estado dos checkboxes do checklist de cada especialidade odontológica.
- **RN10 (Persistência Híbrida de Campos Estendidos):** Campos específicos de negócios que não possuam mapeamento direto no banco de dados Supabase ativo devem ser serializados como metadados JSON ocultos no final da coluna de texto `notes` ou `description` no formato `[META:{"chave":"valor"}]`.

---

## 📱 4. UI/UX e Acessibilidade (Mobile-First)
- **RN11 (Associação de Labels):** Todo e qualquer campo de formulário (`<input>`, `<select>`, `<textarea>`) deve possuir uma tag `<label>` associada explicitamente através de ID e do atributo `htmlFor`.
- **RN12 (Checkboxes Semânticos):** Checkboxes em listas ou planejamentos devem ser construídos com tags `<input type="checkbox">` semânticas com suporte a foco por teclado e estados ARIA (`aria-checked`, `role="checkbox"`).
- **RN13 (Formato Brasileiro de Datas):** Toda data de visualização para o usuário final deve ser formatada no padrão brasileiro `DD/MM/AAAA`. O formato técnico de banco (`AAAA-MM-DD`) deve ser restrito à comunicação de dados.
- **RN14 (Centralização do Fuso Horário):** O sistema deve calcular a data de hoje dinamicamente com base no fuso horário do dispositivo do cliente, evitando discrepâncias temporais e erros React de hidratação (#418).
