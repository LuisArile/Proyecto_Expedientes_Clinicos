import { useState, useEffect, useRef } from "react";
import { registrarConsultaMedica } from "../services/consultaService";
import { toast } from "sonner";

export const useConsultaMedica = (pacienteId, formMethods) => {

    const [guardando, setGuardando] = useState(false);
    const [modal, setModal] = useState({ open: false, result: { success: false, message: "" } });

    const { reset, watch } = formMethods;
    const formValues = watch();
    const STORAGE_KEY = pacienteId ? `borrador_consulta_${pacienteId}` : null;
    
    const isRestoring = useRef(false);
    const hasLoaded = useRef(false);

    useEffect(() => {
        if (!STORAGE_KEY || hasLoaded.current) return;

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            isRestoring.current = true;
            try {
                const timer = setTimeout(() => {
                    reset(JSON.parse(saved));
                    hasLoaded.current = true;
                    setTimeout(() => { isRestoring.current = false; }, 300);
                }, 50);
                return () => clearTimeout(timer);
            } catch (e) {
                console.error("Error al cargar borrador", e);
                isRestoring.current = false;
            }
        }
    }, [STORAGE_KEY, reset]);

    useEffect(() => {
        if (!STORAGE_KEY || isRestoring.current) return;

        const tieneContenido = formValues?.diagnostico?.trim() || 
                               (formValues?.medicamentos && formValues.medicamentos.length > 0);
                      
        if (!tieneContenido) return;

        const timeoutId = setTimeout(() => {
            if (!isRestoring.current) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [formValues, STORAGE_KEY]);
    
    const guardarConsulta = async (expedienteId, data) => {
        setGuardando(true);
        try {
            const response = await registrarConsultaMedica(expedienteId, data);
            
            if (response.success) {
                setModal({
                    open: true,
                    result: { 
                        success: true, 
                        message: "La consulta médica ha sido registrada correctamente en el expediente." 
                    }
                });
                
                localStorage.removeItem(STORAGE_KEY);
                toast.success("Consulta registrada exitosamente");
            } else {
                setModal({
                    open: true,
                    result: { 
                        success: false, 
                        message: response.message || "No se pudo completar el registro." 
                    }
                });
            }
        } catch {
            setModal({
                open: true,
                result: { 
                    success: false, 
                    message: "Hubo un problema de conexión con el servidor." 
                }
            });
            toast.error("Error al procesar el registro médico");
        } finally {
            setGuardando(false);
        }
    };

    return { guardarConsulta, guardando, modal, setModal };
};