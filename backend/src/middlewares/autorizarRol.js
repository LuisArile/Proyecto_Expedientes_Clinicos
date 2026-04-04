const prisma = require('../config/prisma');

const autorizarRol = (rolesPermitidos) => {
    return async (req, res, next) => {
        const usuario = req.usuario;
        console.log("USUARIO EN REQUEST:", req.usuario);
        if (!usuario || !usuario.idRol) {
            return res.status(403).json({ 
                success: false, 
                error: "Acceso denegado", 
                mensaje: "No tienes los permisos necesarios para acceder a este recurso." 
            });
        }

        const rol = await prisma.rol.findUnique({
            where: { idRol: usuario.idRol }
        });

        if (!rol || !rolesPermitidos.includes(rol.nombre)) {
            return res.status(403).json({ 
                success: false, 
                error: "Acceso denegado", 
                mensaje: "No tienes los permisos necesarios para acceder a este recurso." 
            });
        }

        req.usuario.rolNombre = rol.nombre;
        next();
    };
};

module.exports = autorizarRol;