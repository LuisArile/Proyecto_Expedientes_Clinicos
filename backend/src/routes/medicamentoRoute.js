const express = require("express");
const router = express.Router();
const prisma = require('../config/prisma');

const MedicamentoRepository = require("../repositories/medicamentoRepository");
const MedicamentoService = require("../services/medicamentoService");
const MedicamentoController = require("../controllers/medicamentoController");
const AuditoriaRepository = require("../repositories/auditoriaRepositorio");
const AuditoriaService = require("../services/auditoriaService");
const autorizarRol = require("../middlewares/autorizarRol");
const validarToken = require("../middlewares/inicioSesionMiddleware");

// Auditoría
const auditoriaRepository = new AuditoriaRepository(prisma);
const auditoriaService = new AuditoriaService(auditoriaRepository);

// Inyección de dependencias
const repository = new MedicamentoRepository();
const service = new MedicamentoService(repository, auditoriaService);
const controller = new MedicamentoController(service);

router.use(validarToken);

// rutas

router.get("/", autorizarRol(["ADMINISTRADOR"]), controller.buscar);
router.get("/activos", autorizarRol(["MEDICO", "ADMINISTRADOR"]), controller.obtenerActivos);
router.get("/:id", autorizarRol(["ADMINISTRADOR"]), controller.obtenerPorId);
router.post("/", autorizarRol(["ADMINISTRADOR"]), controller.crear);
router.put("/:id", autorizarRol(["ADMINISTRADOR"]), controller.actualizar);
router.patch("/:id/estado", autorizarRol(["ADMINISTRADOR"]), controller.alternarEstado);

module.exports = router;