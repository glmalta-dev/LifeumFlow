alter function public.handle_new_user() set search_path = '';
revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop policy if exists profiles_self_access on public.profiles;
create policy profiles_self_select on public.profiles for select to authenticated
  using ((select auth.uid()) = profiles.id);
create policy profiles_self_update on public.profiles for update to authenticated
  using ((select auth.uid()) = profiles.id)
  with check ((select auth.uid()) = profiles.id);

create index if not exists professional_users_professional_idx on public.professional_users (professional_id);
create index if not exists professional_users_user_idx on public.professional_users (user_id);
create index if not exists professionals_clinic_idx on public.professionals (clinic_id);

create policy professional_users_tenant_select on public.professional_users for select to authenticated
using (
  professional_users.user_id = (select auth.uid())
  or exists (
    select 1 from public.professionals professional
    where professional.id = professional_users.professional_id
      and (select private.is_clinic_member(professional.clinic_id))
  )
);
create policy professional_users_tenant_insert on public.professional_users for insert to authenticated
with check (exists (
  select 1 from public.professionals professional
  where professional.id = professional_users.professional_id
    and (select private.is_clinic_member(professional.clinic_id, array['owner','admin']))
));
create policy professional_users_tenant_delete on public.professional_users for delete to authenticated
using (exists (
  select 1 from public.professionals professional
  where professional.id = professional_users.professional_id
    and (select private.is_clinic_member(professional.clinic_id, array['owner','admin']))
));

drop policy if exists professionals_tenant_write on public.professionals;
create policy professionals_tenant_insert on public.professionals for insert to authenticated
  with check ((select private.is_clinic_member(professionals.clinic_id, array['owner','admin'])));
create policy professionals_tenant_update on public.professionals for update to authenticated
  using ((select private.is_clinic_member(professionals.clinic_id, array['owner','admin'])))
  with check ((select private.is_clinic_member(professionals.clinic_id, array['owner','admin'])));
create policy professionals_tenant_delete on public.professionals for delete to authenticated
  using ((select private.is_clinic_member(professionals.clinic_id, array['owner','admin'])));

drop policy if exists plan_workflows_tenant_write on public.plan_workflows;
create policy plan_workflows_tenant_insert on public.plan_workflows for insert to authenticated
  with check ((select private.is_clinic_member(plan_workflows.clinic_id, array['owner','admin','dentist','reception'])));
create policy plan_workflows_tenant_update on public.plan_workflows for update to authenticated
  using ((select private.is_clinic_member(plan_workflows.clinic_id, array['owner','admin','dentist','reception'])))
  with check ((select private.is_clinic_member(plan_workflows.clinic_id, array['owner','admin','dentist','reception'])));
create policy plan_workflows_tenant_delete on public.plan_workflows for delete to authenticated
  using ((select private.is_clinic_member(plan_workflows.clinic_id, array['owner','admin','dentist'])));

drop policy if exists plan_steps_tenant_write on public.plan_steps;
create policy plan_steps_tenant_insert on public.plan_steps for insert to authenticated
  with check ((select private.is_clinic_member(plan_steps.clinic_id, array['owner','admin','dentist','reception'])));
create policy plan_steps_tenant_update on public.plan_steps for update to authenticated
  using ((select private.is_clinic_member(plan_steps.clinic_id, array['owner','admin','dentist','reception'])))
  with check ((select private.is_clinic_member(plan_steps.clinic_id, array['owner','admin','dentist','reception'])));
create policy plan_steps_tenant_delete on public.plan_steps for delete to authenticated
  using ((select private.is_clinic_member(plan_steps.clinic_id, array['owner','admin','dentist'])));

create index if not exists appointments_task_idx on public.appointments (task_id);
create index if not exists appointments_planner_idx on public.appointments (planner_id);
create index if not exists evolutions_appointment_idx on public.evolutions (appointment_id);
create index if not exists files_appointment_idx on public.files (appointment_id);
create index if not exists files_planner_idx on public.files (planner_id);
create index if not exists files_evolution_idx on public.files (evolution_id);
create index if not exists patient_planners_patient_idx on public.patient_planners (patient_id);
create index if not exists plan_steps_workflow_idx on public.plan_steps (workflow_id);
create index if not exists plan_steps_task_idx on public.plan_steps (task_id);
create index if not exists plan_steps_depends_on_idx on public.plan_steps (depends_on);
create index if not exists plan_workflows_patient_idx on public.plan_workflows (patient_id);
