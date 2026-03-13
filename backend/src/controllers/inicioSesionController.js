const jwt = require("jsonwebtoken");
const { ErrorValidacion, ErrorNoAutorizado } = require("../utils/errores");
const capturarAsync = require("../utils/capturarAsync");

class inicioSesionController {
    constructor(inicioSesionService, auditoriaService) {
        this.inicioSesionService = inicioSesionService;
        this.auditoriaService = auditoriaService;
    }

       // Inicio de sesión
    inicioSesion = capturarAsync(async (req, res) => {
        const { nombreUsuario, clave } = req.body;

        // Validar que se proporcionen usuario y contraseña
        if (!nombreUsuario || !nombreUsuario.trim()) {
            throw new ErrorValidacion('El nombre de usuario es obligatorio');
        }
        if (!clave) {
            throw new ErrorValidacion('La contraseña es obligatoria');
        }

        // Intentar autenticar
        const resultado = await this.inicioSesionService.inicioSesion(nombreUsuario, clave);
        
        if (!resultado) {
            throw new ErrorNoAutorizado('Credenciales incorrectas');
        }

        // Registrar auditoría de inicio de sesión
        await this.auditoriaService.registrarSesion(
            resultado.id, 
            "INICIO_SESION", 
            nombreUsuario
        );

        // Generar token JWT
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

    // Cierre de sesión
    cierreSesion = capturarAsync(async (req, res) => {
        const usuarioId = req.usuario?.id;

        // Validar que hay un usuario autenticado
        if (!usuarioId) {
            throw new ErrorNoAutorizado('No hay una sesión activa');
        }

        // Cerrar sesión
        const resultado = await this.inicioSesionService.cierreSesion(usuarioId);
        
        // Registrar auditoría de cierre de sesión
        await this.auditoriaService.registrarSesion(
            usuarioId, 
            "CIERRE_SESION"
        );

        res.json({ 
            success: true, 
            mensaje: 'Sesión cerrada exitosamente',
            data: resultado 
        });
    });
}


module.exports = inicioSesionController;