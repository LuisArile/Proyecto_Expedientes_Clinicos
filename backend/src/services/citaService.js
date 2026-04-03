const { ErrorValidacion, ErrorNoEncontrado, ErrorNoAutorizado } = require('../utils/errores');

class CitaService {
    constructor(citaRepository, auditoriaService) {
        this.citaRepository = citaRepository;
        this.auditoriaService = auditoriaService;
    }

    async agendarCita(data, recepcionistaId) {
        if (!data.pacienteId) throw new ErrorValidacion('el paciente es obligatorio');
        if (!data.fechaCita) throw new ErrorValidacion('la fecha de cita es obligatoria');
        if (!data.horaCita) throw new ErrorValidacion('la hora de cita es obligatoria');
        if (!data.motivo) throw new ErrorValidacion('el motivo de cita es obligatorio');

        const cita = await this.citaRepository.crear({
            ...data,
            tipo: 'PROGRAMADA',
            estado: 'PROGRAMADO',
            recepcionistaId
        });

        await this.auditoriaService.registrar(
            recepcionistaId,
            'CITA_PROGRAMADA',
            `Cita programada para paciente ${cita.paciente.nombre} ${cita.paciente.apellido}`
        );

        return cita;
    }

    async registrarPacienteHoy(data, recepcionistaId) {
        if (!data.pacienteId) throw new ErrorValidacion('Paciente es obligatorio');
        if (!data.motivo) throw new ErrorValidacion('Motivo de atención es obligatorio');

        const cita = await this.citaRepository.crear({
            ...data,
            fechaCita: new Date(),
            horaCita: new Date().toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' }),
            tipo: 'REGISTRO_DIA',
            estado: 'REGISTRADO_HOY',
            recepcionistaId
        });

        await this.auditoriaService.registrar(
            recepcionistaId,
            'PACIENTE_REGISTRADO_HOY',
            `Paciente ${cita.paciente.nombre} ${cita.paciente.apellido} registrado para atención del día`
        );

        return cita;
    }

    async enviarAEsperaPreclinica(idCita, usuarioId) {
        const cita = await this.citaRepository.actualizarEstado(
            idCita,
            'ESPERA_PRECLINICA',
            usuarioId,
            'Enviado a espera de preclínica'
        );

        return cita;
    }

    async iniciarPreclinica(idCita, usuarioId) {
        const cita = await this.citaRepository.actualizarEstado(
            idCita,
            'EN_PRECLINICA',
            usuarioId,
            'Inicio de preclínica'
        );

        return cita;
    }

    async finalizarPreclinica(idCita, usuarioId) {
        const cita = await this.citaRepository.actualizarEstado(
            idCita,
            'ESPERA_CONSULTA',
            usuarioId,
            'Preclínica finalizada, enviado a consulta'
        );

        return cita;
    }

    async iniciarConsulta(idCita, usuarioId) {
        const cita = await this.citaRepository.actualizarEstado(
            idCita,
            'EN_CONSULTA',
            usuarioId,
            'Inicio de consulta médica'
        );

        return cita;
    }

    async finalizarConsulta(idCita, usuarioId) {
        const cita = await this.citaRepository.actualizarEstado(
            idCita,
            'FINALIZADO',
            usuarioId,
            'Consulta finalizada'
        );

        return cita;
    }

    async obtenerTablero(fecha = null) {
        return await this.citaRepository.obtenerTablero(fecha);
    }

    async obtenerTrazabilidad(idCita) {
        const trazabilidad = await this.citaRepository.obtenerTrazabilidad(idCita);
        if (!trazabilidad.length) {
            throw new ErrorNoEncontrado('No hay trazabilidad para esta cita');
        }
        return trazabilidad;
    }

    async obtenerCitasPorEstado(estado, rol) {
        const estadosPermitidos = {
            RECEPCIONISTA: ['PROGRAMADO', 'REGISTRADO_HOY', 'ESPERA_PRECLINICA', 'FINALIZADO'],
            ENFERMERO: ['ESPERA_PRECLINICA', 'EN_PRECLINICA'],
            DOCTOR: ['ESPERA_CONSULTA', 'EN_CONSULTA']
        };

        if (!estadosPermitidos[rol]?.includes(estado)) {
            throw new ErrorNoAutorizado('No tiene permisos para ver estos pacientes');
        }

        return await this.citaRepository.obtenerPorEstado(estado);
    }
}

module.exports = CitaService;
