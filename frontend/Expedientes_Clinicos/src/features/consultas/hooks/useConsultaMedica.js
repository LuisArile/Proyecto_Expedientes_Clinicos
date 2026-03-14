import { useState, useEffect } from "react";
import { registrarConsultaMedica } from "../services/consultaService";
import { toast } from "sonner";

export const useConsultaMedica = (pacienteId, formMethods, onSuccess) => {

    const [guardando, setGuardando] = useState(false);
    const STORAGE_KEY = `borrador_consulta_${ pacienteId }`;
    const { reset, watch } = formMethods;
    const formValues = watch();

    // Cargar borrador
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && reset) reset(JSON.parse(saved));
    }, [reset, STORAGE_KEY]);

    // Persistir borrador
    useEffect(() => {
        if (formValues?.diagnostico || formValues?.medicamentos?.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
        }
    }, [formValues, STORAGE_KEY]);   
    
    const guardarConsulta = async (expedienteId, data) => {
        
        setGuardando(true);
        try {
            const response = await registrarConsultaMedica(expedienteId, data);
            if (response.success) {
                toast.success("Consulta registrada exitosamente");
                localStorage.removeItem(STORAGE_KEY);
                if (onSuccess) onSuccess();
            }
        } catch (err) {
            toast.error("Error al procesar el registro médico");
            throw err;
        } finally {
            setGuardando(false);
        }
    };

    return { guardarConsulta, guardando };
};