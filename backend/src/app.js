require('dotenv').config();

const express= require("express");
const cors= require("cors");

const usuarioRouters = require("./routes/usuarioRoute")
const inicioSesionRouters= require("./routes/inicioSesionRoute")
const expedienteRouters = require("./routes/expedienteRoute")
const rolRouters = require("./routes/rolRoute")
const permisoRouters = require("./routes/permisoRoute")
const registroPreclinico=require("./routes/registroPreclinicoRoute")
const consultaMedicaRouters=require("./routes/consultaMedicaRoute")


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

app.use("/api/roles", rolRouters); // gestión de roles
app.use("/api/permisos", permisoRouters); // gestión de permisos

app.use("/api/registroPreclinico", registroPreclinico); //gestion de registro de signos vitales

app.use("/api/consultaMedica", consultaMedicaRouters); //Consulta medicas

module.exports=app;
