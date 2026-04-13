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
        // 1. Obtener la cita actual
        const citaActual = await prisma.cita.findUnique({
            where: { idCita: Number(idCita) }
        });


        // 2. Crear registro en Seguimiento
        await prisma.seguimiento.create({
            data: {
                citaId: Number(idCita), 
                estadoAnterior: citaActual.estado,
                estadoNuevo: estadoNuevo,
                usuarioId: Number(usuarioId),
                accion: accion,
                observaciones: observaciones
            }
        });

        // 3. Actualizar estado de la cita
        return await prisma.cita.update({
            where: { idCita: Number(idCita) },
            data: { 
                estado: estadoNuevo, 
                updatedAt: new Date() 
            },
            include: { paciente: true }
        });
    }

    async obtenerPorEstado(estado, fecha = null) {
    //  Si no se especifica fecha, traer todas sin filtrar por fecha
    if (!fecha) {
        return await prisma.cita.findMany({
            where: { estado: estado },
            include: { paciente: true },
            orderBy: { horaCita: 'asc' }
        });
    }
    
    // Si hay fecha, filtrar por esa fecha
    const fechaActual = new Date(fecha);
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
        // Si no se proporciona fecha, devolver todas las citas sin filtrar
        if (!fecha) {
            return await prisma.cita.findMany({
                include: { 
                    paciente: {
                        include: { expedientes: true } 
                    }
                },
                orderBy: { horaCita: 'asc' }
            });
        }

        // Si hay fecha, filtrar por esa fecha
        const fechaActual = new Date(fecha);
        fechaActual.setHours(0, 0, 0, 0);
        const fechaFin = new Date(fechaActual);
        fechaFin.setHours(23, 59, 59, 999);

        return await prisma.cita.findMany({
            where: { fechaCita: { gte: fechaActual, lte: fechaFin } },
            include: { 
                paciente: {
                    include: { expedientes: true } 
                }
            },
            orderBy: { horaCita: 'asc' }
        });
    }

    async obtenerSeguimiento(idCita) {
        return await prisma.seguimiento.findMany({
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
