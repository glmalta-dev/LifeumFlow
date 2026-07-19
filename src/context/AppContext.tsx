"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Patient, Appointment, Task, ClinicalEvolution, PatientFile, Lead, PatientFlow, PlannerChecklistItem, MessageTemplate } from "../types";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabaseClient";

// --- Mappers para Supabase (camelCase <-> snake_case) ---

interface PatientDbRow { 
  id: string; 
  clinic_id: string; 
  name: string; 
  birth_date: string; 
  cpf?: string | null; 
  sex?: string | null;
  phone: string; 
  email: string; 
  status: Patient["status"]; 
  next_action?: string | null; 
  next_action_date?: string | null; 
  notes?: string | null;
  cep?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
}
interface AppointmentDbRow { 
  id: string; 
  clinic_id: string; 
  patient_id: string; 
  patient_name: string; 
  date: string; 
  time: string; 
  type: Appointment["type"]; 
  status: Appointment["status"]; 
  professional: string; 
  notes?: string | null; 
  duration?: number | null;
  room_or_chair?: string | null;
  preparation_interval?: number | null;
  recurrence?: string | null;
  treatment_stage?: string | null;
  reminder?: string | null;
}
interface TaskDbRow { id: string; clinic_id: string; patient_id: string; patient_name: string; title: string; description: string; due_date: string; status: Task["status"]; priority: Task["priority"]; due_time?: string | null; responsible?: string | null; task_type?: string | null; origin?: string | null; waiting_condition?: string | null; next_action?: string | null; }
interface EvolutionDbRow { id: string; clinic_id: string; patient_id: string; date: string; professional: string; procedure: string; description: string; next_step?: string | null; recommended_return_days?: number | null; appointment_id?: string | null; complication?: string | null; conduct?: string | null; guidance?: string | null; }
interface FileDbRow { id: string; clinic_id: string; patient_id: string; name: string; upload_date: string; size: string; mime_type: string; download_url: string; }
interface LeadDbRow { id: string; clinic_id: string; name: string; phone: string; source: string; status: Lead["status"]; last_contact_date?: string | null; notes?: string | null; }
interface FlowDbRow { id: string; clinic_id: string; title: string; stages?: PatientFlow["stages"] | null; }

interface TemplateDbRow {
  id: string;
  clinic_id: string;
  title: string;
  body_text: string;
  is_active: boolean;
  created_at: string;
}

const mapTemplateFromDb = (db: TemplateDbRow): MessageTemplate => ({
  id: db.id,
  clinicId: db.clinic_id,
  title: db.title,
  bodyText: db.body_text,
  isActive: db.is_active,
  createdAt: db.created_at
});

const mapPatientFromDb = (db: PatientDbRow): Patient => {
  let notes = db.notes || "";
  let legacyMeta: Partial<Patient> = {};

  const metaIndex = notes.indexOf("\n\n[META:");
  if (metaIndex !== -1) {
    try {
      const metaStr = notes.substring(metaIndex + 8, notes.length - 1);
      legacyMeta = JSON.parse(metaStr) as Partial<Patient>;
      notes = notes.substring(0, metaIndex);
    } catch (e) {
      console.warn("Falha ao ler metadados do paciente:", e);
    }
  }

  return {
    id: db.id,
    clinicId: db.clinic_id,
    name: db.name,
    birthDate: db.birth_date,
    cpf: db.cpf || undefined,
    sex: db.sex === "female" || db.sex === "male" || db.sex === "intersex" ? db.sex : "not_informed",
    phone: db.phone,
    email: db.email,
    status: db.status,
    nextAction: db.next_action || undefined,
    nextActionDate: db.next_action_date || undefined,
    notes: notes || undefined,
    
    // Mapeamento físico prioritário com fallback para legado
    address: db.street || legacyMeta.address || undefined,
    addressNumber: db.number || legacyMeta.addressNumber || undefined,
    addressComplement: db.complement || legacyMeta.addressComplement || undefined,
    neighborhood: db.neighborhood || legacyMeta.neighborhood || undefined,
    city: db.city || legacyMeta.city || undefined,
    state: db.state || legacyMeta.state || undefined,
    postalCode: db.cep || legacyMeta.postalCode || undefined
  };
};

const mapPatientToDb = (p: Partial<Patient>) => {
  return {
    ...(p.id && { id: p.id }),
    ...(p.clinicId && { clinic_id: p.clinicId }),
    ...(p.name && { name: p.name }),
    ...(p.birthDate && { birth_date: p.birthDate }),
    ...(p.cpf !== undefined && { cpf: p.cpf }),
    ...(p.sex && { sex: p.sex }),
    ...(p.phone && { phone: p.phone }),
    ...(p.email && { email: p.email }),
    ...(p.status && { status: p.status }),
    ...(p.nextAction !== undefined && { next_action: p.nextAction }),
    ...(p.nextActionDate !== undefined && { next_action_date: p.nextActionDate }),
    notes: p.notes || "",
    
    // Persistência direta em colunas físicas do Supabase
    ...(p.postalCode !== undefined && { cep: p.postalCode }),
    ...(p.address !== undefined && { street: p.address }),
    ...(p.addressNumber !== undefined && { number: p.addressNumber }),
    ...(p.addressComplement !== undefined && { complement: p.addressComplement }),
    ...(p.neighborhood !== undefined && { neighborhood: p.neighborhood }),
    ...(p.city !== undefined && { city: p.city }),
    ...(p.state !== undefined && { state: p.state })
  };
};

const mapAppointmentFromDb = (db: AppointmentDbRow): Appointment => {
  let notes = db.notes || "";
  let legacyMeta: Partial<Appointment> = {};

  const metaIndex = notes.indexOf("\n\n[META:");
  if (metaIndex !== -1) {
    try {
      const metaStr = notes.substring(metaIndex + 8, notes.length - 1);
      legacyMeta = JSON.parse(metaStr) as Partial<Appointment>;
      notes = notes.substring(0, metaIndex);
    } catch (e) {
      console.warn("Falha ao ler metadados do agendamento:", e);
    }
  }

  return {
    id: db.id,
    clinicId: db.clinic_id,
    patientId: db.patient_id,
    patientName: db.patient_name,
    date: db.date,
    time: db.time,
    type: db.type,
    status: db.status,
    professional: db.professional,
    notes: notes || undefined,
    
    // Mapeamento das novas colunas físicas com fallback para metadados legados
    duration: db.duration !== null && db.duration !== undefined ? db.duration : (legacyMeta.duration || undefined),
    roomOrChair: db.room_or_chair || legacyMeta.roomOrChair || undefined,
    preparationInterval: db.preparation_interval !== null && db.preparation_interval !== undefined ? db.preparation_interval : (legacyMeta.preparationInterval || undefined),
    recurrence: db.recurrence || legacyMeta.recurrence || undefined,
    treatmentStage: db.treatment_stage || legacyMeta.treatmentStage || undefined,
    reminder: db.reminder || legacyMeta.reminder || undefined
  };
};

const mapAppointmentToDb = (a: Partial<Appointment>) => {
  return {
    ...(a.id && { id: a.id }),
    ...(a.clinicId && { clinic_id: a.clinicId }),
    ...(a.patientId && { patient_id: a.patientId }),
    ...(a.patientName && { patient_name: a.patientName }),
    ...(a.date && { date: a.date }),
    ...(a.time && { time: a.time }),
    ...(a.type && { type: a.type }),
    ...(a.status && { status: a.status }),
    ...(a.professional && { professional: a.professional }),
    notes: a.notes || "",
    
    // Persistência nas colunas físicas
    ...(a.duration !== undefined && { duration: a.duration }),
    ...(a.roomOrChair !== undefined && { room_or_chair: a.roomOrChair }),
    ...(a.preparationInterval !== undefined && { preparation_interval: a.preparationInterval }),
    ...(a.recurrence !== undefined && { recurrence: a.recurrence }),
    ...(a.treatmentStage !== undefined && { treatment_stage: a.treatmentStage }),
    ...(a.reminder !== undefined && { reminder: a.reminder })
  };
};

const mapTaskFromDb = (db: TaskDbRow): Task => {
  let description = db.description || "";
  let metaData: Partial<Task> = {};
  
  const metaIndex = description.indexOf("\n\n[META:");
  if (metaIndex !== -1) {
    try {
      const metaStr = description.substring(metaIndex + 8, description.length - 1);
      metaData = JSON.parse(metaStr) as Partial<Task>;
      description = description.substring(0, metaIndex);
    } catch (e) {
      console.warn("Falha ao ler metadados da tarefa:", e);
    }
  }

  return {
    id: db.id,
    clinicId: db.clinic_id,
    patientId: db.patient_id,
    patientName: db.patient_name,
    title: db.title,
    description: description,
    dueDate: db.due_date,
    status: db.status,
    priority: db.priority,
    ...metaData,
    dueTime: db.due_time || metaData.dueTime,
    responsible: db.responsible || metaData.responsible,
    category: db.task_type || metaData.category,
    nextAction: db.next_action || metaData.nextAction,
    waitingCondition: db.waiting_condition || metaData.waitingCondition,
    origin: db.origin || metaData.origin
  };
};

const mapTaskToDb = (t: Partial<Task>) => {
  return {
    ...(t.id && { id: t.id }),
    ...(t.clinicId && { clinic_id: t.clinicId }),
    ...(t.patientId && { patient_id: t.patientId }),
    ...(t.patientName && { patient_name: t.patientName }),
    ...(t.title && { title: t.title }),
    description: t.description || "",
    ...(t.dueDate && { due_date: t.dueDate }),
    ...(t.status && { status: t.status }),
    ...(t.priority && { priority: t.priority }),
    ...(t.dueTime !== undefined && { due_time: t.dueTime || null }),
    ...(t.responsible !== undefined && { responsible: t.responsible || null }),
    ...(t.category !== undefined && { task_type: t.category || "contact" }),
    ...(t.origin !== undefined && { origin: t.origin || null }),
    ...(t.waitingCondition !== undefined && { waiting_condition: t.waitingCondition || null }),
    ...(t.nextAction !== undefined && { next_action: t.nextAction || null }),
  };
};

const mapEvolutionFromDb = (db: EvolutionDbRow): ClinicalEvolution => ({
  id: db.id,
  clinicId: db.clinic_id,
  patientId: db.patient_id,
  date: db.date,
  professional: db.professional,
  procedure: db.procedure,
  description: db.description,
  nextStep: db.next_step || undefined,
  recommendedReturnDays: db.recommended_return_days || undefined,
  appointmentId: db.appointment_id || undefined,
  complication: db.complication || undefined,
  conduct: db.conduct || undefined,
  guidance: db.guidance || undefined,
});

const mapEvolutionToDb = (e: Partial<ClinicalEvolution>) => ({
  ...(e.id && { id: e.id }),
  ...(e.clinicId && { clinic_id: e.clinicId }),
  ...(e.patientId && { patient_id: e.patientId }),
  ...(e.date && { date: e.date }),
  ...(e.professional && { professional: e.professional }),
  ...(e.procedure && { procedure: e.procedure }),
  ...(e.description && { description: e.description }),
  ...(e.nextStep !== undefined && { next_step: e.nextStep }),
  ...(e.recommendedReturnDays !== undefined && { recommended_return_days: e.recommendedReturnDays }),
  ...(e.appointmentId !== undefined && { appointment_id: e.appointmentId }),
  ...(e.complication !== undefined && { complication: e.complication }),
  ...(e.conduct !== undefined && { conduct: e.conduct }),
  ...(e.guidance !== undefined && { guidance: e.guidance }),
});

const mapFileFromDb = (db: FileDbRow): PatientFile => ({
  id: db.id,
  clinicId: db.clinic_id,
  patientId: db.patient_id,
  name: db.name,
  uploadDate: db.upload_date,
  size: db.size,
  mimeType: db.mime_type,
  downloadUrl: db.download_url,
});

const mapFileToDb = (f: Partial<PatientFile>) => ({
  ...(f.id && { id: f.id }),
  ...(f.clinicId && { clinic_id: f.clinicId }),
  ...(f.patientId && { patient_id: f.patientId }),
  ...(f.name && { name: f.name }),
  ...(f.uploadDate && { upload_date: f.uploadDate }),
  ...(f.size && { size: f.size }),
  ...(f.mimeType && { mime_type: f.mimeType }),
  ...(f.downloadUrl && { download_url: f.downloadUrl }),
});

const mapLeadFromDb = (db: LeadDbRow): Lead => ({
  id: db.id,
  clinicId: db.clinic_id,
  name: db.name,
  phone: db.phone,
  source: db.source,
  status: db.status,
  lastContactDate: db.last_contact_date || undefined,
  notes: db.notes || undefined,
});

const mapFlowFromDb = (db: FlowDbRow): PatientFlow => ({
  id: db.id,
  clinicId: db.clinic_id,
  title: db.title,
  stages: db.stages || [],
});

// --- Context Definition ---

interface AppContextType {
  patients: Patient[];
  appointments: Appointment[];
  tasks: Task[];
  evolutions: ClinicalEvolution[];
  files: PatientFile[];
  leads: Lead[];
  flows: PatientFlow[];
  templates: MessageTemplate[];
  toast: { message: string; type: "success" | "error" | null } | null;
  showToast: (message: string, type: "success" | "error") => void;
  hideToast: () => void;
  activeClinicId: string | null;
  currentUser: User | null;
  
  // Actions
  addPatient: (patient: Omit<Patient, "id">) => Promise<string>;
  updatePatient: (id: string, patient: Partial<Patient>) => Promise<void>;
  addAppointment: (appointment: Omit<Appointment, "id">) => Promise<string | null>;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => Promise<string | null>;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  completeTask: (id: string) => Promise<void>;
  addEvolution: (evolution: Omit<ClinicalEvolution, "id">) => Promise<void>;
  addFile: (file: Omit<PatientFile, "id">) => Promise<void>;
  moveLead: (leadId: string, targetStage: Lead["status"]) => Promise<void>;
  getPatientPlanner: (patientId: string, areaId: string) => Promise<PlannerChecklistItem[]>;
  savePatientPlanner: (patientId: string, areaId: string, checklist: PlannerChecklistItem[]) => Promise<void>;
  addTemplate: (template: Omit<MessageTemplate, "id" | "clinicId" | "createdAt">) => Promise<void>;
  updateTemplate: (id: string, template: Partial<MessageTemplate>) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  quickCaptureOpen: boolean;
  setQuickCaptureOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [evolutions, setEvolutions] = useState<ClinicalEvolution[]>([]);
  const [files, setFiles] = useState<PatientFile[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [flows, setFlows] = useState<PatientFlow[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | null } | null>(null);
  const [quickCaptureOpen, setQuickCaptureOpen] = useState(false);
  const [activeClinicId, setActiveClinicId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const loadSupabaseData = async (clinicId: string) => {
    try {
      const [
        { data: dbPatients, error: ep },
        { data: dbAppointments, error: ea },
        { data: dbTasks, error: et },
        { data: dbEvolutions, error: ee },
        { data: dbFiles, error: ef },
        { data: dbLeads, error: el },
        { data: dbFlows, error: efl },
        { data: dbTemplates, error: etem }
      ] = await Promise.all([
        supabase!.from("patients").select("*").eq("clinic_id", clinicId),
        supabase!.from("appointments").select("*").eq("clinic_id", clinicId),
        supabase!.from("tasks").select("*").eq("clinic_id", clinicId),
        supabase!.from("evolutions").select("*").eq("clinic_id", clinicId),
        supabase!.from("files").select("*").eq("clinic_id", clinicId),
        supabase!.from("leads").select("*").eq("clinic_id", clinicId),
        supabase!.from("flows").select("*").eq("clinic_id", clinicId),
        supabase!.from("message_templates").select("*").eq("clinic_id", clinicId)
      ]);

      const errors = [ep, ea, et, ee, ef, el, efl, etem].filter(Boolean);
      if (errors.length > 0) throw errors[0];
      setPatients((dbPatients ?? []).map(mapPatientFromDb));
      setAppointments((dbAppointments ?? []).map(mapAppointmentFromDb));
      setTasks((dbTasks ?? []).map(mapTaskFromDb));
      setEvolutions((dbEvolutions ?? []).map(mapEvolutionFromDb));
      setFiles((dbFiles ?? []).map(mapFileFromDb));
      setLeads((dbLeads ?? []).map(mapLeadFromDb));
      setFlows((dbFlows ?? []).map(mapFlowFromDb));
      setTemplates((dbTemplates ?? []).map(mapTemplateFromDb));
    } catch (err) {
      console.error("Erro ao carregar dados do Supabase:", err);
    }
  };

  // Load data on mount: Supabase prioritário se logado, LocalStorage como fallback
  useEffect(() => {
    const client = supabase;
    if (!client) return;

    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setCurrentUser(session.user);
        try {
          const { data: memberships, error } = await client
            .from("clinic_members")
            .select("clinic_id")
            .eq("user_id", session.user.id)
            .eq("active", true)
            .limit(1);

          if (memberships && memberships.length > 0 && !error) {
            const clinicId = memberships[0].clinic_id;
            setActiveClinicId(clinicId);
            await loadSupabaseData(clinicId);
          } else {
            setActiveClinicId(null);
            setPatients([]);
          }
        } catch (err) {
          console.error("Erro ao resolver clinica ativa:", err);
        }
      } else {
        setCurrentUser(null);
        setActiveClinicId(null);
        setPatients([]);
        setAppointments([]);
        setTasks([]);
        setEvolutions([]);
        setFiles([]);
        setLeads([]);
        setFlows([]);
        setTemplates([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sincronizar localmente no LocalStorage para redundância
  // Toast Helpers
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const hideToast = () => {
    setToast(null);
  };

  const requireDataContext = () => {
    if (!supabase || !activeClinicId) {
      const error = new Error("Supabase indisponivel ou usuario sem clinica ativa.");
      showToast(error.message, "error");
      throw error;
    }
    return { client: supabase, clinicId: activeClinicId };
  };

  // --- Funções Auxiliares de Validação de Conflito ---
  const timeToMinutes = (t: string): number => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const minutesToTime = (min: number): string => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const checkConflict = (
    newApp: Omit<Appointment, "id"> & { id?: string }
  ): string | null => {
    if (!newApp.date || !newApp.time) return null;
    
    const startNew = timeToMinutes(newApp.time);
    const durationNew = Number(newApp.duration) || 30;
    const prepNew = Number(newApp.preparationInterval) || 0;
    const endNew = startNew + durationNew + prepNew;

    const dayApps = appointments.filter(a => 
      a.date === newApp.date && 
      a.id !== newApp.id && 
      (a.status === "agendado" || a.status === "confirmado")
    );

    for (const app of dayApps) {
      const startApp = timeToMinutes(app.time);
      const durationApp = Number(app.duration) || 30;
      const prepApp = Number(app.preparationInterval) || 0;
      const endApp = startApp + durationApp + prepApp;

      const hasOverlap = startNew < endApp && startApp < endNew;

      if (hasOverlap) {
        if (app.professional === newApp.professional) {
          return `Choque de agenda para o profissional ${app.professional}. O horário já está ocupado pelo atendimento de "${app.patientName}" de ${app.time} às ${minutesToTime(startApp + durationApp)}.`;
        }
        if (app.roomOrChair && newApp.roomOrChair && app.roomOrChair === newApp.roomOrChair) {
          return `Choque de uso da cadeira/sala "${app.roomOrChair}". O espaço já está ocupado pelo atendimento de "${app.patientName}" de ${app.time} às ${minutesToTime(startApp + durationApp)}.`;
        }
      }
    }

    return null;
  };

  // --- Funções de Escrita com clinicId ---

  const addPatient = async (patientInput: Omit<Patient, "id">): Promise<string> => {
    const { client, clinicId } = requireDataContext();
    const newId = `pat-${Date.now()}`;
    const newPatient: Patient = { ...patientInput, id: newId, clinicId };
    
      const { error } = await client.from("patients").insert(mapPatientToDb(newPatient));
      if (error) {
        console.error("Supabase insert patient error:", error);
        showToast(`Erro ao salvar paciente: ${error.message}`, "error");
        throw error;
      }

    setPatients((prev) => [newPatient, ...prev]);
    showToast(`Paciente "${patientInput.name}" cadastrado!`, "success");
    return newId;
  };

  const updatePatient = async (id: string, patientInput: Partial<Patient>): Promise<void> => {
    const { client } = requireDataContext();
      const { error } = await client.from("patients").update(mapPatientToDb(patientInput)).eq("id", id);
      if (error) {
        console.error("Supabase update patient error:", error);
        showToast(`Erro ao atualizar paciente: ${error.message}`, "error");
        throw error;
      }

    setPatients((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patientInput } : p))
    );
    showToast("Dados cadastrais do paciente atualizados!", "success");
  };

  const addAppointment = async (appInput: Omit<Appointment, "id">): Promise<string | null> => {
    const { client, clinicId } = requireDataContext();
    const conflictError = checkConflict(appInput);
    if (conflictError) {
      showToast(conflictError, "error");
      return conflictError;
    }

    const newApp: Appointment = {
      ...appInput,
      id: `app-${Date.now()}`,
      clinicId
    };
    
      const { error } = await client.from("appointments").insert(mapAppointmentToDb(newApp));
      if (error) {
        console.error("Supabase insert appointment error:", error);
        showToast(`Erro ao agendar: ${error.message}`, "error");
        return `Erro de banco de dados: ${error.message}`;
      }

    setAppointments((prev) => [newApp, ...prev]);
    showToast("Agendamento clínico criado!", "success");
    return null;
  };

  const updateAppointment = async (id: string, appInput: Partial<Appointment>): Promise<string | null> => {
    const { client } = requireDataContext();
    const currentApp = appointments.find(a => a.id === id);
    if (!currentApp) return "Agendamento não encontrado.";

    const mergedApp = { ...currentApp, ...appInput };

    const conflictError = checkConflict(mergedApp);
    if (conflictError) {
      showToast(conflictError, "error");
      return conflictError;
    }

      const { error } = await client.from("appointments").update(mapAppointmentToDb(appInput)).eq("id", id);
      if (error) {
        console.error("Supabase update appointment error:", error);
        showToast(`Erro ao atualizar agendamento: ${error.message}`, "error");
        return `Erro de banco de dados: ${error.message}`;
      }

    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...appInput } : a))
    );
    showToast("Agendamento clínico atualizado!", "success");
    return null;
  };

  const addTask = async (taskInput: Omit<Task, "id">): Promise<void> => {
    const { client, clinicId } = requireDataContext();
    const newTask: Task = {
      ...taskInput,
      id: `task-${Date.now()}`,
      clinicId
    };
    
      const { error } = await client.from("tasks").insert(mapTaskToDb(newTask));
      if (error) {
        console.error("Supabase insert task error:", error);
        showToast(`Erro ao registrar pendência: ${error.message}`, "error");
        throw error;
      }

    setTasks((prev) => [newTask, ...prev]);
    showToast("Nova pendência registrada!", "success");
  };

  const completeTask = async (id: string): Promise<void> => {
    const { client } = requireDataContext();
      const { error } = await client.from("tasks").update({ status: "completed", completed_at: new Date().toISOString() }).eq("id", id);
      if (error) {
        console.error("Supabase update task error:", error);
        showToast(`Erro ao concluir pendência: ${error.message}`, "error");
        throw error;
      }

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "completed" as const } : t))
    );
    showToast("Pendência concluída!", "success");
  };

  const updateTask = async (id: string, taskInput: Partial<Task>): Promise<void> => {
    const { client } = requireDataContext();
    const { error } = await client.from("tasks").update(mapTaskToDb(taskInput)).eq("id", id);
    if (error) {
      showToast(`Erro ao atualizar pendencia: ${error.message}`, "error");
      throw error;
    }
    setTasks((current) => current.map((task) => task.id === id ? { ...task, ...taskInput } : task));
    showToast("Pendencia atualizada.", "success");
  };

  const addEvolution = async (evoInput: Omit<ClinicalEvolution, "id">): Promise<void> => {
    const { client, clinicId } = requireDataContext();
    const newEvo: ClinicalEvolution = {
      ...evoInput,
      id: `evo-${Date.now()}`,
      clinicId
    };
    
      const { error } = await client.from("evolutions").insert(mapEvolutionToDb(newEvo));
      if (error) {
        console.error("Supabase insert evolution error:", error);
        showToast(`Erro ao salvar evolução: ${error.message}`, "error");
        throw error;
      }

    setEvolutions((prev) => [newEvo, ...prev]);
    showToast("Nova evolução clínica salva!", "success");
  };

  const addFile = async (fileInput: Omit<PatientFile, "id">): Promise<void> => {
    const { client, clinicId } = requireDataContext();
    const newFile: PatientFile = {
      ...fileInput,
      id: `file-${Date.now()}`,
      clinicId
    };
    
      const { error } = await client.from("files").insert(mapFileToDb(newFile));
      if (error) {
        console.error("Supabase insert file error:", error);
        showToast(`Erro ao salvar arquivo: ${error.message}`, "error");
        throw error;
      }

    setFiles((prev) => [newFile, ...prev]);
    showToast("Arquivo/Exame anexado!", "success");
  };

  const moveLead = async (leadId: string, targetStage: Lead["status"]): Promise<void> => {
    const { client } = requireDataContext();
      const { error } = await client.from("leads").update({ status: targetStage }).eq("id", leadId);
      if (error) {
        console.error("Supabase update lead error:", error);
        showToast(`Erro ao mover lead: ${error.message}`, "error");
        throw error;
      }

    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: targetStage } : l))
    );
    showToast("Lead movido de etapa!", "success");
  };

  const getPatientPlanner = async (patientId: string, areaId: string): Promise<PlannerChecklistItem[]> => {
    if (!supabase || !activeClinicId) return [];
    
    try {
      const { data, error } = await supabase
        .from("patient_planners")
        .select("*")
        .eq("clinic_id", activeClinicId)
        .eq("patient_id", patientId)
        .eq("area_id", areaId)
        .maybeSingle();
        
      if (error) {
        console.error("Erro ao buscar planejamento:", error);
        return [];
      }
      
      if (data) {
        return Array.isArray(data.checklist) ? data.checklist : [];
      }
    } catch (err) {
      console.error("Falha na chamada getPatientPlanner:", err);
    }
    return [];
  };

  const savePatientPlanner = async (patientId: string, areaId: string, checklist: PlannerChecklistItem[]): Promise<void> => {
    if (!supabase || !activeClinicId) {
      showToast("Supabase ou clínica não ativa.", "error");
      throw new Error("Conexão indisponível");
    }
    
    try {
      const { error } = await supabase
        .from("patient_planners")
        .upsert({
          clinic_id: activeClinicId,
          patient_id: patientId,
          area_id: areaId,
          checklist: checklist,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "clinic_id,patient_id,area_id"
        });
        
      if (error) {
        console.error("Erro ao salvar planejamento:", error);
        showToast(`Erro ao salvar planejamento: ${error.message}`, "error");
        throw error;
      }
      
      showToast("Planejamento atualizado com sucesso!", "success");
    } catch (err: unknown) {
      console.error("Erro na chamada savePatientPlanner:", err);
      throw err;
    }
  };

  const addTemplate = async (templateInput: Omit<MessageTemplate, "id" | "clinicId" | "createdAt">): Promise<void> => {
    if (!supabase || !activeClinicId) {
      showToast("Supabase ou clínica não ativa.", "error");
      throw new Error("Conexão indisponível");
    }
    
    try {
      const { data, error } = await supabase
        .from("message_templates")
        .insert({
          clinic_id: activeClinicId,
          title: templateInput.title,
          body_text: templateInput.bodyText,
          is_active: templateInput.isActive
        })
        .select()
        .single();
        
      if (error) {
        console.error("Erro ao adicionar modelo:", error);
        showToast(`Erro ao criar modelo: ${error.message}`, "error");
        throw error;
      }
      
      if (data) {
        setTemplates(prev => [mapTemplateFromDb(data), ...prev]);
        showToast("Modelo de mensagem criado!", "success");
      }
    } catch (err: unknown) {
      console.error("Erro no addTemplate:", err);
      throw err;
    }
  };

  const updateTemplate = async (id: string, templateInput: Partial<MessageTemplate>): Promise<void> => {
    if (!supabase) {
      showToast("Supabase indisponível.", "error");
      throw new Error("Conexão indisponível");
    }
    
    try {
      const { error } = await supabase
        .from("message_templates")
        .update({
          ...(templateInput.title && { title: templateInput.title }),
          ...(templateInput.bodyText && { body_text: templateInput.bodyText }),
          ...(templateInput.isActive !== undefined && { is_active: templateInput.isActive })
        })
        .eq("id", id);
        
      if (error) {
        console.error("Erro ao atualizar modelo:", error);
        showToast(`Erro ao atualizar modelo: ${error.message}`, "error");
        throw error;
      }
      
      setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...templateInput } : t));
      showToast("Modelo atualizado!", "success");
    } catch (err: unknown) {
      console.error("Erro no updateTemplate:", err);
      throw err;
    }
  };

  const deleteTemplate = async (id: string): Promise<void> => {
    if (!supabase) {
      showToast("Supabase indisponível.", "error");
      throw new Error("Conexão indisponível");
    }
    
    try {
      const { error } = await supabase
        .from("message_templates")
        .delete()
        .eq("id", id);
        
      if (error) {
        console.error("Erro ao excluir modelo:", error);
        showToast(`Erro ao excluir modelo: ${error.message}`, "error");
        throw error;
      }
      
      setTemplates(prev => prev.filter(t => t.id !== id));
      showToast("Modelo removido!", "success");
    } catch (err: unknown) {
      console.error("Erro no deleteTemplate:", err);
      throw err;
    }
  };

  return (
    <AppContext.Provider
      value={{
        patients,
        appointments,
        tasks,
        evolutions,
        files,
        leads,
        flows,
        templates,
        toast,
        showToast,
        hideToast,
        activeClinicId,
        currentUser,
        addPatient,
        updatePatient,
        addAppointment,
        updateAppointment,
        addTask,
        updateTask,
        completeTask,
        addEvolution,
        addFile,
        moveLead,
        getPatientPlanner,
        savePatientPlanner,
        addTemplate,
        updateTemplate,
        deleteTemplate,
        quickCaptureOpen,
        setQuickCaptureOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
