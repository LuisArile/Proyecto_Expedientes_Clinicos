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
router.post("/", validarToken, (req, res) => expedienteController.crearConPaciente(req, res));

// Obtener todos los expedientes
router.get("/", (req, res) => expedienteController.obtenerTodos(req, res));

// Búsqueda global (DNI, Nombre, Apellido)
router.get('/buscar', 
    validarToken, 
    (req, res) => expedienteController.buscarGlobal(req, res)
);

// Obtener expediente de un paciente específico
router.get("/paciente/:idPaciente", (req, res) => expedienteController.obtenerPorPaciente(req, res));

// Obtener expediente por ID
router.get("/:idExpediente", (req, res) => expedienteController.obtenerPorId(req, res));

// Actualizar expediente
router.put("/:idExpediente", (req, res) => expedienteController.actualizar(req, res));

// Eliminar expediente
router.delete("/:idExpediente", (req, res) => expedienteController.eliminar(req, res));

// router.get('/:id', expedienteController.obtenerPorId);

module.exports = router;
