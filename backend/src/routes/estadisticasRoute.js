const express = require("express");
const prisma = require("../config/prisma");
const validarToken = require("../middlewares/inicioSesionMiddleware");

const EstadisticasService = require("../services/estadisticasService");
const EstadisticasController = require("../controllers/estadisticasController");

const UsuarioRepository= require("../repositories/usuarioRepositorio");
const AuditoriaRepository = require("../repositories/auditoriaRepositorio");
const PacienteRepository = require("../repositories/pacienteRepositorio");
const ExpedienteRepository = require("../repositories/expedienteRepository");

const router = express.Router();

const usuarioRepo = new UsuarioRepository();
const auditoriaRepo = new AuditoriaRepository(prisma);
const pacienteRepo = new PacienteRepository();
const expedienteRepo = new ExpedienteRepository();

const estadisticasService = new EstadisticasService(prisma, usuarioRepo, auditoriaRepo, pacienteRepo, expedienteRepo);
const estadisticasController = new EstadisticasController(estadisticasService);

router.get("/resumen", validarToken, (req, res,next) => estadisticasController.obtenerDashboard(req, res,next));

module.exports = router;