const { ErrorValidacion} = require("../utils/errores");
const capturarAsync = require("../utils/capturarAsync");


class usuarioController {
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }

    crear = capturarAsync(async (req, res, next) => {
        console.log(' Creando usuario - next existe?', !!next); 
        
        if (!req.body.nombre) {
            throw new ErrorValidacion('El nombre es obligatorio');
        }
        if (!req.body.correo) {
            throw new ErrorValidacion('El correo es obligatorio');
        }
        if (!req.body.nombreUsuario) {
            throw new ErrorValidacion('El nombre de usuario es obligatorio');
        }
        if (!req.body.clave) {
            throw new ErrorValidacion('La contraseña es obligatoria');
        }

        const usuario = await this.usuarioService.crear(req.body);
        
        res.status(201).json({
            success: true,
            mensaje: 'Usuario creado exitosamente',
            data: usuario
        });
    });

    obtenerTodos = capturarAsync(async (req, res, next) => {
        const usuarios = await this.usuarioService.obtenerTodos();
        res.json({ success: true, data: usuarios });
    });
}

module.exports = usuarioController;