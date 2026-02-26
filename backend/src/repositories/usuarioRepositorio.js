const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const UsuarioBase = require('../factoryMet/usuarioBaseFact');
const bcrypt = require('bcrypt');

class UsuarioRepository {

    async crear(data) {
        try {

            const hashedPassword = await bcrypt.hash(data.clave, 10);

            const resultado = await prisma.usuario.create({
                data: {
                    nombre: data.nombre,
                    apellido: data.apellido,
                    correo: data.correo,
                    nombreUsuario: data.nombreUsuario,
                    clave: hashedPassword,
                    rol: data.rol,
                    activo: true
                }
            });

            return UsuarioBase.crearUsuario(resultado);

        } catch (error) {
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    async obtenerTodos() {
        try {
            const resultados = await prisma.usuario.findMany({
                include: { auditorias: true }
            });

            return UsuarioBase.crearUsuarios(resultados);

        } catch (error) {
            throw new Error(`Error al obtener usuarios: ${error.message}`);
        }
    }

    async filtrarNombreUsuario(nombreUsuario) {
        try {
            const data = await prisma.usuario.findUnique({
                where: { nombreUsuario }
            });

            return data ? UsuarioBase.crearUsuario(data) : null;

        } catch (error) {
            throw new Error(`Error al buscar usuario: ${error.message}`);
        }
    }

    async actualizarUltimoAcceso(id) {
        try {
            return await prisma.usuario.update({
                where: { id: Number(id) },
                data: { ultimoAcceso: new Date() }
            });

        } catch (error) {
            throw new Error('Error al actualizar acceso');
        }
    }

    async registrarAccionUsuario(usuarioId, accion, detalles = {}) {
        try {
            return await prisma.auditoria.create({
                data: {
                    usuarioId: usuarioId ? Number(usuarioId) : null,
                    accion: accion,
                    detalles: JSON.stringify(detalles),
                    fecha: new Date()
                }
            });

        } catch (error) {
            console.error('Error al registrar auditoría:', error);
        }
    }
}

module.exports = UsuarioRepository;