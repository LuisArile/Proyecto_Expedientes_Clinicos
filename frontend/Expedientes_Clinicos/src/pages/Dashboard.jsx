import React, { useState, useMemo, Suspense, useCallback, useEffect } from "react";
import { DashboardLayout } from "../components/layout/dashboardLayout";

import { useAuth } from "@/features/auth/hooks/useAuth";

import { LoaderModulo } from "../components/ui/loaderModulo";
import { getView } from "../features/dashboard/utils/verRegistro";

export function Dashboard() {
  const { user } = useAuth();

  const [selectedPaciente, setSelectedPaciente] = useState(() => {
    const saved = localStorage.getItem("sgec_selected_paciente");
    try { return saved ? JSON.parse(saved) : null; } catch { return null; }
  });

  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem("sgec_view") || "inicio";
  });

  const effectiveView = useMemo(() => {
    const protectedViews = ["consulta-medica", "ver-expediente"];
    if (protectedViews.includes(currentView) && !selectedPaciente) {
      return "buscar-paciente";
    }
    return currentView;
  }, [currentView, selectedPaciente]);

  useEffect(() => {
    localStorage.setItem("sgec_view", currentView);
  }, [currentView]);

  useEffect(() => {
    if (selectedPaciente) {
      localStorage.setItem("sgec_selected_paciente", JSON.stringify(selectedPaciente));
    } else {
      localStorage.removeItem("sgec_selected_paciente");
    }
  }, [selectedPaciente]);

  const volverInicio = useCallback(() => {
    setSelectedPaciente(null);
    setCurrentView("inicio");
  }, []);

  const handleConsultaMedica = useCallback((p) => {
    setSelectedPaciente(p);
    setCurrentView("consulta-medica");
  }, []);
  console.log("Estado actual del Dashboard:", { currentView, selectedPaciente });
  const viewConfig = getView(effectiveView);
  const Component = viewConfig.component;
  
  const commonProps = useMemo(() => ({
    onVolver: volverInicio,
    onSuccess: volverInicio,
    paciente: selectedPaciente,
    onVerExpediente: (p) => { setSelectedPaciente(p); setCurrentView("ver-expediente"); },
    onConsultaMedica: handleConsultaMedica,
    onNavigate: setCurrentView
  }), [selectedPaciente, volverInicio, handleConsultaMedica]);

  if (!user) return <LoaderModulo />;

  return (
    <DashboardLayout currentView={effectiveView} onNavigate={setCurrentView}>
      <Suspense fallback={<LoaderModulo />}>
        <Component 
          key={`${effectiveView}-${selectedPaciente?.dni || 'sin-paciente'}`} 
          {...commonProps} 
        />
      </Suspense>
    </DashboardLayout>
  );
}