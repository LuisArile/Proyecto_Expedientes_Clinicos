const express = require("express");
const validarToken = require("../middlewares/inicioSesionMiddleware");
const autorizarRol = require("../middlewares/autorizarRol");
const prisma = require('../config/prisma');

const PermisoRepository = require("../repositories/permisoRepositorio");
const PermisoService = require("../services/permisoService");
const PermisoController = require("../controllers/permisoController");
const AuditoriaService = require("../services/auditoriaService");
const auditoriaRepository = require("../repositories/auditoriaRepositorio");

const router = express.Router();

const auditoriaRepositorio = new auditoriaRepository(prisma);
const auditoriaService = new AuditoriaService(auditoriaRepository)
const permisoRepository = new PermisoRepository();
const permisoService = new PermisoService(permisoRepository, auditoriaService);
const permisoController = new PermisoController(permisoService);

// Todas las rutas requieren autenticación y rol ADMINISTRADOR
router.use(validarToken);
router.use(autorizarRol(['ADMINISTRADOR']));

router.post("/", (req, res,next) => permisoController.crear(req, res,next));
router.get("/", (req, res,next) => permisoController.obtenerTodos(req, res,next));
router.get("/:idPermiso", (req, res,next) => permisoController.obtenerPorId(req, res,next));
router.put("/:idPermiso", (req, res,next) => permisoController.actualizar(req, res,next));
router.delete("/:idPermiso", (req, res,next) => permisoController.eliminar(req, res,next));

module.exports = router;
