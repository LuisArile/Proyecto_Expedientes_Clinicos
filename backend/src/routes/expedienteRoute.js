const express = require("express");
const prisma = require("../config/prisma");

const PacienteRepository = require("../repositories/pacienteRepositorio");
const ExpedienteRepository = require("../repositories/expedienteRepository");
const ExpedienteService = require("../services/expedienteService");
const ExpedienteController = require("../controllers/expedienteController");

const router = express.Router();

const pacienteRepository = new PacienteRepository(prisma);
const expedienteRepository = new ExpedienteRepository(prisma);
const expedienteService = new ExpedienteService(expedienteRepository, pacienteRepository);
const expedienteController = new ExpedienteController(expedienteService);

// Crear expediente junto con datos del paciente (único endpoint de creación)
router.post("/", (req, res) => expedienteController.crearConPaciente(req, res));

// Obtener todos los expedientes
router.get("/", (req, res) => expedienteController.obtenerTodos(req, res));

// Obtener expediente por ID
router.get("/:idExpediente", (req, res) => expedienteController.obtenerPorId(req, res));

// Obtener expediente de un paciente específico
router.get("/paciente/:idPaciente", (req, res) => expedienteController.obtenerPorPaciente(req, res));

// Actualizar expediente
router.put("/:idExpediente", (req, res) => expedienteController.actualizar(req, res));

// Eliminar expediente
router.delete("/:idExpediente", (req, res) => expedienteController.eliminar(req, res));

module.exports = router;
