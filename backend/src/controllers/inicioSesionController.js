class inicioSesionController {
    constructor(inicioSesionService) {
        this.inicioSesionService = inicioSesionService;
    }

    async inicioSesion(req, res) {
        try {
            const { nombreUsuario, clave } = req.body;
            const resultado = await this.inicioSesionService.inicioSesion(nombreUsuario, clave);
            res.json({ success: true, data: resultado });
        } catch (error) {
            res.status(401).json({ success: false, error: error.message });
        }
    }

    async cierreSesion(req, res) {
        try {
            const resultado = await this.inicioSesionService.cierreSesion(req.usuario?.id);
            res.json({ success: true, data: resultado });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

module.exports = inicioSesionController;