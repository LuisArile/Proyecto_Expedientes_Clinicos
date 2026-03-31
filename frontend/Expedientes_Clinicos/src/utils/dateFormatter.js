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
 * formatearFechaParaInput("2000-05-15"); // "2000-05-15"
 * formatearFechaParaInput("2000-05-15T00:00:00.000Z"); // "2000-05-15"
 * formatearFechaParaInput(new Date(2000, 4, 15)); // "2000-05-15"
 * formatearFechaParaInput(""); // ""
 * formatearFechaParaInput("fecha inválida"); // ""
 */
export function formatearFechaParaInput(fecha) {
  if (!fecha) return "";
  
  const date = new Date(fecha);
  
  // Validar que sea una fecha válida
  if (isNaN(date.getTime())) return "";
  
  // Retornar en formato YYYY-MM-DD (requerido por input type="date")
  return date.toISOString().split('T')[0];
}
