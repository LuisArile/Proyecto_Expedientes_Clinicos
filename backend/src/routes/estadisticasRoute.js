const express = require("express");
const prisma = require("../config/prisma");
const validarToken = require("../middlewares/inicioSesionMiddleware");

const EstadisticasService = require("../services/estadisticasService");
const EstadisticasController = require("../controllers/estadisticasController");

const router = express.Router();

const estadisticasService = new EstadisticasService(prisma);
const estadisticasController = new EstadisticasController(estadisticasService);

router.get("/resumen", validarToken, (req, res) => estadisticasController.obtenerDashboard(req, res));

module.exports = router;