const { ErrorValidacion, ErrorNoEncontrado } = require("../utils/errores");
const capturarAsync = require("../utils/capturarAsync");

class expedienteController {
    constructor(expedienteService) {
        this.expedienteService = expedienteService;
    }

        crearConPaciente = capturarAsync(async (req, res, next) => {
        if (!req.body) {
            throw new ErrorValidacion('El body de la petición está vacío');
        }

        const { paciente, expediente } = req.body;
        
        if (!paciente) {
            throw new ErrorValidacion('Los datos del paciente son requeridos');
        }

        if (!paciente.dni) {
            throw new ErrorValidacion('El DNI del paciente es obligatorio');
        }
        if (!paciente.nombre) {
            throw new ErrorValidacion('El nombre del paciente es obligatorio');
        }
        if (!paciente.apellido) {
            throw new ErrorValidacion('El apellido del paciente es obligatorio');
        }
        if (!paciente.fechaNacimiento) {
            throw new ErrorValidacion('La fecha de nacimiento es obligatoria');
        }

        if (!expediente) {
            throw new ErrorValidacion('Los datos del expediente son requeridos');
        }

        const usuarioId = req.usuario?.id;
        if (!usuarioId) {
            throw new ErrorValidacion('Usuario no autenticado');
        }

        const resultado = await this.expedienteService.crearConPaciente(paciente, expediente, usuarioId);
        
        res.status(201).json({
            success: true,
            message: 'Expediente y paciente creados exitosamente',
            data: resultado
        });
    });

    obtenerTodos = capturarAsync(async (req, res, next) => {
        const expedientes = await this.expedienteService.obtenerTodos();
        
        res.json({
            success: true,
            data: expedientes
        });
    });

    obtenerPorId = capturarAsync(async (req, res, next) => {
        const { idExpediente } = req.params;

        if (!idExpediente) {
            throw new ErrorValidacion('El ID del expediente es obligatorio');
        }

        const expediente = await this.expedienteService.obtenerPorId(idExpediente);

        if (!expediente) {
            throw new ErrorNoEncontrado('Expediente');
        }

        res.json({
            success: true,
            data: expediente
        });
    });

    obtenerPorPaciente = capturarAsync(async (req, res, next) => {
        const { idPaciente } = req.params;

        if (!idPaciente) {
            throw new ErrorValidacion('El ID del paciente es obligatorio');
        }

        const expediente = await this.expedienteService.obtenerPorPaciente(idPaciente);

        if (!expediente) {
            throw new ErrorNoEncontrado('Expediente para este paciente');
        }

        res.json({
            success: true,
            data: expediente
        });
    });

    
    actualizar = capturarAsync(async (req, res, next) => {
        const { idExpediente } = req.params;
        const { estado, observaciones, paciente } = req.body;

        if (!idExpediente) {
            throw new ErrorValidacion('El ID del expediente es obligatorio');
        }

        const usuarioId = req.usuario?.id;

        const resultado = await this.expedienteService.actualizar(idExpediente, {
            estado,
            observaciones,
            paciente
        }, usuarioId);

        res.json({
            success: true,
            message: 'Expediente actualizado exitosamente',
            data: resultado
        });
    });

    
    eliminar = capturarAsync(async (req, res,next) => {
        const { idExpediente } = req.params;

        if (!idExpediente) {
            throw new ErrorValidacion('El ID del expediente es obligatorio');
        }

        await this.expedienteService.eliminar(idExpediente);

        res.json({
            success: true,
            message: 'Expediente eliminado exitosamente'
        });
    });
}


module.exports = expedienteController;
