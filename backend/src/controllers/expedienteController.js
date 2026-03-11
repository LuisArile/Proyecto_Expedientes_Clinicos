const BusquedaGlobalDTO = require('../dtos/BusquedaPacienteDTO');
class expedienteController {
    constructor(expedienteService) {
        this.expedienteService = expedienteService;
    }

    async crearConPaciente(req, res) {
        try {
            // Validar que req.body exista
            if (!req.body) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'El body de la petición está vacío. Asegúrate de enviar Content-Type: application/json' 
                });
            }

            const { paciente, expediente } = req.body;
            
            if (!paciente) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Los datos del paciente son requeridos. Envía: { "paciente": {...}, "expediente": {...} }' 
                });
            }

            if (!expediente) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'Los datos del expediente son requeridos. Envía: { "paciente": {...}, "expediente": {...} }' 
                });
            }

            // Obtener el ID del usuario logueado desde el token (agregado por el middleware)
            const usuarioId = req.usuario ? req.usuario.id : null;

            const resultado = await this.expedienteService.crearConPaciente(paciente, expediente, usuarioId);
            res.status(201).json({ 
                success: true, 
                data: resultado,
                message: 'Expediente y paciente creados exitosamente'
            });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    async obtenerTodos(req, res) {
        try {
            const expedientes = await this.expedienteService.obtenerTodos();
            res.json({ 
                success: true, 
                data: expedientes 
            });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    async obtenerPorId(req, res) {
        try {
            const { idExpediente } = req.params;
            const expediente = await this.expedienteService.obtenerPorId(idExpediente);
            res.json({ 
                success: true, 
                data: expediente 
            });
        } catch (error) {
            res.status(404).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    async obtenerPorPaciente(req, res) {
        try {
            const { idPaciente } = req.params;
            const expediente = await this.expedienteService.obtenerPorPaciente(idPaciente);
            res.json({ 
                success: true, 
                data: expediente 
            });
        } catch (error) {
            res.status(404).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    async actualizar(req, res) {
        try {
            const { idExpediente } = req.params;
            const { estado, observaciones } = req.body;

            const resultado = await this.expedienteService.actualizar(idExpediente, {
                estado,
                observaciones
            });

            res.json({ 
                success: true, 
                data: resultado,
                message: 'Expediente actualizado exitosamente'
            });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    async eliminar(req, res) {
        try {
            const { idExpediente } = req.params;
            await this.expedienteService.eliminar(idExpediente);
            res.json({ 
                success: true, 
                message: 'Expediente eliminado exitosamente'
            });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error.message 
            });
        }
    }

    async buscarGlobal(req, res) {
        try {

            const filtroDto = new BusquedaGlobalDTO(req.query);

            const usuarioId = req.usuario ? req.usuario.id : null;

            const resultados = await this.expedienteService.buscarGlobal(filtroDto, usuarioId);
            
            res.json({ 
                success: true, 
                data: resultados 
            });
        } catch (error) {
            res.status(400).json({ 
                success: false, 
                error: error.message 
            });
        }
    }
}

module.exports = expedienteController;
