class auditoriaRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async crear(data, tx = null) {
        const cliente = tx || this.prisma;
        
        try {
            const detallesString = data.detalles && typeof data.detalles === 'object' 
                ? JSON.stringify(data.detalles) 
                : data.detalles;

            return await cliente.auditoria.create({
                data: {
                    usuarioId: data.usuarioId,
                    accion: data.accion,
                    detalles: detallesString || null,
                    fecha: new Date() 
                },
                include: { 
                    usuario: { 
                        select: { nombre: true, apellido: true, nombreUsuario: true } 
                    } 
                }
            });
        } catch (error) {
            throw new Error(`Error al crear registro de auditoría: ${error.message}`);
        }
    }

    async obtenerTodos(limite = 100) {
        return await this.prisma.auditoria.findMany({
            take: limite,
            orderBy: { fecha: 'desc' },
            include: { 
                usuario: { 
                    select: { 
                        nombre: true, 
                        apellido: true, 
                        nombreUsuario: true,
                        rol: { select: { nombre: true } }
                    } 
                } 
            }
        });
    }

    async obtenerLogsDeHoy() {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return await this.prisma.auditoria.findMany({
            where: {
                fecha: {
                    gte: hoy
                }
            },
            orderBy: { fecha: 'desc' },
            include: { 
                usuario: { 
                    select: { 
                        nombre: true, 
                        apellido: true, 
                        nombreUsuario: true 
                    } 
                } 
            }
        });
    }

    async obtenerEstadisticas() {
        const hoy = new Date();
        hoy.setHours(0,0,0,0);

        const [total, hoyConteo, usuariosUnicos] = await Promise.all([
            prisma.auditoria.count(),
            prisma.auditoria.count({ where: { fecha: { gte: hoy } } }),
            prisma.auditoria.groupBy({
                by: ['usuarioId'],
                where: { usuarioId: { not: null } }
            })
        ]);

        return {
            total,
            hoy: hoyConteo,
            usuariosActivos: usuariosUnicos.length
        };
    }

    async obtenerRecientes(limite = 10) {
        return await this.prisma.auditoria.findMany({
            take: limite,
            orderBy: { fecha: 'desc' },
            include: { 
                usuario: { 
                    select: { 
                        nombre: true, 
                        apellido: true, 
                        nombreUsuario: true 
                    } 
                } 
            }
        });
    }

    async buscarActividad(filtros = {}, limite = 10) {
        const { accion, usuarioId, fechaGte } = filtros;
        
        return await this.prisma.auditoria.findMany({
            where: {
                ...(accion && { accion: { contains: accion } }),
                ...(usuarioId && { usuarioId: Number(usuarioId) }),
                ...(fechaGte && { fecha: { gte: fechaGte } })
            },
            take: limite,
            orderBy: { fecha: 'desc' },
            include: { usuario: { select: { nombre: true, apellido: true, nombreUsuario: true } } }
        });
    }
}

module.exports = auditoriaRepository;