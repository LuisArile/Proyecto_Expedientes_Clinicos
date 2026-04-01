/**
 * Obtiene la fecha actual del sistema formateada en español
 * @returns {string} Fecha formateada como "Día, Fecha de Mes Año"
 * @example
 * obtenerFechaActual(); // "Viernes, 28 de Febrero 2026"
 */
export function obtenerFechaActual() {
  const hoy = new Date();
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  const diaSemana = dias[hoy.getDay()];
  const dia = hoy.getDate();
  const mes = meses[hoy.getMonth()];
  const anio = hoy.getFullYear();
  
  return `${diaSemana}, ${dia} de ${mes} ${anio}`;
}

/**
 * Convierte una fecha a formato YYYY-MM-DD para input type="date"
 * @param {string|Date} fecha - Fecha en cualquier formato válido de JavaScript
 * @returns {string} Fecha formateada como YYYY-MM-DD o string vacío si es inválida
 * @example
 * formatearFecha("2026-02-28T00:00:00Z"); // "2026-02-28"
 */
export function formatearFecha(fecha) {
  if (!fecha) return "";
  
  const date = new Date(fecha);
  
  // Validar que sea una fecha válida
  if (isNaN(date.getTime())) return "";
  
  // Retornar en formato YYYY-MM-DD (requerido por input type="date")
  return date.toISOString().split('T')[0];
}

/**
 * Formatea fecha con hora en español (es-HN)
 * @param {string|Date} fechaRaw
 * @returns {string}
 * @example
 * formatearFechaHora("2026-02-28T14:30:00Z")
 * // "28/02/2026 2:30 p. m."
 */
export function formatearFechaHora(fechaRaw) {
  const fecha = fechaRaw ? new Date(fechaRaw) : null;

  if (!fecha || isNaN(fecha)) return "Fecha no disponible";

  return new Intl.DateTimeFormat("es-HN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(fecha).replace(",", "");
}