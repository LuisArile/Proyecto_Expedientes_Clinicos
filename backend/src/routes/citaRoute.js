const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

const CitaRepository = require('../repositories/citaRepositorio');
const CitaService = require('../services/citaService');
const CitaController = require('../controllers/citaController');
const AuditoriaRepository = require('../repositories/auditoriaRepositorio');
const AuditoriaService = require('../services/auditoriaService');
const validarToken = require('../middlewares/inicioSesionMiddleware');
const autorizarRol = require('../middlewares/autorizarRol');

// Instancias
const auditoriaRepository = new AuditoriaRepository(prisma);
const auditoriaService = new AuditoriaService(auditoriaRepository);
const citaRepository = new CitaRepository();
const citaService = new CitaService(citaRepository, auditoriaService);
const citaController = new CitaController(citaService);

// Todas las rutas requieren autenticación
router.use(validarToken);

// RECEPCIONISTA
router.post('/agendar', autorizarRol(['RECEPCIONISTA', 'ADMINISTRADOR']), citaController.agendarCita);
router.post('/registrar-hoy', autorizarRol(['RECEPCIONISTA', 'ADMINISTRADOR']), citaController.registrarPacienteHoy);
router.put('/:idCita/enviar-preclinica', autorizarRol(['RECEPCIONISTA', 'ADMINISTRADOR']), citaController.enviarAEsperaPreclinica);

//ENFERMERO
router.put('/:idCita/iniciar-preclinica', autorizarRol(['ENFERMERO', 'ADMINISTRADOR']), citaController.iniciarPreclinica);
router.put('/:idCita/finalizar-preclinica', autorizarRol(['ENFERMERO', 'ADMINISTRADOR']), citaController.finalizarPreclinica);

//MEDICO
router.put('/:idCita/iniciar-consulta', autorizarRol(['MEDICO', 'ADMINISTRADOR']), citaController.iniciarConsulta);
router.put('/:idCita/finalizar-consulta', autorizarRol(['MEDICO', 'ADMINISTRADOR']), citaController.finalizarConsulta);

// TABLERO -TRAZABILIDAD
router.get('/tablero', autorizarRol(['RECEPCIONISTA', 'ENFERMERO', 'MEDICO', 'ADMINISTRADOR']), citaController.obtenerTablero);
router.get('/seguimiento/:idCita', autorizarRol(['RECEPCIONISTA', 'ENFERMERO', 'MEDICO', 'ADMINISTRADOR']), citaController.obtenerSeguimiento);
router.get('/estado/:estado', autorizarRol(['RECEPCIONISTA', 'ENFERMERO', 'MEDICO', 'ADMINISTRADOR']), citaController.obtenerCitasPorEstado);

module.exports = router;