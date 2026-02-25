const Usuario = require('./Usuario');

class Administrador extends Usuario {
    constructor(data={}) {
        super(data);
        this.rol='administrador';
    }

    getNombre(){
        return `administrador ${this.nombre}`;
    }

    getMenuUsuario(){
        return [
            {id:'ventanaPrincipal' , nombre:'ventanaPrincipal', ruta:'ventanaPrincipal/'},
            {id:'usuarios' , nombre:'Usuarios', ruta:'/usuarios/'},
            {id:'auditoria' , nombre:'Auditoria', ruta:'/auditoria'},
            {id:'reportes' , nombre:'Reportes', ruta:'/reportes/'},
            {id:'configuracion' , nombre:'Configuracion', ruta:'/configuracion/'}
        ];
    }


    getPermisos(){
        return['*'];
    }

    getBienvenida(){
        return `Bienvenido Admin ${this.nombre}`;
    }


}

module.exports='Administrador';