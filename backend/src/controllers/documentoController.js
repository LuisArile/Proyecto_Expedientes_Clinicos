const { ErrorNoEncontrado } = require('../utils/errores');
const capturarAsync = require('../utils/capturarAsync');

class DocumentoController {
    constructor(documentoService) {
        this.documentoService = documentoService;
    }

    subirDocumento = capturarAsync(async (req, res, next) => {
        const { consultaId } = req.body;
        const archivo = req.file;

        const resultado = await this.documentoService.subirDocumento(
            archivo,
            consultaId
        );

        res.status(201).json(resultado);
    });

    obtenerDocumentosPorConsulta = capturarAsync(async (req, res, next) => {
        const { consultaId } = req.params;

        const documentos = await this.documentoService.obtenerDocumentosPorConsulta(consultaId);

        res.json({
            success: true,
            data: documentos
        });
    });

    obtenerDocumento = capturarAsync(async (req, res, next) => {
        const { id } = req.params;

        const documento = await this.documentoService.obtenerDocumento(id);

        if (!documento) {
            throw new ErrorNoEncontrado('Documento');
        }

        res.json({
            success: true,
            data: documento
        });
    });

    eliminarDocumento = capturarAsync(async (req, res, next) => {
        const { id } = req.params;

        const documento = await this.documentoService.obtenerDocumento(id);

        if (!documento) {
            throw new ErrorNoEncontrado('Documento');
        }

        const resultado = await this.documentoService.eliminarDocumento(id, documento.nombre);

        res.json(resultado);
    });
}

module.exports = DocumentoController;
