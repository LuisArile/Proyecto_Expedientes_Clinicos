const express = require("express");
const prisma = require("../config/prisma");

const validarToken = require("../middlewares/inicioSesionMiddleware");

const UsuarioRepository= require("../repositories/usuarioRepositorio");
const AuditoriaRepository = require("../repositories/auditoriaRepositorio");
const AuditoriaService = require("../services/auditoriaService");
const InicioSesionService=require("../services/inicioSesionService");
const InicioSesionController= require("../controllers/inicioSesionController");

const router= express.Router();

const usuarioRepository = new UsuarioRepository();
const auditoriaRepository = new AuditoriaRepository(prisma);
const auditoriaService = new AuditoriaService(auditoriaRepository);

const inicioSesionService = new InicioSesionService(usuarioRepository, auditoriaService);
const inicioSesionController = new InicioSesionController(inicioSesionService);

router.post("/login", (req, res, next) =>  inicioSesionController.inicioSesion(req, res, next));

router.post("/logout", validarToken, (req, res, next) => inicioSesionController.cierreSesion(req, res, next));

module.exports=router;