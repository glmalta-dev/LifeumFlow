"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Patient, Appointment, MessageTemplate } from "@/types";
import { buildWhatsAppUrl, normalizeBrazilianPhone } from "@/lib/phone";

interface QuickPanelProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  taskId?: string; // Pendência selecionada, se houver
  appointmentId?: string; // Agendamento selecionado, se houver
}

export const QuickPanel: React.FC<QuickPanelProps> = ({
  isOpen,
  onClose,
  patientId,
  taskId,
  appointmentId
}) => {
  const router = useRouter();
  const {
    patients,
    tasks,
    appointments,
    templates,
    completeTask,
    updatePatient,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<"details" | "whatsapp">("details");
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [isResolving, setIsResolving] = useState(false);
  const [resolveOption, setResolveOption] = useState<"next_action" | "schedule" | "archive" | null>(null);

  const patient = patients.find((p) => p.id === patientId);
  const task = tasks.find((t) => t.id === taskId);
  const appointment = appointments.find((a) => a.id === appointmentId) || 
    appointments.find((a) => a.patientId === patientId && a.status === "agendado");

  const handleCall = () => {
    const normalized = normalizeBrazilianPhone(patient?.phone);
    if (!normalized.valid) {
      showToast(normalized.reason, "error");
      return;
    }
    window.open(`tel:${normalized.national}`, "_self");
  };

  const replaceVariables = (text: string, p: Patient, app?: Appointment) => {
    let result = text;
    result = result.replace(/{nome_completo}/g, p.name);
    result = result.replace(/{primeiro_nome}/g, p.name.split(" ")[0]);
    result = result.replace(/{clinica}/g, "sua clinica");
    result = result.replace(/{localizacao}/g, "[Localizacao da clinica]");
    
    if (app) {
      const formattedDate = app.date.split("-").reverse().join("/");
      result = result.replace(/{data}/g, formattedDate);
      result = result.replace(/{horario}/g, app.time);
      result = result.replace(/{profissional}/g, app.professional);
    } else {
      result = result.replace(/{data}/g, "[Data]");
      result = result.replace(/{horario}/g, "[Horário]");
      result = result.replace(/{profissional}/g, "[Profissional]");
    }
    return result;
  };

  const selectTemplate = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setCustomMessage(patient ? replaceVariables(template.bodyText, patient, appointment) : "");
  };

  const handleOpenWhatsApp = () => {
    if (!patient) return;
    const textToUse = customMessage || `Ola ${patient.name}, tudo bem?`;
    const url = buildWhatsAppUrl(patient.phone, textToUse);
    if (!url) {
      const validation = normalizeBrazilianPhone(patient.phone);
      showToast(validation.valid ? "Telefone invalido." : validation.reason, "error");
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
    setActiveTab("details");
    setSelectedTemplate(null);
  };

  const handleResolveTask = async () => {
    if (!task) return;
    setIsResolving(true);
  };

  const handleConfirmResolution = async () => {
    if (!task) return;
    
    try {
      await completeTask(task.id);
      setIsResolving(false);
      onClose();

      if (resolveOption === "schedule") {
        router.push(`/pacientes/${patientId}/agendamentos/editar`);
      } else if (resolveOption === "next_action") {
        router.push(`/hoje/pendencias`);
      } else if (resolveOption === "archive") {
        await updatePatient(patientId, { status: "inactive" });
        showToast("Caso marcado como Concluído / Inativo.", "success");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen || !patient) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={styles.dragHandle} />
        
        {activeTab === "details" && !isResolving && (
          <>
            {/* Cabeçalho */}
            <div style={styles.header}>
              <h3 style={styles.name}>{patient.name}</h3>
              <span style={styles.subtitle}>
                Status do Prontuário: <strong style={{ color: patient.status === "alert" ? "var(--error)" : "var(--success)" }}>
                  {patient.status === "alert" ? "Atenção" : patient.status === "active" ? "Ativo" : "Inativo"}
                </strong>
              </span>
            </div>

            {/* Pendência Principal */}
            {task && (
              <div style={styles.taskCard}>
                <span style={styles.taskTag}>AÇÃO REQUERIDA</span>
                <h4 style={styles.taskTitle}>{task.title}</h4>
                <p style={styles.taskDesc}>{task.description}</p>
                <div style={styles.taskMeta}>
                  <span>Prazo: {task.dueDate.split("-").reverse().join("/")}</span>
                  <span style={{ color: task.priority === "high" ? "var(--error)" : "var(--warning)" }}>
                    Prioridade {task.priority === "high" ? "Alta" : "Média"}
                  </span>
                </div>
              </div>
            )}

            {/* Ações de Comunicação Principais */}
            <div style={styles.buttonGrid}>
              <button onClick={() => setActiveTab("whatsapp")} style={styles.actionBtnGreen}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                WhatsApp
              </button>
              
              <button onClick={handleCall} style={styles.actionBtnBlue}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Ligar
              </button>

              {task && (
                <button onClick={handleResolveTask} style={styles.actionBtnGray}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Resolver
                </button>
              )}
            </div>

            {/* Outras Ações */}
            <div style={styles.secondaryActions}>
              <h5 style={styles.subTitleLabel}>Outras Opções</h5>
              
              <button onClick={() => { onClose(); router.push(`/pacientes/${patientId}/resumo`); }} style={styles.secondaryLink}>
                Abrir Ficha Completa
              </button>
              
              <button onClick={() => { onClose(); router.push(`/pacientes/${patientId}/dados-cadastrais`); }} style={styles.secondaryLink}>
                Editar Cadastro
              </button>

              {appointment ? (
                <button onClick={() => { onClose(); router.push(`/pacientes/${patientId}/agendamentos/editar`); }} style={styles.secondaryLink}>
                  Reagendar Consulta
                </button>
              ) : (
                <button onClick={() => { onClose(); router.push(`/pacientes/${patientId}/agendamentos/editar`); }} style={styles.secondaryLink}>
                  Agendar Próxima Consulta
                </button>
              )}
            </div>
          </>
        )}

        {/* Sub-tela: Seleção de Modelos de Mensagem do WhatsApp */}
        {activeTab === "whatsapp" && (
          <div style={styles.tabContent}>
            <div style={styles.tabHeader}>
              <button onClick={() => { setActiveTab("details"); setSelectedTemplate(null); }} style={styles.backBtn}>
                ← Voltar
              </button>
              <h4 style={styles.tabTitle}>Modelos de Mensagem</h4>
            </div>

            {!selectedTemplate ? (
              <div style={styles.templateList} className="hide-scrollbar">
                {templates.filter(t => t.isActive).map(t => (
                  <div key={t.id} onClick={() => selectTemplate(t)} style={styles.templateCard}>
                    <h5 style={styles.templateTitle}>{t.title}</h5>
                    <p style={styles.templateText}>{t.bodyText.substring(0, 70)}...</p>
                  </div>
                ))}
                
                {/* Mensagem Livre */}
                <div onClick={() => selectTemplate({ id: "free", title: "Mensagem Livre", bodyText: "", isActive: true, clinicId: "", createdAt: "" })} style={styles.templateCard}>
                  <h5 style={styles.templateTitle}>Mensagem Livre (Em branco)</h5>
                  <p style={styles.templateText}>Escreva o texto personalizado da mensagem manualmente...</p>
                </div>
              </div>
            ) : (
              <div style={styles.editorWrap}>
                <span style={styles.editorLabel}>EDITAR MENSAGEM ANTES DE ENVIAR</span>
                <textarea
                  rows={6}
                  className="form-control"
                  style={styles.textarea}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Escreva a mensagem personalizada..."
                />
                
                <div style={styles.editorBtnRow}>
                  <button onClick={handleOpenWhatsApp} className="btn btn-primary" style={{ flex: 1 }}>
                    Abrir no WhatsApp
                  </button>
                  <button onClick={() => setSelectedTemplate(null)} className="btn btn-secondary" style={{ flex: 1 }}>
                    Outro modelo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sub-tela: Resolver Pendência & Próxima Ação */}
        {isResolving && (
          <div style={styles.tabContent}>
            <div style={styles.tabHeader}>
              <button onClick={() => setIsResolving(false)} style={styles.backBtn}>
                ← Cancelar
              </button>
              <h4 style={styles.tabTitle}>Resolver Pendência</h4>
            </div>
            
            <p style={styles.resolveQuestion}>Toda pendência clínica precisa de um desfecho. O que deseja fazer a seguir com o caso de {patient.name}?</p>
            
            <div style={styles.resolveOptionsList}>
              <label style={resolveOption === "next_action" ? styles.resolveOptionActive : styles.resolveOption}>
                <input 
                  type="radio" 
                  name="resolve_opt" 
                  checked={resolveOption === "next_action"} 
                  onChange={() => setResolveOption("next_action")} 
                  style={{ marginRight: "10px" }}
                />
                Criar outra pendência de acompanhamento
              </label>

              <label style={resolveOption === "schedule" ? styles.resolveOptionActive : styles.resolveOption}>
                <input 
                  type="radio" 
                  name="resolve_opt" 
                  checked={resolveOption === "schedule"} 
                  onChange={() => setResolveOption("schedule")} 
                  style={{ marginRight: "10px" }}
                />
                Agendar uma próxima consulta / retorno
              </label>

              <label style={resolveOption === "archive" ? styles.resolveOptionActive : styles.resolveOption}>
                <input 
                  type="radio" 
                  name="resolve_opt" 
                  checked={resolveOption === "archive"} 
                  onChange={() => setResolveOption("archive")} 
                  style={{ marginRight: "10px" }}
                />
                Marcar caso como Concluído (Inativar prontuário)
              </label>
            </div>

            <button 
              onClick={handleConfirmResolution} 
              className="btn btn-primary" 
              style={{ width: "100%", marginTop: "20px", padding: "12px" }}
              disabled={!resolveOption}
            >
              Confirmar Desfecho
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(16, 32, 68, 0.4)",
    zIndex: 1000,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "flex-end"
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: "30px",
    borderTopRightRadius: "30px",
    padding: "20px 16px 32px 16px",
    maxHeight: "85%",
    display: "flex",
    flexDirection: "column" as const,
    boxShadow: "0 -8px 32px rgba(16, 32, 68, 0.15)",
    overflowY: "auto" as const
  },
  dragHandle: {
    width: "40px",
    height: "5px",
    borderRadius: "3px",
    backgroundColor: "rgba(16, 32, 68, 0.1)",
    alignSelf: "center",
    marginBottom: "16px"
  },
  header: {
    marginBottom: "16px"
  },
  name: {
    fontSize: "18px",
    fontWeight: 700,
    color: "var(--text-primary)"
  },
  subtitle: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    marginTop: "4px",
    display: "block"
  },
  taskCard: {
    backgroundColor: "rgba(16, 32, 68, 0.02)",
    border: "1px solid var(--border-light)",
    borderRadius: "14px",
    padding: "12px 14px",
    marginBottom: "20px"
  },
  taskTag: {
    fontSize: "9px",
    fontWeight: 700,
    color: "var(--primary)",
    letterSpacing: "0.5px"
  },
  taskTitle: {
    fontSize: "14px",
    fontWeight: 700,
    marginTop: "4px",
    color: "var(--text-primary)"
  },
  taskDesc: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    marginTop: "4px",
    lineHeight: "1.4"
  },
  taskMeta: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "11px",
    fontWeight: 600,
    marginTop: "8px",
    color: "var(--text-secondary)"
  },
  buttonGrid: {
    display: "flex",
    gap: "10px",
    marginBottom: "24px"
  },
  actionBtnGreen: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "6px",
    padding: "12px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "var(--success-bg)",
    color: "var(--success)",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer"
  },
  actionBtnBlue: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "6px",
    padding: "12px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "rgba(20, 99, 230, 0.06)",
    color: "var(--primary)",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer"
  },
  actionBtnGray: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "6px",
    padding: "12px",
    borderRadius: "14px",
    border: "none",
    backgroundColor: "rgba(115, 119, 134, 0.08)",
    color: "var(--text-primary)",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer"
  },
  secondaryActions: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    borderTop: "1px solid var(--border-light)",
    paddingTop: "16px"
  },
  subTitleLabel: {
    fontSize: "11px",
    fontWeight: 700,
    color: "var(--text-secondary)",
    textTransform: "uppercase" as const,
    marginBottom: "4px"
  },
  secondaryLink: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid var(--border-light)",
    backgroundColor: "#ffffff",
    color: "var(--text-primary)",
    fontSize: "13px",
    fontWeight: 600,
    textAlign: "left" as const,
    cursor: "pointer"
  },
  tabContent: {
    display: "flex",
    flexDirection: "column" as const
  },
  tabHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px"
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "var(--primary)",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer"
  },
  tabTitle: {
    fontSize: "15px",
    fontWeight: 700,
    color: "var(--text-primary)"
  },
  templateList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    maxHeight: "350px",
    overflowY: "auto" as const
  },
  templateCard: {
    border: "1px solid var(--border-light)",
    borderRadius: "12px",
    padding: "12px",
    backgroundColor: "rgba(16, 32, 68, 0.01)",
    cursor: "pointer",
    transition: "background 0.2s"
  },
  templateTitle: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)"
  },
  templateText: {
    fontSize: "11px",
    color: "var(--text-secondary)",
    marginTop: "4px",
    lineHeight: "1.4"
  },
  editorWrap: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px"
  },
  editorLabel: {
    fontSize: "10px",
    fontWeight: 700,
    color: "var(--text-secondary)"
  },
  textarea: {
    width: "100%",
    borderRadius: "12px",
    padding: "12px",
    fontSize: "13px",
    lineHeight: "1.4",
    border: "1px solid var(--border-light)",
    fontFamily: "inherit"
  },
  editorBtnRow: {
    display: "flex",
    gap: "8px",
    marginTop: "12px"
  },
  resolveQuestion: {
    fontSize: "13px",
    lineHeight: "1.5",
    color: "var(--text-secondary)",
    marginBottom: "16px"
  },
  resolveOptionsList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px"
  },
  resolveOption: {
    display: "flex",
    alignItems: "center",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid var(--border-light)",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-primary)",
    cursor: "pointer"
  },
  resolveOptionActive: {
    display: "flex",
    alignItems: "center",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "2px solid var(--primary)",
    backgroundColor: "rgba(20, 99, 230, 0.02)",
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--primary)",
    cursor: "pointer"
  }
};
