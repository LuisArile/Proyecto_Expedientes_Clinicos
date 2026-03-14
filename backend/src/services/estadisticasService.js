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
                usuario: log.usuario?.nombreUsuario || "Sistema",
                accion: log.accion,
                fecha: log.fecha
            }))
        };
    }

    async obtenerRecepcionistaData() {
        const totalPacientes = await this.prisma.paciente.count(); 
        
        return {
            tarjetas: [
                { id: 'pacientes',      valor: totalPacientes,      pie: "Registrados" },
                { id: 'expedientes',    valor: 0,                   pie: "Creados hoy" },
                { id: 'citas',          valor: 0,                   pie: "Agendadas" }
            ],
            actividad: []
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