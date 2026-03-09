export function obtenerEstadisticasDoctor() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        consultasRealizadas: 12,
        consultasPendientes: 6,
        examenesOrdenados: 8,
        horaInicio: "08:00 AM",
      });
    }, 800);
  });
}

export function obtenerProximaConsulta() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { nombre: "María García", hora: "09:30", tipo: "Control" },
        { nombre: "Juan Pérez", hora: "10:15", tipo: "Primera vez" },
        { nombre: "Ana López", hora: "11:00", tipo: "Seguimiento" },      ]);
    }, 800);
  });
}

