class consultaMedicaController {
    constructor(consultaMedicaService) {
        this.consultaMedicaService = consultaMedicaService;
    }

    // Registrar nueva consulta médica
    async registrar(req, res) {
        try {
            const { expedienteId } = req.params;
            const medicoId = req.usuario.id;
            const datos = req.body;

            const resultado = await this.consultaMedicaService.registrar(
                expedienteId,
                medicoId,
                datos
            );

            res.status(201).json({
                success: true,
                message: 'Consulta médica registrada exitosamente',
                data: resultado
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Obtener todas las consultas de un expediente
    async obtenerPorExpediente(req, res) {
        try {
            const { expedienteId } = req.params;

            const consultas = await this.consultaMedicaService.obtenerPorExpediente(expedienteId);

            res.json({
                success: true,
                data: consultas
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Obtener una consulta específica por ID
    async obtenerPorId(req, res) {
        try {
            const { id } = req.params;

            const consulta = await this.consultaMedicaService.obtenerPorId(id);

            res.json({
                success: true,
                data: consulta
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = consultaMedicaController;