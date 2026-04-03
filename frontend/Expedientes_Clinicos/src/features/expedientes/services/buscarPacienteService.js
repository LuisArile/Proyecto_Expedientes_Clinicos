import { buscarAPI } from "@/shared/services/api";

/**
 * Buscar pacientes/expedientes por término de búsqueda
 * @param {string} termino - Término de búsqueda (nombre, DNI, Apellido)
 * @returns {Promise<Array>} Lista de resultados que coinciden con el término
 */
export async function buscarPacientes(termino, criterio = "nombre", pagina = 1) {
  try {
    const response = await buscarAPI.buscar({ termino, criterio, pagina });
    
    if (response.success) { 
        return {
            resultados: response.data.resultados || [],
            paginacion: response.paginacion || { totalPaginas: 1, total: 0 }
        };
    }
    throw new Error(response.error || "Error al buscar");
  } catch (error) {
    console.error("Error en búsqueda de paciente:", error);
    throw error;
  }
}

export async function validarIdentidadDuplicada(numeroIdentidad) {
  if (!numeroIdentidad) return false;
  try {
    const response = await buscarPacientes(numeroIdentidad, "identidad", 1);
    return response.resultados.length > 0;
  } catch (error) {
    console.error("Error al validar identidad:", error);
    return false;
  }
}