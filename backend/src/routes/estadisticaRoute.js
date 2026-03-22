const express = require("express");
const prisma = require("../config/prisma");
const validarToken = require("../middlewares/inicioSesionMiddleware");

const EstadisticaService = require("../services/estadisticaService");
const EstadisticaController = require("../controllers/estadisticaController");

const UsuarioRepository= require("../repositories/usuarioRepositorio");
const AuditoriaRepository = require("../repositories/auditoriaRepositorio");
const PacienteRepository = require("../repositories/pacienteRepositorio");
const ExpedienteRepository = require("../repositories/expedienteRepository");
const ConsultaMedicaRepository = require("../repositories/consultaMedicaRepositorio");
const RegistroPreclinicoRepository = require("../repositories/registroPreclinicoRepositorio");
const RecetaMedicaRepository = require("../repositories/recetaMedicaRepositorio");

const router = express.Router();

const usuarioRepository = new UsuarioRepository();
const auditoriaRepository = new AuditoriaRepository(prisma);
const pacienteRepository = new PacienteRepository();
const expedienteRepository = new ExpedienteRepository();
const consultaMedicaRepository = new ConsultaMedicaRepository();
const registroPreclinicoRepository = new RegistroPreclinicoRepository();
const recetaMedicaRepository = new RecetaMedicaRepository();

const estadisticaService = new EstadisticaService(prisma, usuarioRepository, auditoriaRepository, pacienteRepository, expedienteRepository, consultaMedicaRepository, registroPreclinicoRepository, recetaMedicaRepository);
const estadisticaController = new EstadisticaController(estadisticaService);

router.get("/resumen", validarToken, (req, res, next) => estadisticaController.obtenerDashboard(req, res, next));

module.exports = router;