const bcrypt = require('bcrypt');


class Encriptador {

    static async encriptar(campo) {
        const salt=await bcrypt.genSalt(10);
        return await bcrypt.hash(campo,salt);
    }

    static async comparar(clave,claveEncriptado){
        return await bcrypt.compare(clave,claveEncriptado);
    }
}

module.exports= Encriptador;


