const bcrypt = require('bcrypt');
const Encriptador = require('../utils/encritador');
const { ErrorValidacion, ErrorNoEncontrado } = require('../utils/errores');

class usuarioService {
    constructor(usuarioRepository, auditoriaService) {
        this.usuarioRepository = usuarioRepository;
        this.auditoriaService = auditoriaService;
        this.emailService = emailService;
    }

    async crear(data, usuarioCreadorId) {
        data.clave = await Encriptador.encriptar(data.clave);
        
        const usuario = await this.usuarioRepository.crear(data);

        if (usuario && usuario.usuario?.id) {
            await this.auditoriaService.registrarUsuario(
                usuarioCreadorId,
                'CREACION',
                usuario.usuario.id
            );
        }
        
        return usuario;
    }

    async obtenerTodos() {
        return await this.usuarioRepository.obtenerTodos();
    }

    async obtenerPorId(id) {
        const usuario = await this.usuarioRepository.obtenerPorId(id);
        if (!usuario) {
            throw new ErrorNoEncontrado('Usuario');
        }
        return usuario;
    }

    async actualizar(id, data, usuarioActualId) {
        if (data.clave) {
            data.clave = await Encriptador.encriptar(data.clave);
        }
        
        const usuario = await this.usuarioRepository.actualizar(id, data);

        await this.auditoriaService.registrarUsuario(
            usuarioActualId,
            'ACTUALIZACION',
            id
        );

        return usuario;
    }

    async eliminar(id, usuarioActualId) {
        await this.usuarioRepository.eliminar(id);

        await this.auditoriaService.registrarUsuario(
            usuarioActualId,
            'ELIMINACION',
            id
        );

        return true;
    }

    async cambiarPassword(userId, currentPassword, newPassword) {
        const usuario = await this.usuarioRepository.obtenerPorId(userId);

        if (!usuario) {
            throw new ErrorNoEncontrado('Usuario');
        }

        const passwordCorrecta = await bcrypt.compare(currentPassword, usuario.clave);

        if (!passwordCorrecta) {
            throw new ErrorValidacion('La contraseña actual es incorrecta');
        }

        const hashedPassword = await Encriptador.encriptar(newPassword);
        await this.usuarioRepository.actualizarPassword(userId, hashedPassword);
        
        await this.auditoriaService.registrar(userId, 'CAMBIO_PASSWORD', 'El usuario actualizó su contraseña');

        return { mensaje: 'Contraseña actualizada correctamente' };
    }

    async alternarEstado(id) {
        const usuario = await this.usuarioRepository.obtenerPorId(id);
        
        if (!usuario) {
            throw new ErrorNoEncontrado('Usuario');
        }

        const nuevoEstado = !usuario.activo;

        const usuarioActualizado = await this.usuarioRepository.actualizar(id, { 
            activo: nuevoEstado 
        });

        await this.usuarioRepository.registrarAccionUsuario(
            null,
            'ESTADO_USUARIO_CAMBIADO',
            `Usuario ${usuario.nombreUsuario} cambiado a ${nuevoEstado ? 'ACTIVO' : 'INACTIVO'}`
        );

        return {
            success: true,
            mensaje: `Usuario ${nuevoEstado ? 'activado' : 'inactivado'} correctamente`,
            data: usuarioActualizado
        };
    }

    async enviarCredenciales(id) {
        const usuario = await this.usuarioRepository.obtenerPorId(id);
        if (!usuario) throw new Error("Usuario no encontrado");

        // Generar clave aleatoria
        const tempPassword = Math.random().toString(36).slice(-10);
        const hashed = await bcrypt.hash(tempPassword, 10);

        await this.usuarioRepository.actualizar(id, { 
            clave: hashed, 
            debeCambiarPassword: true 
        });

        // Enviar correo (Nodemailer)
        await this.emailService.enviarCredenciales(usuario, tempPassword);

        return { message: "Credenciales enviadas con éxito" };
    }
}

module.exports = usuarioService;
