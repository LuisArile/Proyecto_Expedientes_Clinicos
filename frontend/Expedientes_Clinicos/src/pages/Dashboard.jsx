import React, { useState } from "react";
import { DashboardLayout } from "../components/layout/dashboardLayout";
import { useAuth } from "../features/auth/authContext";

// Importar los dashboards específicos de cada rol
import { DashboardAdministrador } from "../features/dashboard/components/DashboardAdministrador";
import { DashboardDoctor } from "../features/dashboard/components/DashboardDoctor";
import { DashboardRecepcionista } from "../features/dashboard/components/DashboardRecepcionista";


// Aquí podríamos agregar más dashboards para otros roles como enfermería, recepción, etc.
export function Dashboard() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState("inicio");

  // Strategy pattern
  const panelPorRol = {
    administrador: <DashboardAdministrador currentView={currentView} />,
    doctor: <DashboardDoctor currentView={currentView} />,

    enfermero: <div className="p-6"><h2>Panel de Enfermería</h2><p>Bienvenido, {user?.name}</p></div>,
    
    recepcionista: <DashboardRecepcionista currentView={currentView} />,
  };

  return (
    <DashboardLayout
      currentView={currentView}
      onNavigate={(view) => setCurrentView(view)}
    >
      {panelPorRol[user?.role] 
      || 
      (
          <div className="p-10 text-center">
          <h2 className="text-xl font-bold text-red-600">Acceso Restringido</h2>
          <p className="text-gray-500">El rol "{user?.role}" no tiene un panel configurado.</p>
        </div>
      )}
    </DashboardLayout>
  );
}