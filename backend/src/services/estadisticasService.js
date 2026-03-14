class EstadisticasService {
    constructor(prisma, usuarioRepo, auditoriaRepo, pacienteRepo, expedienteRepo) {
        this.prisma = prisma;
        this.usuarioRepo = usuarioRepo;
        this.auditoriaRepo = auditoriaRepo;
        this.pacienteRepo = pacienteRepo;
        this.expedienteRepo = expedienteRepo;

        this.estrategias = {
            ADMINISTRADOR: this.obtenerAdminData.bind(this),
            RECEPCIONISTA: this.obtenerRecepcionistaData.bind(this),
            MEDICO: this.obtenerMedicoData.bind(this),
            ENFERMERO: this.obtenerEnfermeroData.bind(this)
        };
    }

    async obtenerResumenGeneral(usuarioSesion) {
        const rolActual = usuarioSesion.rol?.toUpperCase().trim();
        const estrategia = this.estrategias[rolActual];
        
        if (!estrategia) return { tarjetas: [], actividad: [] };
        
        return await estrategia(usuarioSesion);
    }

    async obtenerAdminData(usuarioSesion) {
        const [usuarios, auditoria] = await Promise.all([
            this.usuarioRepo.obtenerTodos(),
            this.auditoriaRepo.obtenerRecientes(6),
            // this.medicamentoRepo.count(), //próximamente
            // this.examenRepo.count() //próximamente
        ]);

        return {
            tarjetas: [
                { id: 'usuarios',       valor: usuarios.length,     pie: "Total en sistema" },
                { id: 'auditoria',      valor: auditoria.length,    pie: "Logs recientes" },
                { id: 'medicamentos',   valor: 0,                   pie: "Próximamente" },
                { id: 'examenes',       valor: 0,                   pie: "Próximamente" }
            ],
            actividad: auditoria.map(log => ({
                id: log.id,
                usuario: log.usuario ? `${log.usuario.nombre} ${log.usuario.apellido}` : "Sistema",
                accion: log.accion,
                fecha: log.fecha,
                detalles: log.detalles
            }))
        };
    }

    async obtenerRecepcionistaData(usuarioSesion) {
        const inicioHoy = new Date();
        inicioHoy.setHours(0, 0, 0, 0); 

        const esAdmin = usuarioSesion.rol === 'ADMINISTRADOR' || usuarioSesion.idRol === 1;
        
        const usuarioIdFiltro = esAdmin ? null : usuarioSesion.id;
        const [expedientesHoy, actividadReciente] = await Promise.all([
            this.expedienteRepo.contarCreadosHoy(usuarioIdFiltro, 'CREACIÓN DE EXPEDIENTE'),
            this.auditoriaRepo.buscarActividad({ 
                accion: 'CREACIÓN DE EXPEDIENTE', 
                fechaGte: inicioHoy,
                ...(usuarioIdFiltro && { usuarioId: usuarioIdFiltro })
            }, 6)
        ]);

        return {
            tarjetas: [
                { id: 'pacientes',  valor: 0, pie: "Registrados Hoy" },
                { id: 'expedientes', valor: expedientesHoy || 0, pie: "Creados hoy" },
                { id: 'citas', valor: 0, pie: "Agendadas" }
            ],
            actividad: actividadReciente.map(log => ({
                id: log.id,
                usuario: log.usuario ? `${log.usuario.nombre} ${log.usuario.apellido}` : "Sistema",
                accion: log.accion,
                fecha: log.fecha,
                detalles: log.detalles
            }))
        };
    }
    
    async obtenerMedicoData(usuarioSesion) {
        return {
            tarjetas: [
                { id: 'consultasRealizadas',    valor: 0, pie: "Hoy" },
                { id: 'consultasPendientes',    valor: 0, pie: "Programadas" },
                { id: 'examenesOrdenados',      valor: 0, pie: "Hoy" },
                { id: 'recetasCreadas',         valor: 0, pie: "Hoy" }
            ],
            actividad: []
        };
    }
    
    async obtenerEnfermeroData() {
        const totalEvaluados = await this.prisma.registroPreclinico.count();

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const manana = new Date(hoy);
        manana.setDate(manana.getDate() + 1);

        const evaluadosHoy = await this.prisma.registroPreclinico.count({
            where: {
                fechaRegistro: { gte: hoy, lt: manana }
            }
        });

        const actividadReciente = await this.prisma.registroPreclinico.findMany({
            where: {
                fechaRegistro: { gte: hoy, lt: manana }
            },
            orderBy: { fechaRegistro: 'desc' },
            take: 10,
            include: {
                expediente: {
                    include: { paciente: true }
                },
                enfermero: {
                    select: { nombre: true, apellido: true }
                }
            }
        });

    async obtenerEnfermeroData(usuarioSesion) {
        return {
            tarjetas: [
                { id: 'pacientesEvaluados', valor: totalEvaluados, pie: `${evaluadosHoy} hoy` },
                { id: 'evaluacionesPendientes', valor: 0, pie: "Próximamente" }
            ],
            actividad: actividadReciente.map(reg => ({
                id: reg.id,
                primaryText: `${reg.expediente?.paciente?.nombre} ${reg.expediente?.paciente?.apellido}`,
                secondaryText: `Signos vitales registrados`,
                fecha: reg.fechaRegistro
            }))
        };
    }
}

module.exports = EstadisticasService;