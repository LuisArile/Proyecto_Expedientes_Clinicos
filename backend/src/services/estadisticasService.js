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

    async obtenerResumenGeneral(usuarioId, rolNombre) {
        const rolActual = rolNombre?.toUpperCase().trim();
        const estrategia = this.estrategias[rolActual];
        
        if (!estrategia) return { tarjetas: [], actividad: [] };
        
        return await estrategia();
    }

    async obtenerAdminData() {
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

    async obtenerRecepcionistaData() {
        const [expedientesHoy, auditoria] = await Promise.all([
            this.expedienteRepo.contarCreadosHoy(),
            this.auditoriaRepo.buscarActividad({ 
            accion: 'CREACIÓN'
        }, 6)
    ]);

        return {
            tarjetas: [
                { id: 'pacientes',      valor: 0,                   pie: "Registrados Hoy" },
                { id: 'expedientes',    valor: expedientesHoy,      pie: "Creados hoy" },
                { id: 'citas',          valor: 0,                   pie: "Agendadas" }
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
    
    async obtenerMedicoData() {
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
        return {
            tarjetas: [
                { id: 'pacientesEvaluados',     valor: 0, pie: "Próximamente" },
                { id: 'evaluacionesPendientes', valor: 0, pie: "Próximamente" }
            ],
            actividad: []
        };
    }
}

module.exports = EstadisticasService;