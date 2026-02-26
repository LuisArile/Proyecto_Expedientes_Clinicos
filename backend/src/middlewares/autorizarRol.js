const autorizarRol = (rolesPermitidos) => {
    return (req, res, siguiente) => {
        const usuario = req.usuario;

        if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
            return res.status(403).json({ 
                success: false, 
                error: "Acceso denegado", 
                mensaje: "No tienes los permisos necesarios para acceder a este recurso." 
            });
        }

        siguiente();
    };
};

module.exports = autorizarRol;