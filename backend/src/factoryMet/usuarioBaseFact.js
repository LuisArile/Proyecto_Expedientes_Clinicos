
const Usuario=require('../models/usuario');
const Medico=require('../models/medico');
const Administrador=require('../models/administrador');


class UsuarioBase{

    static crearUsuario(data){
        if(!data || !data.rolNombre ){
            throw new Error('Se requiere rol de usuario')
    }


    switch(data.rolNombre) {
            case 'ADMINISTRADOR':
                return new Administrador(data);
            
            case 'MEDICO':
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
