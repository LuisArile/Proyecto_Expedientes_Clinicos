
import { citaAPI } from "@/shared/services/api";

// ========== TABLERO ==========
export const obtenerTablero = async () => {
  try {
    const response = await citaAPI.obtenerTablero();
    return response.data || {};
  } catch (error) {
    console.error("Error al obtener tablero:", error);
    return {};
  }
};

export const obtenerPacientesPorEstado = async (estado) => {
  try {
    const response = await citaAPI.obtenerPorEstado(estado);
    return response.data || [];
  } catch (error) {
    console.error(`Error al obtener pacientes en ${estado}:`, error);
    return [];
  }
};

export const obtenerSeguimiento = async (idCita) => {
  try {
    const response = await citaAPI.obtenerSeguimiento(idCita);
    return response.data || [];
  } catch (error) {
    console.error("Error al obtener seguimiento:", error);
    return [];
  }
};

// ========== RECEPCIONISTA ==========
export const agendarCita = async (data) => {
  try {
    const response = await citaAPI.agendar(data);
    return response.data;
  } catch (error) {
    console.error("Error al agendar cita:", error);
    throw error;
  }
};

export const registrarPacienteHoy = async (data) => {
  try {
    const response = await citaAPI.registrarHoy(data);
    return response.data;
  } catch (error) {
    console.error("Error al registrar paciente hoy:", error);
    throw error;
  }
};

export const enviarAEsperaPreclinica = async (idCita) => {
  try {
    const response = await citaAPI.enviarPreclinica(idCita);
    return response.data;
  } catch (error) {
    console.error("Error al enviar a preclínica:", error);
    throw error;
  }
};

// ========== ENFERMERO ==========
export const iniciarPreclinica = async (idCita) => {
  try {
    const response = await citaAPI.iniciarPreclinica(idCita);
    return response.data;
  } catch (error) {
    console.error("Error al iniciar preclínica:", error);
    throw error;
  }
};

export const finalizarPreclinica = async (idCita) => {
  try {
    const response = await citaAPI.finalizarPreclinica(idCita);
    return response.data;
  } catch (error) {
    console.error("Error al finalizar preclínica:", error);
    throw error;
  }
};

// ========== DOCTOR ==========
export const iniciarConsulta = async (idCita) => {
  try {
    const response = await citaAPI.iniciarConsulta(idCita);
    return response.data;
  } catch (error) {
    console.error("Error al iniciar consulta:", error);
    throw error;
  }
};

export const finalizarConsulta = async (idCita) => {
  try {
    const response = await citaAPI.finalizarConsulta(idCita);
    return response.data;
  } catch (error) {
    console.error("Error al finalizar consulta:", error);
    throw error;
  }
};