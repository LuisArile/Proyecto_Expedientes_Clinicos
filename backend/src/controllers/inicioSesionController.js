const jwt = require("jsonwebtoken");
const { ErrorValidacion, ErrorNoAutorizado } = require("../utils/errores");
const capturarAsync = require("../utils/capturarAsync");

class inicioSesionController {
    constructor(inicioSesionService) {
        this.inicioSesionService = inicioSesionService;
    }

    inicioSesion = capturarAsync(async (req, res) => {
        const { nombreUsuario, clave } = req.body;

        if (!nombreUsuario.trim() || !clave) {
            throw new ErrorValidacion('El nombre de usuario y contraseña son obligatorio');
        }

        const resultado = await this.inicioSesionService.inicioSesion(nombreUsuario, clave);
        
        if (!resultado) throw new ErrorNoAutorizado('Credenciales incorrectas');

        const tokenPayload = {
            id: resultado.id,
            idRol: resultado.idRol
        };

        const token = jwt.sign(
            tokenPayload, 
            process.env.JWT_SECRET || 'tu_clave_secreta', 
            { expiresIn: '8h' }
        );

        res.json({ 
            success: true, 
            token,
            mensaje: 'Inicio de sesión exitoso',
            data: resultado 
        });
    });

    cierreSesion = capturarAsync(async (req, res) => {
        const usuarioId = req.usuario?.id;

        if (!usuarioId) throw new ErrorNoAutorizado('No hay una sesión activa');

        const resultado = await this.inicioSesionService.cierreSesion(usuarioId);

        res.json({ 
            success: true, 
            mensaje: 'Sesión cerrada exitosamente',
            data: resultado 
        });
    });
}


module.exports = inicioSesionController;