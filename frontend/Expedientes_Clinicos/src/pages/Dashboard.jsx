import React, { useState } from "react";
import { DashboardLayout } from "../components/layout/dashboardLayout";
import { useAuth } from "../features/auth/authContext";

// Importar los dashboards específicos de cada rol
import { DashboardAdministrador } from "../features/dashboard/components/DashboardAdministrador";

export function Dashboard() {
  const { user } = useAuth();
    const [currentView, setCurrentView] = useState("usuarios");

  const panelPorRol = {
    administrador: <DashboardAdministrador currentView={currentView} />,
  };

  return (
    <DashboardLayout
      currentView={currentView}
      onNavigate={(view) => setCurrentView(view)}
    >
      {panelPorRol[user?.role] || <p>No autorizado (Rol actual: {user?.role})</p>}
    </DashboardLayout>
  );
}