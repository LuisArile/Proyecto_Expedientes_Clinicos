const express = require("express");
const prisma = require("../config/prisma");

const UsuarioRepository= require("../repositories/usuarioRepositorio");
const InicioSesionService=require("../services/inicioSesionService");
const InicioSesionController= require("../controllers/inicioSesionController");


const router= express.Router();

const usuarioRepository = new  UsuarioRepository(prisma);
const inicioSesionService = new InicioSesionService(usuarioRepository);
const inicioSesionController = new InicioSesionController(inicioSesionService);

router.post("/", (req,res)=> inicioSesionController.inicioSesion(req,res));

module.exports=router;