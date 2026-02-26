const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { eventos } = require('../config/roles');

class InicioSesionService {

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
            throw new Error('Credenciales incorrectas');
        }

        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        return {
            id: usuario.id,
            nombre: usuario.nombre,
            nombreUsuario: usuario.nombreUsuario,
            apellido: usuario.apellido,
            correo: usuario.correo,
            rol: usuario.rol,
            token
        };
    }

    async cierreSesion(usuarioId) {

        if (!usuarioId) {
            throw new Error("Usuario no autenticado");
        }

        await this.usuarioRepository.registrarAccionUsuario(
            usuarioId,
            eventos.logout
        );

        return { message: 'Sesión cerrada exitosamente' };
    }
}

module.exports = InicioSesionService;