const prisma = require('../config/prisma');

/**
 * @typedef {Object} RegistroPreclinicoData
 * @property {number} expedienteId
 * @property {number} enfermeroId
 * @property {string} [presionArterial]
 * @property {number} [temperatura]
 * @property {number} [peso]
 * @property {number} [talla]
 * @property {number} [frecuenciaCardiaca]
 * @property {string} [observaciones]
 */

class registroPreclinicoRepository {
    
    /**
     * Crea un nuevo registro preclínico.
     * @param {RegistroPreclinicoData} data - Objeto con los datos.
     * @param {Object} [tx] - Cliente de transacción de Prisma.
     * @returns {Promise<Object>} El registro creado.
     */
    async crear(data, tx = null) {
        const client = tx || prisma;
        try {
            const resultado = await client.registroPreclinico.create({
                data: {
                    expedienteId: Number(data.expedienteId),
                    enfermeroId: Number(data.enfermeroId),
                    presionArterial: data.presionArterial || null,
                    temperatura: data.temperatura ? parseFloat(data.temperatura) : null,
                    peso: data.peso ? parseFloat(data.peso) : null,
                    talla: data.talla ? parseInt(data.talla) : null,
                    frecuenciaCardiaca: data.frecuenciaCardiaca ? parseInt(data.frecuenciaCardiaca) : null,
                    observaciones: data.observaciones || null,
                    fechaRegistro: new Date()
                },
                include: {
                    expediente: {
                        include: {
                            paciente: true
                        }
                    },
                    enfermero: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true
                        }
                    }
                }
            });
            return resultado;
        } catch (error) {
            throw new Error(`Error al crear registro preclínico: ${error.message}`);
        }
    }

    /**
     * Obtiene todos los registros de un expediente.
     * @param {number} expedienteId - ID del expediente.
     * @returns {Promise<Array<Object>>} Lista de registros.
     */
    async obtenerPorExpediente(expedienteId) {
        try {
            const resultados = await prisma.registroPreclinico.findMany({
                where: { expedienteId: Number(expedienteId) },
                orderBy: { fechaRegistro: 'desc' },
                include: {
                    enfermero: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true
                        }
                    }
                }
            });
            return resultados;
        } catch (error) {
            throw new Error(`Error al obtener registros: ${error.message}`);
        }
    }

    /**
     * Obtiene un registro por su ID.
     * @param {number} id - ID del registro.
     * @returns {Promise<Object|null>} El registro encontrado.
     */
    async obtenerPorId(id) {
        try {
            const data = await prisma.registroPreclinico.findUnique({
                where: { id: Number(id) },
                include: {
                    expediente: {
                        include: {
                            paciente: true
                        }
                    },
                    enfermero: true
                }
            });
            return data;
        } catch (error) {
            throw new Error(`Error al buscar registro: ${error.message}`);
        }
    }

    /**
     * Obtiene el último registro de un expediente.
     * @param {number} expedienteId - ID del expediente.
     * @returns {Promise<Object|null>} Último registro.
     */
    async obtenerUltimoPorExpediente(expedienteId) {
        try {
            const data = await prisma.registroPreclinico.findFirst({
                where: { expedienteId: Number(expedienteId) },
                orderBy: { fechaRegistro: 'desc' }
            });
            return data;
        } catch (error) {
            throw new Error(`Error al obtener último registro: ${error.message}`);
        }
    }

    /**
     * Obtiene todos los registros preclínicos.
     * @returns {Promise<Array<Object>>} Lista de registros.
     */
    async obtenerTodos() {
        try {
            const resultados = await prisma.registroPreclinico.findMany({
                orderBy: { fechaRegistro: 'desc' },
                include: {
                    expediente: {
                        include: {
                            paciente: true
                        }
                    },
                    enfermero: {
                        select: {
                            id: true,
                            nombre: true,
                            apellido: true
                        }
                    }
                }
            });
            return resultados;
        } catch (error) {
            throw new Error(`Error al obtener todos los registros: ${error.message}`);
        }
    }

    /**
     * Cuenta el total de registros preclínicos.
     * @returns {Promise<number>} Total de registros.
     */
    async contarTodos() {
        try {
            return await prisma.registroPreclinico.count();
        } catch (error) {
            throw new Error(`Error al contar registros: ${error.message}`);
        }
    }

    async contarEvaluadosHoy(enfermeroId) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return await prisma.registroPreclinico.count({
            where: {
                fechaRegistro: { gte: hoy },
                ...(enfermeroId && { enfermeroId: Number(enfermeroId) })
            }
        });
    }

    async obtenerRecientes(enfermeroId = null, limite = 10) {
        return await prisma.registroPreclinico.findMany({
            where: enfermeroId ? { enfermeroId: Number(enfermeroId) } : {},
            take: limite,
            orderBy: { fechaRegistro: 'desc' },
            include: { expediente: { include: { paciente: true } } }
        });
    }    
}

module.exports = registroPreclinicoRepository;
