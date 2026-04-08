class EstadisticaService {
    constructor(prisma, usuarioRepository, auditoriaRepository, pacienteRepository, expedienteRepository, consultaMedicaRepository, registroPreclinicoRepository, recetaMedicaRepository, examenRepository, medicamentoRepository) {
        this.prisma = prisma;
        this.usuarioRepository = usuarioRepository;
        this.auditoriaRepository = auditoriaRepository;
        this.pacienteRepository = pacienteRepository;
        this.expedienteRepository = expedienteRepository;
        this.consultaMedicaRepository = consultaMedicaRepository;
        this.registroPreclinicoRepository = registroPreclinicoRepository;
        this.recetaRepository = recetaMedicaRepository;
        this.examenRepository = examenRepository;
        this.medicamentoRepository = medicamentoRepository;

        this.rolesPorId = {
            1: 'ADMINISTRADOR',
            2: 'MEDICO',
            3: 'RECEPCIONISTA',
            4: 'ENFERMERO'
        };

        this.estrategias = {
            ADMINISTRADOR: this.obtenerAdminData.bind(this),
            MEDICO: this.obtenerMedicoData.bind(this),
            RECEPCIONISTA: this.obtenerRecepcionistaData.bind(this),
            ENFERMERO: this.obtenerEnfermeroData.bind(this)
        };
    }

    async obtenerResumenGeneral(usuarioSesion) {
        const rolActual = (
            usuarioSesion.rol ||
            this.rolesPorId[usuarioSesion.idRol] ||
            ""
        ).toUpperCase();

        const metodoEstrategia = this.estrategias[rolActual];

        if (!metodoEstrategia) {
            console.error(`No se encontró estrategia para el rol: [${rolActual}], ID: [${usuarioSesion.idRol}]`);
            return { tarjetas: [], actividad: [] };
        }

        const filtroId = rolActual === 'ADMINISTRADOR' ? null : usuarioSesion.id;

        return await metodoEstrategia(usuarioSesion, filtroId);
    }

    async obtenerAdminData() {
        const [usuarios, logsHoy, logsRecientes, examenesActivos, medicamentosActivos] = await Promise.all([
            this.usuarioRepository.obtenerTodos(),
            this.auditoriaRepository.obtenerLogsDeHoy(),
            this.auditoriaRepository.obtenerRecientes(10),
            this.examenRepository.obtenerActivos(),
            this.medicamentoRepository.obtenerActivos()
        ]);

        return {
            tarjetas: [
                { id: 'usuarios', valor: usuarios.length, pie: "Total en sistema" },
                { id: 'auditoria', valor: logsHoy.length, pie: "Movimientos de hoy" },
                { id: 'medicamentos', valor: medicamentosActivos.length, pie: "Activos" },
                { id: 'examenes', valor: examenesActivos.length, pie: "Activos" }
            ],
            actividad: logsRecientes.map(log => ({
                id: log.id,
                primaryText: log.usuario ? `${log.usuario.nombre} ${log.usuario.apellido}` : "Sistema",
                secondaryText: log.accion,
                fecha: log.fecha,
                detalles: log.detalles
            }))
        };
    }

    async obtenerRecepcionistaData(usuarioSesion, filtroId) {
        const inicioHoy = new Date();
        inicioHoy.setHours(0, 0, 0, 0);

        const [expedientesHoy, actividadReciente] = await Promise.all([
            this.expedienteRepository.contarCreadosHoy(filtroId),
            this.auditoriaRepository.buscarActividad(
                {
                    accion: 'CREACIÓN DE EXPEDIENTE',
                    fechaGte: inicioHoy,
                    ...(filtroId && { usuarioId: filtroId })
                },
                10
            )
        ]);

        return {
            tarjetas: [
                { id: 'pacientes', valor: 0, pie: "Registrados Hoy" },
                { id: 'expedientes', valor: expedientesHoy || 0, pie: "Creados hoy" },
                { id: 'citas', valor: 0, pie: "Agendadas" }
            ],
            actividad: actividadReciente.map(log => ({
                id: log.id,
                primaryText: log.usuario ? `${log.usuario.nombre} ${log.usuario.apellido}` : "Sistema",
                secondaryText: log.accion,
                fecha: log.fecha
            }))
        };
    }

    async obtenerMedicoData(usuarioSesion, filtroId) {
        const [consultasHoy, actividadReciente, recetasHoy] = await Promise.all([
            this.consultaMedicaRepository.contarConsultasHoy(filtroId),
            this.consultaMedicaRepository.obtenerRecientesPorMedico(filtroId, 10),
            this.recetaRepository.contarRecetasHoy(filtroId)
        ]);

        return {
            tarjetas: [
                { id: 'consultasRealizadas', valor: consultasHoy || 0, pie: "Atenciones" },
                { id: 'consultasPendientes', valor: 0, pie: "En sala de espera" },
                { id: 'examenesOrdenados', valor: 0, pie: "Hoy" },
                { id: 'recetasCreadas', valor: recetasHoy || 0, pie: "Hoy" }
            ],
            actividad: actividadReciente.map(con => ({
                id: con.id,
                primaryText: con.expediente?.paciente
                    ? `${con.expediente.paciente.nombre} ${con.expediente.paciente.apellido}`
                    : "Paciente Desconocido",
                secondaryText: `Consulta: ${con.tipoConsulta || 'General'}`,
                fecha: con.fechaConsulta
            }))
        };
    }

    async obtenerEnfermeroData(usuarioSesion, filtroId) {
        const [total, hoy, recientes] = await Promise.all([
            this.registroPreclinicoRepository.contarTodos(),
            this.registroPreclinicoRepository.contarEvaluadosHoy(filtroId),
            this.registroPreclinicoRepository.obtenerRecientes(filtroId, 10)
        ]);

        return {
            tarjetas: [
                { id: 'pacientesEvaluados', valor: total, pie: `${hoy} hoy` },
                { id: 'evaluacionesPendientes', valor: 0, pie: "Próximamente" },
                { id: 'evaluacionesPendientes2', valor: 0, pie: "Próximamente" }
            ],
            actividad: recientes.map(reg => ({
                id: reg.id,
                primaryText: `${reg.expediente?.paciente?.nombre || ''} ${reg.expediente?.paciente?.apellido || ''}`.trim(),
                secondaryText: "Signos vitales registrados",
                fecha: reg.fechaRegistro
            }))
        };
    }
}

module.exports = EstadisticaService;