const express = require('express');
const router = express.Router();
const prisma = require('../config/prisma');

const validarToken = require('../middlewares/inicioSesionMiddleware');
const autorizarRol = require("../middlewares/autorizarRol");

const AuditoriaController = require('../controllers/auditoriaController');
const AuditoriaService = require('../services/auditoriaService');
const AuditoriaRepositorio = require('../repositories/auditoriaRepositorio');

const auditoriaRepositorio = new AuditoriaRepositorio(prisma);
const auditoriaService = new AuditoriaService(auditoriaRepositorio);
const auditoriaController = new AuditoriaController(auditoriaService);

router.get("/", validarToken, autorizarRol(["ADMINISTRADOR"]), (req, res, next) => auditoriaController.obtenerTodos(req, res, next));
router.get("/estadisticas", validarToken,autorizarRol(["Administrador"]), (req, res, next) => auditoriaController.obtenerEstadisticas(req, res, next));

module.exports = router;