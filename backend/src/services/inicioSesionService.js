const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class InicioSesionService {

    constructor(usuarioRepository, auditoriaService) {
        this.usuarioRepository = usuarioRepository;
        this.auditoriaService = auditoriaService;
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
            { id: usuario.id, idRol: usuario.idRol },
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
            token
        };
    }

    async cierreSesion(usuarioId) {

        if (!usuarioId) {
            throw new Error("Usuario no autenticado");
        }

        await this.usuarioRepository.registrarAccionUsuario(
            usuarioId,
            'CIERRE_SESION'
        );

        return { message: 'Sesión cerrada exitosamente' };
    }

    /**
     * Registra la auditoría en una sesión (inicio o cierre)
     * @deprecated - Usar auditoriaService.registrarSesion() directamente desde el controlador
     */
    async registrarAuditoria(usuarioId, accion, detalles) {
        return await this.auditoriaService.registrar(usuarioId, accion, detalles);
    }
}

module.exports = InicioSesionService;