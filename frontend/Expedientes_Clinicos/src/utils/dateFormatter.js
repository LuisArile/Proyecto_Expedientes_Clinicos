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
