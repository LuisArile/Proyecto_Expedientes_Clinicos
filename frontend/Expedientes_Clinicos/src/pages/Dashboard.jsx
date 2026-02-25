import React, { useState } from "react";
import { DashboardLayout } from "../components/layout/dashboardLayout";
import { useAuth } from "../features/auth/authContext";

// Importar los dashboards específicos de cada rol
import { DashboardAdministrador } from "../features/dashboard/components/DashboardAdministrador";
import { DashboardDoctor } from "../features/dashboard/components/DashboardDoctor";
import { DashboardRecepcionista } from "../features/dashboard/components/DashboardRecepcionista";
import { DashboardEnfermero } from "../features/dashboard/components/DashboardEnfermero";

import { FormularioExpediente } from "../features/expedientes/components/FormularioExpediente";


const DASHBOARD_COMPONENTS = {
  administrador: DashboardAdministrador,
  doctor: DashboardDoctor,
  recepcionista: DashboardRecepcionista,
  enfermero: DashboardEnfermero,
};

export function Dashboard() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState("inicio");

  if (loading) return <p>Cargando...</p>;

  const renderContent = () => {
    // Si el usuario hizo clic en "Crear Paciente"
    if (currentView === "crear-expediente") {

      if (["recepcionista", "administrador"].includes(user?.role)) {
        return <FormularioExpediente onCancel={() => setCurrentView("inicio")} />;
      }
      return <div className="p-10 text-red-500">No tienes permiso para crear expedientes.</div>;
    }

    // dashboard según el rol
    const RoleDashboard = DASHBOARD_COMPONENTS[user?.role];
    
    if (RoleDashboard) {
      return <RoleDashboard currentView={currentView} user={user} />;
    }

    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-red-600">Acceso Restringido</h2>
        <p>El rol "{user?.role}" no tiene un panel configurado.</p>
      </div>
    );
  };  

  return (
    <DashboardLayout
      currentView={currentView}
      onNavigate={(view) => setCurrentView(view)}
    >
      {renderContent()}
    </DashboardLayout>
  );
}