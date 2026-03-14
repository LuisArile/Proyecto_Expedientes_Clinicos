class auditoriaRepository{
    constructor(prisma){
        this.prisma=prisma;
    }

//crear datos en tabla auditoria
async crear(data) {
        try {

            const detallesString = data.detalles && typeof data.detalles === 'object' 
                ? JSON.stringify(data.detalles) 
                : data.detalles;

            return await this.prisma.auditoria.create({
                data: {
                    usuarioId: data.usuarioId,
                    accion: data.accion,
                    detalles: detallesString,
                    fecha: new Date()
                },
                include: { usuario: true }
            });
        } catch (error) {
            throw new Error(`Error al crear registro de auditoría: ${error.message}`);
        }
    }
}




module.exports=auditoriaRepository;