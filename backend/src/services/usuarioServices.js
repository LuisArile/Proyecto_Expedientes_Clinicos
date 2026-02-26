const bcrypt=require('bcrypt');
const Encriptador= require('../utils/encritador');


class usuarioService{
    constructor(usuarioRepository){
        this.usuarioRepository=usuarioRepository;
    }

    async  crear(data) {

        try {
          const existeNombre=await this.usuarioRepository.filtrarNombreUsuario(data.nombreUsuario);
          if(existeNombre){
            throw new Error (`El nombre de usuario ya esta registrado : ${error.message}`)
          }

          //encriptacion

         data.clave= await Encriptador.encriptar(data.clave);



        const usuario= await this.usuarioRepository.crear(data);

        if(usuario&&usuario.Id){
            //registrar accion 
        await this.usuarioRepository.registrarAccionUsuario(usuario.Id,'USUARIO_CREADO',
            {rol:data.rol}
        );
    }

        return usuario.toJSON();

        } catch (error) {
            throw new Error (error.message)
        }

    }

     async crear(data) {  
        const usuario = await this.usuarioRepository.crear(data);
        return usuario;
    }

  async obtenerTodos() {
        try {
            const usuarios = await this.usuarioRepository.obtenerTodos();
            return usuarios.map(u => u.toJSON());
        } catch (error) {
            throw new Error(`Error al obtener usuarios: ${error.message}`);
        }
    }
    
}
    
module.exports=usuarioService;


