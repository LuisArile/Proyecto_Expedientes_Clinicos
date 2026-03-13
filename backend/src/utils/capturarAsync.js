
const capturarAsync = (fn) => {
    // Esta función devuelve un middleware que Express entiende
    return function(req, res, next) {
        // Ejecutamos la función y capturamos errores
        fn(req, res, next).catch(err => {
            if (typeof next === 'function') {
                next(err);  // Pasamos el error al middleware
            } else {
                // Si next no es función, respondemos directamente
                res.status(500).json({
                    exito: false,
                    error: {
                        mensaje: err.message,
                        codigo: 500,
                        tipo: 'ErrorInterno'
                    }
                });
            }
        });
    };
};


module.exports = capturarAsync;