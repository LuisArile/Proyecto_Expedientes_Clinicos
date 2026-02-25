const bcrypt=require('bcrypt');


class Encriptador {
  

    static async encriptar(nombreUsuario) {
        const salt=await bcrypt(bcrypt.genSalt(8));
        return await bcrypt.hash(nombreUsuario,salt);
    }

    static async comparar(usuarioNuevo,textoEncriptado){
        return await bcrypt.compare(usuarioNuevo,textoEncriptado);
    }
}

module.exports= Encriptador;


