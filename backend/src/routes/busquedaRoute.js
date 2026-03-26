const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

const validarToken = require('../middlewares/inicioSesionMiddleware');

const BusquedaController = require('../controllers/busquedaController');
const BusquedaService = require('../services/busquedaService');
const AuditoriaService = require('../services/auditoriaService');
const BusquedaRepository = require('../repositories/busquedaRepository'); 
const AuditoriaRepository = require('../repositories/auditoriaRepositorio');

const auditoriaRepository = new AuditoriaRepository(prisma);
const busquedaRepository = new BusquedaRepository();

const auditoriaService = new AuditoriaService(auditoriaRepository);
const busquedaService = new BusquedaService(busquedaRepository, auditoriaService); 

const busquedaController = new BusquedaController(busquedaService);

router.get('/', validarToken, (req, res, next) => busquedaController.buscarGlobal(req, res, next));

module.exports = router;