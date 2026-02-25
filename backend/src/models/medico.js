const Usuario = require('./Usuario');

class Medico extends Usuario {
    constructor(data={}) {
        super(data);
        this.rol='medico';
        this.especialidad=data.especialidad || 'medicina general';
    }

    getNombre(){
        return `administrador ${this.nombre}`;
    }

    getMenuUsuario(){
        return [
            {id:'ventanaPrincipal' , nombre:'ventanaPrincipal', ruta:'ventanaPrincipal/'},
            {id:'pacientes' , nombre:'Mis pacientes', ruta:'/pacientes/'},
            {id:'consultas' , nombre:'Consultas', ruta:'/consultas'},
        ];
    }


    getPermisos(){
        return['vePacientes', 'registrarConsulta'];
    }

    getBienvenida(){
        return `Bienvenido Admin ${this.nombre}`;
    }


}

module.exports=Medico;