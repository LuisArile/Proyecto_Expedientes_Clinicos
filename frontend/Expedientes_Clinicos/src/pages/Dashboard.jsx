import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layout/dashboardLayout";
import { useAuth } from "../features/auth/AuthContext";
import { Button } from "@/components/ui/button";

import { DashboardFeature } from "../features/dashboard/components/DashboardFeature";
import { Changepassword } from "../features/dashboard/components/Changepassword";
import { GestionRoles } from "../features/admin/components/GestionRoles";

import { FormularioExpediente } from "../features/expedientes/components/FormularioExpediente";
import { BuscarPaciente } from "../features/expedientes/components/BuscarPaciente";

import { ConsultaMedica } from "../features/consultas/components/ConsultaMedica";

import { FormularioRegistroPreclinico } from "../features/preclinica/components/FormularioRegistroPreclinico";
import { ListaRegistrosPreclinicos } from "../features/preclinica/components/ListaRegistrosPreclinicos";

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
      default:
        return <p className="p-10 text-center">Módulo en construcción...</p>;
    }
  };

  return (
    <DashboardLayout currentView={currentView} onNavigate={handleNavigate}>
      {renderContent()}
    </DashboardLayout>
  );
}