const bcrypt=require('bcrypt');
const Encriptador= require('../utils/encritador');
const { ErrorConflicto,ErrorValidacion, ErrorNoEncontrado } = require('../utils/errores');


class usuarioService{
    constructor(usuarioRepository, auditoriaService){
        this.usuarioRepository=usuarioRepository;
        this.auditoriaService = auditoriaService;
    }

    async crear(data, usuarioCreadorId) {

        if (!data.nombre || !data.apellido) {
            throw new ErrorValidacion('Nombre y apellido son obligatorios');
        }
        if (!data.correo) {
            throw new ErrorValidacion('El correo es obligatorio');
        }
        if (!data.nombreUsuario) {
            throw new ErrorValidacion('El nombre de usuario es obligatorio');
        }
        if (!data.clave) {
            throw new ErrorValidacion('La contraseña es obligatoria');
        }
        if (!data.idRol) {
            throw new ErrorValidacion('El rol es obligatorio');
        }

        const correoExistente = await this.usuarioRepository.obtenerPorCorreo(data.correo);
        if (correoExistente) {
            throw new ErrorConflicto('El correo ya está registrado');
        }

        
        const existeNombre=await this.usuarioRepository.filtrarNombreUsuario(data.nombreUsuario);
        
        if(existeNombre) throw new ErrorConflicto ('El nombre de usuario ya esta registrado');

        if (data.idRol === 2 && !data.especialidad) {throw new ErrorValidacion('La especialidad es obligatoria para médicos');}

        //encriptamos clave
        data.clave= await Encriptador.encriptar(data.clave);

        //creamos usuario
        const usuario= await this.usuarioRepository.crear(data);

        if(usuario&&usuario.id){
            await this.auditoriaService.registrarUsuario(
            usuarioCreadorId,
            'USUARIO_CREADO',
            usuario
        );
    }
            return usuario;
    }

    async obtenerTodos() {
        
            const usuarios = await this.usuarioRepository.obtenerTodos();
            return usuarios;

    }

    async obtenerPorId(id) {

            const usuario = await this.usuarioRepository.obtenerPorId(id);
            if (!usuario) {
                throw new ErrorValidacion('Usuario');
            }
            return usuario;

    }

    async actualizar(id, data, usuarioActualId) {
        
            const usuarioExistente = await this.usuarioRepository.obtenerPorId(id);
            if (!usuarioExistente) {
                throw new ErrorNoEncontrado('usuario');
            }

            //
            if (data.correo && data.correo !== usuarioExistente.correo) {
            const correoExistente = await this.usuarioRepository.obtenerPorCorreo(data.correo);
            if (correoExistente) {
                throw new ErrorConflicto('El correo ya está registrado por otro usuario');
            }
        }

            // Si se actualiza el nombre de usuario, verificar que no esté en uso
            if (data.nombreUsuario && data.nombreUsuario !== usuarioExistente.nombreUsuario) {
                const existeNombre = await this.usuarioRepository.filtrarNombreUsuario(data.nombreUsuario);
                if (existeNombre) {
                    throw new ErrorConflicto('El nombre de usuario ya está registrado');
                }
            }

            const nuevoRol = data.idRol || usuarioExistente.idRol;
            const especialidad = data.especialidad || usuarioExistente.especialidad;
            if (Number(nuevoRol) === 2 && !especialidad) {
                throw new ErrorValidacion('La especialidad es obligatoria para médicos');
            }

            const usuario = await this.usuarioRepository.actualizar(id, data);

            // Registrar auditoría
            await this.auditoriaService.registrarUsuario(
                usuarioActualId,
                'ACTUALIZACION',
                id
            );

            return usuario;


    }

//eliminar Usuario
    async eliminar(id, usuarioActualId) {
        
            const usuario = await this.usuarioRepository.obtenerPorId(id);
            if (!usuario) {
                throw new ErrorNoEncontrado('Usuario');
            }

            //eliminamos
            await this.usuarioRepository.eliminar(id);
            

            // Registrar auditoría
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
            throw new Error("Usuario no encontrado");
        }

        // Verificar contraseña actual
        const passwordCorrecta = await bcrypt.compare(currentPassword, usuario.clave);

        if (!passwordCorrecta) {
            throw new Error("La contraseña actual es incorrecta");
        }

        // Generar hash de la nueva contraseña
        const hashedPassword = await Encriptador.encriptar(newPassword);

        // Actualizar contraseña en la base de datos
        const resultado = await this.usuarioRepository.actualizarPassword(userId, hashedPassword);
        
        await this.auditoriaService.registrar(userId, 'CAMBIO_PASSWORD', 'El usuario actualizó su contraseña');

        return { mensaje: "Contraseña actualizada correctamente" };
    }
}
    
module.exports=usuarioService;

