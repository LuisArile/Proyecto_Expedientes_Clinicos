const capturarAsync = require('../utils/capturarAsync');
const {ErrorNoAutorizado } = require('../utils/errores');

class CitaController {
    constructor(citaService) {
        this.citaService = citaService;
    }

    // Recepcionista
    agendarCita = capturarAsync(async (req, res) => {
        if (req.usuario.idRol !== 3 && req.usuario.idRol !== 1) {
            throw new ErrorNoAutorizado('Solo recepcionistas y Admin pueden agendar citas');
        }

        const cita = await this.citaService.agendarCita(req.body, req.usuario.id);
        res.status(201).json({ success: true, data: cita });
    });

    registrarPacienteHoy = capturarAsync(async (req, res) => {
        if (req.usuario.idRol !== 3 && req.usuario.idRol !== 1) {
            throw new ErrorNoAutorizado('Solo recepcionistas y Admin pueden registrar pacientes');
        }

        const cita = await this.citaService.registrarPacienteHoy(req.body, req.usuario.id);
        res.status(201).json({ success: true, data: cita });
    });

    enviarAEsperaPreclinica = capturarAsync(async (req, res) => {
        if (req.usuario.idRol !== 3 && req.usuario.idRol !== 1) {
            throw new ErrorNoAutorizado('Solo recepcionistas y Admin  pueden enviar a preclínica');
        }

        const { idCita } = req.params;
        const cita = await this.citaService.enviarAEsperaPreclinica(Number(idCita), req.usuario.id);
        res.json({ success: true, data: cita });
    });

    // Enfermero
    iniciarPreclinica = capturarAsync(async (req, res) => {
        if (req.usuario.idRol !== 4 && req.usuario.idRol !== 1) {
            throw new ErrorNoAutorizado('Solo enfermeros y Admin pueden iniciar preclínica');
        }

        const { idCita } = req.params;
        const cita = await this.citaService.iniciarPreclinica(Number(idCita), req.usuario.id);
        res.json({ success: true, data: cita });
    });

    finalizarPreclinica = capturarAsync(async (req, res) => {
        if (req.usuario.idRol !== 4 && req.usuario.idRol !== 1) {
            throw new ErrorNoAutorizado('Solo enfermeros y Admin pueden finalizar preclínica');
        }

        const { idCita } = req.params;
        const cita = await this.citaService.finalizarPreclinica(Number(idCita), req.usuario.id);
        res.json({ success: true, data: cita });
    });

    // Medico
    iniciarConsulta = capturarAsync(async (req, res) => {
        if (req.usuario.idRol !== 2 && req.usuario.idRol !== 1) {
            throw new ErrorNoAutorizado('Solo doctores y admin pueden iniciar consulta');
        }

        const { idCita } = req.params;
        const cita = await this.citaService.iniciarConsulta(Number(idCita), req.usuario.id);
        res.json({ success: true, data: cita });
    });

    finalizarConsulta = capturarAsync(async (req, res) => {
        if (req.usuario.idRol !== 2 && req.usuario.idRol !== 1) {
            throw new ErrorNoAutorizado('Solo doctores y Admin pueden finalizar consulta');
        }

        const { idCita } = req.params;
        const cita = await this.citaService.finalizarConsulta(Number(idCita), req.usuario.id);
        res.json({ success: true, data: cita });
    });

    // Tablero y trazabilidad
    obtenerTablero = capturarAsync(async (req, res) => {
        const tablero = await this.citaService.obtenerTablero();
        res.json({ success: true, data: tablero });
    });

    obtenerSeguimiento= capturarAsync(async (req, res) => {
        const { idCita } = req.params;
        const seguimiento = await this.citaService.obtenerSeguimiento(Number(idCita));
        res.json({ success: true, data: seguimiento });
    });

    obtenerCitasPorEstado = capturarAsync(async (req, res) => {
        const { estado } = req.params;
        const rol = req.usuario.rol?.nombre;
        const citas = await this.citaService.obtenerCitasPorEstado(estado, rol);
        res.json({ success: true, data: citas });
    });
}

module.exports = CitaController;
