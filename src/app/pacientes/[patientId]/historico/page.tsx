"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useApp } from "@/context/AppContext";

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  icon: "calendar" | "evolution" | "file" | "task" | "planner";
  color: string;
  type: "consultas" | "evolucoes" | "arquivos" | "pendencias" | "planejamentos";
}

export default function HistoricoPage() {
  const params = useParams();
  const { appointments, evolutions, files, tasks, getPatientPlanner } = useApp();
  
  const patientId = params.patientId as string;
  
  const [plannerItems, setPlannerItems] = useState<TimelineItem[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let active = true;
    
    const loadPlannerCompletedStages = async () => {
      const areas = ["protese", "implantodontia", "dentistica", "ortodontia"];
      const stages: TimelineItem[] = [];
      
      try {
        await Promise.all(
          areas.map(async (area) => {
            const checklist = await getPatientPlanner(patientId, area);
            const doneItems = checklist.filter((item) => item.done);
            doneItems.forEach((i) => {
              stages.push({
                date: i.updatedAt ? i.updatedAt.split("T")[0] : new Date().toISOString().split("T")[0],
                title: `Etapa de Planejamento Concluída`,
                description: `Área: ${area.toUpperCase()} — ${i.text}`,
                icon: "planner",
                color: "#00629e",
                type: "planejamentos"
              });
            });
          })
        );
      } catch (err) {
        console.error("Falha ao carregar etapas de planejamentos para a timeline:", err);
      }

      if (active) {
        setPlannerItems(stages);
        setMounted(true);
      }
    };

    loadPlannerCompletedStages();

    return () => {
      active = false;
    };
  }, [patientId, getPatientPlanner]);

  // Constroi a lista unificada
  const allItems: TimelineItem[] = [
    ...appointments.filter(a => a.patientId === patientId).map(a => ({
      date: a.date,
      title: `Consulta de ${a.type.toUpperCase()}`,
      description: `Profissional: ${a.professional} • Status: ${a.status.toUpperCase()}`,
      icon: "calendar" as const,
      color: "var(--primary)",
      type: "consultas" as const
    })),
    ...evolutions.filter(e => e.patientId === patientId).map(e => ({
      date: e.date,
      title: `Evolução Clínica: ${e.procedure}`,
      description: e.description,
      icon: "evolution" as const,
      color: "var(--success)",
      type: "evolucoes" as const
    })),
    ...files.filter(f => f.patientId === patientId).map(f => ({
      date: f.uploadDate,
      title: `Arquivo Anexado: ${f.name}`,
      description: `Tamanho: ${f.size}`,
      icon: "file" as const,
      color: "var(--warning)",
      type: "arquivos" as const
    })),
    ...tasks.filter(t => t.patientId === patientId && t.status === "completed").map(t => ({
      date: t.dueDate, // data de conclusão simulada pelo vencimento
      title: `Pendência Resolvida: ${t.title}`,
      description: t.description || "Nenhuma nota inserida.",
      icon: "task" as const,
      color: "var(--text-secondary)",
      type: "pendencias" as const
    })),
    ...plannerItems
  ].sort((a, b) => b.date.localeCompare(a.date));

  // Filtra itens baseados no filtro selecionado
  const filteredItems = filter === "all" ? allItems : allItems.filter(item => item.type === filter);

  if (!mounted) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
        <p>Carregando histórico unificado...</p>
      </div>
    );
  }

  return (
    <>
      <div style={styles.headerRow}>
        <h3 style={styles.title}>Linha do Tempo Clínica</h3>
        <span style={styles.sub}>Histórico cronológico consolidado</span>
      </div>

      {/* Pílulas de Filtro */}
      <div style={styles.filterBar} className="hide-scrollbar">
        {[
          { id: "all", label: "Todos" },
          { id: "consultas", label: "Consultas" },
          { id: "evolucoes", label: "Evoluções" },
          { id: "arquivos", label: "Arquivos" },
          { id: "pendencias", label: "Pendências" },
          { id: "planejamentos", label: "Planejamento" }
        ].map(btn => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            style={filter === btn.id ? styles.filterBtnActive : styles.filterBtn}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <div style={styles.timeline}>
        {filteredItems.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Nenhuma atividade registrada nesta categoria.</p>
          </div>
        ) : (
          filteredItems.map((item, idx) => (
            <div key={idx} style={styles.timelineItem}>
              <div style={styles.leftCol}>
                <div style={{ ...styles.iconBadge, backgroundColor: item.color }}>
                  {item.icon === "calendar" && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  )}
                  {item.icon === "evolution" && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                      <path d="M12 20h9"></path>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                    </svg>
                  )}
                  {item.icon === "file" && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  )}
                  {item.icon === "task" && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                  {item.icon === "planner" && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  )}
                </div>
                {idx < filteredItems.length - 1 && <div style={styles.timelineLine} />}
              </div>
              
              <div style={styles.rightCol}>
                <span style={styles.itemDate}>{item.date.split("-").reverse().join("/")}</span>
                <h4 style={styles.itemTitle}>{item.title}</h4>
                <p style={styles.itemDesc}>{item.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

const styles = {
  headerRow: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
    padding: "4px 0",
  },
  title: {
    fontSize: "14px",
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  sub: {
    fontSize: "11px",
    color: "var(--text-secondary)",
  },
  timeline: {
    display: "flex",
    flexDirection: "column" as const,
    width: "100%",
    padding: "4px 10px 40px 10px",
  },
  timelineItem: {
    display: "flex",
    gap: "14px",
  },
  leftCol: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
  iconBadge: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    zIndex: 2,
  },
  timelineLine: {
    width: "2px",
    flex: 1,
    backgroundColor: "var(--border-light)",
    margin: "4px 0",
  },
  rightCol: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    gap: "2px",
    paddingBottom: "24px",
  },
  itemDate: {
    fontSize: "10px",
    fontWeight: "bold",
    color: "var(--text-secondary)",
  },
  itemTitle: {
    fontSize: "13px",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginTop: "2px",
  },
  itemDesc: {
    fontSize: "12px",
    color: "var(--text-secondary)",
    marginTop: "2px",
    lineHeight: "1.4",
  },
  emptyState: {
    textAlign: "center" as const,
    padding: "40px 20px",
    color: "var(--text-secondary)",
  },
  filterBar: {
    display: "flex",
    gap: "8px",
    overflowX: "auto" as const,
    paddingBottom: "8px",
    paddingTop: "4px",
  },
  filterBtn: {
    padding: "5px 12px",
    borderRadius: "20px",
    border: "1px solid var(--border-light)",
    backgroundColor: "#ffffff",
    color: "var(--text-secondary)",
    fontSize: "11px",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    flexShrink: 0,
  },
  filterBtnActive: {
    padding: "5px 12px",
    borderRadius: "20px",
    border: "1px solid var(--primary)",
    backgroundColor: "rgba(20, 99, 230, 0.06)",
    color: "var(--primary)",
    fontSize: "11px",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    flexShrink: 0,
  }
};
