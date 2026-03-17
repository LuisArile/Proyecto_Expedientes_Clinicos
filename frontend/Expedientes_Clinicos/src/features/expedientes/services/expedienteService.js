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
 * Buscar pacientes/expedientes por término de búsqueda
 * @param {string} termino - Término de búsqueda (nombre, DNI, Apellido)
 * @returns {Promise<Array>} Lista de resultados que coinciden con el término
 */
// expedienteService.js
export async function buscarPacientes(termino, criterio = "nombre", pagina = 1) {
  try {
    const response = await expedienteAPI.buscar({ termino, criterio, pagina });
    
    if (response.success) return response.data;
    throw new Error(response.error || "Error al buscar");
  } catch(error) {
    console.error("Error en búsqueda de paciente:", error);
    throw error;
  }
}

/**
 * Validar si un número de identidad ya existe
 * @param {string} numeroIdentidad - Número de identidad del paciente
 * @returns {Promise<boolean>} true si existe, false si no
 */
export async function validarIdentidadDuplicada(numeroIdentidad) {
  try {
    const resultados = await buscarPacientes(numeroIdentidad);
    // const expedientes = await obtenerExpedientes();
    // return resultados.some(exp => exp.paciente?.dni === numeroIdentidad);
    return resultados.some(exp => exp.dni === numeroIdentidad);
  } catch (error) {
    console.error("Error al validar identidad:", error);
    return false;
  }
}
