import { ConsultaContext } from "./ConsultaContext";

export function ConsultaProvider({ children, pacienteEnAtencion, onSuccess }) {
    
    const value = {
        paciente: pacienteEnAtencion,
        onSuccess
    };

    return (
        <ConsultaContext.Provider value={value}>
            {children}
        </ConsultaContext.Provider>
    );
}