const express= require("express");
const cors= require("cors");

const usuarioRouters = require("./routes/usuarioRoute")
const inicioSesionRouters= require("./routes/inicioSesionRoute")



const app= express();

app.use(cors());

app.use(express.json());



app.use("/api/usuarios", usuarioRouters); //creacion de usuarios
app.use("/api/obtenerUsuarios", usuarioRouters); //obtener todos los usuarios

app.use("/api/login", inicioSesionRouters);

module.exports=app;
