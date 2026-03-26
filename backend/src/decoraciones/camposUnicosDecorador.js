const DecoradorBase = require('./decoradorBase');
const { ErrorConflicto } = require('../utils/errores');

class camposUnicosDecorador extends DecoradorBase {
    
    constructor(service, usuarioRepository) {
        super(service);
        this.usuarioRepository = usuarioRepository;
    }
    
    async crear(data, usuarioId) {
        // 1. Validar correo único
        if (data.correo) {
            const correoExistente = await this.usuarioRepository.obtenerPorCorreo(data.correo);
            if (correoExistente) {
                throw new ErrorConflicto('El correo ya está registrado');
            }
        }
        
        // 2. Validar nombre de usuario único
        if (data.nombreUsuario) {
            const usuarioExistente = await this.usuarioRepository.filtrarNombreUsuario(data.nombreUsuario);
            if (usuarioExistente) {
                throw new ErrorConflicto('El nombre de usuario ya está registrado');
            }
        }
        
        return this.service.crear(data, usuarioId);
    }
    
    async actualizar(id, data, usuarioId) {
        const usuarioExistente = await this.usuarioRepository.obtenerPorId(id);
        
        if (!usuarioExistente) {
            return this.service.actualizar(id, data, usuarioId);
        }
        
        if (data.correo && data.correo !== usuarioExistente.correo) {
            const correoExistente = await this.usuarioRepository.obtenerPorCorreo(data.correo);
            if (correoExistente) {
                throw new ErrorConflicto('El correo ya está registrado por otro usuario');
            }
        }
        
        if (data.nombreUsuario && data.nombreUsuario !== usuarioExistente.nombreUsuario) {
            const usuarioExistenteNombre = await this.usuarioRepository.filtrarNombreUsuario(data.nombreUsuario);
            if (usuarioExistenteNombre) {
                throw new ErrorConflicto('El nombre de usuario ya está registrado por otro usuario');
            }
        }
        
        return this.service.actualizar(id, data, usuarioId);
    }
}

module.exports = camposUnicosDecorador;