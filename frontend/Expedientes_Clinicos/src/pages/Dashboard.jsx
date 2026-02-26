import React, { useState } from "react";
import { DashboardLayout } from "../components/layout/dashboardLayout";
import { useAuth } from "../features/auth/AuthContext";

import { DashboardAdministrador } from "../features/dashboard/components/DashboardAdministrador";
import { DashboardDoctor } from "../features/dashboard/components/DashboardDoctor";
import { DashboardRecepcionista } from "../features/dashboard/components/DashboardRecepcionista";
import { DashboardEnfermero } from "../features/dashboard/components/DashboardEnfermero";

import { FormularioExpediente } from "../features/expedientes/components/FormularioExpediente";
import { Changepassword } from "../features/dashboard/components/Changepassword";

const DASHBOARD_COMPONENTS = {
  ADMINISTRADOR: DashboardAdministrador,
  DOCTOR: DashboardDoctor,
  RECEPCIONISTA: DashboardRecepcionista,
  ENFERMERO: DashboardEnfermero,
};

export function Dashboard() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState("inicio");

  if (!user) return <p>Cargando...</p>;

  const renderContent = () => {
    if (currentView === "changepassword") {
      return <Changepassword />;
    }

    if (currentView === "crear-expediente") {

      if (["RECEPCIONISTA", "ADMINISTRADOR"].includes(user?.rol)) {
        return (
          <FormularioExpediente
            onCancel={() => setCurrentView("inicio")}
          />
        );
      }

      return (
        <div className="p-10 text-red-500">
          No tienes permiso para crear expedientes.
        </div>
      );
    }

    const RoleDashboard = DASHBOARD_COMPONENTS[user?.rol];

    if (RoleDashboard) {
      return <RoleDashboard currentView={currentView} user={user} />;
    }

    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold text-red-600">
          Acceso Restringido
        </h2>
        <p>El rol "{user?.rol}" no tiene un panel configurado.</p>
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