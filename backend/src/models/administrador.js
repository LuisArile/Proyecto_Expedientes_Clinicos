const Usuario = require('./Usuario');

class Administrador extends Usuario {
    constructor(data={}) {
        super(data);
        this.rolNombre='ADMINISTRADOR';
    }

   

    getMenu(){
        return [
            {id:'ventanaPrincipal' , nombre:'ventanaPrincipal', ruta:'ventanaPrincipal/'},
            {id:'usuarios' , nombre:'Usuarios', ruta:'/usuarios/'},
            {id:'auditoria' , nombre:'Auditoria', ruta:'/auditoria'},
            {id:'reportes' , nombre:'Reportes', ruta:'/reportes/'},
            {id:'configuracion' , nombre:'Configuracion', ruta:'/configuracion/'}
        ];
    }

    getNombre(){
        return `administrador ${this.nombre}`;
    }


    getPermisos(){
        return this.permisos || [];
    }

    getBienvenida(){
        return `Bienvenido Administrador ${this.nombre}`;
    }


}

module.exports=Administrador;