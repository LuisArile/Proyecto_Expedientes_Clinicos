import { useState, useEffect } from "react";
import { ExpedienteContext } from "./ExpedienteContext";

export function ExpedienteProvider({
    children,
    paciente: pacienteInicial,
    onSuccess,
    onEditarExpediente
}) {
    const [paciente, setPaciente] = useState(pacienteInicial);
    
    useEffect(() => {
        setPaciente(pacienteInicial);
    }, [pacienteInicial]);

    const value = {
        paciente,
        setPaciente,
        onSuccess,
        onEditarExpediente
    };

    return (
        <ExpedienteContext.Provider value={value}>
            {children}
        </ExpedienteContext.Provider>
    );
}