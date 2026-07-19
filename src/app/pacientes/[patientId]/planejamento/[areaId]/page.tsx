"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { BackHeader } from "@/components/layout/BackHeader";
import { useApp } from "@/context/AppContext";

interface ChecklistItem {
  id: number;
  text: string;
  done: boolean;
}

export default function DetalheAreaPlanejamentoPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast, getPatientPlanner, savePatientPlanner } = useApp();
  
  const patientId = params.patientId as string;
  const areaId = params.areaId as string;

  // Title translation
  const titles: Record<string, string> = {
    protese: "Prótese Dentária",
    implantodontia: "Implantodontia",
    dentistica: "Dentística Restauradora",
    ortodontia: "Ortodontia"
  };

  const areaTitle = titles[areaId] || "Planejamento Clínico";

  const getInitialChecklist = (area: string): ChecklistItem[] => {
    if (area === "protese") {
      return [
        { id: 1, text: "Moldagem diagnóstica inicial", done: true },
        { id: 2, text: "Planejamento estético digital (wax-up)", done: true },
        { id: 3, text: "Prova de facetas / mock-up clínico", done: false },
        { id: 4, text: "Cimentação adesiva definitiva", done: false },
        { id: 5, text: "Consulta de ajuste oclusal final", done: false }
      ];
    }
    if (area === "implantodontia") {
      return [
        { id: 1, text: "Tomografia computadorizada e guia cirúrgico", done: false },
        { id: 2, text: "Cirurgia para instalação de implante", done: false },
        { id: 3, text: "Cicatrização e reabertura", done: false }
      ];
    }
    if (area === "dentistica") {
      return [
        { id: 1, text: "Profilaxia e remoção de cáries", done: true },
        { id: 2, text: "Restauração em resina composta no dente 36", done: true },
        { id: 3, text: "Restauração classe II no dente 45", done: true },
        { id: 4, text: "Acabamento e polimento estético", done: true }
      ];
    }
    return [
      { id: 1, text: "Documentação ortodôntica completa", done: false },
      { id: 2, text: "Colagem de braquetes e primeiro arco", done: false }
    ];
  };

  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Carregar dados no mount
  useEffect(() => {
    let active = true;
    
    const loadPlanner = async () => {
      const data = await getPatientPlanner(patientId, areaId);
      if (active) {
        if (data.length > 0) {
          setChecklist(data);
        } else {
          setChecklist(getInitialChecklist(areaId));
        }
        setMounted(true);
      }
    };
    
    loadPlanner();
    
    return () => {
      active = false;
    };
  }, [patientId, areaId, getPatientPlanner]);

  const handleToggle = async (id: number) => {
    const nextItemState = checklist.find(i => i.id === id);
    if (!nextItemState) return;
    
    const nextState = !nextItemState.done;
    const updated = checklist.map(i => i.id === id ? { ...i, done: nextState } : i);
    
    try {
      await savePatientPlanner(patientId, areaId, updated);
      setChecklist(updated);
    } catch (err) {
      console.error("Falha ao salvar checklist:", err);
    }
  };

  if (!mounted || checklist.length === 0) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <p>Carregando checklist...</p>
      </div>
    );
  }

  const doneCount = checklist.filter(i => i.done).length;
  const progressPercent = Math.round((doneCount / checklist.length) * 100);

  return (
    <>
      <BackHeader title={areaTitle} backUrl={`/pacientes/${patientId}/planejamento`} />

      {/* Info Card */}
      <div className="card">
        <div style={styles.progressHeader}>
          <div>
            <div style={styles.progressLabel}>CHECKLIST DE PROCEDIMENTOS</div>
            <div style={styles.progressValue}>{doneCount} de {checklist.length} concluídos</div>
          </div>
          <span style={styles.percentBadge}>{progressPercent}%</span>
        </div>
        <div style={styles.progressBarBg}>
          <div style={{ ...styles.progressBarFill, width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Checklist Items Semânticos e Acessíveis */}
      <div style={styles.checklist}>
        {checklist.map((item) => {
          const inputId = `check-item-${item.id}`;
          return (
            <div 
              key={item.id} 
              onClick={() => handleToggle(item.id)}
              style={styles.checkRow}
              role="checkbox"
              aria-checked={item.done}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  handleToggle(item.id);
                }
              }}
            >
              <input
                id={inputId}
                type="checkbox"
                checked={item.done}
                onChange={() => {}} // toggle tratado pela div/onClick
                style={styles.hiddenInput}
                tabIndex={-1}
              />
              <div style={{
                ...styles.checkbox,
                backgroundColor: item.done ? "var(--primary)" : "#ffffff",
                borderColor: item.done ? "var(--primary)" : "var(--outline-variant)"
              }}>
                {item.done && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="4">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </div>
              <label htmlFor={inputId} onClick={(e) => e.stopPropagation()} style={{
                ...styles.itemText,
                textDecoration: item.done ? "line-through" : "none",
                color: item.done ? "var(--text-secondary)" : "var(--text-primary)",
                fontWeight: item.done ? 500 : 600,
                cursor: "pointer",
                flex: 1
              }}>
                {item.text}
              </label>
            </div>
          );
        })}
      </div>

      {/* Action CTA */}
      <button 
        onClick={() => {
          showToast("Planejamento atualizado!", "success");
          router.push(`/pacientes/${patientId}/planejamento`);
        }} 
        className="btn btn-primary"
        style={styles.saveBtn}
      >
        Concluir e Voltar
      </button>
    </>
  );
}

const styles = {
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: "9px",
    fontWeight: "bold",
    color: "var(--text-secondary)",
    letterSpacing: "0.5px",
  },
  progressValue: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginTop: "2px",
  },
  percentBadge: {
    fontSize: "18px",
    fontWeight: 800,
    color: "var(--primary)",
  },
  progressBarBg: {
    width: "100%",
    height: "6px",
    backgroundColor: "rgba(16, 32, 68, 0.05)",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "var(--primary)",
    borderRadius: "3px",
    transition: "width 0.3s ease-out",
  },
  checklist: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    width: "100%",
  },
  checkRow: {
    backgroundColor: "#ffffff",
    border: "1px solid var(--border-light)",
    borderRadius: "12px",
    padding: "14px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    boxShadow: "var(--shadow-sm)",
    outline: "none",
  },
  hiddenInput: {
    position: "absolute" as const,
    opacity: 0,
    width: 0,
    height: 0,
    margin: 0,
    pointerEvents: "none" as const,
  },
  checkbox: {
    width: "20px",
    height: "20px",
    borderRadius: "6px",
    border: "2px solid",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
    flexShrink: 0,
  },
  itemText: {
    fontSize: "13px",
    userSelect: "none" as const,
  },
  saveBtn: {
    marginTop: "20px",
  }
};
