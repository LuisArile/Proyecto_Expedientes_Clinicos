import { auditoriaAPI } from "@/services/api";

export async function obtenerLogsAuditoria() {
  try {
    const response = await auditoriaAPI.obtenerTodos();
    if (response.success) return response.data;
    
    throw new Error(response.mensaje || "Error al obtener logs");
  } catch (error) {
    console.error("Error en servicio auditoria:", error);
    throw error;
  }
}

export async function obtenerEstadisticasAuditoria() {
  try {
    const response = await auditoriaAPI.obtenerEstadisticas();
    if (response.success) return response.data;
    
    throw new Error(response.mensaje || "Error al obtener estadísticas");
  } catch (error) {
    console.error("Error en servicio estadisticas:", error);
    throw error;
  }
}