const jwt = require("jsonwebtoken");

class inicioSesionController {
    constructor(inicioSesionService, auditoriaService) {
        this.inicioSesionService = inicioSesionService;
        this.auditoriaService = auditoriaService;
    }

    async inicioSesion(req, res) {
        try {
            const { nombreUsuario, clave } = req.body;
            const resultado = await this.inicioSesionService.inicioSesion(nombreUsuario, clave);
            
            // Registrar auditoría de inicio de sesión
            await this.auditoriaService.registrarSesion(
                resultado.id, 
                "INICIO_SESION", 
                nombreUsuario
            );

            const tokendPayload = {
                id: resultado.id,
                idRol: resultado.idRol
            };

            const token = jwt.sign(tokendPayload, process.env.JWT_SECRET || 'tu_clave_secreta', { 
                expiresIn: '8h' 
            });

            res.json({ 
                success: true, 
                token: token,
                data: resultado 
            });
        } catch (error) {
            res.status(401).json({ success: false, error: error.message });
        }
    }

    async cierreSesion(req, res) {
        try {
            const usuarioId = req.usuario?.id;
            if (!usuarioId) {
                return res.status(401).json({ success: false, error: "No se encontró usuario para cerrar sesión" });
            }
            const resultado = await this.inicioSesionService.cierreSesion(req.usuario?.id);
            
            // Registrar auditoría de cierre de sesión
            await this.auditoriaService.registrarSesion(
                req.usuario.id, 
                "CIERRE_SESION"
            );

            res.json({ success: true, data: resultado });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

module.exports = inicioSesionController;