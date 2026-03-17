const prisma = require('../config/prisma');

class PermisoRepository {

    async crear(data) {
        return await prisma.permiso.create({
            data: { nombre: data.nombre }
        });
    }

    async obtenerTodos() {
        return await prisma.permiso.findMany();
    }

    async obtenerPorId(idPermiso) {
        return await prisma.permiso.findUnique({
            where: { idPermiso: Number(idPermiso) }
        });
    }

    async obtenerPorNombre(nombre) {
        return await prisma.permiso.findUnique({
            where: { nombre }
        });
    }

    async actualizar(idPermiso, data) {
        return await prisma.permiso.update({
            where: { idPermiso: Number(idPermiso) },
            data: { nombre: data.nombre }
        });
    }

    async eliminar(idPermiso) {
        return await prisma.permiso.delete({
            where: { idPermiso: Number(idPermiso) }
        });
    }
}

module.exports = PermisoRepository;
