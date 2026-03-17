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

router.post("/", (req, res) => rolController.crear(req, res));
router.get("/", (req, res) => rolController.obtenerTodos(req, res));
router.get("/:idRol", (req, res) => rolController.obtenerPorId(req, res));
router.put("/:idRol", (req, res) => rolController.actualizar(req, res));
router.delete("/:idRol", (req, res) => rolController.eliminar(req, res));

// Gestión de permisos por rol
router.get("/:idRol/permisos", (req, res) => rolController.obtenerPermisos(req, res));
router.put("/:idRol/permisos", (req, res) => rolController.asignarPermisos(req, res));

module.exports = router;
