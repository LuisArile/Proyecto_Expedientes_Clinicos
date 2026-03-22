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


router.use(validarToken);
router.use(autorizarRol(['ADMINISTRADOR']));
//RUTAS USUARIOS

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


router.put("/change-password", authMiddleware,(req,res)=> usuarioController.cambiarPassword(req,res));


module.exports=router;