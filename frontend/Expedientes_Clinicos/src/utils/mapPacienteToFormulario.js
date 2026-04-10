export const mapPacienteToFormulario = (p) => {
    const [nombre, ...resto] = p.nombre.split(" ");
    return {
        nombre,
        apellido: resto.join(" "),
        dni: p.identidad,
        expedientes: {
        idExpediente: p.id,
        numeroExpediente: p.id,
        },
    };
};