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

    const claveValida = await bcrypt.compare(clave, usuario.clave);

    if (!claveValida) {
<<<<<<< HEAD
        console.log('❌ Contraseña incorrecta');
=======
        console.log('Contraseña incorrecta');
>>>>>>> feat-db-y-login
        throw new Error('Credenciales incorrectas');
    }

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