const express = require("express");
const router = express.Router();
const prisma = require('../config/prisma');

const ExamenRepository = require("../repositories/examenRepository");
const ExamenService = require("../services/examenService");
const ExamenController = require("../controllers/examenController");
const AuditoriaRepository = require("../repositories/auditoriaRepositorio");
const AuditoriaService = require("../services/auditoriaService");
const autorizarRol = require("../middlewares/autorizarRol");
const validarToken = require("../middlewares/inicioSesionMiddleware");

// Auditoría
const auditoriaRepository = new AuditoriaRepository(prisma);
const auditoriaService = new AuditoriaService(auditoriaRepository);

// Inyección correcta
const repository = new ExamenRepository();
const service = new ExamenService(repository, auditoriaService);
const controller = new ExamenController(service);

router.use(validarToken);
// rutas

router.get("/", autorizarRol([ "ADMINISTRADOR"]), controller.buscar);
router.get("/activos",  autorizarRol(["MEDICO", "ADMINISTRADOR"]), controller.obtenerActivos);
router.get("/:id",  autorizarRol([ "ADMINISTRADOR"]), controller.obtenerPorId);
router.post("/",  autorizarRol(["ADMINISTRADOR"]), controller.crear);
router.put("/:id",   autorizarRol(["ADMINISTRADOR"]), controller.actualizar);
router.patch("/:id/estado",  autorizarRol(["ADMINISTRADOR"]), controller.alternarEstado);

module.exports = router;