const prisma = require('../config/prisma');

class RolRepository {

    async crear(data) {
        return await prisma.rol.create({
            data: { nombre: data.nombre },
            include: { permisos: { include: { permiso: true } } }
        });
    }

    async obtenerTodos() {
        return await prisma.rol.findMany({
            include: { permisos: { include: { permiso: true } } }
        });
    }

    async obtenerPorId(idRol) {
        return await prisma.rol.findUnique({
            where: { idRol: Number(idRol) },
            include: { permisos: { include: { permiso: true } } }
        });
    }

    async obtenerPorNombre(nombre) {
        return await prisma.rol.findUnique({
            where: { nombre }
        });
    }

    async actualizar(idRol, data) {
        return await prisma.rol.update({
            where: { idRol: Number(idRol) },
            data: { nombre: data.nombre },
            include: { permisos: { include: { permiso: true } } }
        });
    }

    async eliminar(idRol) {
        return await prisma.rol.delete({
            where: { idRol: Number(idRol) }
        });
    }

    async asignarPermisos(idRol, idsPermisos) {
        // Eliminar permisos actuales del rol
        await prisma.permisosPorRol.deleteMany({
            where: { idRol: Number(idRol) }
        });

        // Asignar los nuevos permisos
        const data = idsPermisos.map(idPermiso => ({
            idRol: Number(idRol),
            idPermiso: Number(idPermiso)
        }));

        await prisma.permisosPorRol.createMany({ data });

        return await this.obtenerPorId(idRol);
    }

    async obtenerPermisosPorRol(idRol) {
        const resultado = await prisma.permisosPorRol.findMany({
            where: { idRol: Number(idRol) },
            include: { permiso: true }
        });
        return resultado.map(r => r.permiso);
    }
}

module.exports = RolRepository;
