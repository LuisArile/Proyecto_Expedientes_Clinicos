const bcrypt = require('bcrypt');
const Encriptador= require('../utils/encritaptador');


class usuarioService{
    constructor(usuarioRepository){
        this.usuarioRepository=usuarioRepository;
    }

    async  crear(data) {

        try {
          const existeNombre=await this.usuarioRepository.filtrarNombreUsuario(data.nombreUsuario);
          if(existeNombre){
            throw new Error ('El usuario ya esta registrado');
          }

          //encriptacion

         data.clave= await Encriptador.encriptar(data.clave);



        const usuario= await this.usuarioRepository.crear(data);

        if(usuario&&usuario.id){
            //registrar accion 
        await this.usuarioRepository.registrarAccionUsuario(usuario.id,'USUARIO_CREADO',
            {rol:data.rol}
        );
    }

        return usuario.toJSON();

        } catch (error) {
            throw new Error (error.message)
        }

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


