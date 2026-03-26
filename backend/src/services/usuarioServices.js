const bcrypt=require('bcrypt');
const Encriptador= require('../utils/encritador');
const { ErrorConflicto,ErrorValidacion, ErrorNoEncontrado } = require('../utils/errores');


class usuarioService{
    constructor(usuarioRepository, auditoriaService, emailService){
        this.usuarioRepository=usuarioRepository;
        this.auditoriaService = auditoriaService;
        this.emailService = emailService;
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
        if (data.clave.length < 8) {
            throw new ErrorValidacion('La contraseña debe tener al menos 8 caracteres');
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
            //registrar accion 
            await this.usuarioRepository.registrarAccionUsuario(
                usuarioCreadorId,
                'USUARIO_CREADO',
                `Se creó el usuario ${usuario.nombreUsuario} con rol ID ${usuario.idRol}`
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

        // Si se actualiza el nombre de usuario, verificar que no esté en uso
        if (data.nombreUsuario && data.nombreUsuario !== usuarioExistente.nombreUsuario) {
            const existeNombre = await this.usuarioRepository.filtrarNombreUsuario(data.nombreUsuario);
            if (existeNombre) {
                throw new ErrorConflicto('El nombre de usuario ya está registrado');
            }
        }

        if (id === usuarioActualId && data.activo === false) {
            throw new ErrorValidacion('No puedes inactivar tu propia cuenta');
        }

        const nuevoRol = data.idRol || usuarioExistente.idRol;
        const especialidad = data.especialidad || usuarioExistente.especialidad;
        if (Number(nuevoRol) === 2 && !especialidad) {
            throw new ErrorValidacion('La especialidad es obligatoria para médicos');
        }

        const usuario = await this.usuarioRepository.actualizar(id, data);

        // Registrar auditoría
        await this.usuarioRepository.registrarAccionUsuario(
            usuarioActualId,
            'USUARIO_ACTUALIZADO',
            { usuarioId: id, camposModificados: Object.keys(data) }
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
        await this.usuarioRepository.registrarAccionUsuario(
            usuarioActualId,
            'USUARIO_ELIMINADO',
            { usuarioId: id, usuarioNombre: usuario.nombreUsuario }
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
    
module.exports=usuarioService;

