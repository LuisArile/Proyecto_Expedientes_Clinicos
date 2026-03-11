class EstadisticasController {
    constructor(estadisticasService) {
        this.estadisticasService = estadisticasService;
    }

    async obtenerDashboard(req, res) {
        console.log(req.usuario)
        try {
            
            const { id, rol } = req.usuario;

            const datos = await this.estadisticasService.obtenerResumenGeneral(id, rol);
            
            res.json({
                success: true,
                data: datos
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = EstadisticasController;