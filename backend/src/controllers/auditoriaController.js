const capturarAsync = require("../utils/capturarAsync");

class AuditoriaController {
    constructor(auditoriaService) {
        this.auditoriaService = auditoriaService;
    }

    obtenerTodos = capturarAsync(async (req, res, next) => {
        const logs = await this.auditoriaService.obtenerLogs();
        res.json({
            success: true,
            data: logs
        });
    });

    obtenerEstadisticas = capturarAsync(async (req, res, next) => {
        const stats = await this.auditoriaService.obtenerResumen();
        res.json({
            success: true,
            data: stats
        });
    });
}

module.exports = AuditoriaController;