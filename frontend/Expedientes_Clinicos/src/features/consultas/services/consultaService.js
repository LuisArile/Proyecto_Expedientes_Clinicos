import { consultaMedicaAPI } from "@/services/api";

export async function registrarConsultaMedica(idExpediente, datos) {
    try {
        const datosFormateados = {
            motivo: datos.motivo || "Consulta General",
            diagnostico: {
                id: `DIAG-${Date.now()}`,
                descripcion: datos.diagnostico || "",
                tipo: (datos.tipoDiagnostico|| "PRESUNTIVO").toUpperCase()
            },
            observaciones: datos.observacionesClinicas || "",
            
            recetas: (datos.medicamentos || []).map(med => ({
                medicamento: med.nombre,
                dosis: med.dosis,
                duracion: med.duracion,
                indicaciones: med.frecuencia || ""
            }))
        };

        return await consultaMedicaAPI.registrar(idExpediente, datosFormateados);
    } catch (error) {
        console.error("Error en service de consulta:", error);
        throw error;
    }
}

export async function obtenerHistorialConsultas(expedienteId) {
    try {
        const response = await consultaMedicaAPI.obtenerPorExpediente(expedienteId);
        return response.success ? response.data : [];
    } catch (error) {
        console.error("Error al obtener historial:", error);
        throw error;
    }
}