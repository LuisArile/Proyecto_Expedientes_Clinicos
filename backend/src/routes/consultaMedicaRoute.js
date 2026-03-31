const express = require('express');
const validarToken = require('../middlewares/inicioSesionMiddleware');
const autorizarRol = require('../middlewares/autorizarRol');
const autorizarPermiso = require("../middlewares/autorizarPermiso");

const prisma = require('../config/prisma');

const ConsultaMedicaRepository = require('../repositories/consultaMedicaRepositorio');
const RecetaMedicaRepository = require('../repositories/recetaMedicaRepositorio');
const ExpedienteRepository = require('../repositories/expedienteRepository');
const AuditoriaRepository = require('../repositories/auditoriaRepositorio');
const AuditoriaService = require('../services/auditoriaService');
const ConsultaMedicaService = require('../services/consultaMedicaService');
const ConsultaMedicaController = require('../controllers/consultaMedicaController');



const router = express.Router();

// INSTANCIAS 

const consultaMedicaRepository = new ConsultaMedicaRepository(prisma);
const recetaMedicaRepository = new RecetaMedicaRepository(prisma);
const expedienteRepository = new ExpedienteRepository(prisma);
const auditoriaRepository = new AuditoriaRepository(prisma);
const auditoriaService = new AuditoriaService(auditoriaRepository);
const consultaMedicaService = new ConsultaMedicaService(
    consultaMedicaRepository,
    recetaMedicaRepository,
    expedienteRepository,
    auditoriaService
);
const consultaMedicaController = new ConsultaMedicaController(consultaMedicaService);


router.use(validarToken);


//Creacion de nueva consulta, solo medico autorizado
router.post('/expediente/:expedienteId', autorizarPermiso('CONSULTA_MEDICA'), (req, res,next) => consultaMedicaController.registrar(req, res,next));

//Medicos y enfemeros pueden ver consultas de un expediente
router.get('/expediente/:expedienteId', autorizarPermiso('VER_CONSULTAS'), (req, res,next) => consultaMedicaController.obtenerPorExpediente(req, res,next));

//obtener un expediente en especifico, solo medico y enfermeros
router.get('/:id', autorizarPermiso('VER_CONSULTAS'), (req, res,next) => consultaMedicaController.obtenerPorId(req, res,next));

module.exports = router;