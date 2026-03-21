const BusquedaPacienteDTO = require('../dtos/BusquedaPacienteDTO');
const capturarAsync = require("../utils/capturarAsync");
const { ErrorValidacion } = require("../utils/errores");

class BusquedaController {
    constructor(busquedaService) {
        this.busquedaService = busquedaService;
    }

    buscarGlobal = capturarAsync(async (req, res, next) => {
        let filtroDto;

        try {
            filtroDto = new BusquedaPacienteDTO(req.query);
        } catch (error) {
            throw new ErrorValidacion(error.message);
        }
        const usuarioId = req.usuario?.id;

        const resultados = await this.busquedaService.buscarPacientes(filtroDto, usuarioId)

        res.status(200).json({
            success: true,
            message: resultados.paginacion.total > 0 ? 'Resultados encontrados' : 'No se encontraron coincidencias',
            data: resultados,
            paginacion: resultados.paginacion
        });
    });
}

module.exports = BusquedaController;