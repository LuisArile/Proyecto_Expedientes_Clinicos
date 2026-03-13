class auditoriaRepository{
    constructor(prisma){
        this.prisma=prisma;
    }

//crear datos en tabla auditoria
    async crear(data, tx = null){
        const cliente = tx || this.prisma;
        try {
            return await cliente.auditoria.create({
                data: {
                    usuarioId: data.usuarioId,
                    accion: data.accion,
                    detalles: data.detalles || null
                }, 
                include: { usuario: true }
            });

        } catch (error) {
            throw new Error(`Error al crear registro de auditoría: ${error.message}`);
        }
    }

    async obtenerRecientes(limite = 6) {
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
            include: { 
                usuario: { select: { nombre: true, apellido: true, nombreUsuario: true } } 
            }
        });
    }
}




module.exports=auditoriaRepository;