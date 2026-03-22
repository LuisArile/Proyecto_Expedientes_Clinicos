const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class InicioSesionService {

    constructor(usuarioRepository, auditoriaService) {
        this.usuarioRepository = usuarioRepository;
        this.auditoriaService = auditoriaService;
    }

    async inicioSesion(nombreUsuario, clave) {

        const usuario = await this.usuarioRepository.filtrarNombreUsuario(nombreUsuario);
        const claveValida = await bcrypt.compare(clave, usuario.clave);

        if (!usuario || !claveValida) {
            throw new Error('Credenciales incorrectas');
        }

        await this.usuarioRepository.actualizarUltimoAcceso(usuario.id);

        await this.auditoriaService.registrarSesion(usuario.id, "INICIO_SESION", usuario.nombreUsuario);

        const token = jwt.sign(
            { id: usuario.id, idRol: usuario.idRol, rol: usuario.rolNombre },
            process.env.JWT_SECRET || 'secret_key_temporal',
            { expiresIn: "8h" }
        );

        return {
            id: usuario.id,
            nombre: usuario.nombre,
            nombreUsuario: usuario.nombreUsuario,
            apellido: usuario.apellido,
            correo: usuario.correo,
            idRol: usuario.idRol,
            rol: usuario.rolNombre,
            permisos: usuario.permisos,
            token
        };
    }

    async cierreSesion(usuarioId) {

        if (!usuarioId) throw new Error("Usuario no autenticado");

        await this.auditoriaService.registrarSesion(usuarioId, "CIERRE_SESION")

        return { message: 'Sesión cerrada exitosamente' };
    }
}

module.exports = InicioSesionService;