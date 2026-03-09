import React, { useState } from "react";
import { DashboardLayout } from "../components/layout/dashboardLayout";
import { useAuth } from "../features/auth/AuthContext";
import { FormularioExpediente } from "../features/expedientes/components/FormularioExpediente";
import { GestionRoles } from "../features/admin/components/GestionRoles";

import { BuscarPaciente } from "../features/expedientes/components/BuscarPaciente";
import { Changepassword } from "../features/dashboard/components/Changepassword";
import { DashboardFeature } from "../features/dashboard/components/DashboardFeature";

export function Dashboard() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState("inicio");

  // Si no hay usuario todavía, mostramos carga para evitar errores de undefined
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando sesión...</p>
      </div>
    );
  }

  const userRole = user.rol?.toUpperCase();

  const renderContent = () => {
    
    if (currentView === "crear-expediente") return (
      <FormularioExpediente 
        onSuccess={() => setCurrentView("inicio")}
        onCancel={() => setCurrentView("inicio")} 
      />
    );

    if (currentView === "buscar-paciente") return (
      <BuscarPaciente 
        onVolver={() => setCurrentView("inicio")} 
        onVerExpediente={(paciente) => console.log("Abriendo:", paciente.codigo)}
      />
    )

    if (currentView === "gestion-roles") return (
      <GestionRoles 
        onVolver={() => setCurrentView('inicio')}
      />
    )

    if (currentView === "changepassword") return <Changepassword />;

    
    if(currentView === "inicio") {
      return <DashboardFeature/>
    }

    return <p className="p-10 text-center">Módulo en construcción...</p>;
  };   

  return (
    <DashboardLayout
      currentView={currentView}
      // onNavigate={(view) => setCurrentView(view)}
      onNavigate={setCurrentView}
    >
      {renderContent()}
    </DashboardLayout>
  );
}