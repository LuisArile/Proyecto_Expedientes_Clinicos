import React, { useState, useEffect } from "react";
import { DashboardLayout } from "../components/layout/dashboardLayout";
import { useAuth } from "../features/auth/AuthContext";
import { FormularioExpediente } from "../features/expedientes/components/FormularioExpediente";
import { GestionRoles } from "../features/admin/components/GestionRoles";

import { BuscarPaciente } from "../features/expedientes/components/BuscarPaciente";
import { Changepassword } from "../features/dashboard/components/Changepassword";
import { DashboardFeature } from "../features/dashboard/components/DashboardFeature";

export function Dashboard() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem("sgec_view") || "inicio";
  });

  useEffect(() => {
    localStorage.setItem("sgec_view", currentView);
  }, [currentView]);  
  
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
    const volverInicio = () => setCurrentView("inicio");
    
    switch (currentView) {
      case "crear-expediente":
        return <FormularioExpediente onVolver={volverInicio} onSuccess={volverInicio} />;
      case "buscar-paciente":
        return <BuscarPaciente onVolver={volverInicio} onVerExpediente={(paciente) => console.log("Abriendo:", paciente.codigo)}/>;
      case "gestion-roles":
        return <GestionRoles onVolver={volverInicio} />;
      case "changepassword":
        return <Changepassword onVolver={volverInicio} />;
      case "inicio":
        return <DashboardFeature />;
      default:
        return <p className="p-10 text-center">Módulo en construcción...</p>;
    }     
  };   

  return (
    <DashboardLayout
      currentView={currentView}
      // onNavigate={(view) => setCurrentView(view)}
      onNavigate={handleNavigate}
    >
      {renderContent()}
    </DashboardLayout>
  );
}