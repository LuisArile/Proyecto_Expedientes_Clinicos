const jwt = require("jsonwebtoken");
const { roles } = require('../config/roles');

class inicioSesionController {
    constructor(inicioSesionService) {
        this.inicioSesionService = inicioSesionService;
    }

    async inicioSesion(req, res) {
        try {
            const { nombreUsuario, clave } = req.body;
            const resultado = await this.inicioSesionService.inicioSesion(nombreUsuario, clave);
            
            await this.inicioSesionService.registrarAuditoria(
                resultado.id, 
                "INICIO_SESION", 
                `Usuario ${nombreUsuario} 
                accedió al sistema`
            );

            const payload = {
                id: resultado.id,
                nombre: resultado.nombre,
                rol: resultado.rol
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET || 'tu_clave_secreta', { 
                expiresIn: '8h' 
            });

            res.json({ 
                success: true, 
                token: token,
                data: payload 
            });
        } catch (error) {
            res.status(401).json({ success: false, error: error.message });
        }
    }

    async cierreSesion(req, res) {
        try {
            const resultado = await this.inicioSesionService.cierreSesion(req.usuario?.id);
            
            await this.inicioSesionService.registrarAuditoria(
                req.usuario.id, 
                "CIERRE_SESION", 
                "El usuario cerró su sesión"
            );

            res.json({ success: true, data: resultado });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

module.exports = inicioSesionController;