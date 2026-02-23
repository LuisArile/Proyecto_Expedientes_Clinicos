export function obtenerEstadisticasAdmin() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        usuariosActivos: 45,
        eventosHoy: 152,
        medicamentos: 234,
        tiposExamen: 67,
      });
    }, 800);
  });
}

export function obtenerActividadReciente() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { usuario: "Dr. Juan Pérez", accion: "Creó consulta médica", hora: "14:45" },
        { usuario: "María González", accion: "Actualizó expediente", hora: "14:30" },
        { usuario: "Carlos Ramírez", accion: "Registró signos vitales", hora: "14:15" },
      ]);
    }, 800);
  });
}