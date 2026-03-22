const express = require("express");
const validarToken = require("../middlewares/inicioSesionMiddleware");
const autorizarRol = require("../middlewares/autorizarRol");

const RolRepository = require("../repositories/rolRepositorio");
const RolService = require("../services/rolService");
const RolController = require("../controllers/rolController");

const router = express.Router();

const rolRepository = new RolRepository();
const rolService = new RolService(rolRepository);
const rolController = new RolController(rolService);

// Todas las rutas requieren autenticación y rol ADMINISTRADOR
router.use(validarToken);
router.use(autorizarRol(['ADMINISTRADOR']));

router.post("/", (req, res,next) => rolController.crear(req, res,next));
router.get("/", (req, res,next) => rolController.obtenerTodos(req, res,next));
router.get("/:idRol", (req, res,next) => rolController.obtenerPorId(req, res,next));
router.put("/:idRol", (req, res,next) => rolController.actualizar(req, res,next));
router.delete("/:idRol", (req, res,next) => rolController.eliminar(req, res,next));

// Gestión de permisos por rol
router.get("/:idRol/permisos", (req, res,next) => rolController.obtenerPermisos(req, res,next));
router.put("/:idRol/permisos", (req, res,next) => rolController.asignarPermisos(req, res,next));

module.exports = router;
