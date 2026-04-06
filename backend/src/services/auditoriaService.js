/**
 * AuditoriaService
 * Servicio centralizado para manejar todos los registros de auditoría del sistema
 * Patrón: Factory/Wrapper para encapsular la lógica de auditoría
 */
class AuditoriaService {
    constructor(auditoriaRepository) {
        this.auditoriaRepository = auditoriaRepository;
    }

    /**
     * Registra una acción en la auditoría
     * @param {number} usuarioId - ID del usuario que realiza la acción
     * @param {string} accion - Acción realizada (ej: "INICIO_SESION", "Creacion de expediente")
     * @param {string} detalles - Detalles adicionales de la acción
     * @returns {Promise<Object>} Registro creado
     */
    async registrar(usuarioId, accion, detalles = null, tx = null) {
        try {
            if (!usuarioId) return null;

            return await this.auditoriaRepository.crear({
                usuarioId: usuarioId,
                accion: accion,
                detalles: detalles
            }, tx);
        } catch (error) {
            console.error(`Error al registrar auditoría [${accion}]: ${error.message}`);
            // No lanzamos el error para no afectar la operación principal
            return null;
        }
    }

    /**
     * Registra acciones de sesión
     * @param {number} usuarioId - ID del usuario
     * @param {string} tipo - "INICIO_SESION" o "CIERRE_SESION"
     * @param {string} nombreUsuario - Nombre del usuario (opcional)
     * @returns {Promise<Object>}
     */
    async registrarSesion(usuarioId, tipo, nombreUsuario = null) {
        const detalles = `Usuario ${nombreUsuario} ${tipo === 'INICIO_SESION' ? 'entró al' : 'salió del'} sistema`;
        return this.registrar(usuarioId, tipo, detalles);
    }

    /**
     * Registra acciones sobre expedientes
     * @param {number} usuarioId - ID del usuario
     * @param {string} tipo - "Creacion", "Actualizacion", "Eliminacion"
     * @param {number} idExpediente - ID del expediente afectado
     * @returns {Promise<Object>}
     */
    async registrarExpediente(usuarioId, tipo, datos, tx = null) {
        const accion = `${tipo} DE EXPEDIENTE`;

        const idExp = typeof datos === 'object' ? datos.idExpediente : datos;
        const detallesAdicionales = datos.detalles || `Proceso de ${tipo.toLowerCase()}`;
        
        const detallesFinales = `Expediente ID: ${idExp}. ${detallesAdicionales}`;
        
        return this.registrar(usuarioId, accion, detallesFinales, tx);
    }

    /**
     * Registra acciones sobre usuarios
     * @param {number} usuarioId - ID del usuario que realiza la acción
     * @param {string} tipo - "Creacion", "Actualizacion", "Eliminacion"
     * @param {number} usuarioAfectadoId - ID del usuario afectado
     * @returns {Promise<Object>}
     */
    async registrarUsuario(usuarioId, tipo, usuarioAfectadoId) {
        const accion = `${tipo} DE USUARIO`;
        const detalles = `${tipo.toLowerCase()} DE USUARIO ${usuarioAfectadoId}`;
        return this.registrar(usuarioId, accion, detalles);
    }

    /**
     * Registra acciones genéricas sobre cualquier entidad
     * @param {number} usuarioId - ID del usuario
     * @param {string} entidad - Nombre de la entidad (ej: "Paciente", "Medicamento")
     * @param {string} tipoAccion - "Creacion", "Actualizacion", "Eliminacion"
     * @param {string} idEntidad - ID de la entidad afectada
     * @returns {Promise<Object>}
     */
    async registrarEntidad(usuarioId, entidad, tipoAccion, idEntidad) {
        const accion = `${tipoAccion} de ${entidad}`;
        const detalles = `${tipoAccion.toLowerCase()} de ${entidad.toLowerCase()} ${idEntidad}`;
        return this.registrar(usuarioId, accion, detalles);
    }

    async registrarBusqueda(usuarioId, termino){
        return this.registrar(usuarioId, "BUSQUEDA", `Búsqueda global con término: ${termino}`);
    }

    async registrarAccionMedica(usuarioId, tipo, expedienteId, tx = null) {
        return this.registrar(usuarioId, tipo, `Registro de ${tipo.toLowerCase()} para expediente ${expedienteId}`, tx);
    }

    _modulo(accion) {
        const a = accion.toUpperCase();
        if (a.includes('EXPEDIENTE')) return 'Expedientes';
        if (a.includes('SESION') || a.includes('CONTRASEÑA') || a.includes('PASSWORD')) return 'Seguridad';
        if (a.includes('USUARIO')) return 'Administración';
        if (a.includes('PRECLINICO')) return 'Preclínica';
        if (a.includes('CONSULTA')) return 'Consulta Médica';
        if (a.includes('RECETA')) return 'Receta';
        return 'General';
    }

    async obtenerLogs() {
        const logsRaw = await this.auditoriaRepository.obtenerTodos();
        const hoyStr = new Date().toLocaleDateString('es-HN');

        const eventos = logsRaw.map(log => {
            const nombreCompleto = log.usuario 
                ? `${log.usuario.nombre} ${log.usuario.apellido}`.trim() 
                : 'Sistema';

            return {
                id: log.id,
                usuario: nombreCompleto,
                nombreUsuario: log.usuario?.nombreUsuario || 'sistema',
                rol: log.usuario?.rol?.nombre || 'SISTEMA',
                accion: log.accion,
                modulo: this._modulo(log.accion),
                fecha: log.fecha.toLocaleDateString('es-HN'),
                hora: log.fecha.toLocaleTimeString('es-HN', { hour: '2-digit', minute: '2-digit' }),
                timestamp: log.fecha,
                detalles: log.detalles
            };
        });
        return {
            eventos,
            metadatos: {
                total: eventos.length,
                hoy: eventos.filter(e => e.fecha === hoyStr).length,
                usuariosUnicos: [...new Set(eventos.map(e => e.usuario))],
                modulosUnicos: [...new Set(eventos.map(e => e.modulo))]
            }
        };
    }
    
    async obtenerResumen() {
        return await this.auditoriaRepository.obtenerEstadisticas();
    }
}

module.exports = AuditoriaService;
