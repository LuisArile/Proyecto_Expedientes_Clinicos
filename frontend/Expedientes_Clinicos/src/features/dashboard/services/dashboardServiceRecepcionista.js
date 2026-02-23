export function obtenerEstadisticasRecepcionista() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        pacientesAtendidos: 24,
        citasAgendadas: 18,
        expedientesCreados: 5,
        horaInicio: "08:00 AM",
      });
    }, 800);
  });
}

export function obtenerNuevoRegistro() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { nombre: "Carlos Rodríguez", hora: "14:30", id: "EXP-1739728450123" },
        { nombre: "Ana Martínez", hora: "13:15", id: "EXP-1739724850789" },
        { nombre: "Luis Fernández", hora: "11:45", id: "EXP-1739719050456" },        
        { nombre: "Ana López", hora: "11:00", tipo: "Seguimiento" },      ]);
    }, 800);
  });
}

