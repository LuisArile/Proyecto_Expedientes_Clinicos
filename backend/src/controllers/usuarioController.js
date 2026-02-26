class usuarioController {
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }

    async obtenerTodos(req, res) {
        try {
            const usuarios = await this.usuarioService.obtenerTodos();
            res.json({ success: true, data: usuarios });
        } catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}

<<<<<<< HEAD
module.exports = usuarioController;

=======
module.exports = usuarioController;
>>>>>>> feat-db-y-login
