class PermisoController {
    constructor(permisoService) {
        this.permisoService = permisoService;
    }

    async crear(req, res) {
        try {
            const permiso = await this.permisoService.crear(req.body);
            res.status(201).json({ success: true, data: permiso });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async obtenerTodos(req, res) {
        try {
            const permisos = await this.permisoService.obtenerTodos();
            res.json({ success: true, data: permisos });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const permiso = await this.permisoService.obtenerPorId(req.params.idPermiso);
            res.json({ success: true, data: permiso });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const permiso = await this.permisoService.actualizar(req.params.idPermiso, req.body);
            res.json({ success: true, data: permiso });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            await this.permisoService.eliminar(req.params.idPermiso);
            res.json({ success: true, mensaje: 'Permiso eliminado correctamente' });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

module.exports = PermisoController;
