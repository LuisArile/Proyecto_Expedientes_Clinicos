
const { ErrorValidacion, ErrorNoEncontrado, ErrorNoAutorizado } = require('../utils/errores');

class CitaService {
    constructor(citaRepository, auditoriaService) {
        this.citaRepository = citaRepository;
        this.auditoriaService = auditoriaService;
    }


    async agendarCita(data, recepcionistaId) {
        if (!data.pacienteId) throw new ErrorValidacion('El paciente es obligatorio');
        if (!data.fechaCita) throw new ErrorValidacion('La fecha de cita es obligatoria');
        if (!data.horaCita) throw new ErrorValidacion('La hora de cita es obligatoria');
        if (!data.motivo) throw new ErrorValidacion('El motivo de cita es obligatorio');

        const citaData = {
            pacienteId: data.pacienteId,
            fechaCita: data.fechaCita,
            horaCita: data.horaCita,
            motivo: data.motivo,
            prioridad: data.prioridad || 'NORMAL',
            tipo: 'PROGRAMADA',
            estado: 'PROGRAMADO',
            recepcionistaId: recepcionistaId
        };

        const cita = await this.citaRepository.crear(citaData);

        await this.auditoriaService.registrar(
            recepcionistaId,
            'CITA_PROGRAMADA',
            `Cita programada para paciente ${cita.paciente.nombre} ${cita.paciente.apellido}`
        );

        return cita;
    }


    //Lo hace recepcionista
    async registrarPacienteHoy(data, recepcionistaId) {
        if (!data.pacienteId) throw new ErrorValidacion('El paciente es obligatorio');
        if (!data.motivo) throw new ErrorValidacion('El motivo de atención es obligatorio');

        const ahora = new Date();
        const horaFormateada = ahora.toLocaleTimeString('es-HN', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });

        const citaData = {
            pacienteId: data.pacienteId,
            fechaCita: ahora,
            horaCita: horaFormateada,
            motivo: data.motivo,
            prioridad: data.prioridad || 'NORMAL',
            tipo: 'REGISTRO_DIA',
            estado: 'REGISTRADO_HOY',
            recepcionistaId: recepcionistaId
        };

        const cita = await this.citaRepository.crear(citaData);

        await this.auditoriaService.registrar(
            recepcionistaId,
            'PACIENTE_REGISTRADO_HOY',
            `Paciente ${cita.paciente.nombre} ${cita.paciente.apellido} registrado para atención del día`
        );

        return cita;
    }

    async enviarAEsperaPreclinica(idCita, usuarioId) {

        if (!idCita || isNaN(Number(idCita))) {
            throw new ErrorValidacion('El ID de la cita es inválido');
        }

        const cita = await this.citaRepository.actualizarEstado(
            idCita,
            'ESPERA_PRECLINICA',
            usuarioId,
            'Enviado a espera de preclínica'
        );

        if (!cita) {
            throw new ErrorNoEncontrado(`Cita con ID ${idCita} no encontrada`);
        }
        
        return cita;
    }


    // ENFERMERO

    async iniciarPreclinica(idCita, usuarioId) {
        if (!idCita || isNaN(Number(idCita))) {
            throw new ErrorValidacion('El ID de la cita es inválido');
        }

        const cita = await this.citaRepository.actualizarEstado(
            idCita,
            'EN_PRECLINICA',
            usuarioId,
            'Inicio de preclínica'
        );

        if (!cita) {
            throw new ErrorNoEncontrado(`Cita con ID ${idCita} no encontrada`);
        }
        return cita;
    }

    async finalizarPreclinica(idCita, usuarioId) {

        if (!idCita || isNaN(Number(idCita))) {
            throw new ErrorValidacion('El ID de la cita es inválido');
        }

        const cita = await this.citaRepository.actualizarEstado(
            idCita,
            'ESPERA_CONSULTA',
            usuarioId,
            'Preclínica finalizada, enviado a consulta'
        );

        if (!cita) {
            throw new ErrorNoEncontrado(`Cita con ID ${idCita} no encontrada`);
        }

        return cita;
    }

    // MEDICO

    async iniciarConsulta(idCita, usuarioId) {

        if (!idCita || isNaN(Number(idCita))) {
            throw new ErrorValidacion('El ID de la cita es inválido');
        }

        const cita = await this.citaRepository.actualizarEstado(
            idCita,
            'EN_CONSULTA',
            usuarioId,
            'Inicio de consulta médica'
        );

        if (!cita) {
            throw new ErrorNoEncontrado(`Cita con ID ${idCita} no encontrada`);
        }
        return cita;
    }

    async finalizarConsulta(idCita, usuarioId) {

        if (!idCita || isNaN(Number(idCita))) {
            throw new ErrorValidacion('El ID de la cita es inválido');
        }

        const cita = await this.citaRepository.actualizarEstado(
            idCita,
            'FINALIZADO',
            usuarioId,
            'Consulta finalizada'
        );

        if (!cita) {
            throw new ErrorNoEncontrado(`Cita con ID ${idCita} no encontrada`);
        }

        return cita;
    }

    

// TABLERO Y SEGUIMIENTO
    async obtenerTablero(fecha = null) {
        return await this.citaRepository.obtenerTablero(fecha);
    }

    async obtenerSeguimiento(idCita) {

        if (!idCita || isNaN(Number(idCita))) {
            throw new ErrorValidacion('El ID de la cita es inválido');
        }

        const seguimiento = await this.citaRepository.obtenerSeguimiento(idCita);
        if (!seguimiento.length) {
            throw new ErrorNoEncontrado('No hay seguimiento para esta cita');
        }
        return seguimiento;
    }

    async obtenerCitasPorEstado(estado) {

        const estadosValidos = ['PROGRAMADO', 'REGISTRADO_HOY', 'ESPERA_PRECLINICA', 'EN_PRECLINICA', 'ESPERA_CONSULTA', 'EN_CONSULTA', 'FINALIZADO'];

        if (!estadosValidos.includes(estado)) {
            throw new ErrorValidacion(`Estado inválido: ${estado}`);
        }

        return await this.citaRepository.obtenerPorEstado(estado);
    }
}

module.exports = CitaService;
