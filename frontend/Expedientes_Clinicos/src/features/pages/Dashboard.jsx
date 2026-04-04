import React, { useState, useMemo, Suspense, useCallback, useEffect } from "react";
import { DashboardLayout } from "@components/layout/dashboardLayout";

import { useAuth } from "@/features/auth/hooks/useAuth";

import { LoaderModulo } from "@components/ui/loaderModulo";
import { getView } from "@/features/dashboard/utils/verRegistro";

export function Dashboard() {
  const { user } = useAuth();

  const [selectedPaciente, setSelectedPaciente] = useState(() => {
    try {
      const saved = localStorage.getItem("sgec_selected_paciente");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [pacienteEnAtencion, setPacienteEnAtencion] = useState(() => {
    try {
      const saved = localStorage.getItem("sgec_paciente_en_atencion");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [expedienteEnEdicion, setExpedienteEnEdicion] = useState(null);

  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem("sgec_view") || "inicio";
  });

  const tienePacienteValido = useMemo(() => {
    return (
      selectedPaciente &&
      selectedPaciente.dni &&
      selectedPaciente.expedientes?.idExpediente
    );
  }, [selectedPaciente]);

  const effectiveView = useMemo(() => {
    const protectedViews = [
      "consulta-medica",
      "ver-expediente",
      "gestion-pacientes",
      "editar-expediente",
      "preclinica",
      "consulta"
    ];

    if (protectedViews.includes(currentView) && !tienePacienteValido) {
      return "buscar-paciente";
    }

    return currentView;
  }, [currentView, tienePacienteValido]);

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

  useEffect(() => {
    if (pacienteEnAtencion) {
      localStorage.setItem(
        "sgec_paciente_en_atencion",
        JSON.stringify(pacienteEnAtencion)
      );
    } else {
      localStorage.removeItem("sgec_paciente_en_atencion");
    }
  }, [pacienteEnAtencion]);

  const volverInicio = useCallback(() => {
    setSelectedPaciente(null);
    setCurrentView("inicio");
  }, []);

  const volverAlExpediente = useCallback(() => {
    setCurrentView("gestion-pacientes");
  }, []);

  const handleConsultaMedica = useCallback((p) => {
    setSelectedPaciente(p);
    setCurrentView("consulta-medica");
  }, []);

  const handleEditarExpediente = useCallback((expedienteData) => {
    setExpedienteEnEdicion(expedienteData);
    setCurrentView("editar-expediente");
  }, []);
  
  console.log("Estado actual del Dashboard:", { currentView, selectedPaciente });
  const viewConfig = getView(effectiveView);
  const Component = viewConfig.component;

  const commonProps = useMemo(() => {
    return {
      onVolver: volverInicio,
      onSuccess: volverAlExpediente,
      onNavigate: setCurrentView,
      onSeleccionarPaciente: setSelectedPaciente,

      onCancel:
        currentView === "editar-expediente"
          ? volverAlExpediente
          : volverInicio,

      paciente: selectedPaciente,
      pacienteEnAtencion,
      setPacienteEnAtencion,

      onVerExpediente: (p) => {
        setSelectedPaciente(p);
        setCurrentView("gestion-pacientes");
      },

      onEditarExpediente: handleEditarExpediente,
      onConsultaMedica: handleConsultaMedica,

      modo:
        viewConfig.modo ||
        (currentView === "formulario-registro-hoy" ? "hoy" : "agendar"),

      tipoForm: currentView === "editar-expediente" ? "editar" : "crear",

      pacienteData:
        currentView === "editar-expediente"
          ? expedienteEnEdicion
          : null,
    };
  }, [ selectedPaciente, currentView, expedienteEnEdicion, viewConfig, volverInicio, volverAlExpediente, handleConsultaMedica, handleEditarExpediente, pacienteEnAtencion ]);

  console.log("PRUEBA");
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