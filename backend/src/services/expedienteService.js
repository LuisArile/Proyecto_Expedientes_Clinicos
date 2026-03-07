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
                        accion: "Creación de paciente y apertura de expediente clínico"
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
     * Actualiza la información de un expediente.
     * @param {number} idExpediente 
     * @param {Object} data 
     */
    async actualizar(idExpediente, data) {
        try {
            const expediente = await this.expedienteRepository.obtenerPorId(idExpediente);
            if (!expediente) {
                throw new Error(`El expediente con ID ${idExpediente} no existe`);
            }
            return await this.expedienteRepository.actualizar(idExpediente, data);
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

    /**
     * Servicio para buscar pacientes/expedientes por un término general.
     * @param {BusquedaPacienteDTO} filtroDto - Objeto con término, página y límite.
     * @param {number} [usuarioId] - Opcional para registro de auditoría
     * @returns {Promise<Array<Object>>}
     */
    async buscarGlobal(filtroDto, usuarioId = null) {
        try {
            const { termino, pagina, limite } = filtroDto;

            const skip = (pagina - 1) * limite;
     
            if (usuarioId) {
                this.auditoriaService.registrarExpediente(usuarioId, "BUSQUEDA", { 
                    termino: termino,
                    accion: "Búsqueda global de pacientes/expedientes"
                }).catch(err => console.error("Error auditoría búsqueda:", err));
            }

            const resultados = await this.pacienteRepository.buscarPaciente(termino, limite, skip);
            const total = await this.pacienteRepository.contarBusqueda(termino);

            return {
                resultados,
                paginacion: {
                    total,
                    paginaActual: pagina,
                    limite: limite,
                    totalPaginas: Math.ceil(total / limite)
                }
            };
        } catch (error) {
            throw new Error(`Error en el servicio de búsqueda: ${error.message}`);
        }
    }
}

module.exports = expedienteService;
