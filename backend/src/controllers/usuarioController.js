const { ErrorValidacion, ErrorNoAutorizado } = require("../utils/errores");
const capturarAsync = require("../utils/capturarAsync");

class usuarioController {
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }

   crear = capturarAsync(async (req, res) => {
        const { nombre, correo, nombreUsuario, clave } = req.body;
        
        if (!nombre) throw new ErrorValidacion('El nombre es obligatorio');
        if (!correo) throw new ErrorValidacion('El correo es obligatorio');
        if (!nombreUsuario) throw new ErrorValidacion('El nombre de usuario es obligatorio');
        if (!clave) throw new ErrorValidacion('La contraseña es obligatoria');

        const usuario = await this.usuarioService.crear(req.body);
        
        res.status(201).json({
            success: true,
            mensaje: 'Usuario creado exitosamente',
            data: usuario
        });
    });

    obtenerTodos = capturarAsync(async (req, res) => {
        const usuarios = await this.usuarioService.obtenerTodos();
        res.json({ success: true, data: usuarios });
    });

    cambiarPassword = capturarAsync(async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        const userId = req.usuario?.id;

        if (!userId) {
            throw new ErrorNoAutorizado('No se encontró información del usuario');
        }

        if (!currentPassword || !newPassword) {
            throw new ErrorValidacion('Todos los campos son obligatorios');
        }

        const usuario = await this.usuarioService.cambiarPassword(
            userId,
            currentPassword,
            newPassword
        );

        res.json({ 
            success: true, 
            mensaje: 'Contraseña actualizada correctamente',
            data: usuario 
        });
    });
}

module.exports = usuarioController;