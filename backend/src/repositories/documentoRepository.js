const prisma = require('../config/prisma');

class DocumentoRepository {
    
    async crear(data, tx = null) {
        const client = tx || prisma;
        try {
            return await client.documento.create({
                data: {
                    nombre: data.nombre,
                    originalName: data.originalName,
                    url: data.url,
                    contentType: data.contentType,
                    consultaId: Number(data.consultaId)
                }
            });
        } catch (error) {
            throw new Error(`Error al crear documento: ${error.message}`);
        }
    }

    async obtenerPorId(id) {
        try {
            return await prisma.documento.findUnique({
                where: { id: Number(id) }
            });
        } catch (error) {
            throw new Error(`Error al obtener documento: ${error.message}`);
        }
    }

    async obtenerPorConsulta(consultaId) {
        try {
            return await prisma.documento.findMany({
                where: { consultaId: Number(consultaId) },
                orderBy: { createdAt: 'desc' }
            });
        } catch (error) {
            throw new Error(`Error al obtener documentos de consulta: ${error.message}`);
        }
    }

    async eliminar(id, tx = null) {
        const client = tx || prisma;
        try {
            return await client.documento.delete({
                where: { id: Number(id) }
            });
        } catch (error) {
            throw new Error(`Error al eliminar documento: ${error.message}`);
        }
    }
}

module.exports = DocumentoRepository;
