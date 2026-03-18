const express = require("express");
const prisma = require("../config/prisma");

const PacienteRepository = require("../repositories/pacienteRepositorio");
const ExpedienteRepository = require("../repositories/expedienteRepository");
const AuditoriaRepository = require("../repositories/auditoriaRepositorio");
const AuditoriaService = require("../services/auditoriaService");
const ExpedienteService = require("../services/expedienteService");
const ExpedienteController = require("../controllers/expedienteController");
const validarToken = require("../middlewares/inicioSesionMiddleware");

const router = express.Router();

const pacienteRepository = new PacienteRepository(prisma);
const expedienteRepository = new ExpedienteRepository(prisma);
const auditoriaRepository = new AuditoriaRepository(prisma);
const auditoriaService = new AuditoriaService(auditoriaRepository);
const expedienteService = new ExpedienteService(expedienteRepository, pacienteRepository, auditoriaService);
const expedienteController = new ExpedienteController(expedienteService);

// Crear expediente junto con datos del paciente (único endpoint de creación)
router.post("/", validarToken, (req, res,next) => expedienteController.crearConPaciente(req, res, next));

// Obtener todos los expedientes
router.get("/", (req, res,next) => expedienteController.obtenerTodos(req, res,next));

// Obtener expediente de un paciente específico
router.get("/paciente/:idPaciente", (req, res,next) => expedienteController.obtenerPorPaciente(req, res,next));

// Obtener expediente por ID
router.get("/:idExpediente", (req, res,next) => expedienteController.obtenerPorId(req, res,next));

// Actualizar expediente
router.put("/:idExpediente", (req, res,next) => expedienteController.actualizar(req, res,next));

// Eliminar expediente
router.delete("/:idExpediente", (req, res,next) => expedienteController.eliminar(req, res,next));

module.exports = router;
