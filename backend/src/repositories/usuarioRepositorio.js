const { connect } = require("../app");
const { usuario } = require("../config/prisma");

class usuarioRepository{
    constructor(prisma){
        this.prisma=prisma;
    }

//creacion de nuevo usuario
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

    async obtenerTodos(){

        try {
            return await this.prisma.usuario.findMany({include:{auditorias:true}});
        } catch (error) {
            throw new Error(`Error al obtener usuarios:${error.message} `);
            
        }
    }

    
    async filtrarNombreUsuario(nombreUsuario){

        try {
            return await this.prisma.usuario.findUnique({where:{nombreUsuario}});
        } catch (error) {
            throw new Error(`Error al obtener usuarios:${error.message} `);
            
        }
    }
    

    async registrarAccionUsuario(usuarioId, accion){

        try {
            console.log('intentando registrar accion:',{usuarioId, accion});

            if(!usuarioId){
                throw new Error('ID de usuario no proporcionado')
            }
            const id= Number(usuarioId);
            console.log('ID convertido:', id);


            if(isNaN(id)){
                throw new Error(`ID no valido: ${usuarioId}` );
            }

            const usuarioExiste= await this.prisma.usuario.findUnique({where: {id:id}})
            console.log('Usuario existe: ', usuarioExiste);

            if(!usuarioExiste){
                throw new Error(`Usuario con ID ${id} no encontrado`);
            }
           
            const auditoria= await this.prisma.auditoria.create({data:{usuarioId: id ,accion:accion}});
            console.log('Auditoria creada:', auditoria)
            return auditoria;

        } catch (error) {
            throw new Error(`Error al registrar accion:${error.message} `);
            
        }
    }

    
}




module.exports=usuarioRepository;