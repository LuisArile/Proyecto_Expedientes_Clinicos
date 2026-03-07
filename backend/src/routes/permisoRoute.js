const express = require("express");
const validarToken = require("../middlewares/inicioSesionMiddleware");
const autorizarRol = require("../middlewares/autorizarRol");

const PermisoRepository = require("../repositories/permisoRepositorio");
const PermisoService = require("../services/permisoService");
const PermisoController = require("../controllers/permisoController");

const router = express.Router();

const permisoRepository = new PermisoRepository();
const permisoService = new PermisoService(permisoRepository);
const permisoController = new PermisoController(permisoService);

// Todas las rutas requieren autenticación y rol ADMINISTRADOR
router.use(validarToken);
router.use(autorizarRol(['ADMINISTRADOR']));

router.post("/", (req, res) => permisoController.crear(req, res));
router.get("/", (req, res) => permisoController.obtenerTodos(req, res));
router.get("/:idPermiso", (req, res) => permisoController.obtenerPorId(req, res));
router.put("/:idPermiso", (req, res) => permisoController.actualizar(req, res));
router.delete("/:idPermiso", (req, res) => permisoController.eliminar(req, res));

module.exports = router;
