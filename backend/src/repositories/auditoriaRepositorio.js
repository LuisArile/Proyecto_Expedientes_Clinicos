class auditoriaRepository{
    constructor(prisma){
        this.prisma=prisma;
    }

//crear datos en tabla auditoria
    async crear(data){
        try {
            return await this.prisma.auditoria.create({
                data: {
                    usuarioID: data.usuarioID,
                    accion:data.accion

                }, include:{usuario:true}});

        } catch (error) {
            throw  new Error (`Error al crear usuario : ${error.message}`);
        }
    }

}




module.exports=auditoriaRepository;