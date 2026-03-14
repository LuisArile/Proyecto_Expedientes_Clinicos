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
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const manana = new Date(hoy);
        manana.setDate(manana.getDate() + 1);

        const esAdmin = usuarioSesion.rol === 'ADMINISTRADOR' || usuarioSesion.idRol === 1;
        const filtroMedico = esAdmin ? {} : { medicoId: usuarioSesion.id };

        const [consultasHoy, recetasHoy, actividadReciente] = await Promise.all([
            this.prisma.consultaMedica.count({
                where: {
                    ...filtroMedico,
                    fechaConsulta: { gte: hoy, lt: manana }
                }
            }),
            this.prisma.recetaMedica.count({
                where: {
                    consulta: {
                        ...filtroMedico,
                        fechaConsulta: { gte: hoy, lt: manana }
                    }
                }
            }),
            this.prisma.consultaMedica.findMany({
                where: filtroMedico,
                take: 6,
                orderBy: { fechaConsulta: 'desc' },
                include: {
                    expediente: {
                        include: { paciente: true }
                    }
                }
            })
        ]);

        return {
            tarjetas: [
                { id: 'consultasRealizadas', valor: consultasHoy, pie: "Atenciones hoy" },
                { id: 'consultasPendientes', valor: 0, pie: "En sala de espera" /* Próximamente*/},
                { id: 'examenesOrdenados', valor: 0, pie: "Hoy" },
                { id: 'recetasCreadas', valor: 0, pie: "Hoy" }
            ],
            actividad: actividadReciente.map(con => ({
                id: con.id,
                primaryText: `${con.expediente?.paciente?.nombre} ${con.expediente?.paciente?.apellido}`,
                secondaryText: `Consulta: ${con.tipoConsulta || 'General'} - Dx: ${con.diagnostico.substring(0, 40)}${con.diagnostico.length > 40 ? '...' : ''}`,
                fecha: con.fechaConsulta
            }))
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