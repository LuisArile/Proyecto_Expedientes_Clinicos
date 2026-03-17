const prisma = require('../config/prisma');

/**
 * @typedef {Object} PacienteData
 */

class pacienteRepository {
    
    /**
     * Crea un nuevo registro de paciente.
     * @param {PacienteData} data - Objeto con la información del paciente.
     * @param {Object} [tx] - Cliente de transacción de Prisma.
     * @returns {Promise<Object>} El registro del paciente creado.
     */
    async crear(data, tx = null) {
        const client = tx || prisma;
        try {
            const resultado = await client.paciente.create({
                data: {
                    dni: data.dni,
                    nombre: data.nombre,
                    apellido: data.apellido,
                    correo: data.correo || null,
                    telefono: data.telefono || null,
                    fechaNacimiento: new Date(data.fechaNacimiento),
                    sexo: data.sexo || null,
                    direccion: data.direccion || null
                }
            });
            return resultado;
        } catch (error) {
            throw new Error(`Error al crear paciente: ${error.message}`);
        }
    }

    /**
     * Recupera todos los pacientes registrados, incluyendo sus expedientes asociados.
     * @returns {Promise<Array<Object>>} Lista de todos los pacientes.
     */
    async obtenerTodos() {
        try {
            const resultados = await prisma.paciente.findMany({
                include: { expedientes: true }
            });
            return resultados;
        } catch (error) {
            throw new Error(`Error al obtener pacientes: ${error.message}`);
        }
    }

    /**
     * Busca un paciente específico por su ID único.
     * @param {number} idPaciente - El ID numérico del paciente.
     * @returns {Promise<Object|null>} El objeto del paciente o null si no se encuentra.
     */
    async obtenerPorId(idPaciente) {
        try {
            const data = await prisma.paciente.findUnique({
                where: { idPaciente: Number(idPaciente) },
                include: { expedientes: true }
            });
            return data;
        } catch (error) {
            throw new Error(`Error al buscar paciente: ${error.message}`);
        }
    }

    /**
     * Busca un paciente utilizando su número de DNI.
     * @param {string} dni - El número de identidad a buscar.
     * @returns {Promise<Object|null>} El primer paciente que coincida con el DNI.
     */
    async obtenerPorDni(dni) {
        try {
            const data = await prisma.paciente.findFirst({
                where: { dni: dni },
                include: { expedientes: true }
            });
            return data;
        } catch (error) {
            throw new Error(`Error al buscar paciente por DNI: ${error.message}`);
        }
    }

    /**
     * Actualiza los datos de un paciente existente.
     * @param {number} idPaciente - ID único del paciente.
     * @param {Partial<PacienteData>} data - Objeto con los campos parciales a actualizar.
     * @returns {Promise<Object>} El registro del paciente actualizado.
     */
    async actualizar(idPaciente, data) {
        try {
            return await prisma.paciente.update({
                where: { idPaciente: Number(idPaciente) },
                data: {
                    dni: data.dni || undefined,
                    nombre: data.nombre || undefined,
                    apellido: data.apellido || undefined,
                    correo: data.correo || undefined,
                    telefono: data.telefono || undefined,
                    fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : undefined,
                    sexo: data.sexo || undefined,
                    direccion: data.direccion || undefined
                }
            });
        } catch (error) {
            throw new Error(`Error al actualizar paciente: ${error.message}`);
        }
    }

    /**
     * Busca pacientes por coincidencia en DNI, nombre o apellido.
     * @param {string} termino - El texto a buscar (parcial o completo).
     * @param {number} limite - Cuántos registros traer.
     * @param {number} skip - Cuántos registros saltar.
     * @returns {Promise<Array<Object>>} Lista de hasta 10 pacientes que coincidan con el término.
     */
    async buscarPaciente(termino, criterio = 'todos', limite = 10, skip = 0){
        try {
            let whereClause = {}; 

            if(criterio === 'nombre') {
                whereClause = {
                    OR: [
                        { nombre: { contains: termino } },
                        { apellido: { contains: termino } }
                    ]
                };
            } else if (criterio === 'identidad') {
                whereClause = {
                    dni: { contains: termino } 
                };
            } else if (criterio === 'codigo') {
                whereClause = { 
                    expedientes: { 
                        numeroExpediente: { contains: termino } } 
                };
            } else {
                whereClause = {
                    OR: [
                        { dni: { contains: termino } },
                        { nombre: { contains: termino } },
                        { apellido: { contains: termino } },
                        { expedientes: { 
                            numeroExpediente: { contains: termino } 
                            } 
                        },
                    ]
                };
            }
            
            return await prisma.paciente.findMany({
                where: whereClause,
                include: { expedientes: true },
                take: limite,
                skip: skip,
                orderBy: { nombre: 'asc' }
            })
        } catch (error) {
            throw new Error(`Error en búsqueda de pacientes: ${error.message}`);
        }
    }

    async contarBusqueda(termino, criterio = 'todos') {
        try {
            let whereClause = {};

            if(criterio === 'nombre') {
                whereClause = {
                    OR: [
                        { nombre: { contains: termino } },
                        { apellido: { contains: termino } }
                    ]
                };
            } else if (criterio === 'identidad') {
                whereClause = {
                    dni: { contains: termino } 
                };
            } else if (criterio === 'codigo') {
                whereClause = { 
                    expedientes: { 
                        numeroExpediente: { contains: termino } } 
                };
            } else {
                whereClause = {
                    OR: [
                        { dni: { contains: termino } },
                        { nombre: { contains: termino } },
                        { apellido: { contains: termino } },
                        { expedientes: { 
                            numeroExpediente: { contains: termino } 
                            } 
                        },
                    ]
                };
            }

            return await prisma.paciente.count({
                where: whereClause
            });
        } catch (error) {
            throw new Error(`Error al contar resultados de búsqueda: ${error.message}`);
        }
    }
}

module.exports = pacienteRepository;
