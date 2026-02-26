const jwt = require("jsonwebtoken");
const { roles } = require('../config/roles');

class inicioSesionController {
    constructor(inicioSesionService) {
        this.inicioSesionService = inicioSesionService;
    }

    async inicioSesion(req, res) {
        console.log("Datos recibidos:", req.body);
        try {
            const { nombreUsuario, clave } = req.body;
            // const resultado = await this.inicioSesionService.inicioSesion(nombreUsuario, clave);
            const usuario = await this.inicioSesionService.inicioSesion(nombreUsuario, clave);

            const payload = {
                id: usuario.id,
                nombre: usuario.nombre,
                rol: usuario.rol
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET || 'tu_clave_secreta', { 
                expiresIn: '8h' 
            });

            res.json({ 
                success: true, 
                token: token,
                data: payload 
            });
            // res.json({ success: true, data: resultado });
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