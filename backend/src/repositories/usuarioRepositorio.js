const prisma = require('../config/prisma');

class UsuarioRepository {

    async crear(data) {
        const usuario = await prisma.usuario.create({
            data: {
                nombre: data.nombre,
                apellido: data.apellido,
                correo: data.correo,
                nombreUsuario: data.nombreUsuario,
                clave: data.clave,
                idRol: Number(data.idRol),
                especialidad: data.especialidad || null,
                activo: true,
            },
            include: { rol: true }
        });

        return { usuario, rolNombre: usuario.rol?.nombre };
    }

    async obtenerTodos() {
        const usuarios = await prisma.usuario.findMany({
            include: { auditorias: true, rol: true }
        });

        return usuarios.map(r => ({
            ...r,
            rolNombre: r.rol.nombre
        }));
    }

    async actualizar(id, data) {
        const actualizarData = {};
        
        if (data.nombre !== undefined) actualizarData.nombre = data.nombre;
        if (data.apellido !== undefined) actualizarData.apellido = data.apellido;
        if (data.correo !== undefined) actualizarData.correo = data.correo;
        if (data.nombreUsuario !== undefined) actualizarData.nombreUsuario = data.nombreUsuario;
        if (data.clave !== undefined) actualizarData.clave = data.clave;
        if (data.especialidad !== undefined) actualizarData.especialidad = data.especialidad;
        if (data.activo !== undefined) actualizarData.activo = data.activo;
        if (data.idRol !== undefined) actualizarData.idRol = Number(data.idRol);

        const usuario = await prisma.usuario.update({
            where: { id: Number(id) },
            data: actualizarData,
            include: { rol: true }
        });

        return { usuario, rolNombre: usuario.rol?.nombre };
    }

    async eliminar(id) {
        await prisma.usuario.delete({
            where: { id: Number(id) }
        });
        return true;
    }

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
            rolNombre: data.rol?.nombre || "SIN_ROL",
            permisos: data.rol?.permisos?.map(p => p.permiso.nombre) || [],
            ultimoAcceso: data.ultimoAcceso,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt
        };
    }

    async actualizarUltimoAcceso(id) {
        return await prisma.usuario.update({
            where: { id: Number(id) },
            data: { ultimoAcceso: new Date() }
        });
    }

    async obtenerPorId(userId) {
        return await prisma.usuario.findUnique({
            where: { id: Number(userId) },
            include: { rol: true }
        });
    }

    async actualizarPassword(userId, nuevaPassword) {
        return await prisma.usuario.update({
            where: { id: userId },
            data: { clave: nuevaPassword }
        });
    }

    async obtenerPorCorreo(correo) {
        return await prisma.usuario.findUnique({
            where: { correo }
        });
    }
}

module.exports = UsuarioRepository;