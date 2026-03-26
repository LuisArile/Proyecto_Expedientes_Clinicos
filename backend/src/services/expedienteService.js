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
     * Actualiza la información de un expediente.
     * @param {number} idExpediente 
     * @param {Object} data 
     */
    async actualizar(idExpediente, data, usuarioId = null) {
        try {
            const expediente = await this.expedienteRepository.obtenerPorId(idExpediente);
            if (!expediente) {
                throw new Error(`El expediente con ID ${idExpediente} no existe`);
            }

            const datosPaciente = data?.paciente || null;
            const datosExpediente = {
                estado: data?.estado,
                observaciones: data?.observaciones
            };

            if (datosPaciente?.dni) {
                const pacienteConMismoDni = await this.pacienteRepository.obtenerPorDni(datosPaciente.dni);
                if (pacienteConMismoDni && Number(pacienteConMismoDni.idPaciente) !== Number(expediente.idPaciente)) {
                    throw new Error(`El paciente con DNI ${datosPaciente.dni} ya existe`);
                }
            }

            const camposPacienteActualizados = datosPaciente
                ? Object.keys(datosPaciente).filter((key) => datosPaciente[key] !== undefined)
                : [];

            const camposExpedienteActualizados = Object.keys(datosExpediente).filter(
                (key) => datosExpediente[key] !== undefined
            );

            if (camposPacienteActualizados.length === 0) {
                const actualizado = await this.expedienteRepository.actualizar(idExpediente, datosExpediente);

                if (usuarioId && this.auditoriaService && camposExpedienteActualizados.length > 0) {
                    await this.auditoriaService.registrarExpediente(usuarioId, "ACTUALIZACIÓN", {
                        idExpediente: expediente.idExpediente,
                        detalles: `Actualización de datos del expediente. Campos: ${camposExpedienteActualizados.map((campo) => `expediente.${campo}`).join(', ')}`
                    });
                }

                return actualizado;
            }

            await prisma.$transaction(async (tx) => {
                if (camposPacienteActualizados.length > 0) {
                    await this.pacienteRepository.actualizar(expediente.idPaciente, datosPaciente, tx);
                }

                if (camposExpedienteActualizados.length > 0) {
                    await this.expedienteRepository.actualizar(idExpediente, datosExpediente, tx);
                }

                if (usuarioId && this.auditoriaService && (camposPacienteActualizados.length > 0 || camposExpedienteActualizados.length > 0)) {
                    const detalleCampos = [
                        ...camposPacienteActualizados.map((campo) => `paciente.${campo}`),
                        ...camposExpedienteActualizados.map((campo) => `expediente.${campo}`)
                    ];

                    await this.auditoriaService.registrarExpediente(usuarioId, "ACTUALIZACIÓN", {
                        idExpediente: expediente.idExpediente,
                        detalles: `Actualización de datos del expediente. Campos: ${detalleCampos.join(', ')}`
                    }, tx);
                }
            });

            return await this.expedienteRepository.obtenerPorId(idExpediente);
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
