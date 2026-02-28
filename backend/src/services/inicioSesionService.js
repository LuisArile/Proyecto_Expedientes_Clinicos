const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { eventos } = require('../config/roles');

class InicioSesionService {

    constructor(usuarioRepository, prisma) {
        this.usuarioRepository = usuarioRepository;
        this.prisma = prisma;
    }

    async inicioSesion(nombreUsuario, clave) {
        console.log("Service recibió:", nombreUsuario);
        if (!nombreUsuario || !clave) {
            throw new Error('Credenciales incorrectas');
        }

        const usuario = await this.usuarioRepository.filtrarNombreUsuario(nombreUsuario);
        console.log("2. Usuario encontrado en DB:", usuario ? "SÍ" : "NO");

        if (!usuario) {
            throw new Error('Credenciales incorrectas');
        }

        const claveValida = await bcrypt.compare(clave, usuario.clave);
        console.log("3. ¿Clave válida?:", claveValida);

        if (!claveValida) {
            throw new Error('Credenciales incorrectas');
        }

        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol },
            process.env.JWT_SECRET || 'secret_key_temporal',
            { expiresIn: "8h" }
        );

        return {
            id: usuario.id,
            nombre: usuario.nombre,
            nombreUsuario: usuario.nombreUsuario,
            apellido: usuario.apellido,
            correo: usuario.correo,
            rol: usuario.rol,
            token
        };
    }

    async cierreSesion(usuarioId) {

        if (!usuarioId) {
            throw new Error("Usuario no autenticado");
        }

        await this.usuarioRepository.registrarAccionUsuario(
            usuarioId,
            eventos.logout
        );

        return { message: 'Sesión cerrada exitosamente' };
    }

    async registrarAuditoria(usuarioId, accion, detalles) {
        try {
            return await this.prisma.auditoria.create({
                data: {
                    usuarioId: usuarioId,
                    accion: accion,
                    detalles: detalles,
                }
            });
        } catch (error) {
            console.error("Error al registrar auditoría:", error);
        }
    }
}

module.exports = InicioSesionService;