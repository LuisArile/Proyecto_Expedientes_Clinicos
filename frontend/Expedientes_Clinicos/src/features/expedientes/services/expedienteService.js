import { expedienteAPI, registroPreclinicoAPI, consultaMedicaAPI } from "@/shared/services/api";

/**
 * Crear un nuevo expediente con datos del paciente
 * @param {Object} pacienteData - Datos del paciente
 * @param {Object} expedienteData - Datos del expediente
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function crearExpediente(pacienteData, expedienteData) {
  try {
    const response = await expedienteAPI.crearConPaciente(pacienteData, expedienteData);
    return response;
  } catch (error) {
    console.error("Error al crear expediente:", error);
    throw error;
  }
}

/**
 * Obtener todos los expedientes
 * @returns {Promise<Array>} Lista de expedientes
 */
export async function obtenerExpedientes() {
  try {
    const response = await expedienteAPI.obtenerTodos();
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error);
  } catch (error) {
    console.error("Error al obtener expedientes:", error);
    throw error;
  }
}

/**
 * Obtener expediente por ID
 * @param {string} idExpediente - ID del expediente
 * @returns {Promise<Object>} Datos del expediente
 */
export async function obtenerExpediente(idExpediente) {
  try {
    const response = await expedienteAPI.obtenerPorId(idExpediente);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error);
  } catch (error) {
    console.error("Error al obtener expediente:", error);
    throw error;
  }
}

/**
 * Actualizar expediente
 * @param {string} idExpediente - ID del expediente
 * @param {Object} datos - Datos a actualizar
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function actualizarExpediente(idExpediente, datos) {
  try {
    const response = await expedienteAPI.actualizar(idExpediente, datos);
    return response;
  } catch (error) {
    console.error("Error al actualizar expediente:", error);
    throw error;
  }
}

/**
 * Eliminar expediente
 * @param {string} idExpediente - ID del expediente
 * @returns {Promise<Object>} Respuesta del servidor
 */
export async function eliminarExpediente(idExpediente) {
  try {
    const response = await expedienteAPI.eliminar(idExpediente);
    return response;
  } catch (error) {
    console.error("Error al eliminar expediente:", error);
    throw error;
  }
}

export async function obtenerExpedienteCompleto(idExpediente) {
  try {
    const [
      expedienteRes,
      preclinicosRes,
      consultasRes
    ] = await Promise.all([
      expedienteAPI.obtenerPorId(idExpediente).catch(err => {
        console.error("Error crítico: No se pudo obtener el expediente", err);
        return { error: true, data: null };
      }),
      registroPreclinicoAPI.obtenerPorExpediente(idExpediente).catch(err => {
        console.warn("No se pudo obtener preclínica (posible falta de permisos)", err);
        return { success: false, data: [] };
      }),
      consultaMedicaAPI.obtenerPorExpediente(idExpediente).catch(err => {
        console.warn("Consultas bloqueadas o no encontradas", err);
        return { success: false, data: [] };
      }),
    ]);

    if (expedienteRes.error || !expedienteRes.data) {
      throw new Error("Acceso denegado al expediente principal o el expediente no existe.");
    }

    return {
      paciente: expedienteRes.data?.paciente || {},
      registrosPreclinicos: preclinicosRes.data || [],
      consultasMedicas: (consultasRes.data || []).map(c => ({ ...c })),
      documentos: expedienteRes.data?.documentos || []
    };
  } catch (error) {
    console.error("Error fatal obteniendo expediente completo:", error);
    throw error;
  }
}