const express = require("express"); 
const validarToken = require("../middlewares/inicioSesionMiddleware");
const autorizarRol = require("../middlewares/autorizarRol");
const prisma = require("../config/prisma");



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
const registroPreclinicoController = new RegistroPreclinicoController(registroPreclinicoService);

const router = express.Router();

// validar Token en todas las rutas
router.use(validarToken);
//router.use(autorizarRol(['ENFERMERO', 'MEDICO']));

// Rutas

//Registrar signos solo ENFERMEROS
router.post("/expediente/:expedienteId",autorizarRol(['ENFERMERO']) , (req, res,next) => registroPreclinicoController.registrar(req, res,next));

//Obtener todos los registros de un expediente solo ENFERMEROS y MEDICOS
router.get("/expediente/:expedienteId", autorizarRol(['ENFERMERO', 'MEDICO']), (req, res,next) => registroPreclinicoController.obtenerPorExpediente(req, res,next));

//Obtener el ultimo registro de un expediente solo ENFERMEROS y MEDICOS
router.get("/expediente/:expedienteId/ultimo", autorizarRol(['ENFERMERO', 'MEDICO']), (req, res,next) => registroPreclinicoController.obtenerUltimoPorExpediente(req, res,next));

//obtener   todos los registros para panel solo ENFERMEROS ,MEDICOS, ADMINISTRADORES
router.get("/todos", autorizarRol(['ENFERMERO', 'MEDICO', 'ADMINISTRADOR']), (req, res,next) => registroPreclinicoController.obtenerTodos(req, res,next));

//Obtener conteo de registros solo ENFERMEROS ,MEDICOS, ADMINISTRADORES
router.get("/conteo", autorizarRol(['ENFERMERO', 'MEDICO', 'ADMINISTRADOR']), (req, res,next) => registroPreclinicoController.contarTodos(req, res,next));



module.exports = router;

