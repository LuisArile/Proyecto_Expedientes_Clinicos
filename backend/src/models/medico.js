const Usuario = require('./Usuario');

class Medico extends Usuario {
    constructor(data={}) {
        super(data);
        this.rol='MEDICO';
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

    toJSON(){
        return {
            ...super.toJSON(),
            especialidad:this.especialidad
        };
    }


}

module.exports=Medico;