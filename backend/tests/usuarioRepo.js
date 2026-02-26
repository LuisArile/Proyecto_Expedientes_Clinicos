
/*
class usuarioRepository{
    constructor(prisma){
        this.prisma=prisma;
    }

//creacion de nuevo usuario
    async crear(data){
        try {
            return await this.prisma.usuario.create({
                data: {
                    email:data.email,
                    password: data.password,
                    rol:data.rol 
                }});

        } catch (error) {
            throw  new Error (`Error al crear usuario : ${error.message}`);
        }
    }

    async obtenerTodos(){

        try {
            return await this.prisma.usuario.findMany();
        } catch (error) {
            throw new Error(`Error al obtener usuarios:${error.message} `);
            
        }
    }
}

*/

