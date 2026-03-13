class EstadisticasController {
    constructor(estadisticasService) {
        this.estadisticasService = estadisticasService;
    }

    async obtenerDashboard(req, res) {
        try {
            
            const usuarioSesion = req.usuario || req.user;

            if (!usuarioSesion) {
                return res.status(401).json({ success: false, error: "No autenticado" });
            }
            
            const datos = await this.estadisticasService.obtenerResumenGeneral(usuarioSesion);
            
            res.json({ success: true, data: datos });
        } catch (error) {
            console.error("Error en obtenerDashboard:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = EstadisticasController;