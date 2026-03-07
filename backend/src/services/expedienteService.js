class expedienteService {
    constructor(expedienteRepository, pacienteRepository, auditoriaService, prisma) {
        this.expedienteRepository = expedienteRepository;
        this.pacienteRepository = pacienteRepository;
        this.auditoriaService = auditoriaService;
        this.prisma = prisma;
    }

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
            const pacienteExistente = await this.pacienteRepository.obtenerPorDni(dataPaciente.dni);
            if (pacienteExistente) {
                throw new Error(`El paciente con DNI ${dataPaciente.dni} ya existe`);
            }

            if (dataExpediente.numeroExpediente) {
                const expedienteExistente =
                    await this.expedienteRepository.obtenerPorNumero(dataExpediente.numeroExpediente);

                if (expedienteExistente) {
                    throw new Error(
                        `El número de expediente ${dataExpediente.numeroExpediente} ya existe`
                    );
                }
            }

            return await this.prisma.$transaction(async (tx) => {
                const pacienteCreado = await this.pacienteRepository.crear(dataPaciente, tx);

                if (!dataExpediente.numeroExpediente) {
                    dataExpediente.numeroExpediente =
                        await this._generarCodigoExpediente(tx);
                } else {
                    const existeNum =
                        await this.expedienteRepository.obtenerPorNumero(
                            dataExpediente.numeroExpediente
                        );

                    if (existeNum) {
                        throw new Error("El número de expediente manual ya existe");
                    }
                }

                dataExpediente.idPaciente = pacienteCreado.idPaciente;

                const expedienteCreado =
                    await this.expedienteRepository.crear(dataExpediente, tx);

                if (usuarioId && this.auditoriaService) {
                    await this.auditoriaService.registrarExpediente(
                        usuarioId,
                        "CREACIÓN",
                        {
                            idExpediente: expedienteCreado.idExpediente,
                            dniPaciente: pacienteCreado.dni,
                            accion:
                                "Creación de paciente y apertura de expediente clínico"
                        },
                        tx
                    );
                }

                return {
                    paciente: pacienteCreado,
                    expediente: expedienteCreado
                };
            });

        } catch (error) {
            throw new Error(
                `Error en el proceso de registro clínico: ${error.message}`
            );
        }
    }

    async obtenerTodos() {
        return await this.expedienteRepository.obtenerTodos();
    }

    async obtenerPorId(idExpediente) {
        const expediente = await this.expedienteRepository.obtenerPorId(idExpediente);

        if (!expediente) {
            throw new Error(`El expediente con ID ${idExpediente} no existe`);
        }

        return expediente;
    }

    async obtenerPorPaciente(idPaciente) {
        const paciente = await this.pacienteRepository.obtenerPorId(idPaciente);

        if (!paciente) {
            throw new Error(`El paciente con ID ${idPaciente} no existe`);
        }

        return await this.expedienteRepository.obtenerPorPaciente(idPaciente);
    }

    async actualizar(idExpediente, data) {
        const expediente = await this.expedienteRepository.obtenerPorId(idExpediente);

        if (!expediente) {
            throw new Error(`El expediente con ID ${idExpediente} no existe`);
        }

        return await this.expedienteRepository.actualizar(idExpediente, data);
    }

    async eliminar(idExpediente) {
        const expediente = await this.expedienteRepository.obtenerPorId(idExpediente);

        if (!expediente) {
            throw new Error(`El expediente con ID ${idExpediente} no existe`);
        }

        return await this.expedienteRepository.eliminar(idExpediente);
    }

    async buscarGlobal(filtroDto, usuarioId = null) {
        try {
            const { termino, pagina, limite } = filtroDto;
            const skip = (pagina - 1) * limite;

            if (usuarioId) {
                this.auditoriaService
                    .registrarExpediente(usuarioId, "BUSQUEDA", {
                        termino,
                        accion: "Búsqueda global de pacientes/expedientes"
                    })
                    .catch(() => {});
            }

            const resultados =
                await this.pacienteRepository.buscarPaciente(termino, limite, skip);

            const total =
                await this.pacienteRepository.contarBusqueda(termino);

            return {
                resultados,
                paginacion: {
                    total,
                    paginaActual: pagina,
                    limite,
                    totalPaginas: Math.ceil(total / limite)
                }
            };

        } catch (error) {
            throw new Error(`Error en el servicio de búsqueda: ${error.message}`);
        }
    }
}

module.exports = expedienteService;