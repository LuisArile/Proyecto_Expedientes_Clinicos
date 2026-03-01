class auditoriaRepository{
    constructor(prisma){
        this.prisma=prisma;
    }

//crear datos en tabla auditoria
    async crear(data){
        try {
            return await this.prisma.auditoria.create({
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

}




module.exports=auditoriaRepository;