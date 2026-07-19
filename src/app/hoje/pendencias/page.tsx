"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { BackHeader } from "@/components/layout/BackHeader";
import { QuickPanel } from "@/components/ui/QuickPanel";

export default function PendenciasPage() {
  const { tasks, addTask, updateTask, patients } = useApp();
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState<"high" | "medium" | "low">("medium");
  
  // Novos campos requeridos na auditoria
  const [taskPatientId, setTaskPatientId] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskDueTime, setTaskDueTime] = useState("");
  const [taskResponsible, setTaskResponsible] = useState("");
  const [taskCategory, setTaskCategory] = useState("Geral");
  const [taskRecurrence, setTaskRecurrence] = useState("Nenhuma");
  const [taskContactChannel, setTaskContactChannel] = useState("WhatsApp");
  const [taskTreatmentStage, setTaskTreatmentStage] = useState("");

  const filteredTasks = tasks.filter((task) => activeTab === "completed"
    ? task.status === "completed" || task.status === "cancelled"
    : task.status !== "completed" && task.status !== "cancelled");

  const handleAddNewTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    // Buscar o nome do paciente correspondente
    const selectedPatient = patients.find(p => p.id === taskPatientId);
    const patientName = selectedPatient ? selectedPatient.name : "Paciente Sem Vínculo";
    
    addTask({
      patientId: taskPatientId || "pat-avulso",
      patientName: patientName,
      title: taskTitle,
      description: taskDesc,
      dueDate: taskDueDate || new Date().toISOString().split('T')[0],
      status: "pending",
      priority: taskPriority,
      dueTime: taskDueTime || undefined,
      responsible: taskResponsible || undefined,
      contactChannel: taskContactChannel || undefined,
      category: taskCategory || undefined,
      recurrence: taskRecurrence || undefined,
      treatmentStage: taskTreatmentStage || undefined
    });

    // Reset de estado
    setTaskTitle("");
    setTaskDesc("");
    setTaskPriority("medium");
    setTaskPatientId("");
    setTaskDueDate("");
    setTaskDueTime("");
    setTaskResponsible("");
    setTaskCategory("Geral");
    setTaskRecurrence("Nenhuma");
    setTaskContactChannel("WhatsApp");
    setTaskTreatmentStage("");
    setIsModalOpen(false);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <>
      <BackHeader title="Pendências" backUrl="/hoje" />

      {isModalOpen && (
        <div style={modalStyles.overlay} onClick={() => setIsModalOpen(false)}>
          <div style={modalStyles.modal} onClick={e => e.stopPropagation()}>
            <h4 style={{ marginBottom: "12px", fontSize: "15px", fontWeight: 700, borderBottom: "1px solid var(--border-light)", paddingBottom: "6px" }}>Nova Pendência Clínica</h4>
            <form onSubmit={handleAddNewTask} style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "70vh", overflowY: "auto", paddingRight: "4px" }} className="hide-scrollbar">
              
              <div className="form-group">
                <label htmlFor="task-title" className="form-label">TÍTULO DA AÇÃO *</label>
                <input
                  id="task-title"
                  type="text"
                  className="form-control"
                  placeholder="Ex: Ligar para confirmar..."
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-patient" className="form-label">PACIENTE VINCULADO *</label>
                <select
                  id="task-patient"
                  className="form-control"
                  value={taskPatientId}
                  onChange={e => setTaskPatientId(e.target.value)}
                  required
                >
                  <option value="">-- Selecione o Paciente --</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                  <option value="pat-avulso">Sem vínculo direto / Novo Prospecto</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="task-due-date" className="form-label">PRAZOlim (DATA) *</label>
                  <input
                    id="task-due-date"
                    type="date"
                    className="form-control"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="task-due-time" className="form-label">PRAZOlim (HORA)</label>
                  <input
                    id="task-due-time"
                    type="time"
                    className="form-control"
                    value={taskDueTime}
                    onChange={e => setTaskDueTime(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="task-priority" className="form-label">PRIORIDADE *</label>
                  <select
                    id="task-priority"
                    className="form-control"
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as "high" | "medium" | "low")}
                    required
                  >
                    <option value="high">Alta</option>
                    <option value="medium">Média</option>
                    <option value="low">Baixa</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="task-channel" className="form-label">CANAL DE CONTATO</label>
                  <select
                    id="task-channel"
                    className="form-control"
                    value={taskContactChannel}
                    onChange={e => setTaskContactChannel(e.target.value)}
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Ligação">Ligação Telefônica</option>
                    <option value="E-mail">E-mail</option>
                    <option value="Presencial">Presencial</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="task-responsible" className="form-label">RESPONSÁVEL</label>
                  <input
                    id="task-responsible"
                    type="text"
                    className="form-control"
                    placeholder="Ex: Dra. Patricia"
                    value={taskResponsible}
                    onChange={e => setTaskResponsible(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="task-category" className="form-label">CATEGORIA</label>
                  <select
                    id="task-category"
                    className="form-control"
                    value={taskCategory}
                    onChange={e => setTaskCategory(e.target.value)}
                  >
                    <option value="Orçamento">Orçamento</option>
                    <option value="Retorno">Retorno</option>
                    <option value="Pós-Operatório">Pós-Operatório</option>
                    <option value="Documentação">Documentação</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Geral">Geral</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="task-recurrence" className="form-label">RECORRÊNCIA</label>
                  <select
                    id="task-recurrence"
                    className="form-control"
                    value={taskRecurrence}
                    onChange={e => setTaskRecurrence(e.target.value)}
                  >
                    <option value="Nenhuma">Nenhuma</option>
                    <option value="Semanal">Semanal</option>
                    <option value="Mensal">Mensal</option>
                    <option value="Semestral">Semestral</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label htmlFor="task-stage" className="form-label">ETAPA DO PLANEJAMENTO</label>
                  <input
                    id="task-stage"
                    type="text"
                    className="form-control"
                    placeholder="Ex: Prótese - Etapa 2"
                    value={taskTreatmentStage}
                    onChange={e => setTaskTreatmentStage(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="task-desc" className="form-label">DESCRIÇÃO DA AÇÃO</label>
                <textarea
                  id="task-desc"
                  rows={2}
                  className="form-control"
                  placeholder="Instruções complementares para a ação clínica..."
                  value={taskDesc}
                  onChange={e => setTaskDesc(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "8px", marginTop: "8px", borderTop: "1px solid var(--border-light)", paddingTop: "10px" }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: "10px" }}>Salvar Ação</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary" style={{ flex: 1, padding: "10px" }}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabContainer}>
        <button 
          onClick={() => setActiveTab("pending")} 
          style={activeTab === "pending" ? styles.tabActive : styles.tab}
        >
          Ativas ({tasks.filter(t => t.status !== "completed" && t.status !== "cancelled").length})
        </button>
        <button 
          onClick={() => setActiveTab("completed")} 
          style={activeTab === "completed" ? styles.tabActive : styles.tab}
        >
          Encerradas ({tasks.filter(t => t.status === "completed" || t.status === "cancelled").length})
        </button>
      </div>

      {/* Task List */}
      <div style={styles.taskList}>
        {filteredTasks.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Nenhuma pendência encontrada.</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div 
              key={task.id} 
              style={{ ...styles.taskCard, cursor: "pointer" }}
              onClick={() => {
                setSelectedPatientId(task.patientId);
                setSelectedTaskId(task.id);
                setIsPanelOpen(true);
              }}
            >
              <div style={styles.taskInfo}>
                <h3 style={styles.taskTitle}>{task.title}</h3>
                <p style={styles.taskPatient}>Paciente: {task.patientName}</p>
                {task.dueDate && (
                  <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                    Prazo: <strong>{formatDate(task.dueDate)}</strong> {task.dueTime ? `às ${task.dueTime}` : ""}
                  </p>
                )}
                {task.description && <p style={styles.taskDesc}>{task.description}</p>}
                {task.status !== "completed" && task.status !== "cancelled" && (
                  <select
                    className="form-control"
                    aria-label={`Status da pendencia ${task.title}`}
                    value={task.status}
                    onClick={(event) => event.stopPropagation()}
                    onChange={(event) => updateTask(task.id, { status: event.target.value as typeof task.status })}
                    style={{ marginTop: 8 }}
                  >
                    <option value="pending">Aberta</option>
                    <option value="in_progress">Em andamento</option>
                    <option value="waiting_patient">Aguardando paciente</option>
                    <option value="waiting_third_party">Aguardando terceiro</option>
                    <option value="postponed">Adiada</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                )}
                
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                  <span style={{ 
                    ...styles.priorityTag, 
                    backgroundColor: task.priority === "high" ? "var(--error-bg)" : "rgba(94, 108, 134, 0.08)",
                    color: task.priority === "high" ? "var(--error)" : "var(--text-secondary)"
                  }}>
                    Prioridade: {task.priority.toUpperCase()}
                  </span>
                  {task.category && (
                    <span style={{ ...styles.priorityTag, backgroundColor: "rgba(20, 99, 230, 0.08)", color: "var(--primary)" }}>
                      {task.category}
                    </span>
                  )}
                  {task.contactChannel && (
                    <span style={{ ...styles.priorityTag, backgroundColor: "rgba(38, 185, 120, 0.08)", color: "var(--success)" }}>
                      Via: {task.contactChannel}
                    </span>
                  )}
                </div>
              </div>
              {task.status !== "completed" && task.status !== "cancelled" && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPatientId(task.patientId);
                    setSelectedTaskId(task.id);
                    setIsPanelOpen(true);
                  }} 
                  style={styles.checkBtn} 
                  title="Concluir" 
                  aria-label={`Concluir pendência ${task.title}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
              )}
            </div>
          ))
        )}
      </div>

      <button onClick={() => setIsModalOpen(true)} className="btn btn-primary" style={styles.floatingAddBtn} aria-label="Criar Nova Pendência">
        + Criar Pendência
      </button>

      <QuickPanel 
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        patientId={selectedPatientId}
        taskId={selectedTaskId}
      />
    </>
  );
}

const styles = {
  tabContainer: {
    display: "flex",
    borderBottom: "1px solid var(--border-light)",
    width: "100%",
  },
  tab: {
    flex: 1,
    padding: "10px",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-secondary)",
    cursor: "pointer",
    textAlign: "center" as const,
  },
  tabActive: {
    flex: 1,
    padding: "10px",
    background: "none",
    border: "none",
    borderBottom: "2px solid var(--primary)",
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--primary)",
    cursor: "pointer",
    textAlign: "center" as const,
  },
  taskList: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    width: "100%",
    paddingBottom: "160px", // Aumentar rolagem para caber acima do botão flutuante elevado
  },
  taskCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid var(--border-light)",
    padding: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  taskInfo: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  taskTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  taskLink: {
    appearance: "none" as const,
    padding: 0,
    border: 0,
    background: "transparent",
    cursor: "pointer",
    textAlign: "left" as const,
  },
  taskPatient: {
    fontSize: "11px",
    fontWeight: 600,
    color: "var(--primary)",
  },
  taskDesc: {
    fontSize: "12px",
    color: "var(--text-secondary)",
  },
  priorityTag: {
    fontSize: "9px",
    fontWeight: "bold",
    padding: "2px 6px",
    borderRadius: "6px",
    width: "fit-content",
    marginTop: "4px",
  },
  checkBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "rgba(38, 185, 120, 0.08)",
    color: "var(--success)",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "40px 20px",
    color: "var(--text-secondary)",
  },
  floatingAddBtn: {
    position: "absolute" as const,
    bottom: "90px", // Elevado para não ficar atrás da barra de navegação (76px)
    left: "20px",
    right: "20px",
    width: "calc(100% - 40px)",
    zIndex: 90, // Abaixo do bottom sheet (999) mas acima do resto
  }
};

const modalStyles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(10, 15, 25, 0.4)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modal: {
    width: "100%",
    maxWidth: "340px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "18px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    display: "flex",
    flexDirection: "column" as const,
  }
};
