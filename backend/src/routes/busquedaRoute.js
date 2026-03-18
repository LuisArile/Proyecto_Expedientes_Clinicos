const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

const validarToken = require('../middlewares/inicioSesionMiddleware');

const BusquedaController = require('../controllers/busquedaController');
const BusquedaService = require('../services/busquedaService');
const AuditoriaService = require('../services/auditoriaService');
const BusquedaRepository = require('../repositories/busquedaRepository'); 
const AuditoriaRepository = require('../repositories/auditoriaRepositorio');

const auditoriaRepo = new AuditoriaRepository(prisma);
const busquedaRepo = new BusquedaRepository();

const auditoriaService = new AuditoriaService(auditoriaRepo);
const busquedaService = new BusquedaService(busquedaRepo, auditoriaService); 

const controller = new BusquedaController(busquedaService);

router.get('/', validarToken, (req, res, next) => controller.buscarGlobal(req, res, next));

module.exports = router;