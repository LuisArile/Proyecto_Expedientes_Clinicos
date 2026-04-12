import { useNavigate } from "react-router-dom";
import { getView } from "@/features/dashboard/view/registry";
import { usePacienteSelection } from "./usePacienteSelection";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function useSafeNavigation() {
    const navigate = useNavigate();
    const { checkPermission } = useAuth();
    const { selectedPaciente } = usePacienteSelection();

    const go = (viewId, state = {}) => {
        const view = getView(viewId);

        if (!view) {
            console.warn(`La vista con ID "${viewId}" no está registrada. Navegando a inicio por defecto.`);
            navigate("/sistema");
            return;
        }
        
        if(view.permissions.length > 0){
            const tienePermiso = view.permissions.some(p => checkPermission(p.toUpperCase()));
            if(!tienePermiso){
                console.error("No tienen permisos para acceder a esta vista");
                return;
            }
        }

        const navigationState = { ...state };
        const effectivePaciente = navigationState?.paciente || navigationState?.selectedPaciente || selectedPaciente;

        if (viewId === "buscar-paciente-preclinica") {
            navigationState.modo = "preclinica";
        } else if (viewId === "buscar-paciente-consulta") {
            navigationState.modo = "consulta-medica";
        }

        if (view.requiresPaciente && !effectivePaciente) {
            if (viewId === "consulta-medica") {
                navigate("/sistema/buscar-paciente/consulta", { 
                    state: { ...navigationState, modo: "consulta-medica" } 
                });
            }
            else if (viewId === "preclinica") {
                navigate("/sistema/buscar-paciente/preclinica", { 
                    state: { ...navigationState, modo: "preclinica" } 
                });
            }
            else if (viewId === "formulario-agendar-cita") {
                navigate("/sistema/buscar-paciente/agendar", { 
                    state: { ...navigationState, modo: "agendar" } 
                });
            }
            else if (viewId === "formulario-registro-hoy") {
                navigate("/sistema/buscar-paciente/hoy", { 
                    state: { ...navigationState, modo: "hoy" } 
                });
            } 
            else {
                navigate("/sistema/buscar-paciente", { state: navigationState });
            }
            return;

        }

        navigate(`/sistema${view.path}`, { state: navigationState });
    };

    const goBack = (currentViewId) => {
        const currentView = getView(currentViewId);

        if (currentView && currentView.parent) {
            go(currentView.parent);
        } else {
            navigate("/sistema");
        }
    };

    return { go, goBack };
}