const { ErrorValidacion, ErrorNoEncontrado } = require("../utils/errores");
const capturarAsync = require("../utils/capturarAsync");

class RolController {
    constructor(rolService) {
        this.rolService = rolService;
    }

    
    crear = capturarAsync(async (req, res) => {
        // Validar que el nombre del rol sea proporcionado
        if (!req.body.nombre || !req.body.nombre.trim()) {
            throw new ErrorValidacion('El nombre del rol es obligatorio');
        }

        const rol = await this.rolService.crear(req.body);
        
        res.status(201).json({
            success: true,
            mensaje: 'Rol creado exitosamente',
            data: rol
        });
    });

    
    obtenerTodos = capturarAsync(async (req, res) => {
        const roles = await this.rolService.obtenerTodos();
        
        res.json({
            success: true,
            data: roles
        });
    });

    
    obtenerPorId = capturarAsync(async (req, res) => {
        const { idRol } = req.params;

        if (!idRol) {
            throw new ErrorValidacion('El ID del rol es obligatorio');
        }

        const rol = await this.rolService.obtenerPorId(idRol);

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

        const rol = await this.rolService.actualizar(idRol, req.body);

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

        await this.rolService.eliminar(idRol);

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

        const rol = await this.rolService.asignarPermisos(idRol, permisos);

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

        const permisos = await this.rolService.obtenerPermisosPorRol(idRol);

        res.json({
            success: true,
            data: permisos
        });
    });
}

module.exports = RolController;

