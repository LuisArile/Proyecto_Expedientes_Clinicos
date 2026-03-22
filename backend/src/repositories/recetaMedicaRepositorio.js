const prisma = require('../config/prisma');

class recetaMedicaRepository {

    async crear(data, tx = null) {
        const client = tx || prisma;
        try {
            return await client.recetaMedica.create({
                data: {
                    consultaId: Number(data.consultaId),
                    medicamento: data.medicamento,
                    dosis: data.dosis,
                    duracion: data.duracion,
                    indicaciones: data.indicaciones
                }
            });
        } catch (error) {
            throw new Error(`Error al crear receta: ${error.message}`);
        }
    }

    async crearMultiples(consultaId, recetas, tx = null) {
        const client = tx || prisma;
        try {
            const data = recetas.map(receta => ({
                consultaId: Number(consultaId),
                ...receta
            }));

            return await client.recetaMedica.createMany({
                data
            });
        } catch (error) {
            throw new Error(`Error al crear recetas: ${error.message}`);
        }
    }

    async contarRecetasHoy(medicoId = null) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        return await prisma.recetaMedica.count({
            where: {
                consulta: {
                    fechaConsulta: { gte: hoy },
                    ...(medicoId && { medicoId: Number(medicoId) })
                }
            }
        });
    }
}

module.exports = recetaMedicaRepository;