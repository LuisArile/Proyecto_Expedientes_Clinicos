import { PreclinicaContext } from "./PreclinicaContext";

export function PreclinicaProvider({ children, paciente, onSuccess, setPacienteEnAtencion, setSelectedPaciente }) {
    
    const value = { 
        paciente, 
        onSuccess,
        setPacienteEnAtencion,
        setSelectedPaciente 
    };
    
    return (
        <PreclinicaContext.Provider value={value}>
            {children}
        </PreclinicaContext.Provider>
    );
}