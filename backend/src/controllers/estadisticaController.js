class EstadisticaController {
    constructor(estadisticaService) {
        this.estadisticaService = estadisticaService;
    }

    async obtenerDashboard(req, res) {
        try {
            const usuarioSesion = req.usuario;

            if (!usuarioSesion) return res.status(401).json({ success: false, error: "No autenticado" });
            
            const datos = await this.estadisticaService.obtenerResumenGeneral(usuarioSesion);
            
            res.json({ success: true, data: datos });
        } catch (error) {
            console.error("Error en obtenerDashboard:", error);
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = EstadisticaController;