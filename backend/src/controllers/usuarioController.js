const { ErrorValidacion, ErrorNoAutorizado,ErrorNoEncontrado } = require("../utils/errores");
const capturarAsync = require("../utils/capturarAsync");

class usuarioController {
    constructor(usuarioService) {
        this.usuarioService = usuarioService;
    }

    crear = capturarAsync(async (req, res) => {
        const { nombre, apellido, correo, nombreUsuario, clave, idRol, especialidad } = req.body;
        
        if (!nombre || !apellido) throw new ErrorValidacion('nombre y apellido son obligatorio');
        if (!correo) throw new ErrorValidacion('El correo es obligatorio');
        if (!nombreUsuario) throw new ErrorValidacion('El nombre de usuario es obligatorio');
        if (!clave) throw new ErrorValidacion('La contraseña es obligatoria');
        if(!idRol) throw new ErrorValidacion('El rol es obligatorio');

        if (req.usuario.idRol !== 1) {
           throw new ErrorNoAutorizado('Solo los administradores pueden crear usuarios');
        }
        const usuario = await this.usuarioService.crear(req.body, req.usuario.id);
        
        res.status(201).json({
            success: true,
            mensaje: 'Usuario creado exitosamente',
            data: usuario
        });
    });

    obtenerTodos = capturarAsync(async (req, res) => {
        const usuarios = await this.usuarioService.obtenerTodos();
        res.json({ success: true, data: usuarios, currentUserId: req.usuario.id });
    });

    //obtener usuariopor id
    obtenerPorId = capturarAsync(async (req, res) => {
        const { id } = req.params;

        if (!id) {
            throw new ErrorValidacion('El ID del usuario es obligatorio');
        }

        const usuario = await this.usuarioService.obtenerPorId(id);

        if (!usuario) {
            throw new ErrorNoEncontrado('Usuario');
        }

        res.json({
            success: true,
            data: usuario
        });
    });

    //actualizar un usuario
    actualizar = capturarAsync(async (req, res) => {
        const { id } = req.params;

        //solo admin pueden tener acceso
        if(req.usuario.idRol !==1){
            throw new ErrorNoAutorizado('Solo administradores pueden acceder');
        }

        if (!id) {
            throw new ErrorValidacion('El ID del usuario es obligatorio');
        }

        const usuario = await this.usuarioService.actualizar(id, req.body, req.usuario.id);

        res.json({
            success: true,
            mensaje: 'Usuario actualizado correctamente',
            data: usuario
        });
    });

    //eliminar usuario

     eliminar = capturarAsync(async (req, res) => {
        const { id } = req.params;

        if (!id) {
            throw new ErrorValidacion('El ID del usuario es obligatorio');
        }

        // No permitir eliminar su mismo usuario
        if (req.usuario.id === parseInt(id)) {
            throw new ErrorValidacion('No puedes eliminar tu propio usuario');
        }

        await this.usuarioService.eliminar(id, req.usuario.id);

        res.json({
            success: true,
            mensaje: 'Usuario eliminado correctamente'
        });
    });


    //cambio de clave
    cambiarPassword = capturarAsync(async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        const userId = req.usuario?.id;

        if (!userId) {
            throw new ErrorNoAutorizado('No se encontró información del usuario');
        }

        if (!currentPassword || !newPassword) {
            throw new ErrorValidacion('Todos los campos son obligatorios');
        }

        const resultado = await this.usuarioService.cambiarPassword(
            userId,
            currentPassword,
            newPassword
        );

        res.json({ 
            success: true, 
            mensaje: 'Contraseña actualizada correctamente',
            data: resultado 
        });
    });

    alternarEstado = capturarAsync(async (req, res, next) => {
        const { id } = req.params;
        const resultado = await this.usuarioService.alternarEstado(id);
        res.json(resultado);
    }); 

    enviarCredenciales = capturarAsync(async (req, res, next) => {
        const { id } = req.params;
        const administradorId = req.usuario?.id;

        if (!administradorId) {
            throw new ErrorNoAutorizado('No se encontró información del administrador');
        }

        const resultado = await this.usuarioService.enviarCredenciales(id, administradorId);
        res.json(resultado);
    });

}

module.exports = usuarioController;