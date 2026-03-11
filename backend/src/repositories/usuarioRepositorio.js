const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const UsuarioBase = require('../factoryMet/usuarioBaseFact');

class UsuarioRepository {

    async crear(data) {
        try {

            const resultado = await prisma.usuario.create({
                data: {
                    nombre: data.nombre,
                    apellido: data.apellido,
                    correo: data.correo,
                    nombreUsuario: data.nombreUsuario,
                    clave: data.clave,
                    idRol: Number(data.idRol),
                    activo: true
                },
                include: { rol: true }
            });

            const usuarioConRol = {
                ...resultado,
                rolNombre: resultado.rol.nombre
            };

            return UsuarioBase.crearUsuario(usuarioConRol);

        } catch (error) {
            throw new Error(`Error al crear usuario: ${error.message}`);
        }
    }

    async obtenerTodos() {
        try {
            const resultados = await prisma.usuario.findMany({
                include: { auditorias: true, rol: true }
            });

            return UsuarioBase.crearUsuarios(resultados.map(r => ({
                ...r,
                rolNombre: r.rol.nombre
            })));

        } catch (error) {
            throw new Error(`Error al obtener usuarios: ${error.message}`);
        }
    }

    async filtrarNombreUsuario(nombreUsuario) {
        try {
            const data = await prisma.usuario.findUnique({
                where: { nombreUsuario },
                include: { 
                    rol: {
                        include: {
                            permisos: {
                                include: { permiso: true }
                            }
                        }
                    }
                }
            });

            if (!data) return null;

            const usuarioConRol = {
                ...data,
                rolNombre: data.rol?.nombre || "SIN_ROL",
                permisos: data.rol?.permisos?.map(p => p.permiso.nombre) || []
            };

            return UsuarioBase.crearUsuario(usuarioConRol);

        } catch (error) {
            // Este es el error que ves en tu consola actualmente
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