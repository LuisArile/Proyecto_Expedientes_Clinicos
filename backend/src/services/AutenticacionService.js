// const prisma = require('../config/prisma');
// const bcrypt = require('bcrypt'); 

// class AuthService {
//     async login(nombreUsuario, password) {
//         const usuario = await prisma.usuario.findUnique({
//             where: { nombreUsuario },
//             include: {
//                 rol: {
//                     include: {
//                         permisos: {
//                             include: {
//                                 permiso: true
//                             }
//                         }
//                     }
//                 }
//             }
//         });

//         if (!usuario) throw new Error("Usuario no encontrado");

//         const esValida = await bcrypt.compare(password, usuario.password);
//         if (!esValida) throw new Error("Contraseña incorrecta");

//         const listaPermisos = usuario.rol?.permisos.map(p => p.permiso.nombre) || [];

//         const token = jwt.sign(
//             { id: usuario.id, idRol: usuario.idRol, rol: usuario.rolNombre },
//             process.env.JWT_SECRET || 'secret_key_temporal',
//             { expiresIn: "8h" }
//         );

//         return {
//             user: {
//                 id: usuario.idUsuario,
//                 nombre: usuario.nombre,
//                 apellido: usuario.apellido,
//                 nombreUsuario: usuario.nombreUsuario,
//                 rol: usuario.rol?.nombre,
//                 permisos: listaPermisos
//             },
//             token
//         };
//     }
// }

// module.exports = AuthService;