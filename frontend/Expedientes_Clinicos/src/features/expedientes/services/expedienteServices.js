export async function guardarExpediente(datosPaciente) {
 
    return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Expediente guardado:", datosPaciente);
      resolve({ success: true, id: "EXP-2026-001" });
    }, 1000);
  });
}