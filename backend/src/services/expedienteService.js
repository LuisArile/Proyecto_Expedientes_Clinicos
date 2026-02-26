class expedienteService {
    constructor(expedienteRepository, pacienteRepository) {
        this.expedienteRepository = expedienteRepository;
        this.pacienteRepository = pacienteRepository;
    }

    async crearConPaciente(dataPaciente, dataExpediente) {
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

            // Crear paciente
            const pacienteCreado = await this.pacienteRepository.crear(dataPaciente);

            // Crear expediente
            dataExpediente.idPaciente = pacienteCreado.idPaciente;
            const expedienteCreado = await this.expedienteRepository.crear(dataExpediente);

            return {
                paciente: pacienteCreado,
                expediente: expedienteCreado
            };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async obtenerTodos() {
        try {
            return await this.expedienteRepository.obtenerTodos();
        } catch (error) {
            throw new Error(error.message);
        }
    }

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
