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
const busquedaRouters = require("./routes/busquedaRoute");
const estadisticaRouters = require("./routes/estadisticaRoute")
const auditoriaRouters = require("./routes/auditoriaRoute");

const manejadorErrores = require("./middlewares/manejoErrores")


const app= express();

// Lista de orígenes permitidos
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173', // Desarrollo local
    'http://localhost',        // Docker / Nginx
    'https://clinica-frontend-cudebvakabgectfb.mexicocentral-01.azurewebsites.net' // URL de producción del frontend
];

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Error de CORS: Origen no permitido por SGEC'));
        }
    },
    credentials: true
}));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use("/api/usuarios", usuarioRouters); //creacion de usuarios

app.use("/api/usuarios/id", usuarioRouters);//obtener usuario por ID

app.use("/api", inicioSesionRouters); //inicio y cierre de sesion

app.use("/api/expedientes", expedienteRouters); // operaciones con expedientes

app.use("/api/roles", rolRouters); // gestión de roles
app.use("/api/permisos", permisoRouters); // gestión de permisos

app.use("/api/registroPreclinico", registroPreclinico); //gestion de registro de signos vitales

app.use("/api/consultaMedica", consultaMedicaRouters); //Consulta medicas

app.use("/api/estadisticas", estadisticaRouters);

app.use("/api/busqueda", busquedaRouters);

app.use("/api/auditoria", auditoriaRouters);

app.use(manejadorErrores);
module.exports=app;