const prisma = require('../config/prisma');

class expedienteService {
    constructor(expedienteRepository, pacienteRepository, auditoriaService) {
        this.expedienteRepository = expedienteRepository;
        this.pacienteRepository = pacienteRepository;
        this.auditoriaService = auditoriaService;
    }

    /**
     * Genera un número de expediente único con formato EXP-YYYY-00001
     * @private
     */
    async _generarCodigoExpediente(tx) {
        const anioActual = new Date().getFullYear();
        
        const count = await tx.expediente.count({
            where: {
                numeroExpediente: { 
                    startsWith: `EXP-${anioActual}` 
                }
            }
        });
        const numeroIncremental = String(count + 1).padStart(5, '0');
        return `EXP-${anioActual}-${numeroIncremental}`;
    }

    async crearConPaciente(dataPaciente, dataExpediente, usuarioId) {
        try {
            // Validar que el DNI no exista
            const pacienteExistente = await this.pacienteRepository.obtenerPorDni(dataPaciente.dni);
            if (pacienteExistente) {
                throw new Error(`El paciente con DNI ${dataPaciente.dni} ya existe`);
            }

            // Validar que el número de expediente sea único
            if (dataExpediente.numeroExpediente) {
                const expedienteExistente = await this.expedienteRepository.obtenerPorNumero(dataExpediente.numeroExpediente);
                if (expedienteExistente) {
                    throw new Error(`El número de expediente ${dataExpediente.numeroExpediente} ya existe`);
                }
            }
                
            return await prisma.$transaction(async (tx) => {
                
                // Crear paciente
                const pacienteCreado = await this.pacienteRepository.crear(dataPaciente, tx);

                if (!dataExpediente.numeroExpediente) {
                    dataExpediente.numeroExpediente = await this._generarCodigoExpediente(tx);
                } else {
                    const existeNum = await this.expedienteRepository.obtenerPorNumero(dataExpediente.numeroExpediente);
                    if (existeNum) throw new Error("El número de expediente manual ya existe");
                }
                
                // Crear expediente
                dataExpediente.idPaciente = pacienteCreado.idPaciente;
                const expedienteCreado = await this.expedienteRepository.crear(dataExpediente, tx);

                // Registrar en auditoría
                if (usuarioId && this.auditoriaService) {
                    await this.auditoriaService.registrarExpediente(usuarioId, "CREACIÓN", {
                        idExpediente: expedienteCreado.idExpediente,
                        dniPaciente: pacienteCreado.dni,
                        detalles: "Creación de paciente y apertura de expediente clínico"
                    }, tx);
                }

                return {
                    paciente: pacienteCreado,
                    expediente: expedienteCreado
                };
            });
        } catch (error) {
            throw new Error(`Error en el proceso de registro clínico: ${error.message}`);
        }
    }

    /**
     * Obtiene el listado completo de expedientes.
     */
    async obtenerTodos() {
        try {
            return await this.expedienteRepository.obtenerTodos();
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Busca un expediente por su ID único.
     * @param {number} idExpediente 
     */
    async obtenerPorId(idExpediente) {
        try {
            const expediente = await this.expedienteRepository.obtenerPorId(idExpediente);
            if (!expediente) {
                throw new Error(`El expediente con ID ${idExpediente} no existe`);
            }
            return expediente;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Busca un paciente por su ID único.
     * @param {number} idPaciente
     */
    async obtenerPorPaciente(idPaciente) {
        try {
            const paciente = await this.pacienteRepository.obtenerPorId(idPaciente);
            if (!paciente) {
                throw new Error(`El paciente con ID ${idPaciente} no existe`);
            }
            return await this.expedienteRepository.obtenerPorPaciente(idPaciente);
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Actualiza la información de un expediente y sus datos del paciente.
     * @param {number} idExpediente 
     * @param {Object} dataPaciente - Datos del paciente a actualizar
     * @param {Object} dataExpediente - Datos del expediente a actualizar
     * @param {number} usuarioId - ID del usuario que realiza la actualización
     */
    async actualizarConPaciente(idExpediente, dataPaciente, dataExpediente, usuarioId) {
        try {
            const expediente = await this.expedienteRepository.obtenerPorId(idExpediente);
            if (!expediente) {
                throw new Error(`El expediente con ID ${idExpediente} no existe`);
            }

            // Usar transacción para actualizar paciente y expediente
            return await prisma.$transaction(async (tx) => {
                const resultado = {
                    paciente: null,
                    expediente: null
                };

                // Actualizar paciente si hay datos
                if (dataPaciente && Object.keys(dataPaciente).length > 0) {
                    resultado.paciente = await this.pacienteRepository.actualizar(
                        expediente.idPaciente,
                        dataPaciente,
                        tx
                    );
                }

                // Actualizar expediente si hay datos
                if (dataExpediente && Object.keys(dataExpediente).length > 0) {
                    resultado.expediente = await this.expedienteRepository.actualizar(
                        idExpediente,
                        dataExpediente,
                        tx
                    );
                } else {
                    resultado.expediente = expediente;
                }

                // Registrar en auditoría
                if (usuarioId && this.auditoriaService) {
                    const cambios = [];
                    if (dataPaciente && Object.keys(dataPaciente).length > 0) {
                        cambios.push("datos del paciente");
                    }
                    if (dataExpediente && Object.keys(dataExpediente).length > 0) {
                        cambios.push("información del expediente");
                    }

                    await this.auditoriaService.registrarExpediente(usuarioId, "ACTUALIZACIÓN", {
                        idExpediente: idExpediente,
                        dniPaciente: expediente.paciente.dni,
                        detalles: `Actualización de ${cambios.join(" y ")} - Expediente ${expediente.numeroExpediente}`
                    }, tx);
                }

                return resultado;
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }

    /**
     * Elimina un expediente del sistema.
     * @param {number} idExpediente 
     */
    async eliminar(idExpediente) {
        try {
            const expediente = await this.expedienteRepository.obtenerPorId(idExpediente);
            if (!expediente) {
                throw new Error(`El expediente con ID ${idExpediente} no existe`);
            }
            return await this.expedienteRepository.eliminar(idExpediente);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = expedienteService;
