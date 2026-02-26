const prisma = require('../config/prisma');

class expedienteRepository {
    
    async crear(data) {
        try {
            const resultado = await prisma.expediente.create({
                data: {
                    idPaciente: data.idPaciente,
                    numeroExpediente: data.numeroExpediente,
                    estado: data.estado,
                    observaciones: data.observaciones || null,
                    fechaCreacion: new Date(),
                    fechaActualizacion: new Date()
                },
                include: { paciente: true }
            });
            return resultado;
        } catch (error) {
            throw new Error(`Error al crear expediente: ${error.message}`);
        }
    }

    async obtenerTodos() {
        try {
            const resultados = await prisma.expediente.findMany({
                include: { paciente: true }
            });
            return resultados;
        } catch (error) {
            throw new Error(`Error al obtener expedientes: ${error.message}`);
        }
    }

    async obtenerPorId(idExpediente) {
        try {
            const data = await prisma.expediente.findUnique({
                where: { idExpediente: Number(idExpediente) },
                include: { paciente: true }
            });
            return data;
        } catch (error) {
            throw new Error(`Error al buscar expediente: ${error.message}`);
        }
    }

    async obtenerPorPaciente(idPaciente) {
        try {
            const data = await prisma.expediente.findUnique({
                where: { idPaciente: Number(idPaciente) },
                include: { paciente: true }
            });
            return data;
        } catch (error) {
            throw new Error(`Error al buscar expediente por paciente: ${error.message}`);
        }
    }

    async obtenerPorNumero(numeroExpediente) {
        try {
            const data = await prisma.expediente.findUnique({
                where: { numeroExpediente: numeroExpediente },
                include: { paciente: true }
            });
            return data;
        } catch (error) {
            throw new Error(`Error al buscar expediente por número: ${error.message}`);
        }
    }

    async actualizar(idExpediente, data) {
        try {
            return await prisma.expediente.update({
                where: { idExpediente: Number(idExpediente) },
                data: {
                    estado: data.estado || undefined,
                    observaciones: data.observaciones || undefined,
                    fechaActualizacion: new Date()
                },
                include: { paciente: true }
            });
        } catch (error) {
            throw new Error(`Error al actualizar expediente: ${error.message}`);
        }
    }

    async eliminar(idExpediente) {
        try {
            return await prisma.expediente.delete({
                where: { idExpediente: Number(idExpediente) }
            });
        } catch (error) {
            throw new Error(`Error al eliminar expediente: ${error.message}`);
        }
    }
}

module.exports = expedienteRepository;
