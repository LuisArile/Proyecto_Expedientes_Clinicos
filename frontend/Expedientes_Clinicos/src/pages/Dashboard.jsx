import React, { useState } from "react";
import { DashboardLayout } from "../components/layout/dashboardLayout";
import { useAuth } from "../features/auth/AuthContext"; // Verifica que la "A" sea mayúscula si así se llama el archivo

// Importar los dashboards específicos
import { DashboardAdministrador } from "../features/dashboard/components/DashboardAdministrador";
import { DashboardDoctor } from "../features/dashboard/components/DashboardDoctor";
import { DashboardRecepcionista } from "../features/dashboard/components/DashboardRecepcionista";
import { DashboardEnfermero } from "../features/dashboard/components/DashboardEnfermero";
import { FormularioExpediente } from "../features/expedientes/components/FormularioExpediente";

// 1. Mapeo de componentes (Asegúrate de que coincidan con los strings que manda el Backend)
const DASHBOARD_COMPONENTS = {
  ADMINISTRADOR: DashboardAdministrador,
  MEDICO: DashboardDoctor,
  RECEPCIONISTA: DashboardRecepcionista,
  ENFERMERO: DashboardEnfermero,
};

export function Dashboard() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState("inicio");

  // 2. Si no hay usuario todavía, mostramos carga para evitar errores de undefined
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Cargando sesión...</p>
      </div>
    );
  }

  const renderContent = () => {
    // 3. Normalizamos el rol a Mayúsculas para evitar errores de "Administrador" vs "ADMINISTRADOR"
    const userRole = user.rol?.toUpperCase();

    // Lógica para el expediente
    if (currentView === "crear-expediente") {
      if (["RECEPCIONISTA", "ADMINISTRADOR"].includes(userRole)) {
        return <FormularioExpediente onCancel={() => setCurrentView("inicio")} />;
      }
      return (
        <div className="p-10 text-red-500 font-bold">
          No tienes permiso para crear expedientes.
        </div>
      );
    }

    // 4. Seleccionar el Dashboard según el rol
    const RoleDashboard = DASHBOARD_COMPONENTS[userRole];
    
    if (RoleDashboard) {
      return <RoleDashboard currentView={currentView} user={user} />;
    }

    // 5. Caso de error: El rol no existe en nuestro objeto
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-red-600">Acceso Restringido</h2>
        <p className="text-gray-600">El rol "{userRole || 'SIN ROL'}" no tiene un panel configurado.</p>
        <button 
          onClick={() => window.location.href = "/login"}
          className="mt-4 text-blue-500 underline"
        >
          Volver al login
        </button>
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