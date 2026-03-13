const express = require("express");
const prisma = require("../config/prisma");

//importando clases
const UsuarioRepository= require("../repositories/usuarioRepositorio");
const UsuarioService= require("../services/usuarioServices");
const UsuarioController= require("../controllers/usuarioController");


const router= express.Router();

const usuarioRepository = new  UsuarioRepository(prisma);
const usuarioService    = new  UsuarioService(usuarioRepository);
const usuarioController = new  UsuarioController(usuarioService);


//RUTAS USUARIOS
router.post("/", (req,res,next)=> usuarioController.crear(req,res,next));
router.get("/", (req,res,next)=> usuarioController.obtenerTodos(req,res,next));


module.exports=router;