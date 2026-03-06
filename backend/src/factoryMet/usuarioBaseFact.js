
const Usuario=require('../models/Usuario');
const Medico=require('../models/medico');
const Administrador=require('../models/administrador');
const {roles}= require('../config/roles')


class UsuarioBase{

    static crearUsuario(data){
        if(!data || !data.rol ){
            throw new Error('Se requiere rol de usuario')
    }


    switch(data.rol) {
            case roles.admin:
                return new Administrador(data);
            
            case roles.medico:
                return new Medico(data);
            
            default:
                return new Usuario(data);
        }
    }

    static crearUsuarios(data){
        if(!Array.isArray(data)){
            throw new Error("se requiere array de datos");
            
        }
    return data.map(data=>this.crearUsuario(data));
    
    }

}


module.exports=UsuarioBase;
