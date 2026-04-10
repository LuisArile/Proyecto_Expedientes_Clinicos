import React, { Suspense, useEffect, useMemo } from "react";
import { useLocation, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@components/layout/dashboardLayout";

import { LoaderModulo } from "@components/ui/loaderModulo";

import { useAuth } from "@/features/auth/hooks/useAuth";
import { usePacienteSelection } from "@/features/dashboard/hooks/usePacienteSelection";
import { useTriajeState } from "@/features/dashboard/hooks/useTriajeState";
import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";

import { ExpedienteProvider } from "@/features/expedientes/context/ExpedienteProvider";
import { ConsultaProvider } from "@/features/consultas/context/ConsultaProvider";
import { PreclinicaProvider } from "@/features/preclinica/context/PreclinicaProvider";
import { viewRegistry } from "@/shared/services/ViewRegistry";

const WRAPPER_CONFIG = {
  expediente: ["gestion-pacientes", "crear-expediente", "editar-expediente", "formulario-agendar-cita", "formulario-registro-hoy"],
  consulta: ["consulta-medica", "cola-consulta"],
  preclinica: ["preclinica", "cola-preclinica"],
};

const getWrapperType = (viewId) => {
  for (const [type, views] of Object.entries(WRAPPER_CONFIG)) {
    if (views.includes(viewId)) return type;
  }
  return null;
};

export function Dashboard() {
  const { user } = useAuth();
  const { go } = useSafeNavigation();
  const location = useLocation();
  
  const { selectedPaciente, setSelectedPaciente } = usePacienteSelection();
  const { pacienteEnAtencion, setPacienteEnAtencion } = useTriajeState();
  
  const views = useMemo(() => viewRegistry.getAllViews(), []);
  const cleanPath = location.pathname.replace("/sistema", "") || "/";
  const currentView = views.find(v => v.path === cleanPath);

  useEffect(() => {
    if (user?.debeCambiarPassword && currentView?.id !== "changepassword") {
      go("changepassword");
    }
  }, [user?.debeCambiarPassword, currentView?.id, go]);

  const modoActual = location.state?.modo || currentView?.metadata?.modo;
  
  const controller = {
    onVerExpediente: (p) => { setSelectedPaciente(p); go("gestion-pacientes"); },
    onConsultaMedica: (p) => { setSelectedPaciente(p); go("consulta-medica"); },
    onPreclinica: (p) => { setSelectedPaciente(p); go("preclinica"); },
    checkPermission: (perm) => user?.permisos?.includes(perm),
    handleSeleccionarPaciente: (p) => {
      if (modoActual === "preclinica") { setSelectedPaciente(p); go("preclinica");
      } else if (modoActual === "consulta-medica") { setSelectedPaciente(p); go("consulta-medica");
      } else if (modoActual === "agendar") { go("formulario-agendar-cita"); 
      } else if (modoActual === "hoy") { go("formulario-registro-hoy");
      } else { setSelectedPaciente(p); 
      }
    },
    modo: modoActual
  };

  useEffect(() => {
    if (!currentView && location.pathname !== "/sistema") {
      go("inicio");
      return;
    }
    
    if (user?.debeCambiarPassword) return;

    const tienePaciente = selectedPaciente || pacienteEnAtencion;

    if (currentView?.id === "consulta-medica" && !tienePaciente) { go("buscar-paciente-consulta");
    }
    else if (currentView?.id === "preclinica" && !tienePaciente) { go("buscar-paciente-preclinica");
    }
    else if (currentView?.id === "gestion-pacientes" && !selectedPaciente) { go("buscar-paciente");
    }
  }, [currentView, selectedPaciente, pacienteEnAtencion, go, location.pathname, user?.debeCambiarPassword]);

  if (!user || !currentView) return <LoaderModulo />;

  const renderElementWithWrapper = (view) => {
    const Component = view.component;
    const pacienteActual = pacienteEnAtencion || selectedPaciente;

    if (user?.debeCambiarPassword && view.id !== "changepassword") {
      return <LoaderModulo />; 
    }

    const wrapperType = getWrapperType(view.id);

    if (wrapperType === "expediente") {
      return (
        <ExpedienteProvider
          paciente={selectedPaciente}
          onSuccess={() => go(view.id.includes("cita") ? "agenda-citas" : "crear-expediente")}
          onEditarExpediente={(exp) => {
            setSelectedPaciente(exp?.paciente || selectedPaciente);
            go("editar-expediente");
          }}
        >
          <Component viewConfig={view} />
        </ExpedienteProvider>
      );
    }

    if (wrapperType === "consulta") {
      if (view.id === "cola-consulta") {
        return (
          <ConsultaProvider> 
            <Component /> 
          </ConsultaProvider>
        );
      }
      
      return (
        <ConsultaProvider
          pacienteEnAtencion={pacienteActual}
          onSuccess={() => {
            setPacienteEnAtencion(null);
            setSelectedPaciente(null);
            go("cola-consulta");
          }}
        >
          <Component 
            viewConfig={view}
            paciente={pacienteActual}
            onNavigate={go}
            onVolver={() => go("inicio")}
            setPacienteEnAtencion={(p) => {
              setPacienteEnAtencion(p);
              if(p) go("consulta-medica");
            }}
          />
        </ConsultaProvider>
      );
    }

    if (wrapperType === "preclinica") {
      return (
        <PreclinicaProvider 
          paciente={pacienteActual}
          setPacienteEnAtencion={setPacienteEnAtencion}
          setSelectedPaciente={setSelectedPaciente}
          onSuccess={() => {
            setPacienteEnAtencion(null);
            setSelectedPaciente(null);
            go("cola-preclinica");
          }}
        >
          <Component 
            viewConfig={view}
            paciente={pacienteActual}
            onNavigate={go}
            onVolver={() => go("inicio")}
            onSeleccionarPaciente={setSelectedPaciente}
            setPacienteEnAtencion={(p) => {
              setPacienteEnAtencion(p);
              if(p) go("preclinica");
            }}
          />
        </PreclinicaProvider>
      );
    }

    return (
      <Component
        viewConfig={view}
        controller={{...controller, modo: modoActual}}
        paciente={selectedPaciente}
        onSeleccionarPaciente={setSelectedPaciente}
        onNavigate={go}
        pacienteEnAtencion={pacienteEnAtencion}
        setPacienteEnAtencion={setPacienteEnAtencion}
      />
    );
  };

  return (
    <DashboardLayout currentView={currentView?.id} onNavigate={go}>
      <Suspense fallback={<LoaderModulo />}>
        <Routes>
          {views.map((view) => (
            <Route
              key={view.id}
              path={view.path}
              element={renderElementWithWrapper(view)}
            />
          ))}
        </Routes>
      </Suspense>
    </DashboardLayout>
  );
}