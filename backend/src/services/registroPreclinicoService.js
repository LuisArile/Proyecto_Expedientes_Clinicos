const prisma = require('../config/prisma');

class registroPreclinicoService {
    constructor(repository, expedienteRepository, auditoriaService) {
        this.repository = repository;
        this.expedienteRepository = expedienteRepository;
        this.auditoriaService = auditoriaService;
    }

    async registrar(expedienteId, enfermeroId, datos) {
        try {
            const expediente = await this.expedienteRepository.obtenerPorId(expedienteId);
            if (!expediente) throw new Error('Expediente no encontrado');

            const registro = await this.repository.crear({
                expedienteId,
                enfermeroId,
                ...datos
            });

            try {
                await this.auditoriaService.registrarAccionMedica(
                    enfermeroId,
                    'REGISTRO_PRECLINICO',
                    {
                        expedienteId,
                        signosRegistrados: Object.keys(datos).join(', ')
                    }
                );
            } catch (auditError) {
                console.error("Error auditoría:", auditError);
            }

            return registro;

        } catch (error) {
            throw new Error(`Error al registrar: ${error.message}`);
        }
    }

    async obtenerPorExpediente(expedienteId) {
        try {
            return await this.repository.obtenerPorExpediente(expedienteId);
        } catch (error) {
            throw new Error(`Error al obtener registros: ${error.message}`);
        }
    }

    async obtenerUltimoPorExpediente(expedienteId) {
        try {
            return await this.repository.obtenerUltimoPorExpediente(expedienteId);
        } catch (error) {
            throw new Error(`Error al obtener último registro: ${error.message}`);
        }
    }

    async obtenerTodos() {
        try {
            return await this.repository.obtenerTodos();
        } catch (error) {
            throw new Error(`Error al obtener todos los registros: ${error.message}`);
        }
    }

    async contarTodos() {
        try {
            return await this.repository.contarTodos();
        } catch (error) {
            throw new Error(`Error al contar registros: ${error.message}`);
        }
    }
}

module.exports = registroPreclinicoService;