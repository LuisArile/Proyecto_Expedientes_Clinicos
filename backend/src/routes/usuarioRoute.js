const express = require("express");
const prisma = require("../config/prisma");

const UsuarioRepository= require("../repositories/usuarioRepositorio");
const UsuarioService= require("../services/usuarioServices");
const UsuarioController= require("../controllers/usuarioController");
const AuditoriaRepository = require("../repositories/auditoriaRepositorio");
const AuditoriaService = require("../services/auditoriaService");
// const authMiddleware = require("../middlewares/confirmarToken");
// const autorizarRol=require("../middlewares/autorizarRol");
const validarToken=require("../middlewares/inicioSesionMiddleware");
const emailService = require("../services/emailService");

const router= express.Router();

const auditoriaRepository = new AuditoriaRepository(prisma);
const auditoriaService = new AuditoriaService(auditoriaRepository);
const usuarioRepository = new  UsuarioRepository(prisma);
const usuarioService = new UsuarioService(usuarioRepository, auditoriaService, emailService);
const usuarioController = new  UsuarioController(usuarioService);

router.use(validarToken);

router.put("/change-password", validarToken,(req,res)=> usuarioController.cambiarPassword(req,res));

// router.use(autorizarRol(['ADMINISTRADOR']));
//RUTAS USUARIOS

router.patch("/:id/status", (req, res, next) => usuarioController.alternarEstado(req, res, next));

router.post("/:id/enviar-credenciales", (req, res, next) => usuarioController.enviarCredenciales(req, res, next));

//Crear Usuario, solo administrador tiene acceso.
router.post("/", (req,res,next)=> usuarioController.crear(req,res,next));

//obtenemos lista de  usuarios.
router.get("/", (req,res,next)=> usuarioController.obtenerTodos(req,res,next));

//obtenemos usuario por id.
router.get("/:id", (req,res,next)=> usuarioController.obtenerPorId(req,res,next));

//actualizar usuario
router.put("/:id", (req, res,next) => usuarioController.actualizar(req, res,next));

//eliminar usuario
router.delete("/:id", (req,res,next)=> usuarioController.eliminar(req,res,next));

module.exports=router;