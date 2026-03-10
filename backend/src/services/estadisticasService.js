class EstadisticasService {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async obtenerResumenGeneral(usuarioId, rolNombre) {
        try {
            console.log("ROL RECIBIDO EN SERVICE:", rolNombre)

            const dashboardData = {
                tarjetas: [],
                actividadReciente: []
            };

            const rolActual = rolNombre?.toUpperCase().trim();

            // LÓGICA PARA ADMINISTRADOR
            if (rolActual === 'ADMINISTRADOR') {

                const [total, auditoria] = await Promise.all([
                    this.prisma.usuario.count(),
                    this.prisma.auditoria.findMany({
                        take: 6,
                        orderBy: { fecha: 'desc' },
                        include: { usuario: { select: { nombreUsuario: true } } }
                    }),
                    // this.prisma.medicamento.count(), //próximamente
                    // this.prisma.tipoExamen.count() //próximamente
                ]);

                dashboardData.tarjetas = [
                    { titulo: "Usuarios Activos",       valor: total,               icon: "Users",      border: "border-blue-100",      textColor: "text-blue-900",     pie: "Total en sistema" },
                    { titulo: "Eventos de Auditoría",   valor: auditoria.length,    icon: "BarChart3",  border: "border-purple-100",    textColor: "text-purple-600",   pie: "Hoy"              },
                    { titulo: "Medicamentos",           valor: 0,                   icon: "Pill",       border: "border-green-100",     textColor: "text-green-600",    pie: "Proximamente"     },
                    { titulo: "Exámenes",               valor: 0,                   icon: "TestTube",   border: "border-teal-100",      textColor: "text-teal-600",     pie: "Proximamente"     },
                ];

                dashboardData.actividad = auditoria.map(log => ({
                    id: log.id,
                    usuario: log.usuario?.nombreUsuario || "Sistema",
                    accion: log.accion,
                    fecha: log.fecha
                }));
            }

            if (rolNombre === 'RECEPCIONISTA') {

                dashboardData.tarjetas = [
                    { titulo: "Pacientes Atendidos",    valor: 0, icon: "Users",    border: "border-blue-100",      textColor: "text-blue-600",     pie: "Hoy"          },
                    { titulo: "Citas Agendadas",        valor: 0, icon: "Calendar", border: "border-green-100",     textColor: "text-green-600",    pie: "Pendientes"   },
                    { titulo: "Expedientes Creados",    valor: 0, icon: "FileText", border: "border-purple-100",    textColor: "text-purple-600",   pie: "Hoy"          },
                ];
            }

            if (rolNombre === 'MEDICO') {

                dashboardData.tarjetas = [
                    { titulo: "Consultas Realizadas",   valor: 0, icon: "Stethoscope",  border: "border-purple-100",    textColor: "text-purple-600",   pie: "Hoy"          },
                    { titulo: "Consultas Pendientes",   valor: 0, icon: "Calendar",     border: "border-blue-100",      textColor: "text-blue-600",     pie: "Programadas"  },
                    { titulo: "Éxamenes Ordenados",     valor: 0, icon: "TestTube",     border: "border-teal-100",      textColor: "text-teal-600",     pie: "Hoy"          },
                    { titulo: "Recetas Creadas",        valor: 0, icon: "NotebookText", border: "border-purple-100",    textColor: "text-purple-600",   pie: "Hoy"          },
                ];
            }

            if (rolNombre === 'ENFERMERO') {

                dashboardData.tarjetas = [
                    { titulo: "Pacientes Evaluados",        valor: 0, icon: "Users",    border: "border-green-100",     textColor: "text-green-600",    pie: "Hoy"  },
                    { titulo: "Evaluaciones Pendientes",    valor: 0, icon: "Activity", border: "border-orange-100",    textColor: "text-orange-600",   pie: " "    },
                ];
            }            
            
            return dashboardData;
        } catch (error) {
            throw new Error(`Error al compilar estadísticas: ${error.message}`);
        }
    }
}

module.exports = EstadisticasService;