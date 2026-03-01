const express = require("express");
const prisma = require("../config/prisma");

const validarToken = require("../middlewares/inicioSesionMiddleware");

const UsuarioRepository= require("../repositories/usuarioRepositorio");
const AuditoriaRepository = require("../repositories/auditoriaRepositorio");
const AuditoriaService = require("../services/auditoriaService");
const InicioSesionService=require("../services/inicioSesionService");
const InicioSesionController= require("../controllers/inicioSesionController");

const router= express.Router();

const usuarioRepository = new UsuarioRepository(prisma);
const auditoriaRepository = new AuditoriaRepository(prisma);
const auditoriaService = new AuditoriaService(auditoriaRepository);

const inicioSesionService = new InicioSesionService(usuarioRepository, auditoriaService);
const inicioSesionController = new InicioSesionController(inicioSesionService, auditoriaService);

router.post("/", (req, res) => 
    inicioSesionController.inicioSesion(req, res));

router.post("/logout", validarToken, (req, res) =>
  inicioSesionController.cierreSesion(req, res)
);

module.exports=router;