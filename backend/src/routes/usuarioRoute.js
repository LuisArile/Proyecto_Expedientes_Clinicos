const express = require("express");
const prisma = require("../config/prisma");

const UsuarioRepository= require("../repositories/usuarioRepositorio");
const UsuarioService= require("../services/usuarioServices");
const UsuarioController= require("../controllers/usuarioController");
const AuditoriaRepository = require("../repositories/auditoriaRepositorio");
const AuditoriaService = require("../services/auditoriaService");
const authMiddleware = require("../middlewares/confirmarToken");
const autorizarRol=require("../middlewares/autorizarRol");
const validarToken=require("../middlewares/inicioSesionMiddleware");

const router= express.Router();

const auditoriaRepository = new AuditoriaRepository(prisma);
const auditoriaService = new AuditoriaService(auditoriaRepository);
const usuarioRepository = new  UsuarioRepository(prisma);
const usuarioService    = new  UsuarioService(usuarioRepository, auditoriaService);
const usuarioController = new  UsuarioController(usuarioService);


//RUTAS USUARIOS
router.post("/", (req,res,next)=> usuarioController.crear(req,res,next));
router.get("/" ,validarToken, (req,res,next)=> usuarioController.obtenerTodos(req,res,next));
//router.post("/", (req,res)=> usuarioController.crear(req,res));
//router.get("/", (req,res)=> usuarioController.obtenerTodos(req,res));
router.put("/change-password", authMiddleware,(req,res)=> usuarioController.cambiarPassword(req,res));


module.exports=router;