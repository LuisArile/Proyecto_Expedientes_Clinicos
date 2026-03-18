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

        if(usuario&&usuario.id){
            //registrar accion 
        await this.usuarioRepository.registrarAccionUsuario(usuario.id,'USUARIO_CREADO',
            {idRol:data.idRol}
        );
    }

        return usuario.toJSON();

        } catch (error) {
            console.error(error);
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

    async cambiarPassword(userId, currentPassword, newPassword) {

        const usuario = await this.usuarioRepository.obtenerPorId(userId);

        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }

        // Verificar contraseña actual
        const passwordCorrecta = await bcrypt.compare(currentPassword, usuario.clave);

        if (!passwordCorrecta) {
            throw new Error("La contraseña actual es incorrecta");
        }

        // Generar hash de la nueva contraseña
        const hashedPassword = await Encriptador.encriptar(newPassword);
       
        // Actualizar contraseña en la base de datos
        const resultado = await this.usuarioRepository.actualizarPassword(userId, hashedPassword);
        
        return { mensaje: "Contraseña actualizada correctamente" };
    }
}
    
module.exports=usuarioService;

