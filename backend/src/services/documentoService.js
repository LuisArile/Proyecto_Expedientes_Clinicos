const { BlobSASPermissions, generateBlobSASQueryParameters, StorageSharedKeyCredential } = require("@azure/storage-blob");
const { containerClient } = require("../config/storage");

class DocumentoService {
    constructor(documentoRepository, consultaMedicaRepository, auditoriaService) {
        this.documentoRepository = documentoRepository;
        this.consultaMedicaRepository = consultaMedicaRepository;
        this.auditoriaService = auditoriaService;
    }

    //Directorio virtual: numeroExpediente/consultaId/documento 
    generarNombreBlobConRuta(numeroExpediente, consultaId, nombreOriginal) {
        const timestamp = Date.now();
        return `${numeroExpediente}/${consultaId}/${timestamp}-${nombreOriginal}`;
    }

    // Generar URL con SAS token válido por 1 año (se puede ajustar)
    generarSASUrl(blobName) {
        const accountName = process.env.AZURE_STORAGE_ACCOUNT;
        const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
        const containerName = process.env.AZURE_STORAGE_CONTAINER;

        if (!accountName || !accountKey) {
            throw new Error("AZURE_STORAGE_ACCOUNT o AZURE_STORAGE_ACCOUNT_KEY no están configuradas");
        }

        const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey);

        const sasQueryParameters = generateBlobSASQueryParameters(
            {
                containerName,
                blobName,
                permissions: BlobSASPermissions.parse("racwd"), // read, add, create, write, delete
                expiresOn: new Date(new Date().valueOf() + 86400 * 1000 * 365), // 1 año
            },
            sharedKeyCredential
        );

        const sasUrl = `${containerClient.getBlockBlobClient(blobName).url}?${sasQueryParameters}`;
        return sasUrl;
    }

    async subirDocumento(archivo, consultaId, usuarioId) {
        try {
            if (!archivo) {
                throw new Error("No se envió un archivo");
            }

            // Validar que se haya proporcionado consultaId
            if (!consultaId) {
                throw new Error("Se debe especificar un consultaId");
            }

            // Obtener la consulta con su expediente para extraer numeroExpediente
            const consulta = await this.consultaMedicaRepository.obtenerPorId(consultaId);
            if (!consulta) {
                throw new Error("Consulta no encontrada");
            }

            const numeroExpediente = consulta.expediente.numeroExpediente;

            // Generar nombre del blob con estructura: numeroExpediente/consultaId/documento
            const blobName = this.generarNombreBlobConRuta(numeroExpediente, consultaId, archivo.originalname);
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);

            // Subir archivo a Azure
            await blockBlobClient.uploadData(archivo.buffer, {
                blobHTTPHeaders: {
                    blobContentType: archivo.mimetype,
                },
            });

            // Generar URL con SAS token
            const url = this.generarSASUrl(blobName);

            // Guardar referencia en base de datos
            const datosDocumento = {
                nombre: blobName,
                originalName: archivo.originalname,
                url,
                contentType: archivo.mimetype,
                consultaId: Number(consultaId)
            };

            const documento = await this.documentoRepository.crear(datosDocumento);

            // Registrar en auditoría
            if (usuarioId && this.auditoriaService) {
                await this.auditoriaService.registrarEntidad(usuarioId, "DOCUMENTO", "CARGA", documento.id);
            }

            return {
                success: true,
                documento: {
                    id: documento.id,
                    nombre: documento.originalName,
                    url: documento.url,
                    fechaCreacion: documento.createdAt
                }
            };
        } catch (error) {
            throw new Error(`Error al subir documento: ${error.message}`);
        }
    }

    async obtenerDocumentosPorConsulta(consultaId) {
        try {
            return await this.documentoRepository.obtenerPorConsulta(consultaId);
        } catch (error) {
            throw new Error(`Error al obtener documentos: ${error.message}`);
        }
    }

    async obtenerDocumento(id) {
        try {
            return await this.documentoRepository.obtenerPorId(id);
        } catch (error) {
            throw new Error(`Error al obtener documento: ${error.message}`);
        }
    }

    async descargarDocumento(blobName, usuarioId, documentoId) {
        try {
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            
            // Obtener información del blob para saber su tamaño
            const properties = await blockBlobClient.getProperties();
            const buffer = Buffer.alloc(properties.contentLength);
            
            // Descargar el blob al buffer
            await blockBlobClient.downloadToBuffer(buffer);
            
            // Registrar en auditoría
            if (usuarioId && this.auditoriaService) {
                await this.auditoriaService.registrarEntidad(usuarioId, "Documento", "Descarga", documentoId);
            }
            
            return buffer;
        } catch (error) {
            throw new Error(`Error al descargar documento: ${error.message}`);
        }
    }

    async eliminarDocumento(documentoId, blobName, usuarioId) {
        try {
            // Eliminar de Azure Blob Storage
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            await blockBlobClient.delete();

            // Eliminar registro de base de datos
            await this.documentoRepository.eliminar(documentoId);

            // Registrar en auditoría
            if (usuarioId && this.auditoriaService) {
                await this.auditoriaService.registrarEntidad(usuarioId, "DOCUMENTO", "ELIMINACION", documentoId);
            }

            return { success: true, message: "Documento eliminado correctamente" };
        } catch (error) {
            throw new Error(`Error al eliminar documento: ${error.message}`);
        }
    }
}

module.exports = DocumentoService;
