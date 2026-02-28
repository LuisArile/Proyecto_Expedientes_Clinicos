const bcrypt = require('bcrypt');

class Encriptador {
    
    static async encriptar(campo) {
        try {
            const salt = await bcrypt.genSalt(10); 
            return await bcrypt.hash(campo, salt);
        } catch (error) {
            throw new Error("Error al encriptar la clave: " + error.message);
        }
    }

    static async comparar(clave, claveEncriptado) {
        try {
            return await bcrypt.compare(clave, claveEncriptado);
        } catch (error) {
            throw new Error("Error al comparar claves: " + error.message);
        }
    }
}

module.exports = Encriptador;
