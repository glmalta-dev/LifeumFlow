alter table public.tasks drop constraint if exists tasks_status_check;
alter table public.tasks add constraint tasks_status_check check (
  status in ('pending','in_progress','waiting_patient','waiting_third_party','postponed','completed','cancelled')
);

alter table public.appointments drop constraint if exists appointments_status_check;
alter table public.appointments add constraint appointments_status_check check (
  status in ('agendado','confirmado','realizado','faltou','cancelado','reagendado')
);

create index if not exists tasks_clinic_status_due_idx on public.tasks (clinic_id, status, due_date);
create index if not exists appointments_clinic_date_professional_idx on public.appointments (clinic_id, date, professional);
create index if not exists appointments_clinic_date_room_idx on public.appointments (clinic_id, date, room_or_chair)
  where room_or_chair is not null;
