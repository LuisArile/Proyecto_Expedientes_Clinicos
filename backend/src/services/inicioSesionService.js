const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { eventos } = require('../config/roles');

class inicioSesionService {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

        async inicioSesion(nombreUsuario, clave) {

        if (!nombreUsuario || !clave) {
            throw new Error('Credenciales incorrectas');
        }

        const usuario = await this.usuarioRepository.filtrarNombreUsuario(nombreUsuario);
        
        if (!usuario) {
            throw new Error('Credenciales incorrectas');
        }

        //se encontro usuario

        const claveValida = await bcrypt.compare(clave, usuario.clave);

        if (!claveValida) {
            throw new Error('Credenciales incorrectas');
        }

        await this.usuarioRepository.actualizarUltimoAcceso(usuario.id);

        await this.usuarioRepository.registrarAccionUsuario(usuario.id, eventos.loginExitoso);

        const token =jwt.sign({

            id:usuario.id,
            nombreUsuario: usuario.nombreUsuario,
            rol: usuario.rol
        }, process.env.JWT_SECRET,{expiresIn: '4h'}
    );

    console.log('token generado');

    return {
        token,
        usuario: usuario.toJSON(),
        bienvenida: usuario.getBienvenida()
    };

    }

    async cierreSesion(usuarioId) {
        await this.usuarioRepository.registrarAccionUsuario(
            usuarioId,
            eventos.logout
        );
        return { message: 'Sesión cerrada exitosamente' };
    }
}

module.exports = inicioSesionService;