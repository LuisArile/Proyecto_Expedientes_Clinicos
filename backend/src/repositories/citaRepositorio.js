const prisma = require('../config/prisma');

class CitaRepository {
    
    async crear(data) {
        return await prisma.cita.create({
            data: {
                pacienteId: data.pacienteId,
                fechaCita: data.fechaCita,
                horaCita: data.horaCita,
                motivo: data.motivo,
                prioridad: data.prioridad || 'NORMAL',
                tipo: data.tipo,
                estado: data.estado || 'PROGRAMADO',
                recepcionistaId: data.recepcionistaId
            },
            include: { paciente: true }
        });
    }

    async actualizarEstado(idCita, estadoNuevo, usuarioId, accion, observaciones = null) {
        // Registrar trazabilidad
        const citaActual = await prisma.cita.findUnique({
            where: { idCita: Number(idCita) }
        });

        await prisma.trazabilidad.create({
            data: {
                citaId: Number(idCita),
                estadoAnterior: citaActual.estado,
                estadoNuevo: estadoNuevo,
                usuarioId: usuarioId,
                accion: accion,
                observaciones: observaciones
            }
        });

        // Actualizar estado de la cita
        return await prisma.cita.update({
            where: { idCita: Number(idCita) },
            data: { estado: estadoNuevo, updatedAt: new Date() },
            include: { paciente: true }
        });
    }

    async obtenerPorEstado(estado, fecha = null) {
        const fechaActual = fecha || new Date();
        fechaActual.setHours(0, 0, 0, 0);
        const fechaFin = new Date(fechaActual);
        fechaFin.setHours(23, 59, 59, 999);

        return await prisma.cita.findMany({
            where: {
                estado: estado,
                fechaCita: { gte: fechaActual, lte: fechaFin }
            },
            include: { paciente: true },
            orderBy: { horaCita: 'asc' }
        });
    }

    async obtenerTodasPorFecha(fecha = null) {
        const fechaActual = fecha || new Date();
        fechaActual.setHours(0, 0, 0, 0);
        const fechaFin = new Date(fechaActual);
        fechaFin.setHours(23, 59, 59, 999);

        return await prisma.cita.findMany({
            where: { fechaCita: { gte: fechaActual, lte: fechaFin } },
            include: { paciente: true },
            orderBy: { horaCita: 'asc' }
        });
    }

    async obtenerTrazabilidad(idCita) {
        return await prisma.trazabilidad.findMany({
            where: { citaId: Number(idCita) },
            include: { usuario: { select: { nombre: true, apellido: true, rol: true } } },
            orderBy: { fecha: 'asc' }
        });
    }

    async obtenerTablero(fecha = null) {
        const citas = await this.obtenerTodasPorFecha(fecha);
        
        return {
            PROGRAMADO: citas.filter(c => c.estado === 'PROGRAMADO'),
            REGISTRADO_HOY: citas.filter(c => c.estado === 'REGISTRADO_HOY'),
            ESPERA_PRECLINICA: citas.filter(c => c.estado === 'ESPERA_PRECLINICA'),
            EN_PRECLINICA: citas.filter(c => c.estado === 'EN_PRECLINICA'),
            ESPERA_CONSULTA: citas.filter(c => c.estado === 'ESPERA_CONSULTA'),
            EN_CONSULTA: citas.filter(c => c.estado === 'EN_CONSULTA'),
            FINALIZADO: citas.filter(c => c.estado === 'FINALIZADO')
        };
    }
}

module.exports = CitaRepository;
