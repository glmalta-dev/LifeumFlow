"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { BackHeader } from "@/components/layout/BackHeader";
import type { Appointment } from "@/types";

export default function NovoAgendamentoPage() {
  const params = useParams();
  const router = useRouter();
  const { addAppointment, patients } = useApp();

  const patientId = params.patientId as string;
  const patient = patients.find((p) => p.id === patientId);

  // Form states
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState<Appointment["type"]>("consulta");
  const [status, setStatus] = useState<Appointment["status"]>("agendado");
  const [professional, setProfessional] = useState("Dr. Gabriel Mendes");
  const [notes, setNotes] = useState("");
  
  // Novos campos requeridos na auditoria
  const [duration, setDuration] = useState("30");
  const [roomOrChair, setRoomOrChair] = useState("Cadeira 01");
  const [preparationInterval, setPreparationInterval] = useState("10");
  const [recurrence, setRecurrence] = useState("Nenhuma");
  const [treatmentStage, setTreatmentStage] = useState("");
  const [reminder, setReminder] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      return;
    }

    const errorMsg = await addAppointment({
      patientId,
      patientName: patient ? patient.name : "Paciente Desconhecido",
      date,
      time,
      type,
      status,
      professional,
      notes,
      duration: Number(duration),
      roomOrChair,
      preparationInterval: Number(preparationInterval),
      recurrence,
      treatmentStage: treatmentStage || undefined,
      reminder: reminder || undefined
    });

    // Se NÃO houver erro de conflito rígido, navega de volta para a lista
    if (!errorMsg) {
      router.push(`/pacientes/${patientId}/agendamentos`);
    }
  };

  return (
    <>
      <BackHeader title="Novo Agendamento" backUrl={`/pacientes/${patientId}/agendamentos`} />

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Paciente */}
        <div style={styles.patientBanner}>
          <span style={styles.bannerLabel}>PACIENTE VINCULADO</span>
          <span style={styles.bannerVal}>{patient?.name}</span>
        </div>

        {/* Data e Hora */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="app-date" className="form-label">DATA DA CONSULTA *</label>
            <input 
              id="app-date"
              type="date" 
              className="form-control" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="app-time" className="form-label">HORÁRIO *</label>
            <input 
              id="app-time"
              type="time" 
              className="form-control" 
              value={time} 
              onChange={(e) => setTime(e.target.value)} 
              required
            />
          </div>
        </div>

        {/* Duração e Preparação */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="app-duration" className="form-label">DURAÇÃO ESTIMADA *</label>
            <select 
              id="app-duration"
              className="form-control" 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)}
              required
            >
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="45">45 minutos</option>
              <option value="60">1 hora</option>
              <option value="90">1h 30m</option>
              <option value="120">2 horas</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="app-prep" className="form-label">INTERVALO LIMPEZA</label>
            <select 
              id="app-prep"
              className="form-control" 
              value={preparationInterval} 
              onChange={(e) => setPreparationInterval(e.target.value)}
            >
              <option value="0">Sem intervalo</option>
              <option value="10">10 minutos</option>
              <option value="15">15 minutos</option>
              <option value="20">20 minutos</option>
            </select>
          </div>
        </div>

        {/* Cadeira/Sala e Profissional */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="app-room" className="form-label">CADEIRA / SALA *</label>
            <select 
              id="app-room"
              className="form-control" 
              value={roomOrChair} 
              onChange={(e) => setRoomOrChair(e.target.value)}
              required
            >
              <option value="Cadeira 01">Cadeira 01 (Principal)</option>
              <option value="Cadeira 02">Cadeira 02 (Ortodontia)</option>
              <option value="Sala Cirúrgica">Sala Cirúrgica 01</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="app-status" className="form-label">STATUS INICIAL *</label>
            <select 
              id="app-status"
              className="form-control" 
              value={status} 
              onChange={(e) => setStatus(e.target.value as Appointment["status"])}
              required
            >
              <option value="agendado">Agendado</option>
              <option value="confirmado">Confirmado</option>
              <option value="realizado">Realizado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>

        {/* Tipo de Atendimento e Recorrência */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="app-type" className="form-label">TIPO DE CONSULTA</label>
            <select 
              id="app-type"
              className="form-control" 
              value={type} 
              onChange={(e) => setType(e.target.value as Appointment["type"])}
            >
              <option value="consulta">Consulta de Avaliação</option>
              <option value="retorno">Retorno de Acompanhamento</option>
              <option value="cirurgia">Procedimento Cirúrgico</option>
              <option value="planejamento">Planejamento Clínico</option>
              <option value="manutencao">Manutenção Geral</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="app-recurrence" className="form-label">RECORRÊNCIA</label>
            <select 
              id="app-recurrence"
              className="form-control" 
              value={recurrence} 
              onChange={(e) => setRecurrence(e.target.value)}
            >
              <option value="Nenhuma">Nenhuma</option>
              <option value="Semanal">Semanal</option>
              <option value="Quinzenal">Quinzenal</option>
              <option value="Mensal">Mensal</option>
            </select>
          </div>
        </div>

        {/* Dentista */}
        <div className="form-group">
          <label htmlFor="app-professional" className="form-label">PROFISSIONAL RESPONSÁVEL *</label>
          <select 
            id="app-professional"
            className="form-control" 
            value={professional} 
            onChange={(e) => setProfessional(e.target.value)}
            required
          >
            <option value="Dr. Gabriel Mendes">Dr. Gabriel Mendes (Implantodontia)</option>
            <option value="Dra. Patricia Lima">Dra. Patricia Lima (Ortodontia)</option>
            <option value="Dr. Henrique Rocha">Dr. Henrique Rocha (Endodontia)</option>
          </select>
        </div>

        {/* Relação Planejamento e Lembrete */}
        <div style={{ display: "flex", gap: "8px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="app-stage" className="form-label">ETAPA DO PLANEJAMENTO</label>
            <input 
              id="app-stage"
              type="text" 
              className="form-control" 
              placeholder="Ex: Implante - Etapa 2"
              value={treatmentStage} 
              onChange={(e) => setTreatmentStage(e.target.value)} 
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label htmlFor="app-reminder" className="form-label">LEMBRETE</label>
            <input 
              id="app-reminder"
              type="text" 
              className="form-control" 
              placeholder="Ex: Trazer radiografia"
              value={reminder} 
              onChange={(e) => setReminder(e.target.value)} 
            />
          </div>
        </div>

        {/* Notas */}
        <div className="form-group">
          <label htmlFor="app-notes" className="form-label">OBSERVAÇÕES CLÍNICAS</label>
          <textarea 
            id="app-notes"
            rows={2} 
            className="form-control" 
            placeholder="Alguma nota importante sobre esta consulta..."
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Submit */}
        <div style={styles.actions}>
          <button type="submit" className="btn btn-primary">
            Salvar Agendamento
          </button>
          <button 
            type="button" 
            onClick={() => router.push(`/pacientes/${patientId}/agendamentos`)}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    width: "100%",
    paddingBottom: "40px",
  },
  patientBanner: {
    backgroundColor: "rgba(16, 32, 68, 0.03)",
    border: "1px solid var(--border-light)",
    padding: "10px 14px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
  },
  bannerLabel: {
    fontSize: "9px",
    fontWeight: "bold",
    color: "var(--text-secondary)",
  },
  bannerVal: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  actions: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    marginTop: "10px",
  }
};
