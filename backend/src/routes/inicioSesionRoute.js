const express = require("express");
const prisma = require("../config/prisma");

const UsuarioRepository= require("../repositories/usuarioRepositorio");
const InicioSesionService=require("../services/inicioSesionService");
const InicioSesionController= require("../controllers/inicioSesionController");
// const usuarioController = require("../controllers/usuarioController");


const router= express.Router();

const usuarioRepository = new  UsuarioRepository(prisma);
const inicioSesionService = new InicioSesionService(usuarioRepository);
const inicioSesionController = new InicioSesionController(inicioSesionService);

//crear Usuario
// router.post("/", (req,res)=> usuarioController.crear(req,res));

router.post("/", (req,res)=> inicioSesionController.inicioSesion(req,res));
router.post("/logout", (req,res)=> inicioSesionController.cierreSesion(req,res));

module.exports=router;