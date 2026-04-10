import { useCallback } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function useBuscarPacienteController({
    modo, 
    onVerExpediente = () => {}, 
    onConsultaMedica = () => {}, 
    onSeleccionar = () => {},
    onPreclinica = () => {}
}) {
    const { checkPermission } = useAuth();

    const handleSeleccionarPaciente = useCallback((p) => {
        if (modo === "agendar") {
            onSeleccionar(p, "formulario-agendar-cita");
        return;
        }

        if (modo === "hoy") {
            onSeleccionar(p, "formulario-registro-hoy");
        return;
        }

        if (modo === "consulta-medica") {
            onConsultaMedica(p);
            return;
        }

        if (modo === "preclinica") {
            onPreclinica(p);
            return;
        }

        if (modo === "gestion") {
            onVerExpediente(p);
            return;
        }

        onVerExpediente(p);
    }, [modo, onSeleccionar, onVerExpediente, onConsultaMedica, onPreclinica]);

    return { checkPermission, handleSeleccionarPaciente, modo, onVerExpediente, onConsultaMedica, onPreclinica };
}