class registroPreclinicoController {
    constructor(registroPreclinicoService, auditoriaService) {
        this.registroPreclinicoService = registroPreclinicoService;
        this.auditoriaService = auditoriaService;
    }

    async registrar(req, res) {
        try {
            const { expedienteId } = req.params;
            const enfermeroId = req.usuario.id;
            const datos = req.body;

            const resultado = await this.registroPreclinicoService.registrar(
                expedienteId,
                enfermeroId,
                datos
            );

            // Registrar auditoría
            await this.auditoriaService.registrar(
                enfermeroId,
                "REGISTRO_PRECLINICO",
                `Registro de signos vitales para expediente ${expedienteId}`
            );

            res.status(201).json({
                success: true,
                data: resultado
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async obtenerPorExpediente(req, res) {
        try {
            const { expedienteId } = req.params;

            const registros = await this.registroPreclinicoService.obtenerPorExpediente(expedienteId);

            res.json({
                success: true,
                data: registros
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async obtenerUltimoPorExpediente(req, res) {
        try {
            const { expedienteId } = req.params;

            const registro = await this.registroPreclinicoService.obtenerUltimoPorExpediente(expedienteId);

            res.json({
                success: true,
                data: registro
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = registroPreclinicoController;


