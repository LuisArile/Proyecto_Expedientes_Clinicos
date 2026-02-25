const bcrypt=require('bcrypt');


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

        const salt= await bcrypt.genSalt(8);
        data.clave=await bcrypt.hash(data.clave,salt);


        const usuario= await this.usuarioRepository.crear(data);
        console.log('Usuario creado con ID:', usuario.Id);

        if(usuario&&usuario.Id){
            //registrar accion 
        await this.usuarioRepository.registrarAccionUsuario(usuario.Id,'USUARIO CREADO')
        }else{
            console.log('Usuario creado pero sin ID:', usuario)
        }

        
        const {clave,...usuarioSinClave}=usuario;
        return usuarioSinClave;


        } catch (error) {
            throw new Error (error.message)
        }

    }

   async  obtenerTodos() {

        try {
            return await this.usuarioRepository.obtenerTodos();
        } catch (error) {
            throw new Error (`Error al obtener usuarios : ${error.message}`)
        }

    }
    
}
    
module.exports=usuarioService;


