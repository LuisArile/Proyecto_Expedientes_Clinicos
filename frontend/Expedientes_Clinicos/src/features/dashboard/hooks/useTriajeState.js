import { useState, useEffect } from "react";

export function useTriajeState() {
    const [pacienteEnAtencion, setPacienteEnAtencion] = useState(() => {
        try {
            const saved = localStorage.getItem("sgec_paciente_en_atencion");
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error("Error al leer paciente en atencion:", error);
            return null;
        }
    });

    useEffect(() => {
        if (pacienteEnAtencion) {
        try {
            localStorage.setItem(
                "sgec_paciente_en_atencion",
                JSON.stringify(pacienteEnAtencion)
            );
        } catch (error) {
            console.error("Error al guardar paciente en atencion:", error);
        }
        } else {
            localStorage.removeItem("sgec_paciente_en_atencion");
        }
    }, [pacienteEnAtencion]);

    return { pacienteEnAtencion, setPacienteEnAtencion };
}