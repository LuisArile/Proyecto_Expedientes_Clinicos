const Encriptador = require('../utils/encritador');
const {
    ErrorConflicto,
    ErrorValidacion,
    ErrorNoEncontrado
} = require('../utils/errores');

class UsuarioService {
    constructor(usuarioRepository, auditoriaService, emailService) {
        this.usuarioRepository = usuarioRepository;
        this.auditoriaService = auditoriaService;
        this.emailService = emailService;
    }

    /**
     * Normaliza el arreglo de especialidades
     */
    normalizarEspecialidades(especialidades) {
        if (!Array.isArray(especialidades)) return [];

        const normalizadas = especialidades
            .map(e => e?.trim())
            .filter(e => e && e.length > 0);

        return [...new Set(normalizadas)]; // Elimina duplicados
    }

    /**
     * Validar formato de correo
     */
    validarCorreo(correo) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(correo)) {
            throw new ErrorValidacion('Formato de correo inválido');
        }
    }

    /**
     * Crear un nuevo usuario
     */
    async crear(data, usuarioCreadorId) {
        const { nombre, apellido, correo, nombreUsuario, clave, idRol } = data;

        if (!nombre || !apellido) {
            throw new ErrorValidacion('Nombre y apellido son obligatorios');
        }
        if (!correo) {
            throw new ErrorValidacion('El correo es obligatorio');
        }
        if (!nombreUsuario) {
            throw new ErrorValidacion('El nombre de usuario es obligatorio');
        }
        if (!clave) {
            throw new ErrorValidacion('La contraseña es obligatoria');
        }
        if (!idRol) {
            throw new ErrorValidacion('El rol es obligatorio');
        }

        this.validarCorreo(correo);

        const especialidades = this.normalizarEspecialidades(data.especialidades);

        // Validar especialidades para médicos (idRol = 2)
        if (Number(idRol) === 2 && especialidades.length === 0) {
            throw new ErrorValidacion(
                'Debe asignar al menos una especialidad al médico'
            );
        }

        // Validar correo único
        const correoExistente =
            await this.usuarioRepository.obtenerPorCorreo(correo);
        if (correoExistente) {
            throw new ErrorConflicto('El correo ya está registrado');
        }

        // Validar nombre de usuario único
        const usuarioExistente =
            await this.usuarioRepository.filtrarNombreUsuario(nombreUsuario);
        if (usuarioExistente) {
            throw new ErrorConflicto(
                'El nombre de usuario ya está registrado'
            );
        }

        // Validar longitud de contraseña
        if (clave.length < 8) {
            throw new ErrorValidacion(
                'La contraseña debe tener al menos 8 caracteres'
            );
        }

        // Encriptar contraseña
        const hashedPassword = await Encriptador.encriptar(clave);

        // Crear usuario
        const usuario = await this.usuarioRepository.crear({
            ...data,
            clave: hashedPassword,
            especialidades
        });

        // Registrar auditoría
        await this.auditoriaService.registrarUsuario(
            usuarioCreadorId,
            'USUARIO_CREADO',
            usuario.id
        );

        return usuario;
    }

    /**
     * Obtener todos los usuarios
     */
    async obtenerTodos() {
        return await this.usuarioRepository.obtenerTodos();
    }

    /**
     * Obtener usuario por ID
     */
    async obtenerPorId(id) {
        const usuario = await this.usuarioRepository.obtenerPorId(id);
        if (!usuario) {
            throw new ErrorNoEncontrado('Usuario');
        }
        return usuario;
    }

    /**
     * Actualizar usuario
     */
    async actualizar(id, data, usuarioActualId) {
        const usuarioExistente =
            await this.usuarioRepository.obtenerPorId(id);

        if (!usuarioExistente) {
            throw new ErrorNoEncontrado('Usuario');
        }

        // Validar correo único
        if (data.correo && data.correo !== usuarioExistente.correo) {
            this.validarCorreo(data.correo);

            const correoExistente =
                await this.usuarioRepository.obtenerPorCorreo(data.correo);
            if (correoExistente) {
                throw new ErrorConflicto(
                    'El correo ya está registrado por otro usuario'
                );
            }
        }

        // Validar nombre de usuario único
        if (
            data.nombreUsuario &&
            data.nombreUsuario !== usuarioExistente.nombreUsuario
        ) {
            const existeNombre =
                await this.usuarioRepository.filtrarNombreUsuario(
                    data.nombreUsuario
                );
            if (existeNombre) {
                throw new ErrorConflicto(
                    'El nombre de usuario ya está registrado'
                );
            }
        }

        // Evitar que el usuario actual se desactive a sí mismo
        if (Number(id) === Number(usuarioActualId) && data.activo === false) {
            throw new ErrorValidacion(
                'No puedes inactivar tu propia cuenta'
            );
        }

        // Validar especialidades
        const especialidades = this.normalizarEspecialidades(
            data.especialidades !== undefined
                ? data.especialidades
                : usuarioExistente.especialidades
        );

        const nuevoRol = data.idRol
            ? Number(data.idRol)
            : usuarioExistente.idRol;

        if (nuevoRol === 2 && especialidades.length === 0) {
            throw new ErrorValidacion(
                'Debe asignar al menos una especialidad al médico'
            );
        }

        // Encriptar nueva contraseña si se envía
        if (data.clave) {
            if (data.clave.length < 8) {
                throw new ErrorValidacion(
                    'La contraseña debe tener al menos 8 caracteres'
                );
            }
            data.clave = await Encriptador.encriptar(data.clave);
        }

        const usuarioActualizado =
            await this.usuarioRepository.actualizar(id, {
                ...data,
                especialidades
            });

        // Registrar auditoría
        await this.auditoriaService.registrar(
            usuarioActualId,
            'ACTUALIZACION_USUARIO',
            `Usuario actualizado: ${usuarioExistente.nombreUsuario}`
        );

        return usuarioActualizado;
    }

    /**
     * Eliminar usuario
     */
    async eliminar(id, usuarioActualId) {
        const usuario =
            await this.usuarioRepository.obtenerPorId(id);
        if (!usuario) {
            throw new ErrorNoEncontrado('Usuario');
        }

        await this.usuarioRepository.eliminar(id);

        await this.auditoriaService.registrarUsuario(
            usuarioActualId,
            'ELIMINACION_USUARIO',
            id
        );

        return true;
    }

    /**
     * Cambiar contraseña del usuario autenticado
     */
    async cambiarPassword(userId, currentPassword, newPassword) {
        const usuario =
            await this.usuarioRepository.filtrarNombreUsuario(
                (await this.usuarioRepository.obtenerPorId(userId))
                    .nombreUsuario
            );

        if (!usuario) {
            throw new ErrorNoEncontrado('Usuario');
        }

        const passwordCorrecta = await Encriptador.comparar(
            currentPassword,
            usuario.clave
        );

        if (!passwordCorrecta) {
            throw new ErrorValidacion(
                'La contraseña actual es incorrecta'
            );
        }

        if (newPassword.length < 8) {
            throw new ErrorValidacion(
                'La nueva contraseña debe tener al menos 8 caracteres'
            );
        }

        const hashedPassword = await Encriptador.encriptar(newPassword);

        await this.usuarioRepository.actualizar(userId, {
            clave: hashedPassword,
            debeCambiarPassword: false
        });

        await this.auditoriaService.registrar(
            userId,
            'CAMBIO_PASSWORD',
            'El usuario actualizó su contraseña'
        );

        return { mensaje: 'Contraseña actualizada correctamente' };
    }

    /**
     * Activar o desactivar usuario
     */
    async alternarEstado(id) {
        const usuario =
            await this.usuarioRepository.obtenerPorId(id);

        if (!usuario) {
            throw new ErrorNoEncontrado('Usuario');
        }

        const nuevoEstado = !usuario.activo;

        const usuarioActualizado =
            await this.usuarioRepository.actualizar(id, {
                activo: nuevoEstado
            });

        await this.usuarioRepository.registrarAccionUsuario(
            null,
            'ESTADO_USUARIO_CAMBIADO',
            `Usuario ${usuario.nombreUsuario} cambiado a ${
                nuevoEstado ? 'ACTIVO' : 'INACTIVO'
            }`
        );

        return {
            success: true,
            mensaje: `Usuario ${
                nuevoEstado ? 'activado' : 'inactivado'
            } correctamente`,
            data: usuarioActualizado
        };
    }

    /**
     * Enviar credenciales al usuario
     */
    async enviarCredenciales(usuarioId, administradorId) {
        const usuario =
            await this.usuarioRepository.obtenerPorId(usuarioId);

        if (!usuario) {
            throw new ErrorNoEncontrado('Usuario');
        }

        // Generar contraseña temporal segura
        const tempPassword = Math.random().toString(36).slice(-10);

        const hashedPassword = await Encriptador.encriptar(tempPassword);

        await this.usuarioRepository.actualizar(usuarioId, {
            clave: hashedPassword,
            debeCambiarPassword: true
        });

        await this.emailService.enviarCredenciales(
            usuario,
            tempPassword
        );

        await this.auditoriaService.registrar(
            administradorId,
            'ENVIO_CREDENCIALES',
            `Credenciales enviadas al usuario ${usuario.nombreUsuario}`
        );

        return { message: 'Credenciales enviadas con éxito' };
    }
}

module.exports = UsuarioService;