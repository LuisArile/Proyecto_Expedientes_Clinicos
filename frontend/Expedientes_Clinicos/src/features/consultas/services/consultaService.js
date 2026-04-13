import { consultaMedicaAPI, examenAPI, medicamentoAPI } from "@/shared/services/api";

//  REGISTRAR CONSULTA
export async function registrarConsultaMedica(idExpediente, datos) {
    try {
        const datosFormateados = {
            motivo: datos.motivo || "Consulta General",

            diagnostico: {
                id: `DIAG-${Date.now()}`,
                descripcion: datos.diagnostico || "",
                tipo: (datos.tipoDiagnostico || "PRESUNTIVO").toUpperCase()
            },

            observaciones: datos.observacionesClinicas || "",
            
            recetas: (datos.medicamentos || []).map(med => ({
                medicamentoId: med.medicamentoId,
                dosis: med.dosis,
                duracion: med.duracion,
                indicaciones: med.frecuencia || ""
            })),

            //  EXÁMENES 
            examenes: (datos.examenes || [])
                .filter(e => e.examenId)
                .map(e => ({
                    examenId: e.examenId,
                    prioridad: (e.prioridad || "MEDIA").toUpperCase()
            }))
        };

        return await consultaMedicaAPI.registrar(idExpediente, datosFormateados);

    } catch (error) {
        console.error("Error en service de consulta:", error);
        throw error;
    }
}

// EXÁMENES ACTIVOS 
export async function obtenerExamenesActivos() {
    try {
        const response = await examenAPI.obtenerActivos();

        return response.success ? response.data : [];

    } catch (error) {
        console.error("Error obteniendo exámenes:", error);
        throw error;
    }
}

// MEDICAMENTOS ACTIVOS
export async function obtenerMedicamentosActivos() {
    try {
        const response = await medicamentoAPI.obtenerActivos();

        return response.success ? response.data : [];

    } catch (error) {
        console.error("Error obteniendo medicamentos:", error);
        throw error;
    }
}

//  HISTORIAL
export async function obtenerHistorialConsultas(expedienteId) {
    try {
        const response = await consultaMedicaAPI.obtenerPorExpediente(expedienteId);
        return response.success ? response.data : [];
    } catch (error) {
        console.error("Error al obtener historial:", error);
        throw error;
    }
}

// OBTENER CONSULTA POR ID
export async function obtenerConsultaPorId(consultaId) {
    try {
        const response = await consultaMedicaAPI.obtenerPorId(consultaId);
        return response.success ? response.data : null;
    } catch (error) {
        console.error("Error al obtener consulta:", error);
        throw error;
    }
}