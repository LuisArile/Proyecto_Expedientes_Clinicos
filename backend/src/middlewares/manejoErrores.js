const { ErrorApp } = require("../utils/errores");

const manejadorErrores = (err, req, res, next) => {


    if (process.env.NODE_ENV === 'desarrollo') {
        console.error('Error:', err);
    } else {
        //solo registrar errores críticos
        if (!err.esOperacional) {
            console.error('Error crítico:', err);
        }
    }

    // Si es un error personalizado de nuestra aplicación
    if (err instanceof ErrorApp) {
        return res.status(err.codigoHttp).json({
            exito: false,
            error: {
                mensaje: err.message,
                codigo: err.codigoHttp,
                tipo: err.nombre
            }
        });
    }

    // Errores específicos de Prisma
    if (err.code === 'P2002') {
        return res.status(409).json({
            exito: false,
            error: {
                mensaje: 'Ya existe un registro con esos datos (ej: correo duplicado)',
                codigo: 409,
                tipo: 'ErrorDuplicado'
            }
        });
    }

    if (err.code === 'P2003') {
        return res.status(400).json({
            exito: false,
            error: {
                mensaje: 'Error de relación: el registro referenciado no existe',
                codigo: 400,
                tipo: 'ErrorRelacion'
            }
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            exito: false,
            error: {
                mensaje: 'Registro no encontrado',
                codigo: 404,
                tipo: 'ErrorNoEncontrado'
            }
        });
    }

    // Errores de JWT,tokens
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            exito: false,
            error: {
                mensaje: 'Token inválido',
                codigo: 401,
                tipo: 'ErrorTokenInvalido'
            }
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            exito: false,
            error: {
                mensaje: 'Sesión expirada',
                codigo: 401,
                tipo: 'ErrorTokenExpirado'
            }
        });
    }

    // Error 500 por defecto
    const codigo = err.codigoHttp || 500;
    const mensaje = process.env.NODE_ENV === 'produccion' 
        ? 'Error interno del servidor' 
        : err.message || 'Error desconocido';

    return res.status(codigo).json({
        exito: false,
        error: {
            mensaje,
            codigo,
            tipo: err.nombre || 'ErrorServidor'
        }
    });
};

module.exports = manejadorErrores;
