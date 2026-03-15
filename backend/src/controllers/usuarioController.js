const { ErrorValidacion, ErrorNoAutorizado } = require("../utils/errores");
const capturarAsync = require("../utils/capturarAsync");

class usuarioController {
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }

   crear = capturarAsync(async (req, res) => {
        const { nombre, correo, nombreUsuario, clave, idRol } = req.body;
        
        if (!nombre) throw new ErrorValidacion('El nombre es obligatorio');
        if (!correo) throw new ErrorValidacion('El correo es obligatorio');
        if (!nombreUsuario) throw new ErrorValidacion('El nombre de usuario es obligatorio');
        if (!clave) throw new ErrorValidacion('La contraseña es obligatoria');
        if(!idRol) throw new ErrorValidacion('El rol es obligatorio');

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
        const userId = req.user?.id || req.usuario?.id;

        if (!userId) {
            throw new ErrorNoAutorizado('No se encontró información del usuario');
        }

        if (!currentPassword || !newPassword) {
            throw new ErrorValidacion('Todos los campos son obligatorios');
        }

        const resultado = await this.usuarioService.cambiarPassword(
            userId,
            currentPassword,
            newPassword
        );

        res.json({ 
            success: true, 
            mensaje: 'Contraseña actualizada correctamente',
            data: resultado 
        });
    });

    obtenerPorId = capturarAsync(async (req, res) => {
        const { idRol } = req.params;

        if (!idRol) {
            throw new ErrorValidacion('El ID del rol es obligatorio');
        }

        const rol = await this.usuarioService.obtenerPorId(idRol);

        if (!rol) {
            throw new ErrorNoEncontrado('Rol');
        }

        res.json({
            success: true,
            data: rol
        });
    });

    
    actualizar = capturarAsync(async (req, res) => {
        const { idRol } = req.params;

        if (!idRol) {
            throw new ErrorValidacion('El ID del rol es obligatorio');
        }

        
        if (req.body.nombre && !req.body.nombre.trim()) {
            throw new ErrorValidacion('El nombre del rol no puede estar vacío');
        }

        const rol = await this.usuarioService.actualizar(idRol, req.body);

        res.json({
            success: true,
            mensaje: 'Rol actualizado correctamente',
            data: rol
        });
    });

    
    eliminar = capturarAsync(async (req, res) => {
        const { idRol } = req.params;

        if (!idRol) {
            throw new ErrorValidacion('El ID del rol es obligatorio');
        }

        await this.usuarioService.eliminar(idRol);

        res.json({
            success: true,
            mensaje: 'Rol eliminado correctamente'
        });
    });

    
    asignarPermisos = capturarAsync(async (req, res) => {
        const { idRol } = req.params;
        const { permisos } = req.body;

        if (!idRol) {
            throw new ErrorValidacion('El ID del rol es obligatorio');
        }

        if (!permisos || !Array.isArray(permisos)) {
            throw new ErrorValidacion('Los permisos deben ser proporcionados como un array');
        }

        if (permisos.length === 0) {
            throw new ErrorValidacion('Debe proporcionar al menos un permiso');
        }

        const rol = await this.usuarioService.asignarPermisos(idRol, permisos);

        res.json({
            success: true,
            mensaje: 'Permisos asignados correctamente',
            data: rol
        });
    });


    obtenerPermisos = capturarAsync(async (req, res) => {
        const { idRol } = req.params;

        if (!idRol) {
            throw new ErrorValidacion('El ID del rol es obligatorio');
        }

        const permisos = await this.usuarioService.obtenerPermisosPorRol(idRol);

        res.json({
            success: true,
            data: permisos
        });
    });    

}

module.exports = usuarioController;