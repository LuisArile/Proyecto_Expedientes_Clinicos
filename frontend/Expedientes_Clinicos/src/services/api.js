const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL no está definida");
}

const API_BASE_URL = `${API_URL}/api`;

const getHeaders = () => {
  const token = sessionStorage.getItem("token");
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

    const contentType = response.headers.get("content-type");
      let data;
    
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        throw new Error(`Error del servidor (${response.status})`);
      }

    if (!response.ok) throw new Error(data.error || "Error en la solicitud");
    return data;
  } catch (error) {
    console.error("Error API:", error);
    throw error;
  }
};

{/* API de autenticación */}
export const authAPI = {
  login: (nombreUsuario, clave) => 
    apiCall("/login", { method: "POST", body: JSON.stringify({ nombreUsuario, clave }) }),
  logout: () => apiCall("/logout", { method: "POST" }),
};

{/* API de seguridad (cambio de contraseña) */}
export const seguridadAPI = {
  cambiarPassword: (userId, currentPassword, newPassword) =>
    apiCall("/usuarios/change-password", {
      method: "PUT",
      body: JSON.stringify({ userId, currentPassword, newPassword }),
    }),
};

/**
 * Métodos para consumir endpoints de expedientes
 */
export const expedienteAPI = {
  crearConPaciente: (pacienteData, expedienteData) =>
    apiCall("/expedientes", {
      method: "POST",
      body: JSON.stringify({ paciente: pacienteData, expediente: expedienteData }),
  }),
  obtenerTodos: () => apiCall("/expedientes", { method: "GET" }),
  obtenerPorId: (idExpediente) => apiCall(`/expedientes/${idExpediente}`, {method: "GET" }),
  obtenerPorPaciente: (idPaciente) => apiCall(`/expedientes/paciente/${idPaciente}`, { method: "GET" }),
  actualizar: (idExpediente, datos) =>
    apiCall(`/expedientes/${idExpediente}`, { method: "PUT", body: JSON.stringify(datos) }),
  eliminar: (idExpediente) => apiCall(`/expedientes/${idExpediente}`, { method: "DELETE"}),
};

export const buscarAPI = {
  buscar: ({ termino, criterio = "nombre", pagina = 1, limite = 10 }) =>
    apiCall(`/busqueda?q=${encodeURIComponent(termino)}&pagina=${pagina}&limite=${limite}&criterio=${criterio}`, {
      method: "GET",
    }),
}
/**
 * Métodos para consumir endpoints de roles
 */
export const rolAPI = {
  obtenerTodos: () => apiCall("/roles", { method: "GET" }),
  obtenerPorId: (idRol) => apiCall(`/roles/${idRol}`, { method: "GET" }),
  crear: (data) => apiCall("/roles", { method: "POST", body: JSON.stringify(data) }),
  actualizar: (idRol, data) => apiCall(`/roles/${idRol}`, { method: "PUT", body: JSON.stringify(data) }),
  eliminar: (idRol) => apiCall(`/roles/${idRol}`, { method: "DELETE" }),
  obtenerPermisos: (idRol) => apiCall(`/roles/${idRol}/permisos`, { method: "GET" }),
  asignarPermisos: (idRol, permisos) => apiCall(`/roles/${idRol}/permisos`, { method: "PUT", body: JSON.stringify({ permisos }) }),
};

/**
 * Métodos para consumir endpoints de permisos
 */
export const permisoAPI = {
  obtenerTodos: () => apiCall("/permisos", { method: "GET" }),
  crear: (data) => apiCall("/permisos", { method: "POST", body: JSON.stringify(data) }),
  actualizar: (idPermiso, data) => apiCall(`/permisos/${idPermiso}`, { method: "PUT", body: JSON.stringify(data) }),
  eliminar: (idPermiso) => apiCall(`/permisos/${idPermiso}`, { method: "DELETE" }),
};

/**
 * Métodos para consumir endpoints de estadísticas/dashboard
 */
export const estadisticasAPI = {
  obtenerResumen: () => apiCall("/estadisticas/resumen", { method: "GET" }),
};

/**
 * Métodos para consumir endpoints de registro preclínico
 */
export const registroPreclinicoAPI = {
  registrar: (expedienteId, datos) =>
    apiCall(`/registroPreclinico/expediente/${expedienteId}`, {
      method: "POST",
      body: JSON.stringify(datos),
    }),
  obtenerPorExpediente: (expedienteId) => apiCall(`/registroPreclinico/expediente/${expedienteId}`, { method: "GET" }),
  obtenerUltimo: (expedienteId) => apiCall(`/registroPreclinico/expediente/${expedienteId}/ultimo`, { method: "GET" }),
  obtenerTodos: () => apiCall("/registroPreclinico/todos", { method: "GET" }),
  obtenerConteo: () => apiCall("/registroPreclinico/conteo", { method: "GET" }),
};

export const consultaMedicaAPI = {
  registrar: (expedienteId, datos) =>
    apiCall(`/consultaMedica/expediente/${expedienteId}`, {
      method: "POST",
      body: JSON.stringify(datos),
    }),

  obtenerPorExpediente: (expedienteId) =>
    apiCall(`/consultaMedica/expediente/${expedienteId}`, { method: "GET" }),

  obtenerPorId: (id) =>
    apiCall(`/consultaMedica/${id}`, { method: "GET" })
}