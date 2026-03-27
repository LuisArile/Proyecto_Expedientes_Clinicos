const {ErrorNoAutorizado} = require("../utils/errores");
const capturarAsync = require("../utils/capturarAsync");

class EstadisticaController {
    constructor(estadisticaService) {
        this.estadisticaService = estadisticaService;
    }

    obtenerDashboard=capturarAsync(async(req, res, next)=> { 
        const usuarioSesion = req.usuario;

        if (!usuarioSesion) {
            throw new ErrorNoAutorizado('No autenticado');
        }
        
        const datos = await this.estadisticaService.obtenerResumenGeneral(usuarioSesion);
        
        res.json({ success: true, data: datos });
    });
}

module.exports = EstadisticaController;