const autorizarRol = require("../middlewares/autorizarRol");
const validarToken = require("../middlewares/inicioSesionMiddleware");
const prisma = require("../config/prisma");
const express = require("express"); 


const RegistroPreclinicoRepository = require("../repositories/registroPreclinicoRepositorio");
const ExpedienteRepository = require("../repositories/expedienteRepository");
const AuditoriaRepository = require("../repositories/auditoriaRepositorio");
const AuditoriaService = require("../services/auditoriaService");
const RegistroPreclinicoService = require("../services/registroPreclinicoService");
const RegistroPreclinicoController = require("../controllers/registroPreclinicoController");

// instancias
const registroPreclinicoRepository = new RegistroPreclinicoRepository(prisma);
const expedienteRepository = new ExpedienteRepository(prisma);
const auditoriaRepository = new AuditoriaRepository(prisma);
const auditoriaService = new AuditoriaService(auditoriaRepository);
const registroPreclinicoService = new RegistroPreclinicoService(
    registroPreclinicoRepository,
    expedienteRepository,
    auditoriaService
);
const registroPreclinicoController = new RegistroPreclinicoController(
    registroPreclinicoService,
    auditoriaService
);

const router = express.Router();

// validar Token
router.use(validarToken);
router.use(autorizarRol(['ENFERMERO', 'DOCTOR']));

// Rutas
router.post("/expediente/:expedienteId", (req, res) => registroPreclinicoController.registrar(req, res));
router.get("/expediente/:expedienteId", (req, res) => registroPreclinicoController.obtenerPorExpediente(req, res));
router.get("/expediente/:expedienteId/ultimo", (req, res) => registroPreclinicoController.obtenerUltimoPorExpediente(req, res));

module.exports = router;

