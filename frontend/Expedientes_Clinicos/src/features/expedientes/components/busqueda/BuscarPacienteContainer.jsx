import { BuscarPaciente } from "./BuscarPaciente";
import { useLocation } from "react-router-dom";
import { useBuscarPacienteController } from "../../hooks/useBuscarPacienteController";
import { useSafeNavigation } from "@/features/dashboard/hooks/useSafeNavigation";
import { viewRegistry } from "../../../../shared/services/ViewRegistry";

export function BuscarPacienteContainer({ 
    onSeleccionarPaciente = () => {}, 
    modo: modoProp,
    controller: dashboardController
}) {
    const { go } = useSafeNavigation();
    const location = useLocation();
    
    const views = viewRegistry.getAllViews();

    const cleanPath = location.pathname.replace("/sistema", "");
    const currentView = views.find(v => v.path === cleanPath);
    const modo = modoProp || location.state?.modo || dashboardController?.modo || currentView?.metadata?.modo;
    console.log("Detección de modo:", { path: cleanPath, modo });
    
    const configControlador = {
        modo,
        onVerExpediente: (p) => {
            onSeleccionarPaciente(p);
            go("gestion-pacientes", { paciente: p });
        },
        onConsultaMedica: (p) => {
            onSeleccionarPaciente(p);
            go("consulta-medica", { paciente: p });
        },
        onPreclinica: (p) => {
            onSeleccionarPaciente(p);
            go("preclinica", { paciente: p });
        },
        onSeleccionar: (p, destino) => {
            onSeleccionarPaciente(p);
            go(destino, { paciente: p });
        },
        ...dashboardController 
    };

    const controller = useBuscarPacienteController(configControlador);

    return (
        <BuscarPaciente
            controller={controller}
            onVolver={() => go("inicio")}
        />
    );
}