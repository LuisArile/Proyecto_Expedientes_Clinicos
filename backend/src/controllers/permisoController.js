const { ErrorValidacion, ErrorNoEncontrado } = require("../utils/errores");
const capturarAsync = require("../utils/capturarAsync");

class PermisoController {
    constructor(permisoService) {
        this.permisoService = permisoService;
    }

    
    crear = capturarAsync(async (req, res) => {
        // Validar que el nombre del permiso sea proporcionado
        if (!req.body.nombre || !req.body.nombre.trim()) {
            throw new ErrorValidacion('El nombre del permiso es obligatorio');
        }

        const permiso = await this.permisoService.crear(req.body);
        
        res.status(201).json({
            success: true,
            mensaje: 'Permiso creado exitosamente',
            data: permiso
        });
    });


    obtenerTodos = capturarAsync(async (req, res) => {
        const permisos = await this.permisoService.obtenerTodos();
        
        res.json({
            success: true,
            data: permisos
        });
    });


    obtenerPorId = capturarAsync(async (req, res) => {
        const { idPermiso } = req.params;

        if (!idPermiso) {
            throw new ErrorValidacion('El ID del permiso es obligatorio');
        }

        const permiso = await this.permisoService.obtenerPorId(idPermiso);

        if (!permiso) {
            throw new ErrorNoEncontrado('Permiso');
        }

        res.json({
            success: true,
            data: permiso
        });
    });


    actualizar = capturarAsync(async (req, res) => {
        const { idPermiso } = req.params;

        if (!idPermiso) {
            throw new ErrorValidacion('El ID del permiso es obligatorio');
        }

        // Validar que el nombre no esté vacío si se proporciona
        if (req.body.nombre && !req.body.nombre.trim()) {
            throw new ErrorValidacion('El nombre del permiso no puede estar vacío');
        }

        const permiso = await this.permisoService.actualizar(idPermiso, req.body);

        res.json({
            success: true,
            mensaje: 'Permiso actualizado correctamente',
            data: permiso
        });
    });


    eliminar = capturarAsync(async (req, res) => {
        const { idPermiso } = req.params;

        if (!idPermiso) {
            throw new ErrorValidacion('El ID del permiso es obligatorio');
        }

        await this.permisoService.eliminar(idPermiso);

        res.json({
            success: true,
            mensaje: 'Permiso eliminado correctamente'
        });
    });
}

module.exports = PermisoController;

