class usuarioController {
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }

    async crear(req, res) {
        try {
            const usuario = await this.usuarioService.crear(req.body);
            res.status(201).json({ success: true, data: usuario });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async obtenerTodos(req, res) {
        try {
            const usuarios = await this.usuarioService.obtenerTodos();
            res.json({ success: true, data: usuarios });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }

    async cambiarPassword(req, res) {
        try {

            const { currentPassword, newPassword } = req.body;
            const userId = req.user?.id;

            if ( !currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    error: "Todos los campos son obligatorios"
                });
            }

            const usuario = await this.usuarioService.cambiarPassword(
                userId,
                currentPassword,
                newPassword
            );

            return res.json({ success: true, data: usuario });

        } catch (error) {
            return res.status(400).json({ success: false, error: error.message });
        }
    }   
}

module.exports = usuarioController;
