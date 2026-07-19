-- Migração Fase 4: Cadastro inicial dos modelos de mensagem padrão do WhatsApp
-- Criado em: 19/07/2026

insert into public.message_templates (id, clinic_id, title, body_text, is_active)
values 
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'Confirmar Consulta',
    'Olá {nome_completo}, tudo bem? Aqui é da {clinica}. Gostaríamos de confirmar sua consulta marcada para {data} às {horario} com o profissional {profissional}. Confirma sua presença?',
    true
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'Oferecer Horário',
    'Olá {primeiro_nome}, como vai? Temos horários disponíveis para agendarmos sua próxima consulta de retorno com o {profissional}. Qual o melhor dia e período para você?',
    true
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'Solicitar Exame',
    'Olá {primeiro_nome}, tudo bem? Para darmos andamento ao seu planejamento de tratamento, precisamos que você nos envie as radiografias ou exames solicitados pelo profissional {profissional}. Pode nos enviar por aqui?',
    true
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'Lembrar Retorno',
    'Olá {primeiro_nome}, faz algum tempo desde a sua última manutenção na {clinica}. É muito importante agendarmos sua limpeza e avaliação periódica. Vamos marcar?',
    true
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'Enviar Localização',
    'Olá {primeiro_nome}, segue o nosso endereço completo para sua consulta: {localizacao}. Se precisar de ajuda com o caminho, nos avise!',
    true
  ),
  (
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'Acompanhamento Pós-Atendimento',
    'Olá {primeiro_nome}, tudo bem? Aqui é o {profissional}. Passando para acompanhar como você está se sentindo após o procedimento realizado hoje. Qualquer dúvida ou desconforto, estamos à disposição!',
    true
  )
on conflict do nothing;
