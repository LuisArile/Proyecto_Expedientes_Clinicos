
const {ErrorNoAutorizado} = require("../utils/errores");
const capturarAsync = require("../utils/capturarAsync");

class EstadisticasController {
    constructor(estadisticasService) {
        this.estadisticasService = estadisticasService;
    }

    obtenerDashboard=capturarAsync(async(req, res)=> { 
            const usuarioSesion = req.usuario;

            if (!usuarioSesion) {
                throw new ErrorNoAutorizado('No autenticado');
            }
            
            const datos = await this.estadisticasService.obtenerResumenGeneral(usuarioSesion);
            
            res.json({ success: true, data: datos });
    });

}

module.exports = EstadisticasController;