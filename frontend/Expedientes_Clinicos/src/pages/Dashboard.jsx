import React, { useState, useEffect, Suspense, lazy } from "react";
import { DashboardLayout } from "../components/layout/dashboardLayout";
import { useAuth } from "@/features/auth/useAuth";
import { Button } from "@/components/ui/button";

import { DashboardFeature } from "../features/dashboard/components/DashboardFeature";
import { Changepassword } from "../features/dashboard/components/Changepassword";
const GestionRoles = lazy(() => import("../features/admin/components/GestionRoles").then(module => ({ default: module.GestionRoles })));
import { FormularioExpediente } from "../features/expedientes/components/FormularioExpediente";
import { BuscarPaciente } from "../features/expedientes/components/BuscarPaciente";
const ConsultaMedica = lazy(() => import("../features/consultas/components/ConsultaMedica").then(module => ({ default: module.ConsultaMedica })));
const FormularioRegistroPreclinico = lazy(() => import("../features/preclinica/components/FormularioRegistroPreclinico").then(module => ({ default: module.FormularioRegistroPreclinico })));
import { ListaRegistrosPreclinicos } from "../features/preclinica/components/ListaRegistrosPreclinicos";
const Auditoria = lazy(() => import("../features/admin/components/Auditoria").then(module => ({ default: module.Auditoria })));

export function Dashboard() {
  const { user } = useAuth();
  
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem("sgec_view") || "inicio";
  });

  const [selectedPaciente, setSelectedPaciente] = useState(() => {
    const saved = localStorage.getItem("sgec_selected_paciente");
    return saved ? JSON.parse(saved) : null;
  });

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando sesión...</p>
      </div>
    );
  }

  const handleNavigate = (view) => {
    if (typeof view === 'string') setCurrentView(view);
  };

  const renderContent = () => {
    console.log("Vista actual:", currentView);
    const volverInicio = () => {
      setSelectedPaciente(null);
      setCurrentView("inicio");
    };

    switch (currentView) {
      case "inicio":
        return <DashboardFeature onNavigate={handleNavigate} />;
      case "crear-expediente":
        return <FormularioExpediente onVolver={volverInicio} onSuccess={volverInicio} />;
      case "buscar-paciente":
        return (
          <BuscarPaciente onVolver={volverInicio} onVerExpediente={(paciente) => console.log("Abriendo:", paciente.codigo)} onConsultaMedica={(paciente) => { setSelectedPaciente(paciente); setCurrentView("consulta-medica"); }} />
        );
      case "preclinica":
        return <FormularioRegistroPreclinico onVolver={volverInicio} onSuccess={volverInicio} />;
      case "pacientes-evaluados":
        return <ListaRegistrosPreclinicos onVolver={volverInicio} />;
      case "consulta-medica":
        if (!selectedPaciente) {
          return (
            <div className="p-10 text-center">
              <p className="mb-4">No se ha seleccionado ningún paciente para la consulta.</p>
              <Button onClick={() => setCurrentView("buscar-paciente")}>Ir a buscar paciente</Button>
            </div>
          );
        }
        return (
          <ConsultaMedica 
            paciente={selectedPaciente} 
            onVolver={() => {
              setSelectedPaciente(null);
              setCurrentView("buscar-paciente");
            }} 
            onSuccess={volverInicio} 
          />
        );
      case "gestion-roles":
        return <GestionRoles onVolver={volverInicio} />;
      case "changepassword":
        return <Changepassword onVolver={volverInicio} />;
      case "auditoria":
        return <Auditoria onVolver={volverInicio} />;
      default:
        return <p className="p-10 text-center">Módulo en construcción...</p>;
    }
  };

  return (
    <DashboardLayout currentView={currentView} onNavigate={handleNavigate}>
      <Suspense fallback={
        <div className="flex items-center justify-center p-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Cargando módulo...</span>
        </div>
      }>
        {renderContent()}
      </Suspense>
    </DashboardLayout>
  );
}