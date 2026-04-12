/**
 * AuditoriaService
 * Servicio centralizado para manejar todos los registros de auditoría del sistema
 * Patrón: Factory/Wrapper para encapsular la lógica de auditoría
 */
class AuditoriaService {
    constructor(auditoriaRepository) {
        this.auditoriaRepository = auditoriaRepository;
    }

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
            return null;
        }
    }

    async registrarSesion(usuarioId, tipo, nombreUsuario = null) {
        const detalles = `Usuario ${nombreUsuario} ${tipo === 'INICIO_SESION' ? 'entró al' : 'salió del'} sistema`;
        return this.registrar(usuarioId, tipo, detalles);
    }

    async registrarExpediente(usuarioId, tipo, datos, tx = null) {
        const accion = `${tipo} DE EXPEDIENTE`;

        const idExp = typeof datos === 'object' ? datos.idExpediente : datos;
        const detallesAdicionales = datos.detalles || `Proceso de ${tipo.toLowerCase()}`;
        
        const detallesFinales = `Expediente ID: ${idExp}. ${detallesAdicionales}`;
        
        return this.registrar(usuarioId, accion, detallesFinales, tx);
    }

    async registrarUsuario(usuarioId, tipo, usuarioAfectadoId) {
        const accion = `${tipo} DE USUARIO`;
        const detalles = `${tipo.toLowerCase()} DE USUARIO ${usuarioAfectadoId}`;
        return this.registrar(usuarioId, accion, detalles);
    }

    async registrarEntidad(usuarioId, entidad, tipoAccion, idEntidad) {
        const accion = `${tipoAccion.toUpperCase()} DE ${entidad.toUpperCase()}`;
        const detalles = `${tipoAccion.toUpperCase()} DE ${entidad.toUpperCase()} ${idEntidad}`;
        return this.registrar(usuarioId, accion, detalles);
    }

    async registrarBusqueda(usuarioId, termino){
        return this.registrar(usuarioId, "BUSQUEDA", `Búsqueda global con término: ${termino}`);
    }

    //  (CONSULTA MÉDICA)
    async registrarAccionMedica(usuarioId, tipo, datos, tx = null) {
        const detalles = {
            tipo: "CONSULTA_MEDICA",
            accion: tipo,
            idExpediente: datos.idExpediente,
            idConsulta: datos.idConsulta,
            examenes: datos.examenes || false,
            medicamentos: datos.medicamentos || false
        };

        return this.registrar(usuarioId, tipo, detalles, tx);
    }

    _modulo(accion) {
        const a = accion.toUpperCase();
        if (a.includes('EXPEDIENTE')) return 'Expedientes';
        if (a.includes('SESION') || a.includes('CONTRASEÑA') || a.includes('PASSWORD')) return 'Seguridad';
        if (a.includes('USUARIO')) return 'Administración';
        if (a.includes('PRECLINICO')) return 'Preclínica';
        if (a.includes('CONSULTA')) return 'Consulta Médica';
        if (a.includes('RECETA')) return 'Receta';
        if (a.includes('EXAMEN')) return 'Exámenes';
        if (a.includes('MEDICAMENTO')) return 'Medicamentos';
        if (a.includes('DOCUMENTO')) return 'Documentos';
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