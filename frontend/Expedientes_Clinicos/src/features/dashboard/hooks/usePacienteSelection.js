import { useState, useEffect } from "react";

export function usePacienteSelection() {
    const [selectedPaciente, setSelectedPaciente] = useState(() => {
        try {
            const saved = localStorage.getItem("sgec_selected_paciente");
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.error("Error al leer el paciente seleccionado: ", error);
            localStorage.removeItem("sgec_selected_paciente");
            return null;
        }
    });

    useEffect(() => {
        if (selectedPaciente) {
        try {
            localStorage.setItem(
                "sgec_selected_paciente",
                JSON.stringify(selectedPaciente)
            );
        } catch (error) {
            console.error("Error al guardar la paciente seleccionada: ", error);
        }
        } else {
            localStorage.removeItem("sgec_selected_paciente");
        }
    }, [selectedPaciente]);

    return { selectedPaciente, setSelectedPaciente };
}