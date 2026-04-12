const DecoradorBase = require('./decoradorBase');
const { ErrorValidacion } = require('../utils/errores');

class decoracionValidacionesEntrada extends DecoradorBase {
    
    validarClave(clave) {
        const expresionRegular = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        return expresionRegular.test(clave);
    }
    
    async crear(data, usuarioId) {
        // 1. Validar campos obligatorios
        if (!data.nombre || !data.apellido) {
            throw new ErrorValidacion('Nombre y apellido son obligatorios');
        }
        if (!data.correo) {
            throw new ErrorValidacion('El correo es obligatorio');
        }
        if (!data.nombreUsuario) {
            throw new ErrorValidacion('El nombre de usuario es obligatorio');
        }
        if (!data.idRol) {
            throw new ErrorValidacion('El rol es obligatorio');
        }
        
        // 2. Validar fortaleza de contraseña
        if (data.clave && !this.validarClave(data.clave)) {
            throw new ErrorValidacion(
                'La contraseña debe tener al menos 8 caracteres, una mayúscula, ' +
                'una minúscula, un número y un carácter especial'
            );
        }
        
        // 3. Validar especialidad para médicos
        if (data.idRol === 2 && !data.especialidad) {
            throw new ErrorValidacion('La especialidad es obligatoria para médicos');
        }
        
        return this.service.crear(data, usuarioId);
    }
    
    async actualizar(id, data, usuarioId) {
        if (data.clave && !this.validarClave(data.clave)) {
            throw new ErrorValidacion(
                'La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, ' +
                'una minúscula, un número y un carácter especial'
            );
        }
        
        const usuarioExistente = await this.service.usuarioRepository?.obtenerPorId(id);
        
        if (usuarioExistente) {
            const nuevoRol = data.idRol !== undefined ? data.idRol : usuarioExistente.idRol;
            const especialidad = data.especialidad !== undefined ? data.especialidad : usuarioExistente.especialidad;
            
            if (Number(nuevoRol) === 2 && !especialidad) {
                throw new ErrorValidacion('La especialidad es obligatoria para médicos');
            }
        }
        
        return this.service.actualizar(id, data, usuarioId);
    }
        
    async cambiarPassword(userId, currentPassword, newPassword) {
        if (!this.validarClave(newPassword)) {
            throw new ErrorValidacion(
                'La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, ' +
                'una minúscula, un número y un carácter especial'
            );
        }
        
        return this.service.cambiarPassword(userId, currentPassword, newPassword);
    }
}

module.exports = decoracionValidacionesEntrada;