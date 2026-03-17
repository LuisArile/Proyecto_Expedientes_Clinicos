const { ErrorValidacion, ErrorNoEncontrado, ErrorProhibido } = require('../utils/errores');
const capturarAsync = require('../utils/capturarAsync');

class consultaMedicaController {
    constructor(consultaMedicaService) {
        this.consultaMedicaService = consultaMedicaService;
    }

    registrar = capturarAsync(async (req, res, next) => {
        try {
            const { expedienteId } = req.params;
            const medicoId = req.usuario.id;
            const datos = req.body;

            const resultado = await this.consultaMedicaService.registrar(
                expedienteId,
                medicoId,
                datos
            );

            res.status(201).json({
                success: true,
                message: 'Consulta médica registrada exitosamente',
                data: resultado
            });
        } catch (error) {
            throw new ErrorValidacion(error.message);
        }
    });

    obtenerPorExpediente = capturarAsync(async (req, res, next) => {
        try {
            const { expedienteId } = req.params;

            const consultas = await this.consultaMedicaService.obtenerPorExpediente(expedienteId);

            res.json({
                success: true,
                data: consultas
            });
        } catch (error) {
            throw new ErrorValidacion(error.message);
        }
    });

    obtenerPorId = capturarAsync(async (req, res, next) => {
        try {
            const { id } = req.params;

            const consulta = await this.consultaMedicaService.obtenerPorId(id);

            if (!consulta) {
                throw new ErrorNoEncontrado('Consulta médica');
            }

            res.json({
                success: true,
                data: consulta
            });
        } catch (error) {
            if (error instanceof ErrorNoEncontrado) {
                throw error;
            }
            throw new ErrorValidacion(error.message);
        }
    });
}

module.exports = consultaMedicaController;