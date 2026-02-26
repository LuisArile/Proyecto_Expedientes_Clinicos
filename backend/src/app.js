const express= require("express");
const prisma = require('./config/prisma')
const cors= require("cors");

const usuarioRouters = require("./routes/usuarioRoute")
const inicioSesionRouters= require("./routes/inicioSesionRoute")



const app= express();

app.use(cors());

app.use(express.json());



app.use("/api/crear", usuarioRouters); //creacion de usuarios
app.use("/api/obtenerUsuarios", usuarioRouters); //obtener todos los usuarios


app.use("/api/login", inicioSesionRouters); ////inicioSesion
app.use("/api/cierreSesion", inicioSesionRouters);// cierre de sesion

module.exports=app;
