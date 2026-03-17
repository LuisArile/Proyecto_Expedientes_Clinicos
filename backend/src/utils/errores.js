
class ErrorApp extends Error {
    constructor(mensaje, codigoHttp) {
        super(mensaje);
        this.codigoHttp = codigoHttp;
        this.esOperacional = true; 
        Error.captureStackTrace(this, this.constructor);
    }
}


// cuando no se encuentra un recurso (404)
class ErrorNoEncontrado extends ErrorApp {
    constructor(recurso = 'Recurso') {
        super(`${recurso} no encontrado`, 404);
        this.nombre = 'ErrorNoEncontrado';
    }
}


//para validaciones de datos (400)
class ErrorValidacion extends ErrorApp {
    constructor(mensaje = 'Error de validación') {
        super(mensaje, 400);
        this.nombre = 'ErrorValidacion';
    }
}


// para autenticación fallida (401)
class ErrorNoAutorizado extends ErrorApp {
    constructor(mensaje = 'No autorizado') {
        super(mensaje, 401);
        this.nombre = 'ErrorNoAutorizado';
    }
}


//Error para falta de permisos (403)
class ErrorProhibido extends ErrorApp {
    constructor(mensaje = 'Acceso denegado') {
        super(mensaje, 403);
        this.nombre = 'ErrorProhibido';
    }
}


//para conflictos con datos existentes (409)
class ErrorConflicto extends ErrorApp {
    constructor(mensaje = 'Conflicto con datos existentes') {
        super(mensaje, 409);
        this.nombre = 'ErrorConflicto';
    }
}

module.exports = {
    ErrorApp,
    ErrorNoEncontrado,
    ErrorValidacion,
    ErrorNoAutorizado,
    ErrorProhibido,
    ErrorConflicto
};