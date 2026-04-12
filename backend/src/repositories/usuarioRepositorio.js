const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');

class UsuarioRepository {

    /**
     * Normaliza y crea especialidades si no existen
     */
    async procesarEspecialidades(especialidades = []) {
        if (!especialidades || especialidades.length === 0) return [];

        const especialidadesDB = await Promise.all(
            especialidades.map(async (nombre) => {
                const nombreNormalizado =
                    nombre.trim().charAt(0).toUpperCase() +
                    nombre.trim().slice(1).toLowerCase();

                return prisma.especialidad.upsert({
                    where: { nombre: nombreNormalizado },
                    update: {},
                    create: { nombre: nombreNormalizado }
                });
            })
        );

        return especialidadesDB.map(e => ({
            especialidadId: e.id
        }));
    }

    /**
     * Crear usuario con especialidades
     */
    async crear(data) {
        const relacionesEspecialidad =
            await this.procesarEspecialidades(data.especialidades);

        const usuario = await prisma.usuario.create({
            data: {
                nombre: data.nombre,
                apellido: data.apellido,
                correo: data.correo,
                nombreUsuario: data.nombreUsuario,
                clave: data.clave,
                idRol: Number(data.idRol),
                activo: data.activo ?? true,
                debeCambiarPassword: data.debeCambiarPassword ?? true,
                UsuarioEspecialidad: {
                    create: relacionesEspecialidad
                }
            },
            include: {
                rol: true,
                UsuarioEspecialidad: {
                    include: {
                        Especialidad: true
                    }
                }
            }
        });

        return this.mapearUsuario(usuario);
    }

    /**
     * Obtener todos los usuarios
     */
    async obtenerTodos() {
        const usuarios = await prisma.usuario.findMany({
            include: {
                rol: true,
                UsuarioEspecialidad: {
                    include: {
                        Especialidad: true
                    }
                }
            }
        });

        return usuarios.map(u => this.mapearUsuario(u));
    }

    /**
     * Actualizar usuario y sus especialidades
     */
    async actualizar(id, data) {
        const actualizarData = {};

        if (data.nombre !== undefined) actualizarData.nombre = data.nombre;
        if (data.apellido !== undefined) actualizarData.apellido = data.apellido;
        if (data.correo !== undefined) actualizarData.correo = data.correo;
        if (data.nombreUsuario !== undefined) actualizarData.nombreUsuario = data.nombreUsuario;
        if (data.activo !== undefined) actualizarData.activo = data.activo;
        if (data.idRol !== undefined) actualizarData.idRol = Number(data.idRol);
        if (data.debeCambiarPassword !== undefined)
            actualizarData.debeCambiarPassword = data.debeCambiarPassword;

        // Actualizar contraseña si se envía
        if (data.clave) {
            actualizarData.clave = await bcrypt.hash(data.clave, 10);
        }

        // Procesar especialidades
        if (data.especialidades !== undefined) {
            const relacionesEspecialidad =
                await this.procesarEspecialidades(data.especialidades);

            actualizarData.UsuarioEspecialidad = {
                deleteMany: {},
                create: relacionesEspecialidad
            };
        }

        const usuario = await prisma.usuario.update({
            where: { id: Number(id) },
            data: actualizarData,
            include: {
                rol: true,
                UsuarioEspecialidad: {
                    include: {
                        Especialidad: true
                    }
                }
            }
        });

        return this.mapearUsuario(usuario);
    }

    /**
     * Eliminar usuario
     */
    async eliminar(id) {
        await prisma.usuario.delete({
            where: { id: Number(id) }
        });
        return true;
    }

    /**
     * Buscar usuario por nombre de usuario (login)
     */
    async filtrarNombreUsuario(nombreUsuario) {
        const data = await prisma.usuario.findUnique({
            where: { nombreUsuario },
            include: {
                rol: {
                    include: {
                        permisos: {
                            include: { permiso: true }
                        }
                    }
                },
                UsuarioEspecialidad: {
                    include: {
                        Especialidad: true
                    }
                }
            }
        });

        if (!data) return null;

        return {
            id: data.id,
            nombre: data.nombre,
            apellido: data.apellido,
            correo: data.correo,
            nombreUsuario: data.nombreUsuario,
            clave: data.clave,
            idRol: data.idRol,
            activo: data.activo,
            debeCambiarPassword: data.debeCambiarPassword,
            rolNombre: data.rol?.nombre || "SIN_ROL",
            permisos: data.rol?.permisos?.map(p => p.permiso.nombre) || [],
            especialidades: data.UsuarioEspecialidad.map(
                ue => ue.Especialidad.nombre
            ),
            ultimoAcceso: data.ultimoAcceso,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        };
    }

    /**
     * Obtener usuario por ID
     */
    async obtenerPorId(id) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: Number(id) },
            include: {
                rol: true,
                UsuarioEspecialidad: {
                    include: {
                        Especialidad: true
                    }
                }
            }
        });

        if (!usuario) return null;

        return this.mapearUsuario(usuario);
    }

    /**
     * Obtener usuario por correo
     */
    async obtenerPorCorreo(correo) {
        const usuario = await prisma.usuario.findUnique({
            where: { correo },
            include: {
                rol: true,
                UsuarioEspecialidad: {
                    include: {
                        Especialidad: true
                    }
                }
            }
        });

        return usuario ? this.mapearUsuario(usuario) : null;
    }

    /**
     * Actualizar último acceso
     */
    async actualizarUltimoAcceso(id) {
        return prisma.usuario.update({
            where: { id: Number(id) },
            data: { ultimoAcceso: new Date() }
        });
    }

    /**
     * Registrar acción en auditoría
     */
    async registrarAccionUsuario(usuarioId, accion, detalles = {}) {
        return prisma.auditoria.create({
            data: {
                usuarioId: usuarioId ? Number(usuarioId) : null,
                accion,
                detalles:
                    typeof detalles === 'object'
                        ? JSON.stringify(detalles)
                        : detalles,
                fecha: new Date()
            }
        });
    }

    /**
     * Método auxiliar para mapear la respuesta
     */
    mapearUsuario(usuario) {
        return {
            ...usuario,
            rolNombre: usuario.rol?.nombre,
            especialidades: usuario.UsuarioEspecialidad.map(
                ue => ue.Especialidad.nombre
            )
        };
    }
}

module.exports = UsuarioRepository;