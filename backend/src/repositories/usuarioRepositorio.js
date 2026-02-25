
const { usuario } = require("../config/prisma");
const UsuarioBase= require('../facturyMet/usuarioBaseFact');

class usuarioRepository{
    constructor(prisma){
        this.prisma=prisma;
    }

/*
    async crear(data){
        try {
            return await this.prisma.usuario.create({
                data: {
                    nombreUsuario: data.nombreUsuario,
                    correo:data.correo,
                    clave: data.clave,
                    rol:data.rol,
                    activo:data.activo !==undefined ? data.activo:true
                }});

        } catch (error) {
            throw  new Error (`Error al crear usuario : ${error.message}`);
        }
    }

    */
    async obtenerTodos(){

        try {
            return await this.prisma.usuario.findMany({include:{auditorias:true}});
        } catch (error) {
            throw new Error(`Error al obtener usuarios:${error.message} `);
            
        }
    }

    
    async filtrarNombreUsuario(nombreUsuario){

            const data= await this.prisma.usuario.findUnique({
                where:{nombreUsuario}});

                return data ? UsuarioBase.crearUsuario(data) : null;
    }
    

    async registrarAccionUsuario(usuarioId, accion,detalles={}){

        return await this.prisma.auditoria.create({
            data: {

                usuarioId: usuarioId ? Number (usuarioId) : null, detalles: JSON.stringify(detalles),fecha: new Date()
            }

        });
    }

    async actualizarUltimoAcceso(id){
        return await this.prisma.usuario.update({
            where: {id:Number(id)},
            data: {ultimiAcceso : new Date}
        });
    }

    
}




module.exports=usuarioRepository;