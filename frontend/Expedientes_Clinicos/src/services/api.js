const API_BASE_URL = "http://localhost:3000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = getHeaders();

  try {
    const response = await fetch(url, {
      headers,
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error en la solicitud");
    }

    return data;
  } catch (error) {
    console.error("Error API:", error);
    throw error;
  }
};

/**
 * Métodos para consumir endpoints de expedientes
 */
export const expedienteAPI = {
  // Crear expediente con paciente
  crearConPaciente: (pacienteData, expedienteData) =>
    apiCall("/expedientes", {
      method: "POST",
      body: JSON.stringify({
        paciente: pacienteData,
        expediente: expedienteData,
      }),
    }),

  // Obtener todos los expedientes
  obtenerTodos: () =>
    apiCall("/expedientes", {
      method: "GET",
    }),

  // Obtener expediente por ID
  obtenerPorId: (idExpediente) =>
    apiCall(`/expedientes/${idExpediente}`, {
      method: "GET",
    }),

  // Obtener expediente de un paciente
  obtenerPorPaciente: (idPaciente) =>
    apiCall(`/expedientes/paciente/${idPaciente}`, {
      method: "GET",
    }),

  // Actualizar expediente
  actualizar: (idExpediente, datos) =>
    apiCall(`/expedientes/${idExpediente}`, {
      method: "PUT",
      body: JSON.stringify(datos),
    }),

  // Eliminar expediente
  eliminar: (idExpediente) =>
    apiCall(`/expedientes/${idExpediente}`, {
      method: "DELETE",
    }),
  
  buscar: (termino, pagina = 1, filtro = "") =>
    apiCall(`/expedientes/buscar?q=${encodeURIComponent(termino)}&page=${pagina}&filter=${filtro}`, {
      method: "GET",
    }),
};
