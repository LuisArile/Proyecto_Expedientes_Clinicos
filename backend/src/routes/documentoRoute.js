const express = require('express');
const multer = require('multer');
const validarToken = require('../middlewares/inicioSesionMiddleware');
const autorizarPermiso = require("../middlewares/autorizarPermiso");

const prisma = require('../config/prisma');

const DocumentoRepository = require('../repositories/documentoRepository');
const ConsultaMedicaRepository = require('../repositories/consultaMedicaRepositorio');
const AuditoriaRepositorio = require('../repositories/auditoriaRepositorio');
const DocumentoService = require('../services/documentoService');
const AuditoriaService = require('../services/auditoriaService');
const DocumentoController = require('../controllers/documentoController');

const router = express.Router();

// Configurar multer
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } // Límite de 50MB
});

// INSTANCIAS
const documentoRepository = new DocumentoRepository(prisma);
const consultaMedicaRepository = new ConsultaMedicaRepository(prisma);
const auditoriaRepositorio = new AuditoriaRepositorio(prisma);
const auditoriaService = new AuditoriaService(auditoriaRepositorio);
const documentoService = new DocumentoService(documentoRepository, consultaMedicaRepository, auditoriaService);
const documentoController = new DocumentoController(documentoService);

router.use(validarToken);

// Subir documento con estructura de directorios virtuales
// Body: { consultaId }
// File: multipart/form-data con campo "file"
router.post('/upload', 
    (req, res, next) => {
        upload.single('file')(req, res, (err) => {
            if (err) {
                console.error("Error de multer:", err);
                return res.status(400).json({
                    error: "Error al procesar el archivo",
                    detalle: err.message
                });
            }
            next();
        });
    },
    (req, res, next) => documentoController.subirDocumento(req, res, next)
);

// Obtener documentos de una consulta
router.get('/consulta/:consultaId',
    (req, res, next) => documentoController.obtenerDocumentosPorConsulta(req, res, next)
);

// Descargar un documento (con proxy desde Azure) 
router.get('/:id/descargar',
    (req, res, next) => documentoController.descargarDocumento(req, res, next)
);

// Obtener un documento específico
router.get('/:id',
    (req, res, next) => documentoController.obtenerDocumento(req, res, next)
);

// Eliminar un documento
router.delete('/:id',
    (req, res, next) => documentoController.eliminarDocumento(req, res, next)
);

module.exports = router;
