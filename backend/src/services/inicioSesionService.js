
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const { usuario } = require("../config/prisma");

class inicioSesionService {
    constructor(usuarioRepositoy) {
        this.usuarioRepositoy=usuarioRepositoy;
        
    }


    async autenticacion(nombreUsuario,clave){

        if (!nombreUsuario) {
            throw new Error (`credenciales incorrectas : ${error.message}`)
        }

        if (!clave) {
            throw new Error (`credenciales incorrectas : ${error.message}`)
        }

        const usuario= await this.usuarioRepositoy.filtrarNombreUsuario(nombreUsuario);

        if (!usuario) {
            throw new Error (`credenciales incorrectas : ${error.message}`)
        }

        if (!usuario.activo) {
            throw new Error ('usuario inactivo')
        }


        //comparamos ambas claves
        const Validarclave= await bcrypt.compare(clave,usuario.clave)

        if (!Validarclave) {
            throw new Error (`clave  invalida : ${error.message}`)
        }

        //Creacion de Token

            const token= jwt.sign(
                {id:usuario.id, 
                nombreUsuario:usuario.nombreUsuario,
                rol: usuario.rol
            }, process.env.JWT_SECRET,
            {expiresIn: "1h"}

        );

        //inicio de sesion
        await this.usuarioRepositoy.registrarAccionUsuario(usuario.id, "se ha iniciado sesion");

        return {token, usuario:{id: usuario.id, nombreUsuario:usuario.nombreUsuario,correo:usuario.correo,rol:usuario.rol }};

        }
    }

module.exports =inicioSesionService;