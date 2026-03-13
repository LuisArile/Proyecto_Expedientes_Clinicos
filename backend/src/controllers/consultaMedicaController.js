
const { ErrorValidacion, ErrorNoEncontrado, ErrorProhibido } = require("../utils/errores");
const capturarAsync = require("../utils/capturarAsync");

class consultaMedicaController {
    constructor(consultaMedicaService) {
        this.consultaMedicaService = consultaMedicaService;
    }


        // Registrar nueva consulta médica
    registrar = capturarAsync(async (req, res) => {
        const { expedienteId } = req.params;
        const medicoId = req.usuario?.id;
        const datos = req.body;

        // Validar usuario autenticado
        if (!medicoId) {
            throw new ErrorValidacion('Usuario no autenticado');
        }

        // Validar rol de doctor
        if (req.usuario.rol !== 'DOCTOR') {
            throw new ErrorProhibido('Solo los médicos pueden registrar consultas');
        }

        // Validar expedienteId
        if (!expedienteId) {
            throw new ErrorValidacion('El ID del expediente es obligatorio');
        }


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
    });

    // Obtener todas las consultas de un expediente
    obtenerPorExpediente = capturarAsync(async (req, res) => {
        const { expedienteId } = req.params;

        if (!expedienteId) {
            throw new ErrorValidacion('El ID del expediente es obligatorio');
        }

        const consultas = await this.consultaMedicaService.obtenerPorExpediente(expedienteId);

        res.json({
            success: true,
            data: consultas
        });
    });

    // Obtener una consulta específica por ID
    obtenerPorId = capturarAsync(async (req, res) => {
        const { id } = req.params;

        if (!id) {
            throw new ErrorValidacion('El ID de la consulta es obligatorio');
        }

        const consulta = await this.consultaMedicaService.obtenerPorId(id);

        if (!consulta) {
            throw new ErrorNoEncontrado('Consulta médica');
        }

        res.json({
            success: true,
            data: consulta
        });
    });
}

module.exports = consultaMedicaController;