const prisma = require('../config/prisma');

const autorizarPermiso = (permisoRequerido) => {
    return async (req, res, next) => {
        const usuario = req.usuario;

        if (!usuario || !usuario.idRol) {
            return res.status(403).json({ 
                success: false, 
                mensaje: "Acceso denegado: Usuario no identificado." 
            });
        }

        try {
            const tienePermiso = await prisma.permisosPorRol.findFirst({
                where: {
                    idRol: usuario.idRol,
                    permiso: {
                        nombre: permisoRequerido
                    }
                }
            });

            if (!tienePermiso) {
                return res.status(403).json({ 
                    success: false, 
                    error: "Privilegios insuficientes", 
                    mensaje: `No tienes el permiso [${permisoRequerido}] para realizar esta acción.` 
                });
            }

            next();
        } catch (error) {
            console.error("Error en middleware de autorización:", error);
            res.status(500).json({ success: false, mensaje: "Error interno de servidor" });
        }
    };
};

module.exports = autorizarPermiso;