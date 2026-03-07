class RolController {
    constructor(rolService) {
        this.rolService = rolService;
    }

    async crear(req, res) {
        try {
            const rol = await this.rolService.crear(req.body);
            res.status(201).json({ success: true, data: rol });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async obtenerTodos(req, res) {
        try {
            const roles = await this.rolService.obtenerTodos();
            res.json({ success: true, data: roles });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const rol = await this.rolService.obtenerPorId(req.params.idRol);
            res.json({ success: true, data: rol });
        } catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }

    async actualizar(req, res) {
        try {
            const rol = await this.rolService.actualizar(req.params.idRol, req.body);
            res.json({ success: true, data: rol });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async eliminar(req, res) {
        try {
            await this.rolService.eliminar(req.params.idRol);
            res.json({ success: true, mensaje: 'Rol eliminado correctamente' });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async asignarPermisos(req, res) {
        try {
            const { permisos } = req.body;
            const rol = await this.rolService.asignarPermisos(req.params.idRol, permisos);
            res.json({ success: true, data: rol });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async obtenerPermisos(req, res) {
        try {
            const permisos = await this.rolService.obtenerPermisosPorRol(req.params.idRol);
            res.json({ success: true, data: permisos });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

module.exports = RolController;
