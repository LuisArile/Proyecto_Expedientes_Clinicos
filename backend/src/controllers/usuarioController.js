const {
    ErrorValidacion,
    ErrorNoAutorizado
} = require("../utils/errores");
const capturarAsync = require("../utils/capturarAsync");

class UsuarioController {
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }

    /**
     * Validar que el ID sea numérico
     */
    validarId(id) {
        const idNumerico = Number(id);
        if (!id || isNaN(idNumerico)) {
            throw new ErrorValidacion('El ID del usuario debe ser un número válido');
        }
        return idNumerico;
    }

    /**
     * Verificar que el usuario sea administrador
     */
    verificarAdministrador(req) {
        if (req.usuario?.idRol !== 1) {
            throw new ErrorNoAutorizado(
                'Solo los administradores pueden realizar esta acción'
            );
        }
    }

    /**
     * Crear un nuevo usuario
     */
    crear = capturarAsync(async (req, res) => {
        this.verificarAdministrador(req);

        const usuario = await this.usuarioService.crear(
            {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                correo: req.body.correo,
                nombreUsuario: req.body.nombreUsuario,
                clave: req.body.clave,
                idRol: req.body.idRol,
                activo: req.body.activo ?? true,
                especialidades: req.body.especialidades || []
            },
            req.usuario.id
        );

        res.status(201).json({
            success: true,
            mensaje: 'Usuario creado exitosamente',
            data: usuario
        });
    });

    /**
     * Obtener todos los usuarios
     */
    obtenerTodos = capturarAsync(async (req, res) => {
        const usuarios = await this.usuarioService.obtenerTodos();

        res.status(200).json({
            success: true,
            data: usuarios,
            currentUserId: req.usuario?.id
        });
    });

    /**
     * Obtener usuario por ID
     */
    obtenerPorId = capturarAsync(async (req, res) => {
        const id = this.validarId(req.params.id);

        const usuario = await this.usuarioService.obtenerPorId(id);

        res.status(200).json({
            success: true,
            data: usuario
        });
    });

    /**
     * Actualizar usuario
     */
    actualizar = capturarAsync(async (req, res) => {
        this.verificarAdministrador(req);
        const id = this.validarId(req.params.id);

        const usuario = await this.usuarioService.actualizar(
            id,
            {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                correo: req.body.correo,
                nombreUsuario: req.body.nombreUsuario,
                idRol: req.body.idRol,
                activo: req.body.activo,
                clave: req.body.clave,
                especialidades: req.body.especialidades
            },
            req.usuario.id
        );

        res.status(200).json({
            success: true,
            mensaje: 'Usuario actualizado correctamente',
            data: usuario
        });
    });

    /**
     * Eliminar usuario
     */
    eliminar = capturarAsync(async (req, res) => {
        this.verificarAdministrador(req);
        const id = this.validarId(req.params.id);

        // No permitir eliminar su propio usuario
        if (req.usuario.id === id) {
            throw new ErrorValidacion(
                'No puedes eliminar tu propio usuario'
            );
        }

        await this.usuarioService.eliminar(id, req.usuario.id);

        res.status(200).json({
            success: true,
            mensaje: 'Usuario eliminado correctamente'
        });
    });

    /**
     * Cambiar contraseña del usuario autenticado
     */
    cambiarPassword = capturarAsync(async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        const userId = req.usuario?.id;

        if (!userId) {
            throw new ErrorNoAutorizado(
                'No se encontró información del usuario'
            );
        }

        if (!currentPassword || !newPassword) {
            throw new ErrorValidacion(
                'Todos los campos son obligatorios'
            );
        }

        const resultado = await this.usuarioService.cambiarPassword(
            userId,
            currentPassword,
            newPassword
        );

        res.status(200).json({
            success: true,
            mensaje: 'Contraseña actualizada correctamente',
            data: resultado
        });
    });

    /**
     * Alternar estado (activar/inactivar) de un usuario
     */
    alternarEstado = capturarAsync(async (req, res) => {
        this.verificarAdministrador(req);
        const id = this.validarId(req.params.id);

        const resultado = await this.usuarioService.alternarEstado(id);

        res.status(200).json(resultado);
    });

    /**
     * Enviar credenciales a un usuario
     */
    enviarCredenciales = capturarAsync(async (req, res) => {
        this.verificarAdministrador(req);
        const id = this.validarId(req.params.id);

        const resultado = await this.usuarioService.enviarCredenciales(
            id,
            req.usuario.id
        );

        res.status(200).json({
            success: true,
            mensaje: 'Credenciales enviadas correctamente',
            data: resultado
        });
    });
}

module.exports = UsuarioController;