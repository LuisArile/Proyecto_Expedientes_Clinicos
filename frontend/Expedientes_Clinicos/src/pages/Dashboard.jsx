import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layout/dashboardLayout";
import { useAuth } from "../features/auth/AuthContext";
import { FormularioExpediente } from "../features/expedientes/components/FormularioExpediente";
import { GestionRoles } from "../features/admin/components/GestionRoles";
import { Button } from "@/components/ui/button";
import { BuscarPaciente } from "../features/expedientes/components/BuscarPaciente";
import { Changepassword } from "../features/dashboard/components/Changepassword";
import { DashboardFeature } from "../features/dashboard/components/DashboardFeature";
import { ConsultaMedica } from "../features/consultas/components/ConsultaMedica";

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

  // Si no hay usuario todavía, mostramos carga para evitar errores de undefined
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando sesión...</p>
      </div>
    );
  }

  const handleNavigate = (view) => {
    if (typeof view === 'string') {
      setCurrentView(view);
    }
  };

  const renderContent = () => {
    const volverInicio = () => {
      setSelectedPaciente(null);
      setCurrentView("inicio");
      localStorage.removeItem("sgec_selected_paciente");
      setCurrentView("inicio");
    };
    
    switch (currentView) {
      case "crear-expediente":
        return <FormularioExpediente onVolver={volverInicio} onSuccess={volverInicio} />;
      case "buscar-paciente":
        return (<BuscarPaciente onVolver={volverInicio} 
                                onVerExpediente={(paciente) => console.log("Abriendo:", paciente.codigo)}
                                onConsultaMedica={(paciente) => { 
                                  setSelectedPaciente(paciente);
                                  setCurrentView("consulta-medica");
                                }}
              />);
      case "gestion-roles":
        return <GestionRoles onVolver={volverInicio} />;
      case "changepassword":
        return <Changepassword onVolver={volverInicio} />;
      case "preclinica":
        return <FormularioRegistroPreclinico onVolver={volverInicio} onSuccess={volverInicio} />;
      case "pacientes-evaluados":
        return <ListaRegistrosPreclinicos onVolver={volverInicio} />;
      case "inicio":
        return <DashboardFeature />;
      case "consulta-medica":
        if (!selectedPaciente) {
          return (
              <div className="p-10 text-center">
                  <p>No se ha seleccionado ningún paciente.</p>
                  <Button onClick={() => setCurrentView("buscar-paciente")}>Ir a buscar</Button>
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
      default:
        return <p className="p-10 text-center">Módulo en construcción...</p>;
    }     
  };   

  return (
    <DashboardLayout currentView={currentView} onNavigate={handleNavigate} >
      {renderContent()}
    </DashboardLayout>
  );
}