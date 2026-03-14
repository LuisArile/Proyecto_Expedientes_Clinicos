import { registroPreclinicoAPI } from "@/services/api";

export async function registrarPreclinico(expedienteId, datos) {
  try {
    const response = await registroPreclinicoAPI.registrar(expedienteId, datos);
    return response;
  } catch (error) {
    console.error("Error al registrar preclínico:", error);
    throw error;
  }
}

export async function obtenerRegistrosPorExpediente(expedienteId) {
  try {
    const response = await registroPreclinicoAPI.obtenerPorExpediente(expedienteId);
    if (response.success) return response.data;
    throw new Error(response.error);
  } catch (error) {
    console.error("Error al obtener registros:", error);
    throw error;
  }
}

export async function obtenerTodosRegistros() {
  try {
    const response = await registroPreclinicoAPI.obtenerTodos();
    if (response.success) return response.data;
    throw new Error(response.error);
  } catch (error) {
    console.error("Error al obtener todos los registros:", error);
    throw error;
  }
}

export async function obtenerConteoRegistros() {
  try {
    const response = await registroPreclinicoAPI.obtenerConteo();
    if (response.success) return response.data.total;
    throw new Error(response.error);
  } catch (error) {
    console.error("Error al obtener conteo:", error);
    throw error;
  }
}
