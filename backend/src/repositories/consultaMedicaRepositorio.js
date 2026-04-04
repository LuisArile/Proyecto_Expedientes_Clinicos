const prisma = require('../config/prisma');

class consultaMedicaRepository {
    
    async crear(data, tx = null) {
        const client = tx || prisma;
        try {
            return await client.consultaMedica.create({
                data: {
                    expedienteId: Number(data.expedienteId),
                    medicoId: Number(data.medicoId),
                    motivo: data.motivo,
                    diagnostico: JSON.stringify(data.diagnostico),
                    observaciones: data.observaciones,
                    tipoConsulta: data.tipoConsulta
                },
                include: {
                    medico: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true
                        }
                    },
                    expediente: {
                        include: {
                            paciente: true
                        }
                    }
                }
            });
        } catch (error) {
            throw new Error(`Error al crear consulta: ${error.message}`);
        }
    }

    async obtenerPorExpediente(expedienteId) {
        try {
            return await prisma.consultaMedica.findMany({
                where: { expedienteId: Number(expedienteId) },
                orderBy: { fechaConsulta: 'desc' },
                include: {
                    medico: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true
                        }
                    },
                    recetas: true,
                    examenes: {
                        include: {
                            examen: true
                        }
                    }
                }
            });
        } catch (error) {
            throw new Error(`Error al obtener consulta: ${error.message}`);
        }
    }

    async obtenerPorId(id) {
        try {
            return await prisma.consultaMedica.findUnique({
                where: { id: Number(id) },
                include: {
                    medico: true,
                    expediente: {
                        include: {
                            paciente: true
                        }
                    },
                    recetas: true,
                    examenes: {
                        include: {
                            examen: true
                        }
                    }
                }
            });
        } catch (error) {
            throw new Error(`Error al obtener consulta: ${error.message}`);
        }
    }

    async contarConsultasHoy(medicoId = null) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        return await prisma.consultaMedica.count({
            where: {
                fechaConsulta: { gte: hoy },
                ...(medicoId && { medicoId: Number(medicoId) })
            }
        });
    }

    async contarEvaluadosHoy() {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return await prisma.consultaMedica.count({
            where: { fechaRegistro: { gte: hoy } }
        });
    }

    async obtenerRecientesPorMedico(medicoId = null, limite = 10) {
        return await prisma.consultaMedica.findMany({
            where: medicoId ? { medicoId: Number(medicoId) } : {},
            take: limite,
            orderBy: { fechaConsulta: 'desc' },
            include: {
                expediente: { include: { paciente: true } }
            }
        });
    }
}

module.exports = consultaMedicaRepository;