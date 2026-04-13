import { documentoAPI } from "@/shared/services/api";

/**
 * Subir un documento a una consulta
 * @param {number} consultaId - ID de la consulta
 * @param {File} archivo - Archivo a subir
 * @returns {Promise} Resultado de la carga
 */
export async function subirDocumento(consultaId, archivo) {
    try {
        if (!consultaId) {
            throw new Error("Se debe especificar una consulta");
        }

        if (!archivo) {
            throw new Error("Se debe seleccionar un archivo");
        }

        return await documentoAPI.subirDocumento(consultaId, archivo);
    } catch (error) {
        console.error("Error en service de documento:", error);
        throw error;
    }
}

/**
 * Obtener documentos de una consulta
 * @param {number} consultaId - ID de la consulta
 * @returns {Promise<Array>} Lista de documentos
 */
export async function obtenerDocumentosPorConsulta(consultaId) {
    try {
        if (!consultaId) {
            return [];
        }

        return await documentoAPI.obtenerDocumentosPorConsulta(consultaId);
    } catch (error) {
        console.error("Error obteniendo documentos:", error);
        throw error;
    }
}

/**
 * Obtener un documento específico
 * @param {number} documentoId - ID del documento
 * @returns {Promise} Datos del documento
 */
export async function obtenerDocumento(documentoId) {
    try {
        return await documentoAPI.obtenerDocumento(documentoId);
    } catch (error) {
        console.error("Error obteniendo documento:", error);
        throw error;
    }
}

/**
 * Eliminar un documento
 * @param {number} documentoId - ID del documento
 * @returns {Promise} Resultado de la eliminación
 */
export async function eliminarDocumento(documentoId) {
    try {
        return await documentoAPI.eliminarDocumento(documentoId);
    } catch (error) {
        console.error("Error eliminando documento:", error);
        throw error;
    }
}
