require('dotenv').config();

const express= require("express");
const prisma = require('./config/prisma')
const cors= require("cors");

const usuarioRouters = require("./routes/usuarioRoute")
const inicioSesionRouters= require("./routes/inicioSesionRoute")
const expedienteRouters = require("./routes/expedienteRoute")



const app= express();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
    origin: frontendUrl, 
    credentials: true
}));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));



app.use("/api/usuarios", usuarioRouters); //creacion de usuarios
app.use("/api/obtenerUsuarios", usuarioRouters); //obtener todos los usuarios


app.use("/api", inicioSesionRouters); //inicio y cierre de sesion
app.use("/api/cierreSesion", inicioSesionRouters);

app.use("/api/expedientes", expedienteRouters); // operaciones con expedientes

module.exports=app;
