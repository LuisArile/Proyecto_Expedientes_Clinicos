const express = require("express");
const prisma = require("../config/prisma");

const validarToken = require("../middlewares/inicioSesionMiddleware");

const UsuarioRepository= require("../repositories/usuarioRepositorio");
const InicioSesionService=require("../services/inicioSesionService");
const InicioSesionController= require("../controllers/inicioSesionController");

const router= express.Router();

const usuarioRepository = new UsuarioRepository(prisma);

const inicioSesionService = new InicioSesionService(usuarioRepository, prisma);
const inicioSesionController = new InicioSesionController(inicioSesionService);

router.post("/", (req, res) => 
    inicioSesionController.inicioSesion(req, res));

router.post("/logout", validarToken, (req, res) =>
  inicioSesionController.cierreSesion(req, res)
);

module.exports=router;