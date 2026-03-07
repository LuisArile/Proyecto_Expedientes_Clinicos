import { expedienteAPI } from "../../../services/api";

export async function obtenerEstadisticasRecepcionista() {
  try {
    // Obtener todos los expedientes del backend
    const response = await expedienteAPI.obtenerTodos();

    if (!response.success) {
      throw new Error(response.error);
    }

    const expedientes = response.data || [];

    // Obtener la fecha actual
    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // Filtrar expedientes creados hoy
    const expedientesHoy = expedientes.filter((exp) => {
      if (!exp.fechaCreacion) return false;
      const expDate = new Date(exp.fechaCreacion).toISOString().split("T")[0];
      return expDate === dateString;
    });

    // Estadísticas
    return {
      pacientesAtendidos: expedientes.length, // Todos los pacientes con expediente
      citasAgendadas: Math.floor(expedientes.length * 0.75), // Aproximación
      expedientesCreados: expedientesHoy.length, // Expedientes creados hoy
      horaInicio: "08:00 AM",
    };
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return {
      pacientesAtendidos: 0,
      citasAgendadas: 0,
      expedientesCreados: 0,
      horaInicio: "08:00 AM",
    };
  }
}

export async function obtenerNuevoRegistro() {
  try {
    // Obtener todos los expedientes del backend
    const response = await expedienteAPI.obtenerTodos();

    if (!response.success) {
      throw new Error(response.error);
    }

    const expedientes = response.data || [];

    // Ordenar por fecha de creación descendente y tomar los últimos 4
    const ultimosExpedientes = expedientes
      .sort((a, b) => new Date(b.fechaCreacion) - new Date(a.fechaCreacion))
      .slice(0, 4)
      .map((exp) => ({
        nombre: exp.paciente?.nombre || "Paciente desconocido",
        apellido: exp.paciente?.apellido || "",
        id: exp.id,
        hora: formatearHora(exp.fechaCreacion),
      }));

    return ultimosExpedientes;
  } catch (error) {
    console.error("Error al obtener registro:", error);
    return [];
  }
}

// Función auxiliar para formatear la hora
function formatearHora(fecha) {
  try {
    const date = new Date(fecha);
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "N/A";
  }
}

