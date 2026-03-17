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
            if (!usuarioId) {
                console.warn("Intento de auditoría sin usuarioId");
                return null;
            }

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
     * @param {string} tipoSesion - "INICIO_SESION" o "CIERRE_SESION"
     * @param {string} nombreUsuario - Nombre del usuario (opcional)
     * @returns {Promise<Object>}
     */
    async registrarSesion(usuarioId, tipoSesion, nombreUsuario = null) {
        const detalles = nombreUsuario 
            ? `Usuario ${nombreUsuario} ${tipoSesion === 'INICIO_SESION' ? 'inició' : 'cerró'} sesión`
            : `${tipoSesion === 'INICIO_SESION' ? 'Inicio' : 'Cierre'} de sesión`;
        
        return this.registrar(usuarioId, tipoSesion, detalles);
    }

    /**
     * Registra acciones sobre expedientes
     * @param {number} usuarioId - ID del usuario
     * @param {string} tipoAccion - "Creacion", "Actualizacion", "Eliminacion"
     * @param {number} idExpediente - ID del expediente afectado
     * @returns {Promise<Object>}
     */
    async registrarExpediente(usuarioId, tipoAccion, datos, tx = null) {
        const accion = `${tipoAccion} DE EXPEDIENTE`;

        const idExp = typeof datos === 'object' ? datos.idExpediente : datos;
        const detallesAdicionales = datos.detalles || `Proceso de ${tipoAccion.toLowerCase()}`;
        
        const detallesFinales = `Expediente ID: ${idExp}. ${detallesAdicionales}`;
        
        return this.registrar(usuarioId, accion, detallesFinales, tx);
    }

    /**
     * Registra acciones sobre usuarios
     * @param {number} usuarioId - ID del usuario que realiza la acción
     * @param {string} tipoAccion - "Creacion", "Actualizacion", "Eliminacion"
     * @param {number} usuarioAfectadoId - ID del usuario afectado
     * @returns {Promise<Object>}
     */
    async registrarUsuario(usuarioId, tipoAccion, usuarioAfectadoId) {
        const accion = `${tipoAccion} de usuario`;
        const detalles = `${tipoAccion.toLowerCase()} de usuario ${usuarioAfectadoId}`;
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
}

module.exports = AuditoriaService;
