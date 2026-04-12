import { ConsultaContext } from "./ConsultaContext";

export function ConsultaProvider({ children, pacienteEnAtencion, onSuccess, consultaId = null }) {
    
    const value = {
        pacienteEnAtencion,
        onSuccess,
        consultaId
    };

    return (
        <ConsultaContext.Provider value={value}>
            {children}
        </ConsultaContext.Provider>
    );
}