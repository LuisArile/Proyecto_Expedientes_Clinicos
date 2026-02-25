
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const { usuario } = require("../config/prisma");
const {controlarEventos}= require('../config/roles')

class inicioSesionService {
    constructor(usuarioRepositoy) {
        this.usuarioRepositoy=usuarioRepositoy;
        
    }


    async inicioSesion(nombreUsuario,clave){

        if (!nombreUsuario) {
            throw new Error (`credenciales incorrectas : ${error.message}`)
        }

        if (!clave) {
            throw new Error (`credenciales incorrectas : ${error.message}`)
        }

        //Busqueda de usuario , ya con la clase correcta
        const usuario= await this.usuarioRepositoy.filtrarNombreUsuario(nombreUsuario);

        if (!usuario) {
            throw new Error (`usuario no encontrado : ${error.message}`)
        }


        console.log(`usuario encontrado : ${usuario.nombreUsuario} (${usuario.rol})`);

        //verificar clave
        const claveValida= await bcrypt.compare(clave,usuario.clave);

        if (!Validarclave) {
            throw new Error (`clave  invalida : ${error.message}`)
        }


        //Actualizar ultimo acceso
        await this.usuarioRepositoy.actualizarUltimoAcceso(usuario.id);

        //registro de inicio exitoso
        await this.usuarioRepositoy.registrarAccionUsuario(
            usuario.id,
            controlarEventos.loginExitoso
        )


        //Creacion de Token


        const accesoMenu={
            menu:usuario.getMenu(),
            permisos:usuario.getPermisos()

        };

        
            const token= jwt.sign(
                {id:usuario.id, 
                nombreUsuario:usuario.nombreUsuario,
                rol: usuario.rol
            }, process.env.JWT_SECRET,
            {expiresIn: "1h"}

        );


return {token,
        usuario:{id: usuario.toJSON(),
        accesoMenu,
        bienvenida: usuario.getBienvenida()
        }};

        }

        async  cierreSesion(usuarioId) {
            await this.usuarioRepositoy.registrarAccionUsuario(
                usuarioId,
                controlarEventos.cierreLogin
            );
            return {message: 'sesion Cerrada exitosamente'}
        }
    }

module.exports =inicioSesionService;