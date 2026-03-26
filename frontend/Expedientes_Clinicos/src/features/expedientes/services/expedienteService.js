import { expedienteAPI } from "@/services/api";

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

/**
 * Obtener expediente por ID de paciente
 * @param {string|number} idPaciente - ID del paciente
 * @returns {Promise<Object>} Datos del expediente
 */
export async function obtenerExpedientePorPaciente(idPaciente) {
  try {
    const response = await expedienteAPI.obtenerPorPaciente(idPaciente);
    if (response.success) {
      return response.data;
    }
    throw new Error(response.error);
  } catch (error) {
    console.error("Error al obtener expediente por paciente:", error);
    throw error;
  }
}