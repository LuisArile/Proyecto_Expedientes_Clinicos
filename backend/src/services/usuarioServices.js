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
        if (!data.idRol) {
            throw new ErrorValidacion('El rol es obligatorio');
        }

        if (data.idRol === 2 && !data.especialidad) {
            throw new ErrorValidacion('La especialidad es obligatoria para médicos');
        }

        const correoExistente = await this.usuarioRepository.obtenerPorCorreo(data.correo);
        if (correoExistente) {
            throw new ErrorConflicto('El correo ya está registrado');
        }

        const existeNombre = await this.usuarioRepository.filtrarNombreUsuario(data.nombreUsuario);
        if(existeNombre) throw new ErrorConflicto('El nombre de usuario ya esta registrado');

        if (data.clave.length < 8) {
            throw new ErrorValidacion('La contraseña debe tener al menos 8 caracteres');
        }
        
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

        if (id === usuarioActualId && data.activo === false) {
            throw new ErrorValidacion('No puedes inactivar tu propia cuenta');
        }

        const nuevoRol = data.idRol ? Number(data.idRol) : usuarioExistente.idRol;
        const especialidad = data.especialidad || usuarioExistente.especialidad;
        if (Number(nuevoRol) === 2 && !especialidad) {
            throw new ErrorValidacion('La especialidad es obligatoria para médicos');
        }

        const camposCambiados = [];
        const camposMapeo = {
            nombre: 'Nombre',
            apellido: 'Apellido',
            correo: 'Correo',
            idRol: 'Rol',
            activo: 'Estado',
            especialidad: 'Especialidad'
        };

        Object.keys(camposMapeo).forEach(key => {
            if (data[key] !== undefined && String(data[key]) !== String(usuarioExistente[key])) {
                camposCambiados.push(camposMapeo[key]);
            }
        });

        const usuarioActualizado = await this.usuarioRepository.actualizar(id, data);

        if (camposCambiados.length > 0) {
            const detalles = `Usuario modificado: ${usuarioExistente.nombreUsuario}. ` +
                            `Campos: ${camposCambiados.join(', ')}. ` +
                            `Responsable ID: ${usuarioActualId}`;
            
            await this.auditoriaService.registrar(
                usuarioActualId, 
                'ACTUALIZACION_USUARIO', 
                detalles
            );
        }

        return usuarioActualizado;
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

        // Actualizar contraseña y limpiar flag en la base de datos 
        await this.usuarioRepository.actualizar(userId, {
            clave: hashedPassword,
            debeCambiarPassword: false
        });
        
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

    async enviarCredenciales(UsuarioId, administradorId) {
        const usuario = await this.usuarioRepository.obtenerPorId(UsuarioId);
        if (!usuario) throw new Error("Usuario no encontrado");

        // Generar clave aleatoria
        const tempPassword = Math.random().toString(36).slice(-10);
        const hashed = await bcrypt.hash(tempPassword, 10);

        await this.usuarioRepository.actualizar(UsuarioId, { 
            clave: hashed, 
            debeCambiarPassword: true 
        });

        // Enviar correo (Nodemailer)
        await this.emailService.enviarCredenciales(usuario, tempPassword);

        // Registrar en auditoría
        const detalles = `Credenciales enviadas al usuario ${usuario.nombreUsuario} (${usuario.correo}).`;
        
        await this.auditoriaService.registrar(
            administradorId,
            'ENVIO_CREDENCIALES',
            detalles
        );

        return { message: "Credenciales enviadas con éxito" };
    }
}
    
module.exports=usuarioService;

