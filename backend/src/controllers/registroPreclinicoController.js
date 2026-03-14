const { ErrorValidacion, ErrorProhibido } = require("../utils/errores");
const capturarAsync = require("../utils/capturarAsync");

class registroPreclinicoController {
    constructor(registroPreclinicoService, auditoriaService) {
        this.registroPreclinicoService = registroPreclinicoService;
        this.auditoriaService = auditoriaService;
    }

        // Registrar signos vitales
    registrar = capturarAsync(async (req, res,next) => {
        const { expedienteId } = req.params;
        const enfermeroId = req.usuario?.id;
        const datos = req.body;

        // Validar que el usuario esté autenticado
        if (!enfermeroId) {
            throw new ErrorValidacion('Usuario no autenticado');
        }

        // Validar que el expedienteId sea proporcionado
        if (!expedienteId) {
            throw new ErrorValidacion('El ID del expediente es obligatorio');
        }


        if (!datos || Object.keys(datos).length === 0) {
            throw new ErrorValidacion('Debe proporcionar al menos un signo vital');
        }

        
        const resultado = await this.registroPreclinicoService.registrar(
            expedienteId,
            enfermeroId,
            datos
        );

        // Registrar auditoría
        await this.auditoriaService.registrar(
            enfermeroId,
            "REGISTRO_PRECLINICO",
            {
                expedienteId,
                signosRegistrados: Object.keys(datos).join(', ')
            }
        );

        res.status(201).json({
            success: true,
            mensaje: 'Signos vitales registrados exitosamente',
            data: resultado
        });
    });

    // Obtener todos los registros de un expediente
    obtenerPorExpediente = capturarAsync(async (req, res,next) => {
        const { expedienteId } = req.params;

        if (!expedienteId) {
            throw new ErrorValidacion('El ID del expediente es obligatorio');
        }

        const registros = await this.registroPreclinicoService.obtenerPorExpediente(expedienteId);

        res.json({
            success: true,
            data: registros
        });
    });

    // Obtener el último registro de un expediente
    obtenerUltimoPorExpediente = capturarAsync(async (req, res,next) => {
        const { expedienteId } = req.params;

        if (!expedienteId) {
            throw new ErrorValidacion('El ID del expediente es obligatorio');
        }

        const registro = await this.registroPreclinicoService.obtenerUltimoPorExpediente(expedienteId);

        if (!registro) {
            // No puede no haber registros aún
            return res.json({
                success: true,
                mensaje: 'No hay registros previos para este expediente',
                data: null
            });
        }

        res.json({
            success: true,
            data: registro
        });
    });
}


module.exports = registroPreclinicoController;


