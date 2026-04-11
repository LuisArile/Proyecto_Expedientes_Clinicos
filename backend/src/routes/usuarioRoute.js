const express = require("express");
const prisma = require("../config/prisma");

const UsuarioRepository = require("../repositories/usuarioRepositorio");
const UsuarioService = require("../services/usuarioServices");
const UsuarioController = require("../controllers/usuarioController");
const AuditoriaRepository = require("../repositories/auditoriaRepositorio");
const AuditoriaService = require("../services/auditoriaService");
const autorizarRol = require("../middlewares/autorizarRol");
const validarToken = require("../middlewares/inicioSesionMiddleware");

// decoradores 
const camposUnicos = require('../decoraciones/camposUnicosDecorador');
const validacionesEntrada = require('../decoraciones/validacionesEntradaDecorador');

const router = express.Router();

const auditoriaRepository = new AuditoriaRepository(prisma);
const auditoriaService = new AuditoriaService(auditoriaRepository);
const usuarioRepository = new UsuarioRepository(prisma);

// Crear servicio base
let usuarioService = new UsuarioService(usuarioRepository, auditoriaService);

// Aplicar decoradores
usuarioService = new validacionesEntrada(usuarioService);
usuarioService = new camposUnicos(usuarioService, usuarioRepository);

const usuarioController = new UsuarioController(usuarioService);


// Ruta cambio de clave
router.put("/change-password", validarToken,(req,res)=> usuarioController.cambiarPassword(req,res));

// Middlewares para todas las rutas siguientes
router.use(validarToken);
router.use(autorizarRol(['ADMINISTRADOR']));

// RUTAS USUARIOS
router.post("/", (req, res, next) => usuarioController.crear(req, res, next));
router.get("/", (req, res, next) => usuarioController.obtenerTodos(req, res, next));
router.get("/:id", (req, res, next) => usuarioController.obtenerPorId(req, res, next));
router.put("/:id", (req, res, next) => usuarioController.actualizar(req, res, next));
router.delete("/:id", (req, res, next) => usuarioController.eliminar(req, res, next));

module.exports = router;
