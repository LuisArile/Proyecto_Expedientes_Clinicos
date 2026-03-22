const { ErrorValidacion } = require("../utils/errores");
const capturarAsync = require("../utils/capturarAsync");

class registroPreclinicoController {
    constructor(registroPreclinicoService) {
        this.registroPreclinicoService = registroPreclinicoService;
    }

    registrar = capturarAsync(async (req, res) => {
        const { expedienteId } = req.params;
        const enfermeroId = req.usuario?.id;
        const datos = req.body;

        if (!enfermeroId) throw new ErrorValidacion('Usuario no autenticado');
        if (!expedienteId) throw new ErrorValidacion('El ID del expediente es obligatorio');
        if (!datos || Object.keys(datos).length === 0) {
            throw new ErrorValidacion('Debe proporcionar al menos un signo vital');
        }

        const resultado = await this.registroPreclinicoService.registrar(
            expedienteId,
            enfermeroId,
            datos
        );

        res.status(201).json({
            success: true,
            mensaje: 'Signos vitales registrados exitosamente',
            data: resultado
        });
    });

    obtenerPorExpediente = capturarAsync(async (req, res) => {
        const { expedienteId } = req.params;
        if (!expedienteId) throw new ErrorValidacion('El ID del expediente es obligatorio');

        const registros = await this.registroPreclinicoService.obtenerPorExpediente(expedienteId);
        res.json({ success: true, data: registros });
    });

    obtenerUltimoPorExpediente = capturarAsync(async (req, res) => {
        const { expedienteId } = req.params;
        if (!expedienteId) throw new ErrorValidacion('El ID del expediente es obligatorio');

        const registro = await this.registroPreclinicoService.obtenerUltimoPorExpediente(expedienteId);
        
        res.json({
            success: true,
            mensaje: registro ? 'Último registro encontrado' : 'No hay registros previos para este expediente',
            data: registro || null
        });
    });

    obtenerTodos = capturarAsync(async (req, res) => {
        const registros = await this.registroPreclinicoService.obtenerTodos();
        res.json({ success: true, data: registros });
    });

    contarTodos = capturarAsync(async (req, res) => {
        const total = await this.registroPreclinicoService.contarTodos();
        res.json({
            success: true,
            data: { total }
        });
    });
}

module.exports = registroPreclinicoController;