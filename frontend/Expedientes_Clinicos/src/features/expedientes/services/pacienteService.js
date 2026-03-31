// const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// export const expedienteService = {
//   async getExpedientePaciente(id) {
//     await delay(500);

//     return {
//       paciente: {
//         codigo: id,
//         nombre: "Juan Pérez",
//         identidad: "0801-1990-12345",
//         fechaNacimiento: "1990-01-10",
//         genero: "masculino",
//         direccion: "Tegucigalpa",
//         telefono: "9999-9999",
//         correo: "juan@mail.com",
//         estado: "activo",
//       },

//       registrosPreclinicos: [
//         {
//           id: "PRECL-001",
//           fecha: "2026-03-14",
//           enfermero: "Enfermero González",
//           presionArterial: "120/80",
//           temperatura: "36.5",
//           peso: "70.5",
//           frecuenciaCardiaca: "75",
//           frecuenciaRespiratoria: "16",
//           saturacionOxigeno: "98",
//           observaciones: "Paciente en condiciones estables",
//         },
//       ],

//       consultas: [
//         {
//           id: "CONS-001",
//           fecha: "2026-03-14",
//           medico: "Dr. Carlos Rodríguez",
//           tipoDiagnostico: "definitivo",
//           diagnostico: "Infección respiratoria",
//           observaciones: "Tratamiento indicado",
//           receta: {
//             medicamentos: [
//               { nombre: "Amoxicilina", dosis: "500mg", frecuencia: "8h", duracion: "7 días" },
//             ],
//           },
//           examen: {
//             examenesSolicitados: [
//               {
//                 nombre: "Hemograma completo",
//                 descripcion: "Evaluar glóbulos rojos y blancos",
//                 estado: "pendiente",
//               },
//               {
//                 nombre: "Radiografía de tórax",
//                 descripcion: "Descartar complicaciones pulmonares",
//                 estado: "pendiente",
//               }
//             ]
//           }
//         },
//       ],

//       documentos: [
//         {
//           id: "DOC-001",
//           nombre: "Análisis de sangre",
//           tipo: "PDF",
//           fecha: "2026-03-12",
//           subidoPor: "Dr. Carlos Rodríguez",
//           tamano: "2MB",
//         },
//       ],
//     };
//   },
// };