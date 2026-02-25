
const medico=require('../models/administrador');
const paciente=require('../models/paciente');
const recepcionista=require('../models/recepcionista');
const enfermero=require('../models/enfermero');
const administrador=require('../models/medico');
const {roles}= require('../config/roles')

class Usuario{

    static crearUsuario(data){
        if(!data|| !data.rol )
            throw new Error('Se requiere rol de usuario')
    }

    static crearUsuarios(data){
    return data.map(data=>this.crearUsuario(data));
    }
    
    static getClaseRol(rol){

        const clases = {
            [roles.admin]:administrador,
            [roles.medico]:medico,
            [roles.paciente]:paciente,
            [roles.enfermero]:enfermero,
            [roles.recepcionista]:recepcionista

        };

        return clases[rol] || Usuario;
    }
}


module.exports=Usuario;
