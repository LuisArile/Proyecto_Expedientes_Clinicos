const express = require("express");
const prisma = require("../config/prisma");

const UsuarioRepository= require("../repositories/usuarioRepositorio");
const UsuarioService= require("../services/usuarioServices");
const UsuarioController= require("../controllers/usuarioController");
const authMiddleware = require("../middlewares/confirmarToken");


const router= express.Router();

const usuarioRepository = new  UsuarioRepository(prisma);
const usuarioService    = new  UsuarioService(usuarioRepository);
const usuarioController = new  UsuarioController(usuarioService);


//RUTAS USUARIOS
router.post("/", (req,res,next)=> usuarioController.crear(req,res,next));
router.get("/", (req,res,next)=> usuarioController.obtenerTodos(req,res,next));
router.post("/", (req,res)=> usuarioController.crear(req,res));
router.get("/", (req,res)=> usuarioController.obtenerTodos(req,res));
router.put("/change-password", authMiddleware,(req,res)=> usuarioController.cambiarPassword(req,res));


module.exports=router;