// const bcrypt=require('bcrypt');


// class Encriptador {

//     static async encriptar(nombreUsuario) {
//         const salt=await bcrypt(bcrypt.genSalt(8));
//         return await bcrypt.hash(nombreUsuario,salt);
//     }

//     static async comparar(usuarioNuevo,textoEncriptado){
//         return await bcrypt.compare(usuarioNuevo,textoEncriptado);
//     }
// }

// module.exports= Encriptador;

const bcrypt = require('bcrypt');

class Encriptador {
    // Cambiamos el nombre del parámetro a 'password' para que sea más claro
    static async encriptar(password) {
        try {
            // Generamos el salt (nivel de seguridad 10 es el estándar recomendado)
            const salt = await bcrypt.genSalt(10); 
            
            // Encriptamos la clave usando ese salt
            return await bcrypt.hash(password, salt);
        } catch (error) {
            throw new Error("Error al encriptar la clave: " + error.message);
        }
    }

    static async comparar(passwordIngresado, passwordEncriptado) {
        try {
            return await bcrypt.compare(passwordIngresado, passwordEncriptado);
        } catch (error) {
            throw new Error("Error al comparar claves: " + error.message);
        }
    }
}

module.exports = Encriptador;
